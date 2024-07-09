"use client"
import { useState, useEffect } from 'react'
import { getClients } from './Clientlist'

interface Appointment {
    appt_id: string;
    appt_date: string;
    appt_time: string;
    client_id: string;
    order_id: string;
    paid: boolean;
}

interface Client {
    id: string
    name: string
}

export default function AddAppt() {
    const [apptDate, setApptDate] = useState('')
    const [apptTime, setApptTime] = useState('')
    const [clientId, setClientId] = useState('')
    const [orderId, setOrderId] = useState('')
    const [paid, setPaid] = useState(false)
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true)
        setError(null)
        setSuccess(false)

        const newAppt: Omit<Appointment, 'appt_id'> = { appt_date: apptDate, appt_time: apptTime, client_id: clientId, order_id: orderId, paid }

        try {
            const res = await fetch('http://127.0.0.1:5000/appt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newAppt)
            });

            if (!res.ok) {
                throw new Error('Netword response was not ok');
            }

            setApptDate('')
            setApptTime('');
            setClientId('')
            setOrderId('')
            setPaid(true)
            setSuccess(true)
        } catch (error) {
            console.error('Failed to add client', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (success) {
            window.location.reload();
        }
    }, [success])

    const handlePaidChange = (e) => {
        setPaid(e.target.value === 'yes')
    }

    useEffect(() => {
        getClients()
            .then(data => setClients(data))
            .catch(err => console.error('Failed to fetch clients'))
    }, [])

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setClientId(e.target.value)
    }
    return (
        <div className="bg-gray-200 border-black border border-l-8 p-4 rounded-md drop-shadow-md space-x-6">
            <h1><b>Add New Appointment</b></h1>
            {success && <p>Appointment added successfully!</p>}
            <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label htmlFor="date">Date: </label>
                    <input type="date" id="appt_date" value={apptDate} min="2022-01-01" max="2050-01-01" onChange={(e) => setApptDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <label htmlFor="appt_time">Time: </label>
                    <input type="time" id="apptTime" value={apptTime} onChange={(e) => setApptTime(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <label htmlFor="clientId">Client: </label>
                    <select name="clientId" id="clientId" value={clientId} onChange={handleClientChange} required>
                        <option value="">Select a client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="OrderId">Order Number: </label>
                    <input type="text" id="orderNumber" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="phoneNumber">Paid: </label>
                    <select name="paid" id="paid" value={paid ? 'yes' : 'no'} onChange={handlePaidChange}>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <button type="submit" disabled={loading} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700">{loading ? 'Submitting...' : 'Add Client'}</button>
            </form>
        </div>
    )
}