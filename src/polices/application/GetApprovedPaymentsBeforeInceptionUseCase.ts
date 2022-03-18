import Policy from "../domain/policy";
import PolicyEvent, { ApprovedPayment } from "../domain/policy_event";


export default class GetApprovedPaymentsBeforeInceptionUseCase {
    execute(policy: Policy, events: PolicyEvent []) : number {
        let total = 0
        const approvedPayEvents = events.filter( event => event.type === "ApprovedPayment")
        for(let i=0; i<approvedPayEvents.length; i++){
            if((approvedPayEvents[i] as ApprovedPayment).depositedOn < policy.effectiveDate()){
                total = total + policy.billingPremium((approvedPayEvents[i] as ApprovedPayment).installmentIndex())
            }
        }
        return total;
    }
}