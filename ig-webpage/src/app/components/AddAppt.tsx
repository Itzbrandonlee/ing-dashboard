import React, { useState, useEffect } from 'react';
import { getClients } from './Clientlist';

interface Appointment {
    appt_id: number;
    appt_date: string;
    appt_time: string;
    client_id: number;
    order_id: number;
    paid: boolean;
}

interface Client {
    id: string;
    name: string;
}

interface Props {
    onAddSuccess: (apptId: string) => void;
    orderId: string;
}

const AddAppt: React.FC<Props> = ({ onAddSuccess, orderId }) => {
    const [apptDate, setApptDate] = useState('');
    const [apptTime, setApptTime] = useState('');
    const [clientId, setClientId] = useState('');
    const [paid, setPaid] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        getClients()
            .then(data => setClients(data))
            .catch(err => console.error('Failed to fetch clients', err));
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const newAppt: Omit<Appointment, 'appt_id'> = {
            appt_date: apptDate,
            appt_time: apptTime,
            client_id: parseInt(clientId),
            order_id: parseInt(orderId),
            paid,
        };

        try {
            const res = await fetch('http://127.0.0.1:5000/appt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAppt),
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            onAddSuccess(data.appt_id);
            setApptDate('');
            setApptTime('');
            setClientId('');
            setPaid(false);
            setSuccess(true);
        } catch (error) {
            console.error('Failed to add appointment', error);
            setError(error.message || 'Failed to add appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-200 border-black border border-l-8 p-6 rounded-md shadow-lg space-y-4">
            <h1 className="text-lg font-bold text-gray-800 mb-4">
                <b>Add New Appointment</b>
            </h1>
            {success && <p className="text-green-500">Appointment added successfully!</p>}
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="apptDate" className="block text-gray-700">
                        Appointment Date:{' '}
                    </label>
                    <input
                        type="date"
                        id="apptDate"
                        value={apptDate}
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) => setApptDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="apptTime" className="block text-gray-700">
                        Appointment Time:{' '}
                    </label>
                    <input
                        type="time"
                        id="apptTime"
                        value={apptTime}
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) => setApptTime(e.target.value)}
                        required
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
                        onChange={(e) => setClientId(e.target.value)}
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
                <div>
                    <label htmlFor="paid" className="block text-gray-700">
                        Paid:{' '}
                    </label>
                    <input
                        type="checkbox"
                        id="paid"
                        checked={paid}
                        className="p-2"
                        onChange={(e) => setPaid(e.target.checked)}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Appointment'}
                </button>
            </form>
        </div>
    );
};

export default AddAppt;