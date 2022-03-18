class PaymentType {
    private _number_payments: number;
    private _type: string;

    constructor(number_payments: number, type: string){
        this.guardNumberPayments(number_payments)
        this.guardType(type)
        this._number_payments = number_payments;
        this._type = type;
    }

    private guardType(type: string) {
        if(type !== "escrow" && type !== "card")
            throw new Error("type should be a 'card' or 'escrow'");   
    }

    private guardNumberPayments(number_payments: number){
        if(number_payments<1 && number_payments>4)
            throw new Error("number of payments should be a value between 1 and 4");   
    }

    setNumberOfPayments(number_payments: number){
        this.guardNumberPayments(number_payments)
        this._number_payments = number_payments
    }

    setType(type: string){
        this.guardType(type)
        this._type = type
    }

    type() : string {
        return this._type
    }

    numberOfPayments() : number {
        return this._number_payments
    }
}

export default PaymentType;