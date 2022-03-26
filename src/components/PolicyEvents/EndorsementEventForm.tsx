import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { Endorsement } from "../../polices/domain/policy_event";

const EndorsementEventForm = ({onChange} : { onChange: (e: Endorsement) => void }) => {

    const [data, setData] = useState<{ 
        created: string, 
        effective: string, 
        premium: number,
        surplus: number,
        changePolicyEffectiveDate: boolean,
        newPolicyEffectiveDate: string
    }>({
        created: (new Date()).toISOString().split('T')[0],
        effective: (new Date()).toISOString().split('T')[0],
        premium: 0,
        surplus: 0,
        changePolicyEffectiveDate: false,
        newPolicyEffectiveDate: (new Date()).toISOString().split('T')[0]
    })

    useEffect(() => {
        onChange(
            new Endorsement(
                new Date(data.created), 
                new Date(data.effective), 
                data.changePolicyEffectiveDate? new Date(data.newPolicyEffectiveDate) : undefined,
                data.premium,
                data.surplus                    
            )
        )
    }, [data, onChange])

    return (
        <>
            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label>Created date</Form.Label>
                        <Form.Control
                            type="date"
                            value={data.created}
                            onChange={(e) => setData({ ...data, created: new Date(e.target.value).toISOString().split('T')[0] })}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label>Effective Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={data.effective}
                            onChange={(e) => setData({ ...data, effective: new Date(e.target.value).toISOString().split('T')[0] })}
                        />
                    </Form.Group>
                </Col>
            </Row>

            
            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label>Premium</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.premium}
                            onChange={(e) => setData({...data, premium: Number(e.target.value)})}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label>Surplus</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.surplus}
                            onChange={(e) => setData({...data, surplus: Number(e.target.value)})}
                        />
                    </Form.Group>
                </Col>
            </Row>
            
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label >New Policy Effective Date</Form.Label>
                        <Container className='pl-1'>
                            <Form.Check
                                checked={data.changePolicyEffectiveDate}
                                type="switch"
                                onChange={(e) => setData({ ...data, changePolicyEffectiveDate: e.target.checked })}
                            />
                        </Container>
                    </Form.Group>
                </Col>

                {data.changePolicyEffectiveDate && <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label>New Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={data.newPolicyEffectiveDate}
                            onChange={(e) => setData({ ...data, newPolicyEffectiveDate: new Date(e.target.value).toISOString().split('T')[0] })}
                        />
                    </Form.Group>
                </Col>}
                
            </Row>
        </>
    )
}

export default EndorsementEventForm;