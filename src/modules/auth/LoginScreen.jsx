import {Dumbbell} from 'lucide-react';
// 1. Componente Login
export default function LoginScreen ({ onLogin }) {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Dumbbell className="text-white w-8 h-8"/>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Trainer Portal</h1>
                    <p className="text-slate-500">Accedi per gestire i tuoi atleti</p>
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    onLogin();
                }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" placeholder="trainer@gym.com"
                               className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                               defaultValue="trainer@gym.com"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input type="password" placeholder="••••••••"
                               className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                               defaultValue="password"/>
                    </div>
                    <button type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                        Accedi
                    </button>
                </form>
            </div>
        </div>
    );
}