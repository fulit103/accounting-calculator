import Entry from "../domain/entry";
import { CHANGE_UNEARNED_PREMIUM_RESERVE, EARNED_SURPLUS, UNEARNED_PREMIUM_RESERVE, UNEARNED_SURPLUS } from "../domain/ledger";
import Policy from "../domain/policy";
import { DailyAccrual } from "../domain/policy_event";

export default class GenerateDailyEarnedAccrualUseCase {

    execute(policy: Policy, event: DailyAccrual) : Entry {
        const earnedSurplus: number = (policy.surplus()/365) * (event.getDaysBetween());
        const earnedPremium: number = (policy.premium()/365) * (event.getDaysBetween());

        const debits : [string, number] [] = [
            [UNEARNED_SURPLUS, earnedSurplus],
            [UNEARNED_PREMIUM_RESERVE, earnedPremium],
        ]

        const credits : [string, number] [] = [
            [EARNED_SURPLUS, earnedSurplus],
            [CHANGE_UNEARNED_PREMIUM_RESERVE, earnedPremium]            
        ]

        return new Entry( 
            `Daily earned accrual from ${event.getStartDateStr()} to ${event.getEndDateStr()} days: ${event.getDaysBetween()}`,
            debits.filter( i => i[1] !== 0), 
            credits.filter( i => i[1] !== 0)
        )
    }

}