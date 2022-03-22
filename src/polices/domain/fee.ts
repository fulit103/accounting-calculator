import Policy from "./policy";

export const INSTALLMEN_FEE = "Installment Fee";
export const INSPECTION_FEE = "Inspection Fee";
export const ADMIN_FEE = "Admin Fee";
export const EMPA_FEE = "Empa Fee";
export const TAX_FEE = "Tax Fee";
export const SURPLUS_FEE = "Surplus Fee";
export const FIGA_FEE = "Figa Fee";


export abstract class Fee {
    readonly name: string;    

    constructor(name: string) {
        this.name = name
    }

    abstract value(policy: Policy) : number;
}

export class InstallmentFee extends Fee {    
    readonly fee: number;

    constructor(fee: number = 3){
        super(INSTALLMEN_FEE)
        this.fee = fee;
    }

    value(policy: Policy): number {
        if(policy.numberOfPayments()===1)
            return 0
        
        return policy.numberOfPayments()*this.fee - this.fee
    }
}

export class InspectionFee extends Fee {    
    constructor(){
        super(INSPECTION_FEE)
    }

    value(policy: Policy): number {     
        if(policy.hasInspection())   
            return 15;
        return 0;
    }
}

export class AdminFee extends Fee {    
    constructor(){
        super(ADMIN_FEE)
    }

    value(policy: Policy): number {
        return 65;
    }
}

export class EmpaFee extends Fee {    
    constructor(){
        super(EMPA_FEE)
    }

    value(policy: Policy): number {
        return 2
    }
}

export class TaxFee extends Fee {    
    constructor(){
        super(TAX_FEE)
    }

    value(policy: Policy): number {    
        return Number((policy.premium() * 0.0485).toFixed(2));
    }
}

export class SurplusFee extends Fee {    
    constructor(){
        super(SURPLUS_FEE)
    }

    value(policy: Policy): number {
        const pre = policy.premium();
        return Number((pre * 0.1).toFixed(0));
    }
}

export class FigaFee extends Fee {    
    constructor(){
        super(FIGA_FEE)
    }

    value(policy: Policy): number {    
        console.log("FullYear: ", console.log(policy.effectiveDateYear()))        
        if(policy.effectiveDateYear()===2022)
            return Number((policy.premium() * 0.007).toFixed(0))

        return 0
    }
}