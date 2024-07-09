"use client"

import { useState, useEffect } from 'react'

interface Appointment {
    appt_id: string
    appt_date: string
    appt_time: string
    paid: boolean
    client_id: string
    order_id: string 
}

interface Props {
    appointment: Appointment
}

export default function DeleteAppt({ appointment }: Props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [success, setSuccess] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await fetch(`http://127.0.0.1:5000/appt/${appointment.appt_id}`, {
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
            <button onClick={handleDelete} disabled={loading} className="bg-orange-400 text-white px-3 py-1 rounded hover:bg-orange-700">{loading ? 'Deleting...' : 'Delete' }</button>
        </div>
    )
}