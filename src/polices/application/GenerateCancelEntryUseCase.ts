import DaysBetween from "../domain/DaysBetween";
import Entry from "../domain/entry";
import { CHANGE_UNEARNED_PREMIUM_RESERVE, DEFERRED_INSTALLMENTS, DIRECT_PREMIUMS_WRITTEN, EARNED_SURPLUS, FEE_REVENUE, FIGA_FEE_RECEIVABLE, FIGA_FEE_REVENUE, PREMIUMS_RECEIVED_IN_ADVANCED, PREMIUM_RECEIVABLE, REFUNS_PAYABLE, STATE_TAX_RECEIVABLE, STATE_TAX_REVENUE, UNASSIGNED_SURPLUS, UNEARNED_PREMIUM_RESERVE, UNEARNED_SURPLUS } from "../domain/ledger";
import Policy from "../domain/policy";
import { Cancelled } from "../domain/policy_event";

export default class GenerateCancelEntryUseCase {

    execute(policy: Policy, event: Cancelled, approvedPaymentsAmountBeforeInception: number, approvedPaymentsAmountAfterInception: number) : Entry []{   
        const remainingPremium = Math.abs(policy.premium()/365 * DaysBetween.get(event.effective, policy.endDate()))
        const remainingSurplus = Math.abs(policy.surplus()/365 * DaysBetween.get(event.effective, policy.endDate()))

        const remainingStateTax = Math.abs(policy.taxFee()/365 * DaysBetween.get(event.effective, policy.endDate()))
        const remainingFigaFee = Math.abs(policy.figaFee()/365 * DaysBetween.get(event.effective, policy.endDate()))

        const remainingUnearnedPremiumReserve = Math.abs(policy.premium()/365 * DaysBetween.get(event.created >= event.effective ? event.created : event.effective, policy.endDate()))
        const remainingUnearnedSurplus = Math.abs(policy.surplus()/365 * DaysBetween.get(event.created >= event.effective ? event.created : event.effective, policy.endDate()))

        const entries: Entry [] = [
            this.getEntryForNonpayment(
                approvedPaymentsAmountBeforeInception,
                approvedPaymentsAmountAfterInception,
                remainingPremium,
                remainingStateTax,
                remainingFigaFee,
                remainingUnearnedPremiumReserve,
                remainingUnearnedSurplus
            )
        ]
        
        const refundPaymentEntry : Entry | undefined = this.getRefundPaymentEntry(          
            policy,
            approvedPaymentsAmountBeforeInception,
            approvedPaymentsAmountAfterInception,
            remainingPremium,
            remainingSurplus,
            remainingStateTax,
            remainingFigaFee
        );

        if(refundPaymentEntry!==undefined){
            entries.push(refundPaymentEntry)
        }

        return entries
    }

    getEntryForNonpayment( 
        approvedPaymentsAmountBeforeInception: number, 
        approvedPaymentsAmountAfterInception: number,
        remainingPremium: number,
        remainingStateTax: number,
        remainingFigaFee: number,
        remainingUnearnedPremiumReserve: number,
        remainingUnearnedSurplus: number
    ) : Entry {                        
        // Deal with multipay, 1 Pay don't deal with write off
        const paymentAmount = approvedPaymentsAmountBeforeInception + approvedPaymentsAmountAfterInception;

        const debits : [string, number] [] = [
            [UNEARNED_PREMIUM_RESERVE, remainingUnearnedPremiumReserve],
            [UNEARNED_SURPLUS, remainingUnearnedSurplus],
            [DIRECT_PREMIUMS_WRITTEN, remainingPremium],
            [STATE_TAX_REVENUE, paymentAmount===0 ? remainingStateTax : 0 ],
            [FIGA_FEE_REVENUE, paymentAmount===0 ? remainingFigaFee: 0 ]
        ]

        const credits : [string, number] [] = [
            [CHANGE_UNEARNED_PREMIUM_RESERVE, remainingUnearnedPremiumReserve],
            [PREMIUM_RECEIVABLE, remainingPremium],
            [EARNED_SURPLUS, remainingUnearnedSurplus],
            [STATE_TAX_RECEIVABLE, paymentAmount===0 ? remainingStateTax : 0],
            [FIGA_FEE_RECEIVABLE, paymentAmount===0 ? remainingFigaFee: 0]
        ]

        return new Entry(
            "Zero out premium receivable for cancellation",
            debits,
            credits
        )
    }

    getRefundPaymentEntry(
        policy: Policy,
        approvedPaymentsAmountBeforeInception: number, 
        approvedPaymentsAmountAfterInception: number,
        remainingPremium: number,
        remainingSurplus: number,
        remainingStateTax: number,
        remainingFigaFee: number
    ) : Entry | undefined {
        const totalApprovedPayment = (approvedPaymentsAmountBeforeInception+approvedPaymentsAmountAfterInception)
        
        if(totalApprovedPayment===0){
            return undefined;
        }

        const debits : [string, number] [] = [
            [PREMIUM_RECEIVABLE, remainingPremium ],
            //[PREMIUMS_RECEIVED_IN_ADVANCED, ],
            [UNASSIGNED_SURPLUS, remainingSurplus],
            [FIGA_FEE_REVENUE, remainingFigaFee],
            [STATE_TAX_REVENUE, remainingStateTax],
        ]
        const credits : [string, number] [] = [
            [REFUNS_PAYABLE, remainingPremium + remainingSurplus + remainingStateTax + remainingFigaFee], // less deferred installments
            //[DEFERRED_INSTALLMENTS, ]
        ]

        return new Entry(
            "Cancell refund Entry",
            debits,
            credits
        );
    }

}