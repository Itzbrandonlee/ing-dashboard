import Image from "next/image";
import ApptByDateWig from './components/ApptByDateWig'


export default function Home() {
  return (
    <main className="bg-slate-50 text-black flex min-h-screen flex-col p-24">
      <div className="font-semibold text-center mb-4">
        <h1 className="text-4xl">Welcome</h1>
      </div>
      <div className="flex-grow"> 
        <div className="flex justify-start items-start">
        <ApptByDateWig />
        </div>
      </div>
    </main>
  );
}

