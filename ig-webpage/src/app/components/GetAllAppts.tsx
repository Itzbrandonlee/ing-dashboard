"use client"
import { useState, useEffect } from 'react'
import AddAppt from './AddAppt'
import DeleteAppt from './DeleteAppt'
import UpdateAppt from './UpdateAppt';

interface Appointment {
    appt_id: string;
    appt_date: string;
    appt_time: string;
    paid: boolean;
    client_id: string;
    order_id: string;
    name: string;
}

async function getAllAppts(): Promise<Appointment[]> {
    const res = await fetch('http://127.0.0.1:5000/appts')
    if (!res.ok) {
        throw new Error('Network response was not ok')
    }
    const data: Appointment[] = await res.json()
    return data
}

export default function GetAllAppts() {
    const [appts, setAppts] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
    const [addingAppt, setAddingAppt] = useState(false);
    useEffect(() => {
        getAllAppts()
            .then(data => {
                setAppts(data)
                setLoading(false)

            })
            .catch(err => {
                console.error('Failed to fetch appointments', err)
                setError(err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <p className='text-gray-500'>Loading...</p>;
    }

    if (error) {
        return <p className='text-red-500'>Error: {error.message}</p>;
    }

    const handleUpdateSuccess = () => {
        setEditingAppt(null);
        getAllAppts()
            .then(data => {
                setAppts(data);
            })
            .catch(err => {
                console.error('Failed to refresh clients:', err);
            });
    };

    const handleCancelEdit = () => {
        setEditingAppt(null);
    };

    const handleAddSuccess = () => {
        setAddingAppt(false);
        getAllAppts()
            .then(data => {
                setAppts(data);
            })
            .catch(err => {
                console.error('Failed to refresh clients:', err);
            });
    };

    return (
        <div className='container mx-auto p-4'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold text-gray-800'>Appointments</h1>
            </div>
            <div>{addingAppt && <AddAppt onAddSuccess={handleAddSuccess} />}</div>
            <div className="flex justify-end mb-4">

                <button
                    onClick={() => setAddingAppt(!addingAppt)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    {addingAppt ? 'Cancel' : 'Add Appointment'}
                </button>

            </div>
            <div className='overflow-x-auto'>
            <table className="table-auto w-full bg-white shadow-md rounded-lg">
                <thead>
                    <tr className='bg-blue-950 text-white'>
                        <th className='px-4 py-2 text-left'>Date</th>
                        <th className='px-4 py-2 text-left'>Time</th>
                        <th className='px-4 py-2 text-left'>Client</th>
                        <th className='px-4 py-2 text-left'>Order Number</th>
                        <th className='px-4 py-2 text-left'>Paid?</th>
                        <th className='px-4 py-2'></th>
                    </tr>
                </thead>
                <tbody>
                    {appts.map(appt => (
                        <tr key={appt.appt_id} className="hover:bg-gray-200 border-b border-gray-200">

                            <td className="px-4 py-2">
                                {appt.appt_date}
                            </td>
                            <td className="px-4 py-2">
                                {appt.appt_time}
                            </td>
                            <td className="px-4 py-2">
                                {appt.name}
                            </td>
                            <td className="px-4 py-2">
                                {appt.order_id}
                            </td>
                            <td className="px-4 py-2">
                                {appt.paid ? 'Yes' : 'No'}
                            </td>
                            <td className="px-4 py-2 flex space-x-6">
                                <DeleteAppt appointment={appt} /><button onClick={() => setEditingAppt(appt)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            {editingAppt && (
                <div className='mt-4 p-4 bg-gray-200 border-black border-l-8 rounded-md shadow-large'>
                    <UpdateAppt appointment={editingAppt} onUpdateSuccess={handleUpdateSuccess} />
                    <button
                        onClick={handleCancelEdit}
                        className="bg-red-500 text-white px-4 py-2 rounded mt-2 hover: bg-red-700"
                    >
                        Cancel Edit
                    </button>
                </div>
            )}
        </div>
    )
}