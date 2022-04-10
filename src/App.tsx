import 'bootstrap/dist/css/bootstrap.min.css';
import { useRef, useState } from 'react';
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
import PolicyEvent, { ApprovedPayment, Cancelled, DailyAccrual, Inception } from './polices/domain/policy_event';
import Timeline from 'react-vis-timeline'
import GenerateEffectivePeriods from './polices/application/GenerateEffectivePeriodsUseCase';
import GenerateCancelEntryUseCase from './polices/application/GenerateCancelEntryUseCase';
import GetApprovedPaymentsUseCase from './polices/application/GetApprovedPaymentsUseCase';
import ErrorBoundary from './components/ErrorBoundary';

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

const items = [
  {id: 1, content: 'item 1', start: new Date()},
    {id: 2, content: 'item 2', start: new Date('2022-04-14')},
]

const options = {
  initialGroups: [
    {id: 1, content: 'Periods'},
    {id: 2, content: 'Events'}
  ],
	initialItems: [
    //{id: 1, content: 'item 1', group: 1, start: new Date()}
  ],
	options: {
		height: '250px',
		autoResize: true,
		stack: true, // false == overlap items
		//orientation: 'top',
		verticalScroll: true
	}
}

function App() {

  const [policy] = useState<Policy>(Policy.createEmpty());
  const [billingsData, setBillingData] = useState<Billing[]>(billings(policy));
  const [entries, setEntries] = useState<Entry[]>([]);
  const [balances, setBalances] = useState<[string, number] []>([])
  const timeline = useRef<Timeline>(null);

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

      if (e instanceof Cancelled) {
        const amount = (new GetApprovedPaymentsUseCase()).execute(policy, EVENTS)
        setEntries([...entries, ...(new GenerateCancelEntryUseCase()).execute(policy, e,  amount[0], amount[1])])
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

  const generateTimeline = () => {
    //timeline.current.timeline.fit()
    //timeline.current.items.add({id: 1, content: 'item 1', group: 1, start: new Date()})
    if (null !== timeline.current) {
      timeline?.current.items.clear();

      const periods : {
        premium: number, 
        startDate: Date, 
        endDate: Date} [] = (new GenerateEffectivePeriods()).execute(policy, EVENTS);
      
      periods.forEach((item, index) => {
        if (null !== timeline.current) {
          timeline.current.items.add({
            id: index+1,
            group: 1,
            content: `${item.premium}`,
            start: item.startDate,
            end: item.endDate
          })   
        }         
      })

      EVENTS.forEach((item, index) => {
        if (null !== timeline.current) {
          timeline.current.items.add({
            id: index+1+periods.length,
            group: 2,
            content: `${item.type}`,
            start: item.effective,
          })   
        }
      })
    }    
  }

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <ErrorBoundary key={2233}>
            <PolicyContainer policy={policy} onChange={onChangePolicyHandler} />
          </ErrorBoundary>
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
                    <td>{item[1]===0 || item[1].toFixed(2)==="0.00" || item[1].toFixed(2)==="-0.00"? <div style={{color: 'gray'}}>0</div> : <strong>{item[1].toFixed(2)}</strong>}</td>
                  </tr>
                  
                ))}
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Button className="mb-4" variant="outline-primary" size="sm" onClick={generateTimeline}>Generate</Button>  
          <Timeline
            ref={timeline}
            {...options}            
          />
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
