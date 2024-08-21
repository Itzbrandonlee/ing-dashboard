import Link from "next/link"

export default function Header() {
    return (
        <div className="bg-blue-950 h-14 border-solid border-black text-white text-md flex items-center justify-between px-4">
            <h1 className=" text-2xl font-semibold">I&G Screens</h1>
            <div className="flex space-x-4">
                <Link className="hover:bg-slate-500 px-3 py-1" href="/">Home</Link>
                <Link href="/clients" className="hover:bg-slate-500 px-3 py-1" >Clients</Link>
                <Link href="/appointments" className="hover:bg-slate-500 px-3 py-1" >Appointments</Link>
                <Link href='/orders' className="hover:bg-slate-500 px-3 py-1" >Orders</Link>
            </div>
        </div>

    )
}