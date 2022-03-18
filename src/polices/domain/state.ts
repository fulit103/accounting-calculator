import { AdminFee, EmpaFee, Fee, FigaFee, InspectionFee, InstallmentFee, SurplusFee, TaxFee } from "./fee";
import Policy from "./policy";

export abstract class State {
    name: string;
    private fees: Fee [];

    constructor(name: string, fees: Fee []){
        this.name = name;
        this.fees = fees;
    }

    feeValue(name: string, policy: Policy) : number {
        const filtered_fees: Fee[] = this.fees.filter((fee: Fee) => fee.name === name )
        
        if(filtered_fees.length===0)
            return 0
        
        return filtered_fees[0].value(policy)
    }    
}

export class FL extends State {
    
    constructor(){
        super("FL", [
            new EmpaFee(),
            new SurplusFee(),
            new InstallmentFee(),
            new FigaFee()
        ]);
    }
}

export class CA extends State {
    constructor(){
        super("CA", [
            new AdminFee(),
            new InstallmentFee(),
            new InspectionFee()
            //new SurplusFee()
        ])
    }
}

export class LA extends State {
    constructor(){
        super("LA", [
            new InstallmentFee(),
            new InspectionFee(),
            new TaxFee(),
            new SurplusFee()
        ])
    }
}

type statesOptions = {
    [key: string]: any
}

const states : statesOptions = {    
    "FL": FL, 
    "LA": LA, 
    "CA": CA 
};

export class FactoryState {
    static createState(name: string ) : State {
        const StateType = states[name];
        return new StateType()
    }
}