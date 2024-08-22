"use client"
import { useState, useEffect } from 'react'

interface Appointment {
    appt_id: string;
    appt_date: string;
    appt_time: string;
    paid: boolean;
    client_id: string;
    order_id: string;
    name: string;
}

async function getApptByDate(apptDate: string): Promise<Appointment[]> {
    const res = await fetch(`http://127.0.0.1:5000/appt/${apptDate}`)
    if (!res.ok) {
        throw new Error('Network response was not ok')
    }
    const data = await res.json()
    return data;
}

export default function getApptsByDateWig() {
    const [appts, setAppts] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const getDate = () => {
        let getDate = new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}).split(" ")
        let date: string = getDate[0]

        var splitDate = date.split('/')
        let day = splitDate[1]
        let month = splitDate[0]
        let year = splitDate[2].slice(0, -1)
        
        let apptDate = month + "-" + day + "-" + year 
        if(day.includes('/')){
            day = apptDate.slice(0, 2)
        }
        console.log(apptDate)
        return apptDate
    }

    const apptDate = getDate()
    useEffect(() => {

        getApptByDate(apptDate)
            .then(data => {
                setAppts(data)
                setLoading(false)

            })
            .catch(err => {
                console.error('Failed to fetch appointments', err)
                setError(err)
                setLoading(false)
            })
    }, [apptDate])


    function formatTime(time: string) {
        const [hours, minutes] = time.split(':').map(Number)
        const date = new Date()
        date.setHours(hours)
        date.setMinutes(minutes)

        const options: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };

        return date.toLocaleTimeString('en-US', options)
    }

    return (

        <div className="p-4 bg-gray-100 rounded-lg shadow-lg ">
            <h1 className="text-orange-600 font-semibold text-2xl pb-2">Today's Appointments: {apptDate}</h1>
            {appts.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                    {appts.map(appt => (
                        <div key={appt.appt_id} className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[250px]">
                            <h4 className="text-lg font-semibold text-gray-800">{appt.name}</h4>
                            <p className="text-gray-600 font-bold">{formatTime(appt.appt_time)}</p>
                            <p className="text-gray-600">Order ID: {appt.order_id}</p>
                            <p className="text-gray-600">Paid: {appt.paid ? 'Yes' : 'No'}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No appointments found for today.</p>
            )}
        </div>
    );
}