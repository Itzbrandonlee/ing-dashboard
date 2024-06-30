export default async function Clients() {
    const data = await getClients()
    console.log(data)
    
    return (
        <div>
            <ul>
            {data.map(client => (
                
                <li key={client.id}>
                    <p>{client.name}</p>
                    <p>{client.email}</p>
                    <p>{client.phone_number}</p>
                </li>
            ))}
            </ul>
        </div>
    )
}

async function getClients() {
    const res = await fetch('http://127.0.0.1:5000/clients');
    const data = res.json()

    return data
}