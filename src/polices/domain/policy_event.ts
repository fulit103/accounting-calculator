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
        return Math.ceil((this.created.getTime() - this.effective.getTime()) / (1000 * 3600 * 24));
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

export default PolicyEvent;