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
        <div className="bg-gray-200 border-black border border-l-8 p-6 rounded-md shadow-lg space-y-4">
            <h1 className='text-lg font-bold text-gray-800 mb-4'><b>Add New Appointment</b></h1>
            {success && <p className='text-green-500'>Appointment added successfully!</p>}
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor="date" className="block text-gray-700">Date: </label>
                    <input type="date" id="appt_date" value={apptDate} min="2022-01-01" max="2050-01-01" className="w-full p-2 border border-gray-300 rounded" onChange={(e) => setApptDate(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="appt_time" className="block text-gray-700">Time: </label>
                    <input type="time" id="apptTime" value={apptTime} className="w-full p-2 border border-gray-300 rounded" onChange={(e) => setApptTime(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="clientId" className="block text-gray-700">Client: </label>
                    <select name="clientId" id="clientId" value={clientId} className="w-full p-2 border border-gray-300 rounded" onChange={handleClientChange} required>
                        <option value="">Select a client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="OrderId" className="block text-gray-700">Order Number: </label>
                    <input type="text" id="orderNumber" value={orderId} className="w-full p-2 border border-gray-300 rounded" onChange={(e) => setOrderId(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="paid" className="block text-gray-700">Paid: </label>
                    <select name="paid" id="paid" value={paid ? 'yes' : 'no'} className="w-full p-2 border border-gray-300 rounded" onChange={handlePaidChange}>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <button type="submit" disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 w-full">{loading ? 'Submitting...' : 'Add Client'}</button>
            </form>
        </div>
    )
}