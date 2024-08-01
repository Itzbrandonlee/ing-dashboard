"use client"
import React, { useState, useEffect } from 'react';
import { getClients } from './Clientlist';

interface Order {
    order_id: number;
    address: string;
    num_of_windows: number;
    num_of_doors: number;
    notes: string;
    total_cost: number;
    cost_paid: number;
    rem_balance: number;
    appt_id: number | null; // Allow appt_id to be null
    client_id: number;
    name: string;
}

interface Client {
    id: string;
    name: string;
}

const AddOrder: React.FC = () => {
    const [address, setAddress] = useState('');
    const [numOfWindows, setNumOfWindows] = useState('');
    const [numOfDoors, setNumOfDoors] = useState('');
    const [notes, setNotes] = useState('');
    const [totalCost, setTotalCost] = useState('');
    const [costPaid, setCostPaid] = useState('');
    const [clientId, setClientId] = useState('');
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        getClients()
            .then(data => setClients(data))
            .catch(err => console.error('Failed to fetch clients', err));
    }, []);

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setClientId(e.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newOrder: Order = {
                address,
                num_of_windows: parseInt(numOfWindows),
                num_of_doors: parseInt(numOfDoors),
                notes,
                total_cost: parseFloat(totalCost),
                cost_paid: parseFloat(costPaid),
                rem_balance: 0, // Assuming this is handled on the backend
                appt_id: null, // Set appt_id to null for new order
                client_id: parseInt(clientId),
                order_id: 0, // This should be handled by the database auto-increment
                name: '', // Ensure this is handled correctly
            };

            const res = await fetch('http://127.0.0.1:5000/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrder),
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            setAddress('');
            setNumOfWindows('');
            setNumOfDoors('');
            setNotes('');
            setTotalCost('');
            setCostPaid('');
            setSuccess(true);
        } catch (error) {
            console.error('Failed to add order', error);
            setError(error.message || 'Failed to add order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-200 border-black border border-l-8 p-6 rounded-md shadow-lg space-y-4">
            <h1 className="text-lg font-bold text-gray-800 mb-4">
                <b>Add New Order</b>
            </h1>
            {success && <p className="text-green-500">Order added successfully!</p>}
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="address" className="block text-gray-700">
                        Address:{' '}
                    </label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="num_of_windows" className="block text-gray-700">
                        Number of Windows:{' '}
                    </label>
                    <input
                        type="text"
                        id="numOfWindows"
                        value={numOfWindows}
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) => setNumOfWindows(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="num_of_doors" className="block text-gray-700">
                        Number of Doors:{' '}
                    </label>
                    <input
                        type="text"
                        id="numOfDoors"
                        value={numOfDoors}
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) => setNumOfDoors(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="totalCost" className="block text-gray-700">
                        Total Cost:{' '}
                    </label>
                    <input
                        type="text"
                        id="totalCost"
                        value={totalCost}
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) => setTotalCost(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="costPaid" className="block text-gray-700">
                        Amount Paid:{' '}
                    </label>
                    <input
                        type="text"
                        id="costPaid"
                        value={costPaid}
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) => setCostPaid(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="notes" className="block text-gray-700">
                        Notes:{' '}
                    </label>
                    <input
                        type="text"
                        id="notes"
                        value={notes}
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="clientId" className="block text-gray-700">
                        Client:{' '}
                    </label>
                    <select
                        name="clientId"
                        id="clientId"
                        value={clientId}
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={handleClientChange}
                        required
                    >
                        <option value="">Select a client</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                >
                    {loading ? 'Submitting...' : 'Add Order'}
                </button>
            </form>
        </div>
    );
};

export default AddOrder;