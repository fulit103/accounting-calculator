import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import PolicyEvent from "../../polices/domain/policy_event";
import EndorsementEventForm from "./EndorsementEventForm";
import ApprovedEventForm from "./ApprovedEventForm";
import CancelledEventForm from "./CancelledEventForm";
import InceptionEventForm from "./InceptionEventForm";
import DailyAccrualEventForm from "./DailyAccrualEventForm";

class EventFormFactory {
    static build(name: string, onChange : (e: PolicyEvent) => void) {
        switch (name) {
            case 'endorsement':
                return (
                    <EndorsementEventForm onChange={onChange} />
                );
            case 'cancellation':
                return (
                    <CancelledEventForm onChange={onChange}/>
                );
            case 'approve_payment':
                return (
                    <ApprovedEventForm onChange={onChange}/>
                )
            case 'inception':
                return (
                    <InceptionEventForm onChange={onChange}/>
                )
            case 'daily_accrual':
                return (
                    <DailyAccrualEventForm onChange={onChange} />
                )
        }
    }
}

const EventModal = ({ show, handleClose, onSaveEvent }: { 
    show: boolean, 
    handleClose: () => void,
    onSaveEvent: (e: PolicyEvent) => void
}) => {

    const [eventType, setEventType] = useState<string>("inception");
    let policyEvent: PolicyEvent;    

    const onChangeEvent = (e: PolicyEvent) => {
        policyEvent = e;
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="inputPremium">Type</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={(e) => setEventType(e.target.value)}>
                        <option value="inception">Inception</option>
                        <option value="endorsement">Endorsement</option>
                        <option value="cancellation">Cancellation</option>
                        <option value="renewal">Renewal</option>
                        <option value="expiration">Expiration</option>
                        <option value="reinstatement">Reinstatemen</option>
                        <option value="approve_payment">Approve Payment</option>
                        <option value="daily_accrual">Daily Accrual</option>
                    </Form.Select>
                </Form.Group>

                {EventFormFactory.build(eventType, onChangeEvent)}

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={(e) => onSaveEvent(policyEvent) }>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EventModal;