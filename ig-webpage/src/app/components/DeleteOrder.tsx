"use client"

import { useState, useEffect } from 'react'

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

interface Props {
    order: Order
}

export default function DeleteAppt({ order }: Props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [success, setSuccess] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await fetch(`http://127.0.0.1:5000/order/${order.order_id}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                throw new Error('Network response was not ok')
            }

        } catch (error) {
            console.error('Failed to delete Appt:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(success) {
            window.location.reload();
        }
    }, [success])

    return (
        <div>
            <button onClick={handleDelete} disabled={loading} className="bg-orange-400 text-white rounded hover:bg-orange-700 px-4 py-2">{loading ? 'Deleting...' : 'Delete' }</button>
        </div>
    )
}