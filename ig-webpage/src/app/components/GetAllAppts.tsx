"use client"
import { useState, useEffect } from 'react'

interface Appointment {
    appt_id: string;
    appt_date:string;
    appt_time: string;
    paid: boolean;
    client_id: string;
    order_id: string;
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
            <div className="w-1/2 mx-auto">
                <ul className="space-y-4">
                    {appts.map(appt => (
                        <li key={appt.appt_id}>
                            <div>
                                <p>
                                    Date: {appt.appt_date}
                                </p>
                                <p>
                                    Time: {appt.appt_time}
                                </p>
                                <p>
                                    Paid: {appt.paid ? 'Yes' : 'No'}
                                </p>
                                <p>
                                    Client: {appt.client_id}
                                </p>
                                <p>
                                    Order Number: {appt.order_id}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}