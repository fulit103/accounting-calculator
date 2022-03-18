import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BillingContainer from './components/BillingContainer';
import EventsContainer from './components/EventsContainer/EventsContainer';
import LedgerContainer from './components/LedgerContainer';
import PolicyContainer from './components/PolicyContainer';
import GenerateApprovedPaymentEntryUseCase from './polices/application/GenerateApprovedPaymentEntryUseCase';
import GenerateInceptionEntryUseCase from './polices/application/GenerateInceptionEntryUseCase';
import GetApprovedPaymentsBeforeInceptionUseCase from './polices/application/GetApprovedPaymentsBeforeInceptionUseCase';
import Entry from './polices/domain/entry';
import Policy from './polices/domain/policy';
import PolicyEvent, { ApprovedPayment, Inception } from './polices/domain/policy_event';

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

let EVENTS: PolicyEvent [];

function App() {

  const [policy] = useState<Policy>(Policy.createEmpty());
  const [billingsData, setBillingData] = useState<Billing []>(billings(policy));
  const [entries, setEntries] = useState<Entry []>([]);

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
      if( e instanceof ApprovedPayment){
        setEntries([ ...entries, ...(new GenerateApprovedPaymentEntryUseCase()).execute(policy, e) ])
      }
  
      if( e instanceof Inception){
        const ammount = (new GetApprovedPaymentsBeforeInceptionUseCase()).execute(policy, EVENTS)
        setEntries([ ...entries, ...(new GenerateInceptionEntryUseCase()).execute(policy, e, ammount) ])       
      }
    } catch (ex) {
      console.error(ex); // pass exception object to err handler
    }
    
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
          
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <LedgerContainer entries={entries} onClear={() => setEntries([])}/>          
        </Col>
      </Row>
    </Container>
  );
}

export default App;
