import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Policy from '../polices/domain/policy';
import ErrorBoundary from './ErrorBoundary';

type PolicyProps = {
    policy: Policy,
    onChange: (policy: Policy) => void
}

type DataTypes = {
    premium: number,
    state: string,
    effectiveDate: string,
    paymentSchedulle: number,
    paymentMethod: string,
    hasInspection: boolean
}

const PolicyContainer = ({policy, onChange}: PolicyProps) => {

    const [data, setData] = useState<DataTypes>({
        premium: policy.premium(),
        state: policy.stateName(),
        effectiveDate: policy.effectiveDateStr(),
        paymentMethod: policy.paymentMethod(),
        paymentSchedulle: policy.numberOfPayments(),
        hasInspection: policy.hasInspection()
    });

    function onStateChange(_e : React.ChangeEvent<HTMLSelectElement>) {
        _e.preventDefault()
        policy.setState(_e.target.value)
        setData({ ...data, state: policy.stateName()})        
        onChange(policy)
    }

    function onPremiumChange(_e : React.ChangeEvent<HTMLInputElement>){
        policy.setPremium(Number(_e.target.value))
        setData({ ...data, premium: policy.premium()})  
        onChange(policy)
    }

    function onEffectiveDateChange(_e : React.ChangeEvent<HTMLInputElement>){
        _e.preventDefault()
        try{
            policy.setEffectiveDateStr(_e.target.value)
            setData({ ...data, effectiveDate: _e.target.value})  
            onChange(policy)
        } catch (e) {
            console.log(e);
        }
    }

    function onPaynmentSchedulleChanged(_e : React.ChangeEvent<HTMLSelectElement>) {
        _e.preventDefault()
        policy.setNumberOfPayments(Number(_e.target.value))
        setData({ ...data, paymentSchedulle: policy.numberOfPayments()})
        onChange(policy)
    }

    function onPaymentMethodChanged(_e : React.ChangeEvent<HTMLSelectElement>) {
        _e.preventDefault()
        setData({ ...data, paymentMethod: _e.target.value })
    }

    function onNeedInspectionChanged(_e : React.ChangeEvent<HTMLInputElement>) {        
        policy.setInspection(_e.target.checked)
        setData({ ...data, hasInspection: policy.hasInspection() })
        onChange(policy)
    }

    return (        
        <Container>
            <Row>   
                <Col>
                    <h1>Policy Accounting Calculator</h1>
                </Col>           
            </Row>

            <Row className="mt-3">
                <Col>
                    <Form.Label>State</Form.Label>
                    <Form.Select aria-label="Default select example" value={data.state} onChange={onStateChange}>
                        <option value="LA">LA</option>
                        <option value="FL">FL</option>
                        <option value="CA">CA</option>
                    </Form.Select> 
                </Col>   

                <Col>
                    <Form.Label htmlFor="inputPremium">Premium</Form.Label>
                    <Form.Control
                        type="text"
                        id="inputPremium"
                        value={data.premium}
                        onChange={onPremiumChange}
                    />          
                </Col>  
                <Col>
                    <Form.Label htmlFor="inputPremium">Effective Date</Form.Label>
                    <Form.Control
                        type="date"   
                        value={data.effectiveDate}
                        onChange={onEffectiveDateChange}                     
                    />          
                </Col> 
            </Row>

            <Row className="mt-3">
                <Col>
                    <Form.Label >Payment Schedulle</Form.Label>    
                    <Form.Select aria-label="Default select example" value={data.paymentSchedulle} onChange={onPaynmentSchedulleChanged}>            
                        <option value="1">1 Pay</option>
                        <option value="2">2 Pay</option>
                        <option value="4">4 Pay</option>
                    </Form.Select> 
                </Col> 

                <Col>
                    <Form.Label >Payment Method</Form.Label>
                    <Form.Select aria-label="Default select example" value={data.paymentMethod} onChange={onPaymentMethodChanged}>
                        <option value="escrow">Escrow</option>
                        <option value="card">Card</option>
                    </Form.Select> 
                </Col>

                <Col>   
                    <Form.Label >Need Inspection</Form.Label>  
                    <Container className='pl-1'>
                        <Form.Check    
                            checked={data.hasInspection}                        
                            type="switch"              
                            onChange={onNeedInspectionChanged}                   
                        />
                    </Container>     
                </Col>  
            </Row>        
        </Container>        
    );
}

export default PolicyContainer;