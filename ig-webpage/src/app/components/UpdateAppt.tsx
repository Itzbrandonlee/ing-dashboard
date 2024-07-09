"use client";
import { useState, useEffect } from 'react';
import { getClients } from './Clientlist'

interface Appointment {
    appt_id: string;
    appt_date: string;
    appt_time: string;
    paid: boolean;
    client_id: string;
    order_id: string;
}

interface Client {
    id: string
    name: string
}

interface Props {
    appointment: Appointment;
    onUpdateSuccess: () => void; // Callback function to handle update success
}

export default function UpdateAppt({ appointment, onUpdateSuccess }: Props) {
    const [formData, setFormData] = useState<Appointment>(appointment);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clients, setClients] = useState<Client[]>([])
    const [clientId, setClientId] = useState('')
    const [paid, setPaid] = useState(false)
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://127.0.0.1:5000/appt/${appointment.appt_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Failed to update appt');
            }

            // Call the parent callback to handle update success
            onUpdateSuccess();
        } catch (error) {
            console.error('Failed to update Appt:', error);
            setError('Failed to update Appt. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getClients()
            .then(data => setClients(data))
            .catch(err => console.error('Failed to fetch clients'))
    }, [])

    
    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setClientId(e.target.value)
    }

    
    const handlePaidChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({...formData, paid: e.target.value === 'yes'})
    }

    return (
        <div className="bg-gray-200 p-4">
            <h1 className='text-lg font-bold text-gray-800 mb-4'><b>Edit Appointment:</b></h1>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label className='block text-gray-700'>Date </label>
                    <input
                        type="date"
                        name="appt_date"
                        value={formData.appt_date}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded'
                        required
                    />
                </div>
                <div>
                    <label className='block text-gray-700'>Time: </label>
                    <input
                        type="time"
                        name="appt_time"
                        value={formData.appt_time}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded'
                        required
                    />
                </div>
                <div>
                    <label htmlFor="clientId" className='block text-gray-700'>Client: </label>
                    <select name="clientId" id="clientId" value={formData.client_id} className='w-full p-2 border border-gray-300 rounded' onChange={handleClientChange} required>
                        <option value="">Select a client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                <label className='block text-gray-700'>Order Number:  </label>
                    <input
                        type="text"
                        name="order_id"
                        value={formData.order_id}
                        className='w-full p-2 border border-gray-300 rounded'
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                <label className="block text-gray-700">Paid: </label>
                <select name="paid" id="paid" value={formData.paid ? 'yes' : 'no'}  className="w-full p-2 border border-gray-300 rounded" onChange={handlePaidChange}>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                {error && <p>Error: {error}</p>}
                <button type="submit" disabled={loading}  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                    {loading ? 'Updating...' : 'Update Client'}
                </button>
            </form>
        </div>
    );
}