import Entry from "../domain/entry";
import { CHANGE_UNEARNED_PREMIUM_RESERVE, DEFERRED_INSTALLMENTS, DIRECT_PREMIUMS_WRITTEN, EARNED_SURPLUS, FIGA_FEE_RECEIVABLE, FIGA_FEE_REVENUE, PREMIUMS_RECEIVED_IN_ADVANCED, PREMIUM_RECEIVABLE, STATE_TAX_RECEIVABLE, STATE_TAX_REVENUE, UNEARNED_PREMIUM_RESERVE, UNEARNED_SURPLUS } from "../domain/ledger";
import Policy from "../domain/policy";
import { Inception } from "../domain/policy_event";

export default class GenerateInceptionEntryUseCase {

    execute(policy: Policy, event: Inception, approvedPaymentsAmountBeforeInception: number, approvedPaymentsAmountAfterInception: number) : Entry [] {
        const entries: Entry [] = [this.getInceptionEntry(policy)]        
        const catchUpEntry = this.getCatchUpEntries(policy, event);
        const preEffectiveEntry = this.getEntryForInceptionWithPreEffectivePayment(policy, event, approvedPaymentsAmountBeforeInception, approvedPaymentsAmountAfterInception);        
        
        if(preEffectiveEntry!==undefined) {
            entries.push(preEffectiveEntry);
        }

        if(catchUpEntry!==undefined) {
            entries.push(catchUpEntry)
        }

        return entries;
    }

    private getInceptionEntry(policy: Policy) : Entry {
        const debits : [string, number ] [] = [
            [PREMIUM_RECEIVABLE, policy.premium() ],
            [CHANGE_UNEARNED_PREMIUM_RESERVE, policy.premium()],
            [EARNED_SURPLUS, policy.surplus()],
            [FIGA_FEE_RECEIVABLE, policy.figaFee()],            
            [STATE_TAX_RECEIVABLE, policy.taxFee()]
        ]
        const credits : [string, number ] [] = [
            [DIRECT_PREMIUMS_WRITTEN, policy.premium()],
            [UNEARNED_PREMIUM_RESERVE, policy.premium()],
            [UNEARNED_SURPLUS, policy.surplus()],
            [FIGA_FEE_REVENUE, policy.figaFee()],
            [STATE_TAX_REVENUE, policy.taxFee()]
        ]

        return new Entry(
            "Inception", 
            debits.filter( i => i[1] !== 0), 
            credits.filter( i => i[1] !== 0)
        )
    }

    private getCatchUpEntries(policy: Policy, event: Inception) : Entry | undefined {
        if(event.effective >= event.created)
            return undefined;            

        const debits : [string, number] [] = [
            [UNEARNED_PREMIUM_RESERVE, policy.premium() / 356 * event.getDaysBetween() ],
            [UNEARNED_SURPLUS, policy.surplus() / 356 * event.getDaysBetween()]
        ]
        
        const credits : [string, number] [] = [
            [CHANGE_UNEARNED_PREMIUM_RESERVE, policy.premium() / 356 * event.getDaysBetween() ],
            [EARNED_SURPLUS, policy.surplus() / 356 * event.getDaysBetween()]
        ]

        return new Entry(
            "Record catch up for premium and surplus",
            debits, 
            credits
        )
    }

    private getEntryForInceptionWithPreEffectivePayment(policy: Policy, event: Inception, approvedPaymentsAmountBeforeInception: number, approvedPaymentsAmountAfterInception: number)  : Entry | undefined {
        if((approvedPaymentsAmountBeforeInception + approvedPaymentsAmountAfterInception)===0)
            return undefined;

        const debits : [string, number ] [] = [            
            [DEFERRED_INSTALLMENTS, policy.premium() - approvedPaymentsAmountBeforeInception - approvedPaymentsAmountAfterInception],
        ]

        if(approvedPaymentsAmountBeforeInception>0){
            debits.push([PREMIUMS_RECEIVED_IN_ADVANCED, approvedPaymentsAmountBeforeInception ])  // We have a dependency of Ladger or Approved Payment Events
        }

        if(approvedPaymentsAmountAfterInception>0){
            debits.push([PREMIUM_RECEIVABLE, approvedPaymentsAmountAfterInception ])  // We have a dependency of Ladger or Approved Payment Events
        }

        const credits : [string, number ] [] = [
            [PREMIUM_RECEIVABLE, policy.premium()]
        ]

        return new Entry(
            "Record Policy Inception with Pre-effective Payment",
            debits.filter( i => i[1] !== 0), 
            credits.filter( i => i[1] !== 0)
        )
    }

}