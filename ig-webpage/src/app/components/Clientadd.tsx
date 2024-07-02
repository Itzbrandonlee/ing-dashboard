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
    const [ loading, setLoading] = useState(false)
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
        <div>
            <h1>Add New Client</h1>
            {success && <p>Client added successfully!</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input type="text" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Add Client' }</button>
            </form>
        </div>
    )
}