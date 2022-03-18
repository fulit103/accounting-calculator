class AccountingValue {
    readonly value: number;
    readonly date: Date;

    constructor(value: number, date: Date){
        this.value = value
        this.date = date
    }
}

class Account {
    readonly name : string;
    readonly type: string;
    private credits: AccountingValue [];
    private debits: AccountingValue [];

    constructor(name: string, type: string){
        this.name = name;
        this.type = type;
        this.credits = [];
        this.debits = [];
    }

    addCredit(value: number, date: Date) : void {        
        this.credits.push(new AccountingValue(value, date))
    }

    addDebit(value: number, date: Date) : void{
        this.debits.push(new AccountingValue(value, date))
    }

    totalCredits(): number {
        return this.credits.map<number>( i => i.value ).reduce( (previous, current) => previous + current, 0 )        
    }

    totalDebits(): number {
        return this.debits.map<number>( i => i.value ).reduce( (previous, current) => previous + current, 0 )        
    }

    totalBalance() : number {
        return this.totalCredits() - this.totalDebits()
    }
}

export default Account;