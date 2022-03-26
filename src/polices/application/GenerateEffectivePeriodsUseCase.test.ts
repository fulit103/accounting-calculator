import PaymentType from "../domain/payment_type";
import Policy from "../domain/policy";
import PolicyEvent, { Endorsement, Inception } from "../domain/policy_event";
import { FL } from "../domain/state";
import GenerateEffectivePeriods from "./GenerateEffectivePeriodsUseCase"

it('Generate Effective Periods scenario 1', () => { 
    const useCase = new GenerateEffectivePeriods();

    const policy = new Policy(1000, new FL(), new PaymentType(2, "card"), false, new Date("05/10/2022"))

    // type        effective  premium
    // Inception     may 10    1000
    // Endo          may 20    1050
    // Endo          may 10    600
    const events: PolicyEvent [] = [
        new Inception(new Date("05/10/2022"), new Date("05/10/2022")),
        new Endorsement(new Date("05/20/2022"), new Date("05/20/2022"), new Date("05/20/2022"), 1050, 105),
        new Endorsement(new Date("05/30/2022"), new Date("05/10/2022"), new Date("05/20/2022"), 600, 60)
    ]

    const effectivePolicies = useCase.execute(policy, events)

    // EffectivePolicies
    // (600, 05/10/2022, 05/10/2023)

    expect(effectivePolicies.length).toBe(1);
    expect(effectivePolicies[0].premium).toBe(600);
    expect(effectivePolicies[0].startDate).toEqual(new Date("05/10/2022"))
    expect(effectivePolicies[0].endDate).toEqual(new Date("05/10/2023"))
})

it('Generate Effective Periods scenario 2', () => { 
    const useCase = new GenerateEffectivePeriods();

    const policy = new Policy(110, new FL(), new PaymentType(2, "card"), false, new Date("05/05/2022"))

    // type        effective  premium
    // Endo          may 5     100
    // Inception     may 5    110
    // Endo          may 30    120
    // Endo          may 30    121
    // Endo          may 30    123
    const events: PolicyEvent [] = [
        new Endorsement(new Date("05/05/2022"), new Date("05/05/2022"), new Date("05/05/2022"), 100, 10),
        new Inception(new Date("05/05/2022"), new Date("05/05/2022")),
        new Endorsement(new Date("05/30/2022"), new Date("05/30/2022"), new Date("05/30/2022"), 120, 12),
        new Endorsement(new Date("05/30/2022"), new Date("05/30/2022"), new Date("05/30/2022"), 121, 12.1),
        new Endorsement(new Date("05/20/2022"), new Date("05/30/2022"), new Date("05/30/2022"), 123, 12.3),
    ]

    const effectivePolicies = useCase.execute(policy, events)

    // EffectivePolicies
    // (100, 05/05/2022, 05/30/2022)
    // (123, 05/30/2022, 05/05/2023)

    expect(effectivePolicies.length).toBe(2)
    expect(effectivePolicies[0].premium).toBe(100)
    expect(effectivePolicies[0].startDate).toEqual(new Date("05/05/2022"))
    expect(effectivePolicies[0].endDate).toEqual(new Date("05/30/2022"))

    expect(effectivePolicies[1].premium).toBe(123)
    expect(effectivePolicies[1].startDate).toEqual(new Date("05/30/2022"))
    expect(effectivePolicies[1].endDate).toEqual(new Date("05/05/2023"))
})