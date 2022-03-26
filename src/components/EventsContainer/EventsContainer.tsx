import React, { useState } from "react";
import { Badge, Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import PolicyEvent, { ApprovedPayment, Cancelled, DailyAccrual, Endorsement, Inception } from "../../polices/domain/policy_event";
import EventModal from "../PolicyEvents/EventModal";



const EventItemHeader = ({event, onClick} : {event: PolicyEvent, onClick? : (event: PolicyEvent) => void}) => {

  const handleOnClick = () => {    
    if(onClick){
      onClick(event)
    }
  }

  return (
    <Row>
      <Col>{event.type}</Col>
      <Col xs={6}></Col>
      <Col className="text-right">
        <div className="float-rigth">
          <Button variant="outline-secondary" size="sm" onClick={handleOnClick}>Run</Button>
        </div>
      </Col>
    </Row>
  )
}

const CancelledListItem = ({ event, onClickRunButtom }: { event: Cancelled, onClickRunButtom? : (e: PolicyEvent) => void }) => {
  return (
    <ListGroup.Item>
      <EventItemHeader event={event} onClick={onClickRunButtom}/>
      <Row>
        <Col>
          <strong>Created</strong> {event.getCreatedStr()}
          <strong> Effective Date</strong> {event.getEffectiveStr() + " "}
          <strong>Flat </strong> {event.flatCancel ? "yes" : "no"}
        </Col>
      </Row>

    </ListGroup.Item>
  )
}

const EndorsementListItem = ({ event, onClickRunButtom }: { event: Endorsement, onClickRunButtom? : (e: PolicyEvent) => void  }) => {
  return (
    <ListGroup.Item>
      <EventItemHeader event={event} onClick={onClickRunButtom}/>
      <Row>
        <Col>
          <strong>Created</strong> {event.getCreatedStr()}
          <strong> Effective Date</strong> {event.getEffectiveStr()}          
        </Col>
      </Row>
      <Row>
        <Col>
          <strong> Previus Premium</strong> {event.premium}
          <strong> New Premium</strong> {event.surplus}
        </Col>
      </Row>
      <Row>
        <Col>          
          <strong> New Policy effective date</strong> {event.newPolicyEffectiveDateStr()}
        </Col>
      </Row>
    </ListGroup.Item>
  )
}

const InceptionListItem = ({ event, onClickRunButtom }: { event: Inception, onClickRunButtom? : (e: PolicyEvent) => void  }) => {
  return (
    <ListGroup.Item>
      <EventItemHeader event={event} onClick={onClickRunButtom}/>
      <Row>
        <Col>
          <strong>Created</strong> {event.getCreatedStr()}
          <strong> Effective Date</strong> {event.getEffectiveStr()}
        </Col>
      </Row>
    </ListGroup.Item>
  )
}

const DailyAccrualListItem = ({ event, onClickRunButtom }: { event: DailyAccrual, onClickRunButtom? : (e: PolicyEvent) => void  }) => {
  return (
    <ListGroup.Item>
      <EventItemHeader event={event} onClick={onClickRunButtom}/>
      <Row>
        <Col>
          <strong>Start Date</strong> {event.getStartDateStr()}
          <strong> End Date</strong> {event.getEndDateStr()}
        </Col>
      </Row>
    </ListGroup.Item>
  )
}

const ApprovedPaymentListItem = ({ event, onClickRunButtom }: { event: ApprovedPayment, onClickRunButtom? : (e: PolicyEvent) => void  }) => {
  return (
    <ListGroup.Item>
      <EventItemHeader event={event} onClick={onClickRunButtom}/>
      <Row>
        <Col>
          <strong>Deposited on</strong> {event.getCreatedStr()}
          <strong> Installment</strong> {event.installment}
          <strong> Term</strong> {event.term}
          <strong> Overpayment</strong> {event.overpayment}
          <strong> Duplicated</strong> {event.isDuplicated ? "yes" : "no"}
        </Col>
      </Row>
    </ListGroup.Item>
  )
}

class FactoryItemListEvent {

  static build(e: PolicyEvent, onClickRunButtom? : (e: PolicyEvent) => void ) {
    if (e instanceof Cancelled) {
      return (
        <CancelledListItem event={e} onClickRunButtom={onClickRunButtom}/>
      )
    }

    if (e instanceof Endorsement) {
      return (
        <EndorsementListItem event={e} onClickRunButtom={onClickRunButtom}/>
      )
    }

    if ( e instanceof Inception ) {
      return (
        <InceptionListItem event={e} onClickRunButtom={onClickRunButtom}/>
      )
    }

    if ( e instanceof ApprovedPayment ) {
      return (
        <ApprovedPaymentListItem event={e} onClickRunButtom={onClickRunButtom}/>
      )
    }

    if ( e instanceof DailyAccrual ) {
      return (
        <DailyAccrualListItem event={e} onClickRunButtom={onClickRunButtom}/>
      )
    }
  }

}

const EventsContainer = ({onClickRunButtom, onEventsChange} : {onClickRunButtom? : (e: PolicyEvent) => void, onEventsChange : (events: PolicyEvent []) => void }) => {

  const [show, setShow] = useState(false);
  const [events, setEvents] = useState<PolicyEvent[]>([])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Card>
        <Card.Header>Events <Button variant="outline-primary" size="sm" onClick={handleShow}>Add</Button></Card.Header>
        <Card.Body>
          <ListGroup>
            {events.map((item, index) => (
              <div key={index}>{FactoryItemListEvent.build(item, onClickRunButtom)}</div>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      <EventModal show={show} handleClose={handleClose} onSaveEvent={(e) => {
        onEventsChange([...events, e]);
        setEvents([...events, e]);
        setShow(false);        
      }} />
    </>
  )
}

export default EventsContainer;