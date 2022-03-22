import Entry from "../entry";
import Ledger, { CASH, CHANGE_UNEARNED_PREMIUM_RESERVE, PREMIUMS_RECEIVED_IN_ADVANCED, PREMIUM_RECEIVABLE } from "../ledger";

it('test add Entry on leadger', () => {    

    const ledger = new Ledger();
    const entry = new Entry(
        "entry 1",
        [
            [PREMIUM_RECEIVABLE, 10],
            [PREMIUMS_RECEIVED_IN_ADVANCED, 15],
            [CHANGE_UNEARNED_PREMIUM_RESERVE, 20],
        ],
        [
            [CASH, 45]
        ]
    )

    ledger.addEntry(entry);

    expect(ledger.accounts[0].totalBalance()).toEqual(-10);  
    expect(ledger.accounts[1].totalBalance()).toEqual(-15);  
    expect(ledger.accounts[3].totalBalance()).toEqual(-20);
    
    expect(ledger.accounts[11].totalBalance()).toEqual(45);
});