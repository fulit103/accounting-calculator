import PaymentType from "../domain/payment_type";
import Policy from "../domain/policy";
import PolicyEvent, { ApprovedPayment, Inception } from "../domain/policy_event";
import { FL } from "../domain/state";
import GetApprovedPaymentsForInceptionUseCase from "./GetApprovedPaymentsForInceptionUseCase";

it('approved amounts for inceptions', () => {    
    const useCase = new GetApprovedPaymentsForInceptionUseCase();
    const policy = new Policy(1000, new FL(), new PaymentType(2, "card"), false, new Date("03/15/2022"))
    const events : PolicyEvent []= [                
        new ApprovedPayment( 1, 1, new Date("03/10/2022"), false, 0),
        new Inception(new Date(), new Date()),
        new ApprovedPayment( 2, 1, new Date("03/15/2022"), false, 0),
        new ApprovedPayment( 1, 1, new Date("03/20/2022"), false, 0),
    ];

    const amounts = useCase.execute(policy, events);

    expect(amounts[0]).toEqual(500);
    expect(amounts[1]).toEqual(500);      
});