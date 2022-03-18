import { FactoryState, FL, LA, CA } from "../state";

it('test factory', () => {    
    expect(FactoryState.createState("FL")).toEqual(new FL());
    expect(FactoryState.createState("LA")).toEqual(new LA());
    expect(FactoryState.createState("CA")).toEqual(new CA());    
});