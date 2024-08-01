"use client";
import { useState, useEffect } from 'react';
import { getClients } from './Clientlist'

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

interface Client {
    id: string
    name: string
}

interface Props {
    order: Order;
    onUpdateSuccess: () => void; // Callback function to handle update success
}

export default function UpdateOrder({ order, onUpdateSuccess }: Props) {
    const [formData, setFormData] = useState<Order>(order);
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
            const res = await fetch(`http://127.0.0.1:5000/order/${order.order_id}`, {
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
            console.error('Failed to update Order:', error);
            setError('Failed to update Order. Please try again later.');
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

    return (
        <div className="bg-gray-200 p-4">
            <h1 className='text-lg font-bold text-gray-800 mb-4'><b>Edit Order:</b></h1>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label className='block text-gray-700'>Address: </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded'
                        required
                    />
                </div>
                <div>
                    <label className='block text-gray-700'>Number of Windows: </label>
                    <input
                        type="text"
                        name="num_of_windows"
                        value={formData.num_of_windows}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded'
                        required
                    />
                </div>
                <div>
                    <label className='block text-gray-700'>Number of Doors: </label>
                    <input
                        type="text"
                        name="num_of_doors"
                        value={formData.num_of_doors}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded'
                        required
                    />
                </div>
                <div>
                    <label className='block text-gray-700'>Total Cost: </label>
                    <input
                        type="text"
                        name="total_cost"
                        value={formData.total_cost}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded'
                        required
                    />
                </div>
                <div>
                    <label className='block text-gray-700'>Cost Paid: </label>
                    <input
                        type="text"
                        name="cost_paid"
                        value={formData.cost_paid}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded'
                        required
                    />
                </div>
                <div>
                    <label className='block text-gray-700'>Notes: </label>
                    <input
                        type="text"
                        name="notes"
                        value={formData.notes}
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
                {error && <p>Error: {error}</p>}
                <button type="submit" disabled={loading}  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                    {loading ? 'Updating...' : 'Update Order'}
                </button>
            </form>
        </div>
    );
}