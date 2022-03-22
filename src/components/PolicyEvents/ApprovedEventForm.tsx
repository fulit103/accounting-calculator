import { useEffect, useState } from "react";
import { Button, Card, Container, Form, ListGroup, Modal } from "react-bootstrap";
import { ApprovedPayment } from "../../polices/domain/policy_event";

const ApprovedEventForm = ({ onChange }: { onChange: (e: ApprovedPayment) => void }) => {
  const [data, setData] = useState<{
    depositedOn: string,
    term: number,
    installment: number,
    isOverpayment: boolean,
    overpayment: number,
    duplicated: boolean
  }>({
    depositedOn: (new Date()).toISOString().split('T')[0],
    term: 1,
    installment: 1,
    isOverpayment: false,
    overpayment: 0,
    duplicated: false
  })

  useEffect(() => {
    console.log(data.depositedOn, Date.parse(data.depositedOn))
    onChange(new ApprovedPayment(
      data.installment,
      data.term,
      new Date(data.depositedOn.replace("-", "/")),
      data.duplicated,
      data.overpayment
    ))
  }, [data, onChange])

  return (
    <>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label htmlFor="inputPremium">Payment date</Form.Label>
        <Form.Control
          type="date"
          value={data.depositedOn}
          onChange={(e) => setData({ ...data, depositedOn: new Date(e.target.value).toISOString().split('T')[0] })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="inputPremium">Term</Form.Label>
        <Form.Control
          type="text"
          id="inputPremium"
          value={data.term}
          onChange={(e) => setData({ ...data, overpayment: Number(e.target.value) })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="inputPremium">Installment</Form.Label>
        <Form.Control
          type="text"
          id="inputPremium"
          value={data.installment}
          onChange={(e) => setData({ ...data, installment: Number(e.target.value) })}
        />
      </Form.Group>

      <Form.Group className="mb-5">
        <Form.Label >Is Overpayment</Form.Label>
        <Container className='pl-1'>
          <Form.Check
            checked={data.isOverpayment}
            type="switch"
            onChange={(e) => setData({ ...data, isOverpayment: e.target.checked })}
          />
        </Container>
      </Form.Group>

      {data.isOverpayment && <Form.Group className="mb-4">
        <Form.Label htmlFor="inputPremium">Overpayment</Form.Label>
        <Form.Control
          type="text"
          id="inputPremium"
          value={data.overpayment}
          onChange={(e) => setData({ ...data, overpayment: Number(e.target.value) })}
        />
      </Form.Group>}

      <Form.Group className="mb-4">
        <Form.Label >Is Duplicated</Form.Label>
        <Container className='pl-1'>
          <Form.Check
            checked={data.duplicated}
            type="switch"
            onChange={(e) => setData({ ...data, duplicated: e.target.checked })}
          />
        </Container>
      </Form.Group>

    </>
  )
}

export default ApprovedEventForm;