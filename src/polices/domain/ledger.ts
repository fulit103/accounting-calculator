import Account from "./account";
import Entry from "./entry";

export const PREMIUM_RECEIVABLE = "Premium receivable"
export const DIRECT_PREMIUMS_WRITTEN = "Direct premiums written";
export const CHANGE_UNEARNED_PREMIUM_RESERVE = "Change unearned premium reserve";
export const UNEARNED_PREMIUM_RESERVE = "Unearned premium reserve"
export const UNEARNED_SURPLUS = "Unearned surplus";
export const EARNED_SURPLUS = "Earned surplus";
export const FIGA_FEE_RECEIVABLE = "Figa fee receivable";
export const FIGA_FEE_REVENUE = "Figa fee revenue";
export const STATE_TAX_RECEIVABLE = "State tax receivable";
export const STATE_TAX_REVENUE = "State tax revenue";
export const CASH = "Cash";
export const EMPA_FEE_PAYABLE = "Empa fee payable";
export const INSPECTION_FEES = "Inspection fees";
export const PROGRAM_ADMINISTRATOR_FEE_REVENUE = "Program administrator fee revenue";
export const UNASSIGNED_SURPLUS = "Unassigned surplus";
export const FEE_REVENUE = "Fee revenue";
export const REFUNS_PAYABLE = "Refunds payable";

export const PREMIUMS_RECEIVED_IN_ADVANCED = "Premiums Received In Advanced";
export const DEFERRED_INSTALLMENTS = "Deferred Installments";

class Ledger {
    readonly accounts: Account [];    

    constructor(){
        this.accounts = [
            new Account(PREMIUM_RECEIVABLE, "asset"),
            new Account(PREMIUMS_RECEIVED_IN_ADVANCED, "liability"),
            new Account(DIRECT_PREMIUMS_WRITTEN, "revenew"),            
            new Account(CHANGE_UNEARNED_PREMIUM_RESERVE, ""),
            new Account(UNEARNED_PREMIUM_RESERVE, ""),
            new Account(UNEARNED_SURPLUS, ""),
            new Account(EARNED_SURPLUS, ""),
            new Account(FIGA_FEE_RECEIVABLE, ""),
            new Account(FIGA_FEE_REVENUE, ""),
            new Account(STATE_TAX_RECEIVABLE, ""),
            new Account(STATE_TAX_REVENUE, ""),
            new Account(CASH, ""),
            new Account(EMPA_FEE_PAYABLE, ""),
            new Account(INSPECTION_FEES, ""),
            new Account(PROGRAM_ADMINISTRATOR_FEE_REVENUE, ""),
            new Account(UNASSIGNED_SURPLUS, ""),
            new Account(FEE_REVENUE, ""),
            new Account(REFUNS_PAYABLE, ""),            
            new Account(DEFERRED_INSTALLMENTS, "")
        ]
    }

    addEntry(entry: Entry) {
        entry.debits.forEach( (debit: [string, number]) => {
            const filterAccounts: Account [] = this.accounts.filter( i => i.name === debit[0])
            if(filterAccounts.length>0){
                filterAccounts[0].addDebit(debit[1], new Date())
            }
        })

        entry.credits.forEach( (credit: [string, number]) => {
            const filterAccounts: Account [] = this.accounts.filter( i => i.name === credit[0])
            if(filterAccounts.length>0){
                filterAccounts[0].addCredit(credit[1], new Date())
            }
        })
    }
}

export default Ledger;