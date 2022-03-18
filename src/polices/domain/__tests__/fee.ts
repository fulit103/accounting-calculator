import {Fee, InstallmentFee} from '../fee'
import PaymentType from '../payment_type';
import Policy from '../policy';
import { LA } from '../state';

it('installment fee should be cero for 1Pay policies', () => {
    const fee: Fee = new InstallmentFee()
    const policy: Policy = new Policy(1000, new LA(), new PaymentType(1, "escrow"), false, new Date() )    
    expect(fee.value(policy)).toEqual(0);  
});


it('installment fee should be 3 for 2Pay  policies', () => {
    const fee: Fee = new InstallmentFee()
    const policy: Policy = new Policy(1000, new LA(), new PaymentType(2, "escrow"), false, new Date() )    
    expect(fee.value(policy)).toEqual(3);  
});