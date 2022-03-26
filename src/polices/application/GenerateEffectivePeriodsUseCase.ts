import Period from "../domain/Period";
import Policy from "../domain/policy";
import PolicyEvent, { Cancelled, Endorsement, Inception } from "../domain/policy_event";

export default class GenerateEffectivePeriods {

    execute(policy: Policy, events: PolicyEvent []) : {premium: number, startDate: Date, endDate: Date} [] {
        const periodEvents = events.filter(event => event instanceof Endorsement || event instanceof Inception ).map<{
            premium: number,
            startDate: Date,
            endDate: Date,
            event: string
        }>(event => {

            if(event instanceof Endorsement){
                return {
                    premium: (event as Endorsement).premium,
                    startDate: (event as Endorsement).effective,
                    endDate: policy.endDate(),
                    event: event.type
                } 
            }

            return {
                premium: policy.premium(),
                startDate: (event as Inception).effective,
                endDate: policy.endDate(),
                event: event.type
            } 
        })

        if(periodEvents.length===0) return [];

        const root : Period = new Period(
            periodEvents[0].premium, 
            periodEvents[0].startDate,
            periodEvents[0].endDate,
            periodEvents[0].event,   
        )
        
        for(let i=1; i<periodEvents.length; i++){
            root.insert( 
                periodEvents[i].premium, 
                periodEvents[i].startDate,
                periodEvents[i].endDate,
                periodEvents[i].event
            )
        }

        return root.toArray()
    }
}