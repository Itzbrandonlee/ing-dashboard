"use client";
import { useState } from 'react';

interface Client {
    id: string;
    name: string;
    email: string;
    phone_number: string;
}

interface Props {
    client: Client;
    onUpdateSuccess: () => void; // Callback function to handle update success
}

export default function UpdateClient({ client, onUpdateSuccess }: Props) {
    const [formData, setFormData] = useState<Client>(client);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://127.0.0.1:5000/client/${client.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Failed to update client');
            }

            // Call the parent callback to handle update success
            onUpdateSuccess();
        } catch (error) {
            console.error('Failed to update client:', error);
            setError('Failed to update client. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-200 border-black border border-l-8 p-4 rounded-md drop-shadow-md space-x-6">
            <h1><b>Edit: {client.name}</b></h1>
            <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label>Name: </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label>Email: </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label>Phone Number: </label>
                    <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <p>Error: {error}</p>}
                <button type="submit" disabled={loading}  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">
                    {loading ? 'Updating...' : 'Update Client'}
                </button>
            </form>
        </div>
    );
}