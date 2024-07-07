"use client";
import { useState, useEffect } from 'react';
import DeleteClient from './DeleteClient'
import UpdateClient from './UpdateClient'
import AddClient from './Clientadd'

interface Client {
    id: string;
    name: string;
    email: string;
    phone_number: string;
}

// Function to fetch client data
async function getClients(): Promise<Client[]> {
    const res = await fetch('http://127.0.0.1:5000/clients');
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const data: Client[] = await res.json();
    return data;
}

// ClientList component
export default function ClientList() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [addingClient, setAddingClient] = useState(false);

    useEffect(() => {
        getClients()
            .then(data => {
                setClients(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch clients:', err);
                setError(err);
                setLoading(false);
            });
    }, []);

    const handleAddSuccess = () => {
        setAddingClient(false);
        getClients()
            .then(data => {
                setClients(data);
            })
            .catch(err => {
                console.error('Failed to refresh clients:', err);
            });
    };

    const handleCancelEdit = () => {
        setEditingClient(null);
    };
    
    const handleUpdateSuccess = () => {
        setEditingClient(null);
        getClients()
            .then(data => {
                setClients(data);
            })
            .catch(err => {
                console.error('Failed to refresh clients:', err);
            });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <>
            <div className="w-3/4 mx-auto">

                <div>{addingClient && <AddClient onAddSuccess={handleAddSuccess} />}</div>
                <div className="flex justify-end mb-4">

                    <button
                        onClick={() => setAddingClient(!addingClient)}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        {addingClient ? 'Cancel' : 'Add Client'}
                    </button>

                </div>

                <ul className="space-y-4">
                    {clients.map(client => (
                        <li key={client.id} className="bg-gray-200 border-black border border-l-8 p-4 rounded-md drop-shadow-md">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{client.name}</p>
                                    <p> <b>Email:</b> {client.email}</p>
                                    <p> <b>Phone Number:</b> {client.phone_number}</p>
                                </div>
                                <div className="flex space-x-4">
                                    <button onClick={() => setEditingClient(client)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">Edit</button><DeleteClient client={client} />
                                </div>
                            </div>
                        </li>
                    ))}
                    
                    {editingClient && (
                        <div>
                            <UpdateClient client={editingClient} onUpdateSuccess={handleUpdateSuccess} />
                            <button
                                onClick={handleCancelEdit}
                                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                            >
                                Cancel Edit
                            </button>
                        </div>
                    )}
                </ul>

            </div >
        </>
    );
}

