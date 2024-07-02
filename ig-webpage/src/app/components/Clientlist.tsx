"use client";
import { useState, useEffect } from 'react';
import DeleteClient from './DeleteClient'

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

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div>
            <ul>
                {clients.map(client => (
                    <li key={client.id}>
                        <p>{client.name}</p>
                        <p>{client.email}</p>
                        <p>{client.phone_number}</p>
                        <DeleteClient client={client} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
