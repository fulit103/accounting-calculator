import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Inception } from "../../polices/domain/policy_event";

const InceptionEventForm = ({onChange} : { onChange: (e: Inception) => void }) => {

    const [data, setData] = useState<{ created: string, effective: string }>({
        created: (new Date()).toISOString().split('T')[0],
        effective: (new Date()).toISOString().split('T')[0],
    })

    useEffect(() => {
        onChange(new Inception(new Date(data.created), new Date(data.effective)))
    }, [data, onChange])

    return (
        <>
            <Form.Group className="mb-3" >
                <Form.Label>Created date</Form.Label>
                <Form.Control
                    type="date"
                    value={data.created}
                    onChange={(e) => setData({ ...data, created: new Date(e.target.value).toISOString().split('T')[0] })}
                />
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label>Effective Date</Form.Label>
                <Form.Control
                    type="date"
                    value={data.effective}
                    onChange={(e) => setData({ ...data, effective: new Date(e.target.value).toISOString().split('T')[0] })}
                />
            </Form.Group>            
        </>
    )
}

export default InceptionEventForm;