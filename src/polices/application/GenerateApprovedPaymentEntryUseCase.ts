import Entry from "../domain/entry";
import { FIGA_FEE } from "../domain/fee";
import { CASH, EMPA_FEE_PAYABLE, FEE_REVENUE, FIGA_FEE_RECEIVABLE, INSPECTION_FEES, PREMIUMS_RECEIVED_IN_ADVANCED, PREMIUM_RECEIVABLE, PROGRAM_ADMINISTRATOR_FEE_REVENUE, REFUNS_PAYABLE, UNASSIGNED_SURPLUS } from "../domain/ladger";
import Policy from "../domain/policy";
import { ApprovedPayment } from "../domain/policy_event";

export default class GenerateApprovedPaymentEntryUseCase {

    execute(policy: Policy, event: ApprovedPayment) : Entry []{
        const entries: Entry[] = [this.getApprovedPaymentEntry(policy, event)]
        
        if(event.isDuplicated){
            entries.push( this.getDuplicatedEntry(policy, event) )
        }

        if(event.isOverpayment()) {
            entries.push( this.getOverpaymentEntry(event) )
        }

        return  entries;
    }

    getApprovedPaymentEntry(policy: Policy, event: ApprovedPayment) : Entry {
        let entryDescription = `Record Pre-Effective Policy Payment for term ${event.term}`;
        const debits: [string, number] [] = [
            [CASH, policy.billingTotal(event.installmentIndex())],
        ]
        const credits: [string, number] [] = [
            [EMPA_FEE_PAYABLE, policy.billingEmpaFee(event.installmentIndex())],
            [INSPECTION_FEES, policy.billingInspectionFee(event.installmentIndex())],
            [PROGRAM_ADMINISTRATOR_FEE_REVENUE, policy.billingAdminFee(event.installmentIndex())],
            [FIGA_FEE_RECEIVABLE, policy.billingFigaFee(event.installmentIndex())],

            [UNASSIGNED_SURPLUS, policy.billingSurplus(event.installmentIndex())],
            [FEE_REVENUE, policy.billingInstallmentFee(event.installmentIndex())]
        ]

        if(event.created < policy.effectiveDate() ){
            credits.push([PREMIUMS_RECEIVED_IN_ADVANCED, policy.billingPremium(event.installmentIndex()) ])
        } else {
            entryDescription = "Record Policy Installment Payment";

            if(event.installment===1){
                entryDescription = `Record ${policy.paymentMethod()} Policy Payment Post-Effective`;
            }
            
            credits.push([PREMIUM_RECEIVABLE, policy.billingPremium(event.installmentIndex()) ])
        }

        return  new Entry(
            entryDescription, 
            debits.filter( i => i[1] !== 0),
            credits.filter( i => i[1] !== 0)
        )
    }

    getDuplicatedEntry(policy: Policy, event: ApprovedPayment) : Entry {
        const debits: [string, number] [] = [
            [CASH, policy.billingTotal(event.installmentIndex())],
        ]
        const credits: [string, number] [] = [
            [REFUNS_PAYABLE, policy.billingTotal(event.installmentIndex()) ]
        ]

        return new Entry(
            "Duplicated payment", 
            debits.filter( i => i[1] !== 0),
            credits.filter( i => i[1] !== 0)
        )
    }

    getOverpaymentEntry(event: ApprovedPayment) : Entry {
        const debits: [string, number] [] = [
            [CASH, event.overpayment],
        ]
        const credits: [string, number] [] = [
            [REFUNS_PAYABLE, event.overpayment ]
        ] // account_to_credit_the_overpayment ????? refund payable || fee_revenue
        
        return new Entry(
            "Overpayment", 
            debits.filter( i => i[1] !== 0),
            credits.filter( i => i[1] !== 0)
        )
    }

}