import { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { Cancelled } from "../../polices/domain/policy_event";

const CancelledEventForm = ({onChange} : { onChange: (e: Cancelled) => void }) => {

    const [data, setData] = useState<{ created: string, effective: string, flat: boolean }>({
        created: (new Date()).toISOString().split('T')[0],
        effective: (new Date()).toISOString().split('T')[0],
        flat: false
    })

    useEffect(() => {
        onChange(new Cancelled(new Date(data.created), new Date(data.effective), data.flat))
    }, [data, onChange])

    return (
        <>
            <Form.Group className="mb-3" >
                <Form.Label >Created date</Form.Label>
                <Form.Control
                    type="date"
                    value={data.created}
                    onChange={(e) => setData({ ...data, created: new Date(e.target.value).toISOString().split('T')[0] })}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label >Effective Date</Form.Label>
                <Form.Control
                    type="date"
                    value={data.effective}
                    onChange={(e) => setData({ ...data, effective: new Date(e.target.value).toISOString().split('T')[0] })}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label >Flat Cancell</Form.Label>
                <Container className='pl-1'>
                    <Form.Check
                        checked={data.flat}
                        type="switch"
                        onChange={(e) => setData({ ...data, flat: e.target.checked })}
                    />
                </Container>
            </Form.Group>
        </>
    )
}

export default CancelledEventForm;