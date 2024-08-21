"use client";
import { useState, useEffect } from 'react';
import DeleteClient from './DeleteClient';
import UpdateClient from './UpdateClient';
import AddClient from './Clientadd';

interface Client {
    id: string;
    name: string;
    email: string;
    phone_number: string;
}

// Function to fetch client data
export async function getClients(): Promise<Client[]> {
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
        return <p className='text-gray-500 text-center py-4'>Loading...</p>;
    }

    if (error) {
        return <p className='text-red-500 text-center py-4'>Error: {error.message}</p>;
    }

    return (
        <>
            <div className="w-3/4 mx-auto">
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold text-gray-800'>Clients</h1>
                {addingClient && (
                    <div className="rounded-lg p-4 mb-4">
                        <AddClient onAddSuccess={handleAddSuccess} />
                    </div>
                )}
                <div className="flex justify-end mb-2">
                    <button
                        onClick={() => setAddingClient(!addingClient)}
                        className="bg-green-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-green-700"
                    >
                        {addingClient ? 'Cancel' : 'Add Client'}
                    </button>
                </div>
                </div>
            

            <table className="table-auto w-full bg-white shadow-md rounded-lg">
                <thead>
                    <tr className='bg-blue-950 text-white'>
                        <th className='px-4 py-2 text-left'>Name</th>
                        <th className='px-4 py-2 text-left'>Email</th>
                        <th className='px-4 py-2 text-left'>Phone number</th>
                        <th className='px-4 py-2'></th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(client => (
                        <tr key={client.id} className="hover:bg-gray-200 border-b border-gray-200">
                            <td className="px-4 py-2">{client.name}</td>
                            <td className="px-4 py-2">{client.email}</td>
                            <td className="px-4 py-2">{client.phone_number}</td>
                            <td className="px-4 py-2 flex flex-col sm:flex-row sm:space-x-6">
                                <button
                                    onClick={() => setEditingClient(client)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded transition duration-300 ease-in-out hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                                <DeleteClient client={client} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingClient && (
                <div className='mt-4 p-4 bg-gray-200 border-black border-l-8 rounded-md shadow-lg'>
                    <UpdateClient client={editingClient} onUpdateSuccess={handleUpdateSuccess} />
                    <button
                        onClick={handleCancelEdit}
                        className="bg-red-500 text-white px-4 py-2 rounded mt-2 transition duration-300 ease-in-out hover:bg-red-700"
                    >
                        Cancel Edit
                    </button>
                </div>
            )}
            </div>
        </>
    );
}