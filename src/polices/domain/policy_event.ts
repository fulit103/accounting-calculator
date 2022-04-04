import DaysBetween from "./DaysBetween";

class PolicyEvent {
    readonly type: string;
    readonly created: Date;
    readonly effective: Date;

    constructor(type: string, created: Date, effective: Date){
        this.type = type;
        this.created = created;
        this.effective = effective;
        this.created.setHours(0,0,0,0)
        this.effective.setHours(0,0,0,0)
    }

    getCreatedStr() : string {
        return this.created.toISOString().split('T')[0]
    }

    getEffectiveStr() : string {
        return this.effective.toISOString().split('T')[0]
    }

    getDaysBetween() : number {
        return DaysBetween.get(this.effective, this.created);
    }
} 

export class Inception extends PolicyEvent {

    constructor(created: Date, effective: Date) {
        super("Inception", created, effective)
    }
}

export class Cancelled extends PolicyEvent {
    readonly flatCancel : boolean;

    constructor(created: Date, effective: Date, flatCancel: boolean) {
        super("Cancelled", created, effective)
        this.flatCancel = flatCancel
    }
}

export class Endorsement extends PolicyEvent {
    readonly premium: number;
    readonly surplus: number;
    readonly newPolicyEffectiveDate: Date | undefined;

    constructor(
        created: Date, 
        effective: Date,
        newPolicyEffectiveDate: Date | undefined,         
        premium: number,
        surplus: number) {
        super("Endorsement", created, effective)
        this.newPolicyEffectiveDate = newPolicyEffectiveDate;        
        this.newPolicyEffectiveDate?.setHours(0,0,0,0);
        this.premium = premium;
        this.surplus = surplus;        
    }

    newPolicyEffectiveDateStr() : string {
        if( this.newPolicyEffectiveDate === undefined)
            return "-"

        return this.newPolicyEffectiveDate.toISOString().split('T')[0]
    }

}

export class ApprovedPayment extends PolicyEvent {
    readonly installment: number;
    readonly term: number;
    readonly depositedOn: Date;
    readonly isDuplicated: boolean;
    readonly overpayment: number;

    constructor(installment: number, term: number, depositedOn: Date, isDuplicated: boolean, overpayment: number) {
        super("ApprovedPayment", depositedOn, depositedOn)
        this.installment = installment;
        this.term = term;
        this.depositedOn = depositedOn;
        this.depositedOn.setHours(0,0,0,0);
        this.isDuplicated = isDuplicated;
        this.overpayment = overpayment;
    }

    isOverpayment(): boolean {
        return this.overpayment > 0
    }

    installmentIndex() : number {
        return this.installment - 1;
    }
}

export class WriteOffApproved extends PolicyEvent {
    readonly term: number;
    readonly premium: number;
    readonly stateTax: number;
    readonly figaFee: number;
    readonly approvedOn: Date;

    constructor(term: number, premium: number, stateTax: number, figaFee: number, approvedOn: Date) {
        super("WriteOffApproved", approvedOn, approvedOn);
        this.term = term;
        this.premium = premium;
        this.stateTax = stateTax;
        this.figaFee = figaFee;
        this.approvedOn = approvedOn;
        this.approvedOn.setHours(0,0,0,0)
    }
} 

export class DailyAccrual extends PolicyEvent {
    readonly startDate: Date;
    readonly endDate: Date;

    constructor(startDate: Date, endDate: Date ) {
        super("Daily Accrual", startDate, endDate)
        this.startDate = startDate;
        this.endDate = endDate;
        this.startDate.setHours(0,0,0,0);
        this.endDate.setHours(0,0,0,0)
    }

    getStartDateStr() : string {
        return this.startDate.toISOString().split('T')[0]
    }

    getEndDateStr() : string {
        return this.endDate.toISOString().split('T')[0]
    }
}

export default PolicyEvent;