import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import BillingContainer from './components/BillingContainer';
import EventsContainer from './components/EventsContainer/EventsContainer';
import LedgerContainer from './components/LedgerContainer';
import PolicyContainer from './components/PolicyContainer';
import GenerateApprovedPaymentEntryUseCase from './polices/application/GenerateApprovedPaymentEntryUseCase';
import GenerateDailyEarnedAccrualUseCase from './polices/application/GenerateDailyEarnedAccrualUseCase';
import GenerateInceptionEntryUseCase from './polices/application/GenerateInceptionEntryUseCase';
import GetApprovedPaymentsForInceptionUseCase from './polices/application/GetApprovedPaymentsForInceptionUseCase';
import Entry from './polices/domain/entry';
import Ledger from './polices/domain/ledger';
import Policy from './polices/domain/policy';
import PolicyEvent, { ApprovedPayment, DailyAccrual, Inception } from './polices/domain/policy_event';

export type Billing = {
  index: number,
  premium: number,
  surplus: number,
  installmentFee: number,
  adminFee: number,
  empaFee: number,
  inspectionFee: number,
  taxFee: number,
  figaFee: number,
  total: number
}

let EVENTS: PolicyEvent[];

function App() {

  const [policy] = useState<Policy>(Policy.createEmpty());
  const [billingsData, setBillingData] = useState<Billing[]>(billings(policy));
  const [entries, setEntries] = useState<Entry[]>([]);
  const [balances, setBalances] = useState<[string, number] []>([])

  function billings(policy: Policy): Billing[] {
    const data: Billing[] = []
    for (let i = 0; i < policy.billingSize(); i++) {
      data.push({
        index: (i + 1),
        premium: policy.billingPremium(i),
        surplus: policy.billingSurplus(i),
        installmentFee: policy.billingInstallmentFee(i),
        adminFee: policy.billingAdminFee(i),
        empaFee: policy.billingEmpaFee(i),
        inspectionFee: policy.billingInspectionFee(i),
        taxFee: policy.billingTaxFee(i),
        figaFee: policy.billingFigaFee(i),
        total: policy.billingTotal(i)
      })
    }
    return data;
  }

  const onChangePolicyHandler = (policy: Policy) => {
    console.log("Premium: ", policy.premium())
    setBillingData(billings(policy))
  }

  const onClickRunButton = (e: PolicyEvent) => {
    try {
      if (e instanceof ApprovedPayment) {
        const newEntries = (new GenerateApprovedPaymentEntryUseCase()).execute(policy, e)

        setEntries([...entries, ...newEntries])
      }

      if (e instanceof Inception) {
        const amount = (new GetApprovedPaymentsForInceptionUseCase()).execute(policy, EVENTS)
        const newEntries = (new GenerateInceptionEntryUseCase()).execute(policy, e, amount[0], amount[1])
        
        setEntries([...entries, ...newEntries])
      }

      if (e instanceof DailyAccrual) {
        setEntries([...entries, (new GenerateDailyEarnedAccrualUseCase()).execute(policy, e)])
      }
    } catch (ex) {
      console.error(ex); // pass exception object to err handler
    }

  }

  const generateBalance = () => {
    const ledger = new Ledger();

    entries.forEach(entry => ledger.addEntry(entry))

    const balancesTemp: [string, number] []  = []

    console.log("######### ledger #############")

    ledger.accounts.forEach(account => {
      balancesTemp.push([account.name, account.totalBalance()])
      console.log(`|${account.name}|${account.totalBalance()}|`)
    })

    console.log("######### ###### #############")

    setBalances(balancesTemp)
  }

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <PolicyContainer policy={policy} onChange={onChangePolicyHandler} />
        </Col>
        <Col>
          <BillingContainer billings={billingsData} />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <EventsContainer onClickRunButtom={onClickRunButton} onEventsChange={(events) => EVENTS = events} />
        </Col>
        <Col>
          <Card>
            <Card.Header>Balance <Button variant="outline-secondary" size="sm" onClick={generateBalance}>Generate</Button></Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                {balances.map((item, index) => (
                  
                  <tr key={"balances" + index}>
                    <td>{item[0]}</td>
                    <td>{item[1]===0 ? <div style={{color: 'gray'}}>0</div> : <strong>{item[1].toFixed(2)}</strong>}</td>
                  </tr>
                  
                ))}
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <LedgerContainer entries={entries} onClear={() => setEntries([])} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
