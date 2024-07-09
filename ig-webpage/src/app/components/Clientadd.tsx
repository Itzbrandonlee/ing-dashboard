"use client"
import { useState, useEffect } from 'react'

interface Client {
    id: string;
    name: string;
    email: string;
    phone_number: string;
}

export default function Clientadd() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true)
        setError(null)
        setSuccess(false)

        const newClient: Omit<Client, 'id'> = { name, email, phone_number: phoneNumber }

        try {
            const res = await fetch('http://127.0.0.1:5000/client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newClient)
            });

            if (!res.ok) {
                throw new Error('Netword response was not ok');
            }

            setName('')
            setEmail('');
            setPhoneNumber('')
            setSuccess(true)
        } catch (error) {
            console.error('Failed to add client', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(success) {
            window.location.reload();
        }
    }, [success])
    
    return (
        <div className="bg-gray-200 border-black border border-l-8 p-4 rounded-md drop-shadow-md space-x-6">
            <h1><b>Add New Client</b></h1>
            {success && <p>Client added successfully!</p>}
            <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label htmlFor="name">Name: </label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email">Email: </label>
                    <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <label htmlFor="phoneNumber">Phone Number: </label>
                    <input type="text" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700">{loading ? 'Submitting...' : 'Add Client' }</button>
            </form>
        </div>
    )
}