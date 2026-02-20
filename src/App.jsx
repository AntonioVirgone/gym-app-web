import React, { useState, useEffect, useRef } from 'react';
import {
    Users,
    Dumbbell,
    LogOut,
    Plus,
    Search,
    ChevronRight,
    Save,
    Trash2,
    User,
    Calendar,
    Edit,
    List,
    UserX,
    UserCheck,
    Building,
    Loader2,
    ClipboardList,
    MessageSquare,
    Send,
    Bell
} from 'lucide-react';

// ============================================================================
// --- API SERVICE (PREDISPOSIZIONE BACKEND NESTJS) ---
// ============================================================================
const USE_MOCK_API = true;
const API_BASE_URL = 'http://localhost:3000/api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    // --- ATLETI ---
    getClients: async () => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/clients`);
            if (!res.ok) throw new Error('Errore server');
            return res.json();
        }
        await delay(500);
        return JSON.parse(localStorage.getItem('gymClientsData')) || MOCK_CLIENTS.map(c => ({ ...c, isActive: true }));
    },

    addClient: async (clientData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/clients`, { method: 'POST', body: JSON.stringify(clientData), headers: {'Content-Type': 'application/json'} });
            return res.json();
        }
        await delay(400);
        const clients = JSON.parse(localStorage.getItem('gymClientsData')) || MOCK_CLIENTS;
        const newClients = [clientData, ...clients];
        localStorage.setItem('gymClientsData', JSON.stringify(newClients));
        return clientData;
    },

    updateClient: async (clientData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/clients/${clientData.id}`, { method: 'PUT', body: JSON.stringify(clientData), headers: {'Content-Type': 'application/json'} });
            return res.json();
        }
        await delay(400);
        const clients = JSON.parse(localStorage.getItem('gymClientsData')) || MOCK_CLIENTS;
        const newClients = clients.map(c => c.id === clientData.id ? clientData : c);
        localStorage.setItem('gymClientsData', JSON.stringify(newClients));
        return clientData;
    },

    deleteClient: async (id) => {
        if (!USE_MOCK_API) {
            await fetch(`${API_BASE_URL}/clients/${id}`, { method: 'DELETE' });
            return id;
        }
        await delay(300);
        const clients = JSON.parse(localStorage.getItem('gymClientsData')) || MOCK_CLIENTS;
        localStorage.setItem('gymClientsData', JSON.stringify(clients.filter(c => c.id !== id)));
        return id;
    },

    // --- PALESTRE ---
    getGyms: async () => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/gyms`);
            return res.json();
        }
        await delay(200);
        return JSON.parse(localStorage.getItem('gymLocationsData')) || MOCK_GYMS;
    },

    addGym: async (gymData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/gyms`, { method: 'POST', body: JSON.stringify(gymData), headers: {'Content-Type': 'application/json'} });
            return res.json();
        }
        await delay(300);
        const list = JSON.parse(localStorage.getItem('gymLocationsData')) || MOCK_GYMS;
        localStorage.setItem('gymLocationsData', JSON.stringify([...list, gymData]));
        return gymData;
    },

    updateGym: async (gymData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/gyms/${gymData.id}`, { method: 'PUT', body: JSON.stringify(gymData), headers: {'Content-Type': 'application/json'} });
            return res.json();
        }
        await delay(300);
        const list = JSON.parse(localStorage.getItem('gymLocationsData')) || MOCK_GYMS;
        localStorage.setItem('gymLocationsData', JSON.stringify(list.map(g => g.id === gymData.id ? gymData : g)));
        return gymData;
    },

    deleteGym: async (id) => {
        if (!USE_MOCK_API) {
            await fetch(`${API_BASE_URL}/gyms/${id}`, { method: 'DELETE' });
            return id;
        }
        await delay(300);
        const list = JSON.parse(localStorage.getItem('gymLocationsData')) || MOCK_GYMS;
        localStorage.setItem('gymLocationsData', JSON.stringify(list.filter(g => g.id !== id)));
        return id;
    },

    // --- ESERCIZI ---
    getExercises: async () => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/exercises`);
            return res.json();
        }
        await delay(200);
        let rawData = JSON.parse(localStorage.getItem('gymExercisesData'));
        if (rawData && rawData.length > 0 && typeof rawData[0] === 'string') {
            rawData = rawData.map((name, i) => ({ id: `migrated-${i}`, name, description: '', defaultRest: 60 }));
            localStorage.setItem('gymExercisesData', JSON.stringify(rawData));
        }
        return rawData || MOCK_EXERCISES;
    },

    addExercise: async (exData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/exercises`, { method: 'POST', body: JSON.stringify(exData), headers: {'Content-Type': 'application/json'} });
            return res.json();
        }
        await delay(300);
        const list = JSON.parse(localStorage.getItem('gymExercisesData')) || MOCK_EXERCISES;
        localStorage.setItem('gymExercisesData', JSON.stringify([...list, exData]));
        return exData;
    },

    updateExercise: async (exData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/exercises/${exData.id}`, { method: 'PUT', body: JSON.stringify(exData), headers: {'Content-Type': 'application/json'} });
            return res.json();
        }
        await delay(300);
        const list = JSON.parse(localStorage.getItem('gymExercisesData')) || MOCK_EXERCISES;
        localStorage.setItem('gymExercisesData', JSON.stringify(list.map(e => e.id === exData.id ? exData : e)));
        return exData;
    },

    deleteExercise: async (id) => {
        if (!USE_MOCK_API) {
            await fetch(`${API_BASE_URL}/exercises/${id}`, { method: 'DELETE' });
            return id;
        }
        await delay(300);
        const list = JSON.parse(localStorage.getItem('gymExercisesData')) || MOCK_EXERCISES;
        localStorage.setItem('gymExercisesData', JSON.stringify(list.filter(e => e.id !== id)));
        return id;
    },

    // --- MODELLI SCHEDE (TEMPLATES) ---
    getTemplates: async () => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/templates`);
            return res.json();
        }
        await delay(200);
        return JSON.parse(localStorage.getItem('gymTemplatesData')) || MOCK_TEMPLATES;
    },

    addTemplate: async (templateData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/templates`, { method: 'POST', body: JSON.stringify(templateData), headers: {'Content-Type': 'application/json'} });
            return res.json();
        }
        await delay(300);
        const list = JSON.parse(localStorage.getItem('gymTemplatesData')) || MOCK_TEMPLATES;
        const newTemplates = [templateData, ...list];
        localStorage.setItem('gymTemplatesData', JSON.stringify(newTemplates));
        return templateData;
    },

    updateTemplate: async (templateData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/templates/${templateData.id}`, { method: 'PUT', body: JSON.stringify(templateData), headers: {'Content-Type': 'application/json'} });
            return res.json();
        }
        await delay(300);
        const list = JSON.parse(localStorage.getItem('gymTemplatesData')) || MOCK_TEMPLATES;
        const newTemplates = list.map(t => t.id === templateData.id ? templateData : t);
        localStorage.setItem('gymTemplatesData', JSON.stringify(newTemplates));
        return templateData;
    },

    deleteTemplate: async (id) => {
        if (!USE_MOCK_API) {
            await fetch(`${API_BASE_URL}/templates/${id}`, { method: 'DELETE' });
            return id;
        }
        await delay(300);
        const list = JSON.parse(localStorage.getItem('gymTemplatesData')) || MOCK_TEMPLATES;
        localStorage.setItem('gymTemplatesData', JSON.stringify(list.filter(t => t.id !== id)));
        return id;
    }
};


// --- MOCK DATA (Simulazione iniziale per il DB locale) ---
const MOCK_GYMS = [
    { id: 'g1', name: 'Palestra Centrale' },
    { id: 'g2', name: 'FitActive Sud' }
];

const MOCK_CLIENTS = [
    {
        id: 1,
        name: 'Mario Rossi',
        email: 'mario@email.com',
        goal: 'Ipertrofia',
        activePlan: 'Scheda Forza A',
        history: [],
        isActive: true,
        gymId: 'g1',
        messages: [
            { id: 'm1', sender: 'client', text: 'Ciao! Sulla panca piana sento un po\' di fastidio alla spalla destra, cosa posso fare?', timestamp: '19/02/2026, 14:30', read: true },
            { id: 'm2', sender: 'trainer', text: 'Ciao Mario, prova a stringere leggermente la presa e tieni i gomiti più vicini al busto. Altrimenti passiamo ai manubri.', timestamp: '19/02/2026, 15:10', read: true }
        ]
    },
    {
        id: 2,
        name: 'Luigi Verdi',
        email: 'luigi@email.com',
        goal: 'Dimagrimento',
        activePlan: null,
        history: [],
        isActive: true,
        gymId: 'g2',
        // Inseriamo un messaggio NON LETTO per testare le notifiche
        messages: [
            { id: 'm3', sender: 'client', text: 'Ciao, ho un dubbio sulla scheda. Posso sostituire lo squat libero con la leg press oggi? Ho la schiena affaticata.', timestamp: '20/02/2026, 09:15', read: false }
        ]
    },
];

const MOCK_EXERCISES = [
    { id: '1', name: 'Panca Piana', description: 'Esercizio fondamentale per il petto con bilanciere.', defaultRest: 90 },
    { id: '2', name: 'Squat', description: 'Accosciata profonda per lo sviluppo delle gambe.', defaultRest: 120 },
    { id: '4', name: 'Trazioni', description: 'Esercizio a corpo libero per il dorso.', defaultRest: 90 },
];

const MOCK_TEMPLATES = [
    {
        id: 't1',
        name: 'Total Body Principianti',
        days: [
            {
                id: 'd1',
                name: 'Giorno 1 - Push/Pull',
                exercises: [
                    { id: 'e1', name: 'Squat', sets: 3, reps: 12, rest: 120 },
                    { id: 'e2', name: 'Panca Piana', sets: 3, reps: 10, rest: 90 }
                ]
            }
        ]
    }
];

// --- COMPONENTS ---

// 1. Componente Login
const LoginScreen = ({ onLogin }) => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
            <div className="text-center mb-8">
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Dumbbell className="text-white w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Trainer Portal</h1>
                <p className="text-slate-500">Accedi per gestire i tuoi atleti</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" placeholder="trainer@gym.com" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="trainer@gym.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input type="password" placeholder="••••••••" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="password" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                    Accedi
                </button>
            </form>
        </div>
    </div>
);

// 2. Componente Lista Clienti
const ClientsList = ({ clients, gyms, onSelectClient, onAddClient, onUpdateClient, onDeleteClient, onToggleStatus }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGymFilter, setSelectedGymFilter] = useState('all');
    const [clientModal, setClientModal] = useState({ isOpen: false, mode: 'add', client: null });
    const [formData, setFormData] = useState({ name: '', email: '', goal: '', gymId: gyms.length > 0 ? gyms[0].id : '' });
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const filteredClients = clients.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGym = selectedGymFilter === 'all' || c.gymId === selectedGymFilter;
        return matchesSearch && matchesGym;
    });

    const openAddModal = () => {
        setFormData({ name: '', email: '', goal: '', gymId: gyms.length > 0 ? gyms[0].id : '' });
        setClientModal({ isOpen: true, mode: 'add', client: null });
        setErrorMsg('');
    };

    const openEditModal = (client, e) => {
        e.stopPropagation();
        setFormData({ name: client.name, email: client.email, goal: client.goal, gymId: client.gymId || '' });
        setClientModal({ isOpen: true, mode: 'edit', client });
        setErrorMsg('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setErrorMsg('Il nome è obbligatorio');
            return;
        }

        if (clientModal.mode === 'add') {
            onAddClient({
                id: Date.now().toString(),
                name: formData.name.trim(),
                email: formData.email.trim(),
                goal: formData.goal.trim() || 'Generico',
                gymId: formData.gymId,
                activePlan: null,
                history: [],
                messages: [],
                isActive: true
            });
        } else {
            onUpdateClient({
                ...clientModal.client,
                name: formData.name.trim(),
                email: formData.email.trim(),
                goal: formData.goal.trim() || 'Generico',
                gymId: formData.gymId
            });
        }
        setClientModal({ isOpen: false, mode: 'add', client: null });
    };

    return (
        <div className="space-y-6">
            {/* HEADER LISTA CLIENTI RESPONSIVE */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 shrink-0">I tuoi Atleti</h2>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto flex-1 lg:justify-end">
                    <select
                        value={selectedGymFilter}
                        onChange={(e) => setSelectedGymFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white w-full sm:w-auto"
                    >
                        <option value="all">Tutte le palestre</option>
                        {gyms.map(gym => (
                            <option key={gym.id} value={gym.id}>{gym.name}</option>
                        ))}
                    </select>
                    <div className="relative flex-1 w-full sm:w-auto min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Cerca atleta..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={openAddModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 whitespace-nowrap transition-colors shadow-sm w-full sm:w-auto shrink-0"
                    >
                        <Plus className="w-5 h-5" /> <span>Nuovo Atleta</span>
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredClients.map(client => {
                    const clientGym = gyms.find(g => g.id === client.gymId);
                    const hasUnread = client.messages?.some(m => m.sender === 'client' && !m.read);

                    return (
                        <div
                            key={client.id}
                            onClick={() => onSelectClient(client)}
                            className={`bg-white p-6 rounded-xl shadow-sm border ${hasUnread ? 'border-blue-400 ring-1 ring-blue-400' : 'border-slate-100'} hover:shadow-md transition-all cursor-pointer flex flex-col h-full ${!client.isActive ? 'opacity-70 bg-slate-50' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="relative">
                                    <div className={`p-3 rounded-full ${client.isActive ? 'bg-blue-100' : 'bg-slate-200'}`}>
                                        <User className={`${client.isActive ? 'text-blue-600' : 'text-slate-500'} w-6 h-6`} />
                                    </div>
                                    {hasUnread && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                  </span>
                                    )}
                                </div>
                                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                    <button onClick={(e) => openEditModal(client, e)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifica">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); onToggleStatus(client.id); }} className="p-2 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title={client.isActive ? "Sospendi Atleta" : "Riattiva Atleta"}>
                                        {client.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(client.id); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Elimina">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                {client.name}
                                {!client.isActive && <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-normal">Inattivo</span>}
                            </h3>
                            <p className="text-slate-500 text-sm mb-2">{client.email}</p>
                            {clientGym && (
                                <div className="flex items-center gap-1 text-xs font-medium text-slate-500 mb-4 bg-slate-100 self-start px-2 py-1 rounded">
                                    <Building className="w-3 h-3" /> {clientGym.name}
                                </div>
                            )}
                            <div className="flex items-center justify-between text-sm mt-auto">
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded truncate max-w-[120px]" title={client.goal}>
                Obiettivo: {client.goal}
              </span>
                                <span className={`px-2 py-1 rounded whitespace-nowrap ${client.activePlan ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {client.activePlan ? 'Attivo' : 'Nessuna Scheda'}
              </span>
                            </div>
                        </div>
                    )})}
                {filteredClients.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-100 text-slate-400">
                        Nessun atleta trovato in archivio.
                    </div>
                )}
            </div>

            {clientModal.isOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">
                            {clientModal.mode === 'add' ? 'Aggiungi Nuovo Atleta' : 'Modifica Atleta'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Es. Mario Rossi"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="mario.rossi@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Palestra di Riferimento</label>
                                {gyms.length > 0 ? (
                                    <select
                                        value={formData.gymId}
                                        onChange={(e) => setFormData({...formData, gymId: e.target.value})}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="">Nessuna palestra specifica</option>
                                        {gyms.map(gym => (
                                            <option key={gym.id} value={gym.id}>{gym.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm border border-yellow-200">
                                        Nessuna palestra configurata. Aggiungine una dal menu laterale.
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Obiettivo Principale</label>
                                <input
                                    type="text"
                                    value={formData.goal}
                                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Es. Ipertrofia, Dimagrimento..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setClientModal({ isOpen: false, mode: 'add', client: null })}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Annulla
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    {clientModal.mode === 'add' ? 'Aggiungi' : 'Salva Modifiche'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmDeleteId !== null && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Elimina Atleta</h3>
                        <p className="text-slate-600 mb-6">
                            Sei sicuro di voler eliminare questo atleta? Tutti i suoi dati e lo storico schede verranno persi per sempre sul server.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={() => {
                                    onDeleteClient(confirmDeleteId);
                                    setConfirmDeleteId(null);
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Elimina Definitivamente
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// 2.5 Componente Visualizzazione Notifiche
const NotificationsView = ({ notifications, onSelectClient }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Bell className="w-6 h-6 text-blue-600" /> Notifiche
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                {notifications.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p>Non hai nuove notifiche da leggere.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map(notif => (
                            <div
                                key={notif.id}
                                onClick={() => onSelectClient(notif.client)}
                                className="p-4 bg-blue-50 border border-blue-100 rounded-lg cursor-pointer hover:bg-blue-100 hover:shadow-sm transition-all flex justify-between items-center group gap-4"
                            >
                                <div className="flex items-start gap-4 min-w-0 flex-1">
                                    <div className="bg-white p-2 rounded-full shadow-sm text-blue-500 shrink-0 mt-1">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-blue-900 truncate">
                                            Nuovo messaggio da {notif.client.name}
                                            <span className="text-xs font-normal text-blue-600 ml-2 whitespace-nowrap">{notif.timestamp}</span>
                                        </p>
                                        <p className="text-sm text-blue-800 mt-1 truncate">{notif.text}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-2 rounded-full shadow-sm text-blue-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// 3. Componente Dettaglio Cliente
const ClientDetail = ({ client, templates, onBack, onCreateWorkout, onAssignTemplate, onEditWorkout, onDeleteWorkout, onSendMessage }) => {
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [newMessageText, setNewMessageText] = useState('');

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [client.messages]);

    const handleSend = () => {
        if(!newMessageText.trim()) return;
        onSendMessage(client.id, newMessageText.trim());
        setNewMessageText('');
    };

    return (
        <div className="space-y-6">
            <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-2">
                ← Torna alla lista
            </button>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-100">
                <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            {client.name}
                            {!client.isActive && <span className="text-sm bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-medium">Inattivo</span>}
                        </h2>
                        <p className="text-slate-500">{client.email}</p>
                    </div>
                    <button
                        onClick={() => setShowAssignModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-200 w-full md:w-auto"
                    >
                        <Plus className="w-5 h-5" /> Nuova Scheda
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-sm text-slate-500 mb-1">Obiettivo Attuale</p>
                        <p className="font-semibold text-slate-800">{client.goal}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-sm text-slate-500 mb-1">Scheda Attiva</p>
                        <p className="font-semibold text-slate-800">{client.activePlan || 'Nessuna assegnata'}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-sm text-slate-500 mb-1">Ultima Scheda Assegnata</p>
                        <p className="font-semibold text-slate-800">
                            {client.history && client.history.length > 0 ? client.history[0].date : 'Nessun dato'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Storico Schede */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-slate-500" /> Storico Schede Cliente
                    </h3>

                    {client.history && client.history.length > 0 ? (
                        <div className="space-y-3">
                            {client.history.map((workout, index) => (
                                <div key={workout.id || index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 border border-slate-100 rounded-lg gap-3">
                                    <div>
                                        <h4 className="font-bold text-slate-800">{workout.name}</h4>
                                        <p className="text-sm text-slate-500">Assegnata il: {workout.date}</p>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                        <div className="text-xs font-medium text-slate-600 bg-white px-2 py-1 rounded-full border border-slate-200 shadow-sm whitespace-nowrap">
                                            {workout.days ? `${workout.days.length} gg` : `${workout.exercises?.length || 0} es.`}
                                        </div>
                                        <button
                                            onClick={() => onEditWorkout(workout)}
                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                            title="Modifica scheda"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteId(workout.id || index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Elimina scheda"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400 text-sm">
                            Nessuna scheda passata trovata.
                        </div>
                    )}
                </div>

                {/* Area Messaggi / Note */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex flex-col h-[500px]">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 shrink-0">
                        <MessageSquare className="w-5 h-5 text-blue-500" /> Area Messaggi
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                        {!client.messages || client.messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                Nessun messaggio presente.
                            </div>
                        ) : (
                            client.messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.sender === 'trainer' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                  <span className="text-xs text-slate-400 mb-1 px-1">
                    {msg.sender === 'trainer' ? 'Tu' : client.name} • {msg.timestamp}
                  </span>
                                    <div className={`px-4 py-2 rounded-2xl ${msg.sender === 'trainer' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="shrink-0 flex gap-2 pt-4 border-t border-slate-100">
                        <input
                            type="text"
                            value={newMessageText}
                            onChange={(e) => setNewMessageText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Scrivi una risposta..."
                            className="flex-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!newMessageText.trim()}
                            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal di Selezione Tipo Scheda (Modello vs Nuova) */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Assegna una Scheda</h3>
                        <p className="text-slate-500 text-sm mb-6">Scegli se utilizzare un modello globale salvato o crearne una da zero specifica per {client.name}.</p>

                        <button
                            onClick={() => { setShowAssignModal(false); onCreateWorkout(client.id); }}
                            className="w-full p-4 mb-6 border-2 border-dashed border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                            <Plus className="w-5 h-5" /> Crea Nuova Scheda da Zero
                        </button>

                        <div className="mb-4">
                            <h4 className="font-semibold text-slate-700 flex items-center gap-2 mb-3">
                                <ClipboardList className="w-5 h-5 text-slate-400" /> I tuoi Modelli
                            </h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                {templates.length === 0 ? (
                                    <p className="text-sm text-slate-400 p-2 text-center bg-slate-50 rounded-lg">Non hai ancora creato alcun modello globale.</p>
                                ) : (
                                    templates.map(tpl => (
                                        <div key={tpl.id} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg hover:border-slate-300">
                                            <div>
                                                <p className="font-medium text-slate-800">{tpl.name}</p>
                                                <p className="text-xs text-slate-500">{tpl.days?.length || 0} giorni</p>
                                            </div>
                                            <button
                                                onClick={() => { setShowAssignModal(false); onAssignTemplate(tpl); }}
                                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                                            >
                                                Usa Modello
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-slate-100">
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Annulla
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Conferma Eliminazione Scheda */}
            {confirmDeleteId !== null && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Conferma Eliminazione</h3>
                        <p className="text-slate-600 mb-6">Sei sicuro di voler eliminare questa scheda? L'azione sul server non è reversibile.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={() => {
                                    onDeleteWorkout(confirmDeleteId);
                                    setConfirmDeleteId(null);
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Elimina
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// 3.5 Componente Gestione Modelli (Templates)
const TemplatesManager = ({ templates, onCreateTemplate, onEditTemplate, onDeleteTemplate }) => {
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 shrink-0">Modelli Schede (Globali)</h2>
                <button
                    onClick={onCreateTemplate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm w-full sm:w-auto shrink-0"
                >
                    <Plus className="w-5 h-5" /> Nuovo Modello
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="space-y-3">
                    {templates.map((tpl) => (
                        <div key={tpl.id} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                            <div>
                                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                    <ClipboardList className="w-5 h-5 text-slate-400" />
                                    {tpl.name}
                                </h4>
                                <p className="text-sm text-slate-500 mt-1">{tpl.days?.length || 0} giorni allenanti configurati</p>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => onEditTemplate(tpl)}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                    title="Modifica Modello"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setConfirmDeleteId(tpl.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Elimina Modello"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {templates.length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                            Nessun modello presente. Crea il tuo primo template di allenamento!
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Conferma Eliminazione Template */}
            {confirmDeleteId !== null && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Elimina Modello</h3>
                        <p className="text-slate-600 mb-6">
                            Sei sicuro di voler eliminare il modello "{templates.find(t => t.id === confirmDeleteId)?.name}"? <br/><br/>
                            <b>Nota:</b> Le schede già assegnate agli atleti usando questo modello non verranno cancellate.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={() => {
                                    onDeleteTemplate(confirmDeleteId);
                                    setConfirmDeleteId(null);
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Elimina Definitivamente
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// 4. Componente Gestione Esercizi
const ExercisesManager = ({ exercises, onAdd, onUpdate, onDelete }) => {
    const [formData, setFormData] = useState({ name: '', description: '', defaultRest: 60 });
    const [editId, setEditId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const valName = formData.name.trim();
        if (!valName) {
            setErrorMsg('Inserisci un nome valido per l\'esercizio');
            return;
        }

        const isDuplicate = exercises.some(ex => ex.name.toLowerCase() === valName.toLowerCase() && ex.id !== editId);
        if (isDuplicate) {
            setErrorMsg('Questo esercizio esiste già');
            return;
        }

        setErrorMsg('');
        if (editId !== null) {
            onUpdate(editId, { ...formData, name: valName });
            setEditId(null);
        } else {
            onAdd({ ...formData, name: valName });
        }
        setFormData({ name: '', description: '', defaultRest: 60 });
    };

    const handleEdit = (exercise) => {
        setFormData({ name: exercise.name, description: exercise.description || '', defaultRest: exercise.defaultRest || 60 });
        setEditId(exercise.id);
        setErrorMsg('');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Gestione Esercizi</h2>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Esercizio</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Es. Panca Inclinata..."
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Recupero Default (s)</label>
                            <input
                                type="number"
                                value={formData.defaultRest}
                                onChange={(e) => setFormData({...formData, defaultRest: parseInt(e.target.value) || 0})}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Descrizione (opzionale)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Note sull'esecuzione, muscoli coinvolti..."
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-20"
                        />
                    </div>

                    {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                    <div className="flex flex-wrap gap-2 mt-2">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors w-full sm:w-auto"
                        >
                            {editId !== null ? 'Aggiorna Server' : 'Aggiungi al Server'}
                        </button>
                        {editId !== null && (
                            <button
                                type="button"
                                onClick={() => { setEditId(null); setFormData({ name: '', description: '', defaultRest: 60 }); setErrorMsg(''); }}
                                className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors w-full sm:w-auto"
                            >
                                Annulla
                            </button>
                        )}
                    </div>
                </form>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {exercises.map((ex) => (
                        <div key={ex.id} className="flex justify-between items-start p-4 bg-slate-50 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                            <div>
                                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                    {ex.name}
                                    <span className="text-xs font-normal bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {ex.defaultRest}s rec.
                  </span>
                                </h4>
                                {ex.description && <p className="text-sm text-slate-500 mt-1">{ex.description}</p>}
                            </div>
                            <div className="flex gap-2 ml-4 shrink-0">
                                <button
                                    onClick={() => handleEdit(ex)}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                    title="Modifica"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setConfirmDeleteId(ex.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Elimina"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {exercises.length === 0 && (
                        <div className="text-center py-8 text-slate-400">
                            Nessun esercizio presente sul server. Aggiungine uno!
                        </div>
                    )}
                </div>
            </div>

            {confirmDeleteId !== null && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Elimina Esercizio</h3>
                        <p className="text-slate-600 mb-6">
                            Sei sicuro di voler eliminare l'esercizio "{exercises.find(e => e.id === confirmDeleteId)?.name}" dal server? L'azione non è reversibile.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={() => {
                                    onDelete(confirmDeleteId);
                                    if (editId === confirmDeleteId) {
                                        setEditId(null);
                                        setFormData({ name: '', description: '', defaultRest: 60 });
                                    }
                                    setConfirmDeleteId(null);
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Elimina Definitivamente
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// 4.5 Componente Gestione Palestre
const GymsManager = ({ gyms, onAdd, onUpdate, onDelete }) => {
    const [formData, setFormData] = useState({ name: '' });
    const [editId, setEditId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const valName = formData.name.trim();
        if (!valName) {
            setErrorMsg('Inserisci il nome della palestra');
            return;
        }

        const isDuplicate = gyms.some(g => g.name.toLowerCase() === valName.toLowerCase() && g.id !== editId);
        if (isDuplicate) {
            setErrorMsg('Questa palestra esiste già');
            return;
        }

        setErrorMsg('');
        if (editId !== null) {
            onUpdate(editId, { ...formData, name: valName });
            setEditId(null);
        } else {
            onAdd({ id: Date.now().toString(), name: valName });
        }
        setFormData({ name: '' });
    };

    const handleEdit = (gym) => {
        setFormData({ name: gym.name });
        setEditId(gym.id);
        setErrorMsg('');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Gestione Palestre</h2>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row flex-wrap gap-4 mb-6 items-start">
                    <div className="flex-1 w-full min-w-[200px]">
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({name: e.target.value})}
                            placeholder="Nome Palestra (es. FitActive Milano)"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors h-[50px] whitespace-nowrap flex-1 md:flex-none"
                        >
                            {editId !== null ? 'Aggiorna' : 'Aggiungi Palestra'}
                        </button>
                        {editId !== null && (
                            <button
                                type="button"
                                onClick={() => { setEditId(null); setFormData({ name: '' }); setErrorMsg(''); }}
                                className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors h-[50px] flex-1 md:flex-none"
                            >
                                Annulla
                            </button>
                        )}
                    </div>
                </form>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {gyms.map((gym) => (
                        <div key={gym.id} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
              <span className="font-bold text-slate-800 flex items-center gap-2">
                <Building className="w-5 h-5 text-slate-400" />
                  {gym.name}
              </span>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => handleEdit(gym)}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                    title="Modifica"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setConfirmDeleteId(gym.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Elimina"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {gyms.length === 0 && (
                        <div className="text-center py-8 text-slate-400">
                            Nessuna palestra configurata sul server.
                        </div>
                    )}
                </div>
            </div>

            {confirmDeleteId !== null && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Elimina Palestra</h3>
                        <p className="text-slate-600 mb-6">
                            Sei sicuro di voler eliminare questa palestra dal server? Gli atleti associati non verranno eliminati, ma perderanno il riferimento.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={() => {
                                    onDelete(confirmDeleteId);
                                    if (editId === confirmDeleteId) {
                                        setEditId(null);
                                        setFormData({ name: '' });
                                    }
                                    setConfirmDeleteId(null);
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Elimina
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// 5. Componente Creazione Scheda (Workout Builder) Adattabile a Clienti/Modelli
const WorkoutBuilder = ({ clientName, onCancel, onSave, initialWorkout, availableExercises, isTemplate }) => {
    const [workoutName, setWorkoutName] = useState(initialWorkout ? initialWorkout.name : (isTemplate ? 'Nuovo Modello' : `Scheda per ${clientName}`));

    const [days, setDays] = useState(() => {
        if (initialWorkout?.days) return initialWorkout.days;
        if (initialWorkout?.exercises?.length > 0) {
            return [{ id: Date.now().toString(), name: 'Giorno Unico', exercises: initialWorkout.exercises }];
        }
        return [{ id: Date.now().toString(), name: 'Giorno 1', exercises: [] }];
    });

    const [errorMsg, setErrorMsg] = useState('');

    const addDay = () => {
        setDays([...days, { id: Date.now().toString(), name: `Giorno ${days.length + 1}`, exercises: [] }]);
    };

    const removeDay = (dayId) => {
        setDays(days.filter(d => d.id !== dayId));
    };

    const updateDayName = (dayId, newName) => {
        setDays(days.map(d => d.id === dayId ? { ...d, name: newName } : d));
    };

    const addExercise = (dayId) => {
        const defaultEx = availableExercises[0] || { name: 'Nuovo Esercizio', defaultRest: 60 };
        setDays(days.map(d => {
            if (d.id === dayId) {
                return {
                    ...d,
                    exercises: [...d.exercises, { id: Date.now().toString() + Math.random(), name: defaultEx.name, sets: 3, reps: 10, rest: defaultEx.defaultRest }]
                };
            }
            return d;
        }));
    };

    const updateExercise = (dayId, exId, field, value) => {
        setDays(days.map(d => {
            if (d.id === dayId) {
                return {
                    ...d,
                    exercises: d.exercises.map(ex => ex.id === exId ? { ...ex, [field]: value } : ex)
                };
            }
            return d;
        }));
    };

    const handleExerciseChange = (dayId, exId, newName) => {
        const selectedEx = availableExercises.find(ex => ex.name === newName);
        setDays(days.map(d => {
            if (d.id === dayId) {
                return {
                    ...d,
                    exercises: d.exercises.map(ex =>
                        ex.id === exId
                            ? { ...ex, name: newName, rest: selectedEx ? selectedEx.defaultRest : 60 }
                            : ex
                    )
                };
            }
            return d;
        }));
    };

    const removeExercise = (dayId, exId) => {
        setDays(days.map(d => {
            if (d.id === dayId) {
                return { ...d, exercises: d.exercises.filter(ex => ex.id !== exId) };
            }
            return d;
        }));
    };

    const handleSave = () => {
        if (!workoutName) return setErrorMsg('Inserisci un nome');
        if (days.length === 0) return setErrorMsg('Aggiungi almeno un giorno di allenamento');
        const hasEmptyDays = days.some(d => d.exercises.length === 0);
        if (hasEmptyDays) return setErrorMsg('Ogni giorno deve contenere almeno un esercizio');

        setErrorMsg('');
        onSave({ name: workoutName, days });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800 shrink-0">
                    {isTemplate
                        ? (initialWorkout ? 'Modifica Modello' : 'Crea Modello Base')
                        : (initialWorkout && initialWorkout.id ? 'Modifica Scheda Cliente' : 'Nuova Scheda Cliente')
                    }
                </h2>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
                    <button onClick={onCancel} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg flex-1 sm:flex-none text-center transition-colors">
                        Annulla
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 flex-1 sm:flex-none transition-colors">
                        <Save className="w-4 h-4 shrink-0" /> <span className="whitespace-nowrap">{isTemplate ? 'Salva Modello' : 'Salva e Sincronizza'}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{errorMsg}</div>}
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome {isTemplate ? 'Modello' : 'Scheda'}</label>
                <input
                    type="text"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-6"
                />

                <div className="space-y-6">
                    {days.map((day, dayIndex) => (
                        <div key={day.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-6 relative">

                            <div className="flex justify-between items-center mb-4 gap-2">
                                <input
                                    type="text"
                                    value={day.name}
                                    onChange={(e) => updateDayName(day.id, e.target.value)}
                                    className="font-bold text-lg bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-colors px-1 w-full max-w-sm"
                                    placeholder={`Nome Giorno (es. Giorno ${dayIndex + 1})`}
                                />
                                <button
                                    onClick={() => removeDay(day.id)}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm flex items-center gap-1 shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Elimina Giorno</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {day.exercises.map((exercise, index) => (
                                    <div key={exercise.id} className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row items-end md:items-center gap-4 animate-fadeIn shadow-sm">
                                        <div className="flex-1 w-full">
                                            <label className="text-xs text-slate-500 mb-1 block">Esercizio {index + 1}</label>
                                            <select
                                                value={exercise.name}
                                                onChange={(e) => handleExerciseChange(day.id, exercise.id, e.target.value)}
                                                className="w-full p-2 border border-slate-300 rounded focus:ring-blue-500 outline-none"
                                            >
                                                {availableExercises.map(ex => <option key={ex.id || ex.name} value={ex.name}>{ex.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="flex w-full md:w-auto gap-4">
                                            <div className="flex-1 md:w-20">
                                                <label className="text-xs text-slate-500 mb-1 block">Serie</label>
                                                <input
                                                    type="number"
                                                    value={exercise.sets}
                                                    onChange={(e) => updateExercise(day.id, exercise.id, 'sets', parseInt(e.target.value))}
                                                    className="w-full p-2 border border-slate-300 rounded text-center"
                                                />
                                            </div>

                                            <div className="flex-1 md:w-20">
                                                <label className="text-xs text-slate-500 mb-1 block">Reps</label>
                                                <input
                                                    type="number"
                                                    value={exercise.reps}
                                                    onChange={(e) => updateExercise(day.id, exercise.id, 'reps', parseInt(e.target.value))}
                                                    className="w-full p-2 border border-slate-300 rounded text-center"
                                                />
                                            </div>

                                            <div className="flex-1 md:w-24">
                                                <label className="text-xs text-slate-500 mb-1 block">Rec (s)</label>
                                                <input
                                                    type="number"
                                                    value={exercise.rest}
                                                    onChange={(e) => updateExercise(day.id, exercise.id, 'rest', parseInt(e.target.value))}
                                                    className="w-full p-2 border border-slate-300 rounded text-center"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeExercise(day.id, exercise.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full md:w-auto flex justify-center mt-2 md:mt-0"
                                            title="Rimuovi esercizio"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => addExercise(day.id)}
                                className="mt-4 w-full py-2 border-2 border-dashed border-slate-300 text-slate-500 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                            >
                                <Plus className="w-4 h-4" /> Aggiungi Esercizio a {day.name || 'questo giorno'}
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={addDay}
                    className="mt-6 w-full py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-bold"
                >
                    <Plus className="w-5 h-5" /> Aggiungi Nuovo Giorno
                </button>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState('list'); // 'list', 'detail', 'create-workout', 'exercises', 'gyms', 'templates', 'create-template', 'notifications'
    const [selectedClient, setSelectedClient] = useState(null);

    const [editingWorkout, setEditingWorkout] = useState(null);
    const [startingTemplate, setStartingTemplate] = useState(null);

    const [toastMessage, setToastMessage] = useState('');

    const [clients, setClients] = useState([]);
    const [exercisesList, setExercisesList] = useState([]);
    const [gymsList, setGymsList] = useState([]);
    const [templatesList, setTemplatesList] = useState([]);

    useEffect(() => {
        if (isAuthenticated) loadInitialData();
    }, [isAuthenticated]);

    const loadInitialData = async () => {
        setIsLoading(true);
        try {
            const [fetchedClients, fetchedGyms, fetchedExercises, fetchedTemplates] = await Promise.all([
                api.getClients(),
                api.getGyms(),
                api.getExercises(),
                api.getTemplates()
            ]);
            setClients(fetchedClients);
            setGymsList(fetchedGyms);
            setExercisesList(fetchedExercises);
            setTemplatesList(fetchedTemplates);
        } catch (error) {
            console.error("Errore nel caricamento dati dal server", error);
            setToastMessage("Errore di connessione col server!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => {
        setIsAuthenticated(false);
        setView('list');
        setSelectedClient(null);
        setClients([]);
    };

    // Navigazione Menu
    const handleSelectClient = async (client) => {
        // Controllo se ci sono messaggi da "smarcare" come letti
        const hasUnread = client.messages?.some(m => m.sender === 'client' && !m.read);

        if (hasUnread) {
            const updatedMessages = client.messages.map(m => m.sender === 'client' ? { ...m, read: true } : m);
            const updatedClient = { ...client, messages: updatedMessages };

            setClients(clients.map(c => c.id === client.id ? updatedClient : c));
            setSelectedClient(updatedClient);
            setView('detail');

            // Sincronizzazione in background
            try { await api.updateClient(updatedClient); }
            catch (e) { console.error("Errore sinc. messaggi letti", e); }
        } else {
            setSelectedClient(client);
            setView('detail');
        }
    };

    const handleBackToList = () => { setSelectedClient(null); setView('list'); };
    const handleNavToExercises = () => { setSelectedClient(null); setView('exercises'); };
    const handleNavToGyms = () => { setSelectedClient(null); setView('gyms'); };
    const handleNavToTemplates = () => { setSelectedClient(null); setView('templates'); };
    const handleNavToNotifications = () => { setSelectedClient(null); setView('notifications'); };

    // Calcolo dinamico notifiche (messaggi non letti dei clienti)
    const unreadNotifications = clients.flatMap(client =>
        (client.messages || [])
            .filter(msg => msg.sender === 'client' && !msg.read)
            .map(msg => ({ ...msg, client }))
    );

    // --- ATLETI ---
    const handleAddClient = async (newClientData) => {
        try {
            const createdClient = await api.addClient(newClientData);
            setClients([createdClient, ...clients]);
            setToastMessage('Atleta salvato sul server!');
            setTimeout(() => setToastMessage(''), 3000);
        } catch (e) { setToastMessage('Errore salvataggio server!'); }
    };

    const handleUpdateClient = async (updatedClientData) => {
        try {
            const updatedClient = await api.updateClient(updatedClientData);
            setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
            if (selectedClient?.id === updatedClient.id) setSelectedClient(updatedClient);
            setToastMessage('Profilo aggiornato sul server!');
            setTimeout(() => setToastMessage(''), 3000);
        } catch (e) { setToastMessage('Errore salvataggio server!'); }
    };

    const handleDeleteClient = async (clientId) => {
        try {
            await api.deleteClient(clientId);
            setClients(clients.filter(c => c.id !== clientId));
            if (selectedClient?.id === clientId) handleBackToList();
            setToastMessage('Atleta eliminato dal server!');
            setTimeout(() => setToastMessage(''), 3000);
        } catch (e) { setToastMessage('Errore eliminazione server!'); }
    };

    const handleToggleClientStatus = async (clientId) => {
        const targetClient = clients.find(c => c.id === clientId);
        if (!targetClient) return;
        const toggledData = { ...targetClient, isActive: !targetClient.isActive };
        await handleUpdateClient(toggledData);
    };

    // --- MESSAGGI ---
    const handleSendMessage = async (clientId, text) => {
        const targetClient = clients.find(c => c.id === clientId);
        if (!targetClient) return;

        const now = new Date();
        const timestamp = now.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ', ' + now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

        const newMessage = {
            id: Date.now().toString(),
            sender: 'trainer',
            text: text,
            timestamp: timestamp,
            read: true // i messaggi del trainer sono letti di default per il lato trainer
        };

        const updatedClientData = {
            ...targetClient,
            messages: [...(targetClient.messages || []), newMessage]
        };

        try {
            const savedClient = await api.updateClient(updatedClientData);
            setClients(clients.map(c => c.id === savedClient.id ? savedClient : c));
            if (selectedClient?.id === savedClient.id) setSelectedClient(savedClient);
        } catch (e) {
            setToastMessage('Errore invio messaggio!');
        }
    };

    // --- SCHEDE CLIENTE ---
    const handleCreateWorkoutClick = (clientId) => {
        setEditingWorkout(null);
        setStartingTemplate(null);
        setView('create-workout');
    };

    const handleAssignTemplateClick = (template) => {
        setEditingWorkout(null);
        setStartingTemplate({ ...template, id: null });
        setView('create-workout');
    };

    const handleEditWorkoutClick = (workout) => {
        setEditingWorkout(workout);
        setStartingTemplate(null);
        setView('create-workout');
    };

    const handleSaveWorkout = async (workoutData) => {
        let newHistory;
        let alertMessage;

        if (editingWorkout && editingWorkout.id) {
            newHistory = selectedClient.history.map(w =>
                (w.id === editingWorkout.id)
                    ? { ...w, ...workoutData, date: new Date().toLocaleDateString('it-IT') }
                    : w
            );
            alertMessage = `Scheda "${workoutData.name}" aggiornata sul server!`;
        } else {
            const newWorkoutHistory = {
                ...workoutData,
                id: Date.now().toString(),
                date: new Date().toLocaleDateString('it-IT')
            };
            newHistory = [newWorkoutHistory, ...(selectedClient.history || [])];
            alertMessage = `Scheda "${workoutData.name}" assegnata e salvata sul server!`;
        }

        const updatedClientData = {
            ...selectedClient,
            activePlan: newHistory[0]?.name || null,
            history: newHistory
        };

        try {
            const savedClient = await api.updateClient(updatedClientData);
            setClients(clients.map(c => c.id === savedClient.id ? savedClient : c));
            setSelectedClient(savedClient);
            setToastMessage(alertMessage);
            setTimeout(() => setToastMessage(''), 3000);
            setView('detail');
        } catch (e) { setToastMessage('Errore sincronizzazione scheda!'); }
    };

    const handleDeleteWorkout = async (workoutIdOrIndex) => {
        const updatedHistory = selectedClient.history.filter((w, idx) =>
            w.id ? w.id !== workoutIdOrIndex : idx !== workoutIdOrIndex
        );
        const updatedClientData = {
            ...selectedClient,
            history: updatedHistory,
            activePlan: updatedHistory[0]?.name || null
        };

        try {
            const savedClient = await api.updateClient(updatedClientData);
            setClients(clients.map(c => c.id === savedClient.id ? savedClient : c));
            setSelectedClient(savedClient);
            setToastMessage('Scheda eliminata dal server!');
            setTimeout(() => setToastMessage(''), 3000);
        } catch(e) { setToastMessage('Errore eliminazione scheda!'); }
    };

    // --- MODELLI GLOBALI (TEMPLATES) ---
    const handleCreateTemplateClick = () => {
        setEditingWorkout(null);
        setView('create-template');
    };

    const handleEditTemplateClick = (template) => {
        setEditingWorkout(template);
        setView('create-template');
    };

    const handleAddTemplate = async (templateData) => {
        try {
            const created = await api.addTemplate({ ...templateData, id: Date.now().toString() });
            setTemplatesList([created, ...templatesList]);
            setToastMessage('Modello base salvato!');
            setTimeout(() => setToastMessage(''), 3000);
            setView('templates');
        } catch (e) { setToastMessage('Errore API!'); }
    };

    const handleUpdateTemplate = async (templateData) => {
        try {
            const updated = await api.updateTemplate(templateData);
            setTemplatesList(templatesList.map(t => t.id === updated.id ? updated : t));
            setToastMessage('Modello base aggiornato!');
            setTimeout(() => setToastMessage(''), 3000);
            setView('templates');
        } catch (e) { setToastMessage('Errore API!'); }
    };

    const handleDeleteTemplate = async (id) => {
        try {
            await api.deleteTemplate(id);
            setTemplatesList(templatesList.filter(t => t.id !== id));
            setToastMessage('Modello eliminato!');
            setTimeout(() => setToastMessage(''), 3000);
        } catch (e) { setToastMessage('Errore API!'); }
    };

    // --- PALESTRE E ESERCIZI ---
    const handleAddGym = async (newGym) => {
        try {
            const created = await api.addGym({ ...newGym, id: Date.now().toString() });
            setGymsList([...gymsList, created]);
            setToastMessage('Palestra sincronizzata!');
            setTimeout(() => setToastMessage(''), 3000);
        } catch (e) { setToastMessage('Errore API!'); }
    };

    const handleUpdateGym = async (id, updatedGym) => {
        try {
            const updated = await api.updateGym(updatedGym);
            setGymsList(gymsList.map(g => g.id === id ? updated : g));
            setToastMessage('Palestra aggiornata!');
            setTimeout(() => setToastMessage(''), 3000);
        } catch (e) { setToastMessage('Errore API!'); }
    };

    const handleDeleteGym = async (id) => {
        try {
            await api.deleteGym(id);
            setGymsList(gymsList.filter(g => g.id !== id));
            const updatedClients = clients.map(c => c.gymId === id ? { ...c, gymId: null } : c);
            setClients(updatedClients);
            setToastMessage('Palestra eliminata!');
            setTimeout(() => setToastMessage(''), 3000);
        } catch (e) { setToastMessage('Errore API!'); }
    };

    const handleAddExercise = async (newExercise) => {
        try {
            const created = await api.addExercise({ ...newExercise, id: Date.now().toString() });
            setExercisesList([...exercisesList, created]);
            setToastMessage('Esercizio sincronizzato!');
            setTimeout(() => setToastMessage(''), 3000);
        } catch (e) { setToastMessage('Errore API!'); }
    };

    const handleUpdateExercise = async (id, updatedExercise) => {
        try {
            const updated = await api.updateExercise(updatedExercise);
            setExercisesList(exercisesList.map(ex => ex.id === id ? updated : ex));
            setToastMessage('Esercizio aggiornato!');
            setTimeout(() => setToastMessage(''), 3000);
        } catch (e) { setToastMessage('Errore API!'); }
    };

    const handleDeleteExercise = async (id) => {
        try {
            await api.deleteExercise(id);
            setExercisesList(exercisesList.filter(ex => ex.id !== id));
            setToastMessage('Esercizio eliminato!');
            setTimeout(() => setToastMessage(''), 3000);
        } catch (e) { setToastMessage('Errore API!'); }
    };

    // --- RENDER MAIN LAYOUT ---
    if (!isAuthenticated) return <LoginScreen onLogin={handleLogin} />;

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-white flex-col hidden md:flex">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <Dumbbell className="text-blue-500 w-8 h-8" />
                    <span className="font-bold text-xl">GymApp</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={handleBackToList}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'list' || view === 'detail' || view === 'create-workout' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Users className="w-5 h-5" />
                        Atleti
                    </button>
                    <button
                        onClick={handleNavToTemplates}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'templates' || view === 'create-template' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <ClipboardList className="w-5 h-5" />
                        Modelli Schede
                    </button>
                    <button
                        onClick={handleNavToGyms}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'gyms' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Building className="w-5 h-5" />
                        Palestre
                    </button>
                    <button
                        onClick={handleNavToExercises}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'exercises' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <List className="w-5 h-5" />
                        Esercizi
                    </button>

                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <button
                            onClick={handleNavToNotifications}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${view === 'notifications' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5" />
                                Notifiche
                            </div>
                            {unreadNotifications.length > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadNotifications.length}
                </span>
                            )}
                        </button>
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <LogOut className="w-5 h-5" />
                        Esci
                    </button>
                </div>
            </aside>

            <main className="flex-1 h-screen overflow-y-auto flex flex-col relative">
                <header className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10 shrink-0">
                    <div className="flex items-center gap-2">
                        <Dumbbell className="text-blue-600 w-6 h-6" />
                        <span className="font-bold text-lg">GymApp</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleNavToNotifications} className="relative">
                            <Bell className="text-slate-500 w-6 h-6" />
                            {unreadNotifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                </span>
                            )}
                        </button>
                        <button onClick={handleLogout}>
                            <LogOut className="text-slate-500 w-6 h-6" />
                        </button>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500 animate-pulse">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                        <p className="font-medium text-lg">Sincronizzazione dati con il server...</p>
                    </div>
                ) : (
                    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full overflow-x-hidden">
                        {view === 'list' && (
                            <ClientsList
                                clients={clients}
                                gyms={gymsList}
                                onSelectClient={handleSelectClient}
                                onAddClient={handleAddClient}
                                onUpdateClient={handleUpdateClient}
                                onDeleteClient={handleDeleteClient}
                                onToggleStatus={handleToggleClientStatus}
                            />
                        )}

                        {view === 'detail' && selectedClient && (
                            <ClientDetail
                                client={selectedClient}
                                templates={templatesList}
                                onBack={handleBackToList}
                                onCreateWorkout={handleCreateWorkoutClick}
                                onAssignTemplate={handleAssignTemplateClick}
                                onEditWorkout={handleEditWorkoutClick}
                                onDeleteWorkout={handleDeleteWorkout}
                                onSendMessage={handleSendMessage}
                            />
                        )}

                        {/* Sezione Notifiche */}
                        {view === 'notifications' && (
                            <NotificationsView
                                notifications={unreadNotifications}
                                onSelectClient={handleSelectClient}
                            />
                        )}

                        {/* Workout Builder (Scheda Cliente) */}
                        {view === 'create-workout' && selectedClient && (
                            <WorkoutBuilder
                                isTemplate={false}
                                clientName={selectedClient.name}
                                onCancel={() => setView('detail')}
                                onSave={handleSaveWorkout}
                                initialWorkout={editingWorkout || startingTemplate}
                                availableExercises={exercisesList}
                            />
                        )}

                        {/* Elenco Modelli Globali */}
                        {view === 'templates' && (
                            <TemplatesManager
                                templates={templatesList}
                                onCreateTemplate={handleCreateTemplateClick}
                                onEditTemplate={handleEditTemplateClick}
                                onDeleteTemplate={handleDeleteTemplate}
                            />
                        )}

                        {/* Workout Builder (Modello Globale) */}
                        {view === 'create-template' && (
                            <WorkoutBuilder
                                isTemplate={true}
                                clientName=""
                                onCancel={() => setView('templates')}
                                onSave={editingWorkout ? handleUpdateTemplate : handleAddTemplate}
                                initialWorkout={editingWorkout}
                                availableExercises={exercisesList}
                            />
                        )}

                        {view === 'exercises' && (
                            <ExercisesManager
                                exercises={exercisesList}
                                onAdd={handleAddExercise}
                                onUpdate={handleUpdateExercise}
                                onDelete={handleDeleteExercise}
                            />
                        )}

                        {view === 'gyms' && (
                            <GymsManager
                                gyms={gymsList}
                                onAdd={handleAddGym}
                                onUpdate={handleUpdateGym}
                                onDelete={handleDeleteGym}
                            />
                        )}
                    </div>
                )}

                {toastMessage && (
                    <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fadeIn flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        {toastMessage}
                    </div>
                )}
            </main>
        </div>
    );
}