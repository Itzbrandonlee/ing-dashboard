import Clientlist from '../components/Clientlist'
import Clientadd from '../components/Clientadd'

export default async function Clients() {
    return (
        <div className="bg-slate-50 text-black flex min-h-screen flex-col items-center justify-between p-24"> <Clientlist />
       </div>
        
    )
}