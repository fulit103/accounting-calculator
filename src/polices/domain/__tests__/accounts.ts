import Account from '../account';

it('accounting total credits should be 25', () => {
    const account: Account = new Account("account 1", "asset")

    account.addCredit(10, new Date())
    account.addCredit(15, new Date())

    expect(account.totalCredits()).toEqual(25);  
});


it('accounting total debits should be 30', () => {
    const account: Account = new Account("account 1", "asset")

    account.addDebit(10, new Date())
    account.addDebit(15, new Date())
    account.addDebit(5, new Date())

    expect(account.totalDebits()).toEqual(30);  
});