import Policy from "../domain/policy";
import PolicyEvent, { ApprovedPayment } from "../domain/policy_event";


export default class GetApprovedPaymentsForInceptionUseCase {
    /*
    return [amount approved before inception, amount aproved on inception]
    */
    execute(policy: Policy, events: PolicyEvent []) : [number, number] {
        let totalApprovedBeforeInception = 0;
        let totalApprovedOnInception = 0;
        const approvedPayEvents = events.filter( event => event.type === "ApprovedPayment")
        for(let i=0; i<approvedPayEvents.length; i++){
            const approvedPayment = (approvedPayEvents[i] as ApprovedPayment)
            const effectiveDate = policy.effectiveDate();
            if(approvedPayment.depositedOn < effectiveDate){
                totalApprovedBeforeInception = totalApprovedBeforeInception + policy.billingPremium((approvedPayEvents[i] as ApprovedPayment).installmentIndex())
            }
            if(+approvedPayment.depositedOn === +effectiveDate){
                totalApprovedOnInception = totalApprovedOnInception + policy.billingPremium((approvedPayEvents[i] as ApprovedPayment).installmentIndex())
            }
        }
        return [totalApprovedBeforeInception, totalApprovedOnInception];
    }
}