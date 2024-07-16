"use client"
import {useState, useEffect} from 'react'
import DeleteOrder from './DeleteOrder'
interface Order {
    order_id: string
    address: string
    num_of_windows: string
    num_of_doors: string
    notes: string
    total_cost: string
    cost_paid: string
    rem_balance: string
    appt_id: string
    client_id: string
    name: string
}

async function getOrderDetails(order_id: string): Promise<Order> {
   const res = await fetch(`http://127.0.0.1:5000/orders/${order_id}`)
    if (!res.ok) {
        throw new Error('Network response was not ok')
    }
    const data = await res.json()
    return data;
}

interface GetOrderDetailsProps {
    order_id: string
}

export default function GetOrderDetails({order_id}: GetOrderDetailsProps) {
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        getOrderDetails(order_id)
            .then(data => {
                setOrder(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch order:', err);
                setError(err);
                setLoading(false);
            });
    }, [order_id]);


    return (
        <>
            <div className="w-3/4 mx-auto">
                <ul className="space-y-4">
                    {order && (
                        <li key={order.order_id} className="bg-gray-200 border-black border border-l-8 p-4 rounded-md drop-shadow-md">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{order.name}</p>
                                    <p> <b>Order Number: </b> {order.order_id}</p>
                                    <p> <b>Client: </b> {order.name}</p>
                                    <p> <b>Address: </b> {order.address}</p>
                                    <p> <b>Number of windows: </b> {order.num_of_windows}</p>
                                    <p> <b>Number of Doors: </b> {order.num_of_doors}</p>
                                    <p> <b>Total Cost: </b> {order.total_cost}</p>
                                    <p> <b>Amount Paid: </b> {order.cost_paid}</p>
                                    <p> <b>Remaining Balance: </b> {order.rem_balance}</p>
                                    <p> <b>Notes: </b> {order.notes}</p>

                                </div>
                            </div>
                        </li>
                       
                    )}
                </ul>
                <DeleteOrder order={order} />
            </div >
        </>
    );
}
