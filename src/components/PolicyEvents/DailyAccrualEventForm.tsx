import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { DailyAccrual,  } from "../../polices/domain/policy_event";

const DailyAccrualEventForm = ({onChange} : { onChange: (e: DailyAccrual) => void }) => {

    const [data, setData] = useState<{ created: string, effective: string }>({
        created: (new Date()).toISOString().split('T')[0],
        effective: (new Date()).toISOString().split('T')[0],
    })

    useEffect(() => {
        onChange(new DailyAccrual(new Date(data.created.replace("-", "/")), new Date(data.effective.replace("-", "/"))))
    }, [data, onChange])

    return (
        <>
            <Form.Group className="mb-3" >
                <Form.Label>Start date</Form.Label>
                <Form.Control
                    type="date"
                    value={data.created}
                    onChange={(e) => setData({ ...data, created: new Date(e.target.value).toISOString().split('T')[0] })}
                />
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label>End Date</Form.Label>
                <Form.Control
                    type="date"
                    value={data.effective}
                    onChange={(e) => setData({ ...data, effective: new Date(e.target.value).toISOString().split('T')[0] })}
                />
            </Form.Group>            
        </>
    )
}

export default DailyAccrualEventForm;