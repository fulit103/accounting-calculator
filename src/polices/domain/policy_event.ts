class PolicyEvent {
    readonly type: string;
    readonly created: Date;
    readonly effective: Date;

    constructor(type: string, created: Date, effective: Date){
        this.type = type;
        this.created = created;
        this.effective = effective;
    }

    getCreatedStr() : string {
        return this.created.toISOString().split('T')[0]
    }

    getEffectiveStr() : string {
        return this.effective.toISOString().split('T')[0]
    }

    getDaysBetween() : number {
        return Math.ceil(( this.effective.getTime() - this.created.getTime()) / (1000 * 3600 * 24));
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

    constructor(created: Date, effective: Date, premium: number) {
        super("Endorsement", created, effective)
        this.premium = premium;
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