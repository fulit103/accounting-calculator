class Entry {

    readonly name: string;
    readonly debits: [string, number][];
    readonly credits: [string, number][];

    constructor(name: string, debits:  [string, number][], credits: [string, number][]){        
        this.guardName(name);
        this.name = name;
        //this.guardAmmount(debits, credits);     
        this.debits = debits.filter( i => i[1] !== 0);
        this.credits = credits.filter( i => i[1] !== 0);
    }

    guardName(name : string){
        
    }

   guardAmmount(debits:  [string, number][], credits: [string, number][]) {        
        const totalDebits = this.totalAmmount(debits);
        const totalCredits = this.totalAmmount(credits)      
        
        if((totalDebits-totalCredits)!==0) {
            throw new Error(`the Entry ${this.name} its not balance debits ${totalDebits} credits: ${totalCredits}`);   
        }
    }

    private totalAmmount(data: [string, number][]) : number {
        return data.reduce<[string, number]>( (prev, curr) => ["total", prev[1] + curr[1]], ["total", 0])[1]
    }

}

export default Entry;