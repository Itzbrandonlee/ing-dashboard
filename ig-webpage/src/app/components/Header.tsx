import Link from "next/link"

export default function Header() {
    return (
        <div className="bg-gray-300 h-10 border-solid border-black text-blue-950 flex items-center justify-between px-4">
            <h1 className=" text-2xl font-semibold">I&G Screens</h1>
            <div className="flex space-x-4">
                <Link href="/">Home</Link>
                <Link href="/clients">Clients</Link>
                <Link href="/appointments">Appointments</Link>
            </div>
        </div>

    )
}