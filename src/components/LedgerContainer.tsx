import { Button, Card, ListGroup, Table } from "react-bootstrap";
import Entry from "../polices/domain/entry";

const LedgerContainer = ({entries, onClear} : {entries: Entry [], onClear: () => void}) => {
    return (
        <div>
            <Card>
                <Card.Header>Ledger <Button variant="outline-secondary" size="sm" onClick={onClear}>Clear</Button></Card.Header>
                <Card.Body>                    
                    <Table striped bordered hover responsive size="sm">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th colSpan={2}>Account</th>
                                <th>Debits</th>
                                <th>Credits</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        {entries.map((item, index) => (
                            <>
                                <tr key={"entries" + index}>
                                    <td colSpan={5}><strong>{item.name}</strong></td>
                                </tr>
                                {item.debits.map((debits, indexDebits) => (
                                    <tr key={"debits" + indexDebits}>                                    
                                        <td></td>
                                        <td>{debits[0]}</td>
                                        <td></td>
                                        <td>{debits[1]}</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                ))}

                                {item.credits.map((credits, indexCredits) => (
                                    <tr key={"credits" + indexCredits}>                                    
                                        <td></td>
                                        <td></td>
                                        <td>{credits[0]}</td>
                                        <td></td>
                                        <td>{credits[1]}</td>
                                        <td></td>
                                    </tr>
                                ))}
                                
                            </>
                        ))}
                    </Table>
                </Card.Body>
            </Card>
        </div>
    )
}

export default LedgerContainer;