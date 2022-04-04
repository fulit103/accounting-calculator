import DaysBetween from "../domain/DaysBetween";
import Entry from "../domain/entry";
import { CHANGE_UNEARNED_PREMIUM_RESERVE, DIRECT_PREMIUMS_WRITTEN, EARNED_SURPLUS, FEE_REVENUE, FIGA_FEE_RECEIVABLE, FIGA_FEE_REVENUE, PREMIUMS_RECEIVED_IN_ADVANCED, PREMIUM_RECEIVABLE, REFUNS_PAYABLE, STATE_TAX_RECEIVABLE, STATE_TAX_REVENUE, UNEARNED_PREMIUM_RESERVE, UNEARNED_SURPLUS } from "../domain/ledger";
import Policy from "../domain/policy";
import { Cancelled } from "../domain/policy_event";

export default class GenerateCancelEntryUseCase {

    
    // deferred
    // remaining_unearned_premium_reserve
    // remaining_unearned_surplus

    // non_transactional_fees
    execute(policy: Policy, event: Cancelled, approvedPaymentsAmountBeforeInception: number, approvedPaymentsAmountAfterInception: number) : Entry []{   

        const entries: Entry [] = [
            this.getEntryForNonpayment(policy, event)
        ]
        
        /*const refundPaymentEntry : Entry | undefined = this.getRefundPaymentEntry(
            policy,
            event,            
            approvedPaymentsAmountBeforeInception,
            approvedPaymentsAmountAfterInception,
            remainingPremium,
            remainingSurplus,
            remainingStateTax,
            remainingFigaFee
        );

        if(refundPaymentEntry!==undefined){
            //entries.push(refundPaymentEntry)
        }*/

        return entries
    }

    getEntryForNonpayment(policy: Policy, event: Cancelled) : Entry {
        const remainingPremium = Math.abs(policy.premium()/365 * DaysBetween.get(event.effective, policy.endDate()))
        //const remainingSurplus = Math.abs(policy.surplus()/365 * DaysBetween.get(event.effective, policy.endDate()))

        const remainingStateTax = Math.abs(policy.taxFee()/365 * DaysBetween.get(event.effective, policy.endDate()))
        const remainingFigaFee = Math.abs(policy.figaFee()/365 * DaysBetween.get(event.effective, policy.endDate()))
        
        const remainingUnearnedPremiumReserve = Math.abs(policy.premium()/365 * DaysBetween.get(event.created >= event.effective ? event.created : event.effective, policy.endDate()))
        const remainingUnearnedSurplus = Math.abs(policy.surplus()/365 * DaysBetween.get(event.created >= event.effective ? event.created : event.effective, policy.endDate()))

        // Deal with multipay, 1 Pay don't deal with write off

        const debits : [string, number] [] = [
            [UNEARNED_PREMIUM_RESERVE, remainingUnearnedPremiumReserve],
            [UNEARNED_SURPLUS, remainingUnearnedSurplus],
            [DIRECT_PREMIUMS_WRITTEN, remainingPremium],
            [STATE_TAX_REVENUE, remainingStateTax],
            [FIGA_FEE_REVENUE, remainingFigaFee]
        ]

        const credits : [string, number] [] = [
            [CHANGE_UNEARNED_PREMIUM_RESERVE, remainingUnearnedPremiumReserve],
            [PREMIUM_RECEIVABLE, remainingPremium],
            [EARNED_SURPLUS, remainingUnearnedSurplus],
            [STATE_TAX_RECEIVABLE, remainingStateTax],
            [FIGA_FEE_RECEIVABLE, remainingFigaFee]
        ]

        return new Entry(
            "Zero out premium receivable for cancellation",
            debits,
            credits
        )
    }

    getRefundPaymentEntry(
        policy: Policy,
        event: Cancelled,
        approvedPaymentsAmountBeforeInception: number, 
        approvedPaymentsAmountAfterInception: number,
        remainingPremium: number,
        remainingSurplus: number,
        remainingStateTax: number,
        remainingFigaFee: number
    ) : Entry | undefined {
        
        if((approvedPaymentsAmountBeforeInception+approvedPaymentsAmountAfterInception)===0){
            return undefined;
        }

        const prorratedSurplus = policy.surplus()/365 * DaysBetween.get(policy.effectiveDate(), event.effective)

        const debits : [string, number] [] = [
            [PREMIUM_RECEIVABLE, approvedPaymentsAmountAfterInception + approvedPaymentsAmountAfterInception ],
            //[PREMIUMS_RECEIVED_IN_ADVANCED, ],
            [FIGA_FEE_RECEIVABLE, remainingFigaFee],
            [STATE_TAX_RECEIVABLE, remainingStateTax],
        ]
        const credits : [string, number] [] = [
            //[FIGA_FEE_REVENUE, remainingFigaFee],
            //[STATE_TAX_REVENUE, remainingStateTax],
            [FEE_REVENUE, prorratedSurplus],
            [REFUNS_PAYABLE, remainingPremium + remainingSurplus + remainingStateTax + remainingFigaFee]
        ]

        return new Entry(
            "Cancell refund Entry",
            debits,
            credits
        );
    }

}