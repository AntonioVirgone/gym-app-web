import {Dumbbell} from 'lucide-react';
import {useState} from "react";
import {api} from "../../api/gymService.js";
// 1. Componente Login & Registrazione
export default function LoginScreen({onLogin}) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('trainer@gym.com');
    const [password, setPassword] = useState('password');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            if (isRegistering) {
                const data = await api.register(name, email, password);
                onLogin(data.user);
            } else {
                const data = await api.login(email, password);
                onLogin(data.user);
            }
        } catch (err) {
            setErrorMsg(err.message || 'Errore di connessione');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 transition-all">
                <div className="text-center mb-8">
                    <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Dumbbell className="text-white w-8 h-8"/>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        {isRegistering ? 'Nuovo Trainer' : 'Trainer Portal'}
                    </h1>
                    <p className="text-slate-500">
                        {isRegistering ? 'Crea il tuo account per iniziare' : 'Accedi per gestire i tuoi atleti'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}

                    {isRegistering && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Es. Marco Neri"
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="trainer@gym.com"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-2"
                    >
                        {isLoading ? 'Attendere...' : (isRegistering ? 'Registrati' : 'Accedi')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setErrorMsg('');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        {isRegistering ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
                    </button>
                </div>
            </div>
        </div>
    );
};