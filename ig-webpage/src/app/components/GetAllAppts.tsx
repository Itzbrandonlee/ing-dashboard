"use client"
import { useState, useEffect } from 'react'
import AddAppt from './AddAppt'

interface Appointment {
    appt_id: string;
    appt_date: string;
    appt_time: string;
    paid: boolean;
    client_id: string;
    order_id: string;
    name: string;
}

async function getAllAppts(): Promise<Appointment[]> {
    const res = await fetch('http://127.0.0.1:5000/appts')
    if (!res.ok) {
        throw new Error('Network response was not ok')
    }
    const data: Appointment[] = await res.json()
    return data
}

export default function GetAllAppts() {
    const [appts, setAppts] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        getAllAppts()
            .then(data => {
                setAppts(data)
                setLoading(false)

            })
            .catch(err => {
                console.error('Failed to fetch appointments', err)
                setError(err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <>
            <AddAppt />
            <table className="table-auto w-3/4">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Client</th>
                        <th>Order Number</th>
                        <th>Paid?</th>
                    </tr>
                </thead>
                <tbody>
                    {appts.map(appt => (
                        <tr key={appt.appt_id} className="hover:bg-slate-400">

                            <td className="border">
                                {appt.appt_date}
                            </td>
                            <td className="border">
                                {appt.appt_time}
                            </td>
                            <td className="border">
                                {appt.name}
                            </td>
                            <td className="border">
                                {appt.order_id}
                            </td>
                            <td className="border">
                                {appt.paid ? 'Yes' : 'No'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </>
    )
}