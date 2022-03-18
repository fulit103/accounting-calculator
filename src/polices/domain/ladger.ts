import Account from "./account";

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
export const REFUNS_PAYABLE = "Refuns payable";

export const PREMIUMS_RECEIVED_IN_ADVANCED = "Premiums Received In Advanced";
export const DEFERRED_INSTALLMENTS = "Deferred Installments";

class Ladger {
    readonly accounts: Account [];    

    constructor(){
        this.accounts = [
            new Account("Premium receivable", "asset"),
            new Account("Premiums Received In Advanced", "liability"),
            new Account("Direct premiums written", "revenew")
        ]
    }

    addEntry(name: string, debits:  [string, number][], credits: [string, number][]) {

    }
}

export default Ladger;