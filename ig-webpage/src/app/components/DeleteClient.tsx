"use client"

import { Props } from 'next/script'
import { useState } from 'react'

interface Client {
    id: string
    name: string
    email: string
    phone_number: string
}

interface props {
    client: Client
}

export default function DeleteClient({ client }: Props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const handleDelete = async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await fetch(`http://127.0.0.1:5000/client/${client.id}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                throw new Error('Network response was not ok')
            }

        } catch (error) {
            console.error('Failed to delete client:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <p>Are you sure you want to delete this client? {client.name }</p>
            <button onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete Client' }</button>
        </div>
    )
}