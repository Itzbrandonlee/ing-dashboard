"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import DeleteOrder from './DeleteOrder'
import AddOrder from './AddOrder'
import AddAppt from './AddAppt'

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

async function getAllOrders() {
    const res = await fetch('http://127.0.0.1:5000/orders')
    if (!res.ok) {
        throw new Error('Network response was not ok')
    }
    const data: Order[] = await res.json()
    return data
}

export default function GetAllOrders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [addingOrder, setAddingOrder] = useState(false)
    const [addingAppt, setAddingAppt] = useState<{ [key: string]: boolean }>({})

    useEffect(() => {
        getAllOrders()
            .then(data => {
                setOrders(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to fetch orders', err)
                setError(err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <p className='text-gray-500'>Loading...</p>
    }

    if (error) {
        return <p className='text-red-500'>Error: {error.message}</p>
    }

    const handleAddSuccess = (apptId: string, orderId: string) => {
        setAddingAppt({ ...addingAppt, [orderId]: false })
        getAllOrders()
            .then(data => {
                setOrders(data)
            })
            .catch(err => {
                console.error('Failed to refresh orders:', err)
            })
    }

    return (
        <div className='container mx-auto p-4'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold text-gray-800'>Orders</h1>
            </div>
            <div className='overflow-x-auto'>
                <div>{addingOrder && <AddOrder onAddSuccess={handleAddSuccess} />}</div>
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => setAddingOrder(!addingOrder)}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        {addingOrder ? 'Cancel' : 'Add Client'}
                    </button>
                </div>
                <table className="table-auto w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className='bg-blue-950 text-white'>
                            <th className='px-4 py-2 text-left'>Order Number</th>
                            <th className='px-4 py-2 text-left'>Client</th>
                            <th className='px-4 py-2 text-left'>Remaining Balance</th>
                            <th className='px-4 py-2'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.order_id} className="hover:bg-gray-200 border-b border-gray-200">
                                <td className="px-4 py-2">
                                    {order.order_id}
                                </td>
                                <td className="px-4 py-2">
                                    {order.name}
                                </td>
                                <td className="px-4 py-2">
                                    {order.rem_balance}
                                </td>
                                <td className="px-4 py-2 flex space-x-4">
                                    <Link href={`/orders/${order.order_id}`}>
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800">
                                            View Order
                                        </button>
                                    </Link>
                                    Add Update button
                                    <DeleteOrder order={order} />
                                    <button
                                        onClick={() => setAddingAppt({ ...addingAppt, [order.order_id]: !addingAppt[order.order_id] })}
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                    >
                                        {addingAppt[order.order_id] ? 'Cancel' : 'Set Appt'}
                                    </button>
                                    {addingAppt[order.order_id] && (
                                        <AddAppt onAddSuccess={handleAddSuccess} orderId={order.order_id} />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
