import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Endorsement } from "../../polices/domain/policy_event";

const EndorsementEventForm = ({onChange} : { onChange: (e: Endorsement) => void }) => {

    const [data, setData] = useState<{ created: string, effective: string, premium: number }>({
        created: (new Date()).toISOString().split('T')[0],
        effective: (new Date()).toISOString().split('T')[0],
        premium: 0
    })

    useEffect(() => {
        onChange(new Endorsement(new Date(data.created), new Date(data.effective), data.premium))
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

            <Form.Group className="mb-3" >
                <Form.Label>Premium</Form.Label>
                <Form.Control
                    type="text"
                    value={data.premium}
                    onChange={(e) => setData({...data, premium: Number(e.target.value)})}
                />
            </Form.Group>
        </>
    )
}

export default EndorsementEventForm;