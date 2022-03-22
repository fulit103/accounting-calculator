import { Billing, Payment } from "./billing";
import { ADMIN_FEE, EMPA_FEE, FIGA_FEE, INSPECTION_FEE, INSTALLMEN_FEE, SURPLUS_FEE, TAX_FEE } from "./fee";
import PaymentType from "./payment_type";
import { FactoryState, FL, LA, State } from "./state";

// Aggregate Root
class Policy {
    private _premium: number;
    private state: State;
    private payment_type: PaymentType;    
    private need_inspection: boolean;
    private _effectiveDate: Date;
    private billings : Billing [];
    //private end_date: Date;
    
    constructor(premium: number, state: State, payment_type: PaymentType, need_inspection: boolean, _effectiveDate: Date) {
        this._premium = premium;
        this.state = state;
        this.payment_type = payment_type;
        this.need_inspection = need_inspection;
        this._effectiveDate = _effectiveDate;
        this._effectiveDate.setHours(0,0,0,0);
        this.billings = this.generatePayment()
    }

    static createEmpty() : Policy {
        return new Policy(
            1000, 
            new FL(),
            new PaymentType(1, "card"), 
            false, 
            new Date()
        )
    }

    effectiveDate() : Date{
        return this._effectiveDate
    }

    effectiveDateYear() : number {        
        return this._effectiveDate.getFullYear()
    }

    effectiveDateStr() : string{
        return this._effectiveDate.toISOString().split('T')[0]
    }

    setEffectiveDate(effectiveDate: Date) {
        this._effectiveDate = effectiveDate;
        this.billings = this.generatePayment()
    }

    setEffectiveDateStr(effectiveDate: string) {
        console.log("value: ", effectiveDate)
        console.log("value: string ", (new Date(effectiveDate).toISOString().split('T')[0]).replace("-", "/")  )
        this._effectiveDate = new Date((new Date(effectiveDate).toISOString().split('T')[0]).replace("-", "/") );
        this.billings = this.generatePayment()
    }

    premium(): number {
        return this._premium
    }

    setPremium(premium: number): void {
        this._premium = premium
        this.billings = this.generatePayment()
    }

    stateName() : string{
        return this.state.name
    }

    setState(name: string) : void {
        this.state = FactoryState.createState(name)
        this.billings = this.generatePayment()
    }

    surplus() : number{        
        return this.state.feeValue(SURPLUS_FEE, this);
    }   
    
    installmentFee(): number {
        return this.state.feeValue(INSTALLMEN_FEE, this);
    }

    empaFee(): number {
        return this.state.feeValue(EMPA_FEE, this);
    }

    figaFee(): number {
        return this.state.feeValue(FIGA_FEE, this);
    }

    adminFee(): number {
        return this.state.feeValue(ADMIN_FEE, this);
    }

    inspectionFee(): number {
        return this.state.feeValue(INSPECTION_FEE, this);
    }

    taxFee(): number {
        return this.state.feeValue(TAX_FEE, this);
    }

    numberOfPayments(): number {
        return this.payment_type.numberOfPayments();
    }

    setNumberOfPayments(numberOfPayments: number) : void {
        this.payment_type.setNumberOfPayments(numberOfPayments);
        this.billings = this.generatePayment();
    }

    paymentMethod(): string {
        return this.payment_type.type();
    }

    hasInspection(): boolean {
        return this.need_inspection;
    }

    setInspection(needInspection: boolean) : void {
        this.need_inspection = needInspection;
        this.billings = this.generatePayment();
    }

    billingPremium(index: number ) : number {
        return this.billings[index].premium;
    }

    billingSurplus(index: number ) : number {
        return this.billings[index].surplus;
    }

    billingInstallmentFee(index: number ) : number {
        return this.billings[index].installmentFee;
    }

    billingEmpaFee(index: number ) : number {
        return this.billings[index].empaFee;
    }

    billingInspectionFee(index: number ) : number {
        return this.billings[index].inspectionFee;
    }

    billingTaxFee(index: number ) : number {
        return this.billings[index].taxFee;
    }

    billingAdminFee(index: number ) : number {
        return this.billings[index].adminFee;
    }

    billingFigaFee(index: number ) : number {
        return this.billings[index].figaFee;
    }

    billingStatus(index: number ) : string {
        return this.billings[index].status.name;
    }

    billingTotal(index: number ) : number {
        return this.billingPremium(index) + 
            this.billingSurplus(index) +
            this.billingInstallmentFee(index) + 
            this.billingAdminFee(index) + 
            this.billingEmpaFee(index) +
            this.billingInspectionFee(index) +
            this.billingTaxFee(index) +
            this.billingFigaFee(index)
    }

    billingSize(): number {
        return this.billings.length;
    }

    generatePayment(): Billing [] {
        var payments: Billing [] = [];
        for(var i = 1; i<=this.payment_type.numberOfPayments(); i++){
            payments.push(Payment.create(this, i));
        }
        return payments;
    }
}

export default Policy;