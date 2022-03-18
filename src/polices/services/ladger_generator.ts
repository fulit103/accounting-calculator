import Ladger from "../domain/ladger";
import Policy from "../domain/policy";

class LadgerGenerator {

    execute(policy: Policy, date: Date) : Ladger {
        return new Ladger()
    }
}

export default LadgerGenerator