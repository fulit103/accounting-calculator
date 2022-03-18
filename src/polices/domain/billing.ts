import { SurplusFee } from "./fee";
import Policy from "./policy";

export class Status {
    name: string;

    constructor(){
        this.name = "pending"
    }

    approve(){
        if(this.name==="pending")
            this.name = "approved";
            
        throw new Error(`can't approve on ${this.name} state`)
    }

    reject(){
        if(this.name==="pending")
            this.name = "rejected"        

        throw new Error(`can't reject on ${this.name} state`)
    }
}

export abstract class Billing {
    readonly status: Status;
    readonly premium: number;
    readonly surplus: number;    
    readonly installmentFee: number;
    readonly adminFee: number;
    readonly empaFee: number;
    readonly inspectionFee: number;
    readonly taxFee: number;
    readonly figaFee: number;

    constructor(
        premium: number, 
        surplus: number, 
        installmentFee: number, 
        adminFee: number, 
        empaFee: number, 
        inspectionFee: number,
        taxFee: number,
        figaFee: number
    ) {
        this.status = new Status()
        this.surplus = surplus;
        this.premium = premium;
        this.installmentFee = installmentFee;
        this.adminFee = adminFee;
        this.empaFee = empaFee;
        this.inspectionFee = inspectionFee;
        this.taxFee = taxFee;
        this.figaFee = figaFee;
    }
}

export class Payment extends Billing {
    static create(policy: Policy, installmentNumber: number) : Payment {
        if( installmentNumber===1){
            return new Payment(
                policy.premium() / policy.numberOfPayments(),
                policy.surplus() / policy.numberOfPayments(),
                0,
                policy.adminFee(),
                policy.empaFee(),
                policy.inspectionFee(),
                policy.taxFee(),
                policy.figaFee()
            );
        }

        return new Payment(
            policy.premium() / policy.numberOfPayments(),
            policy.surplus() / policy.numberOfPayments(),
            policy.installmentFee() / (policy.numberOfPayments()-1),
            0,
            0,
            0,
            0,
            0
        );
    }
}

export class Refund extends Billing {

}

export class WriteOff extends Billing {

}