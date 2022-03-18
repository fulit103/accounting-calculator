import { useEffect, useState } from "react";
import { Container, Row, Table } from "react-bootstrap";
import { Billing } from "../App";
import Policy from "../polices/domain/policy";

type BillingProps = {
    billings : Billing []
}

const BillingContainer = ({billings}: BillingProps) => {

    return (
        <Container>
            <Row>
                <h2>Billing Table</h2>
            </Row>
            
            <Row>
                <Table striped bordered hover responsive size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Total</th>
                            <th>Premium</th>
                            <th>Surplus</th>
                            <th>Installment Fee</th>
                            <th>Admin Fee</th>
                            <th>Empa Fee</th>
                            <th>Inspection Fee</th>
                            <th>Tax Fee</th>
                            <th>Figa Fee</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billings.map((item: Billing, index) => (
                            <tr key={index}>
                                <td>{item.index}</td>
                                <td>{item.total}</td>
                                <td>{item.premium}</td>
                                <td>{item.surplus}</td>
                                <td>{item.installmentFee}</td>
                                <td>{item.adminFee}</td>
                                <td>{item.empaFee}</td>
                                <td>{item.inspectionFee}</td>
                                <td>{item.taxFee}</td>
                                <td>{item.figaFee}</td>
                                <td>{"pending"}</td>
                            </tr>
                        ))}                   
                    </tbody>
                </Table>
            </Row>
        </Container>
    )
}

export default BillingContainer;