// src/modules/clients/ClientsList.jsx
import React, { useState } from 'react';
import {Search, Plus, User, Edit, UserX, UserCheck, Trash2, Building, Key} from 'lucide-react';

// 2. Componente Lista Clienti
export default function ClientsList({ clients, gyms, onSelectClient, onAddClient, onUpdateClient, onDeleteClient, onToggleStatus }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGymFilter, setSelectedGymFilter] = useState('all');
    const [clientModal, setClientModal] = useState({ isOpen: false, mode: 'add', client: null });
    const [formData, setFormData] = useState({ name: '', email: '', password: '', goal: '', gymId: gyms.length > 0 ? gyms[0].id : '' });
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const filteredClients = clients.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGym = selectedGymFilter === 'all' || c.gymId === selectedGymFilter;
        return matchesSearch && matchesGym;
    });

    const openAddModal = () => {
        setFormData({ name: '', email: '', password: '', goal: '', gymId: gyms.length > 0 ? gyms[0].id : '' });
        setClientModal({ isOpen: true, mode: 'add', client: null });
        setErrorMsg('');
    };

    const openEditModal = (client, e) => {
        e.stopPropagation();
        setFormData({ name: client.name, email: client.email, password: '', goal: client.goal, gymId: client.gymId || '' });
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
            if (!formData.email.trim()) {
                setErrorMsg("L'email è obbligatoria per creare l'account del cliente");
                return;
            }
            onAddClient({
                id: Date.now().toString(),
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password.trim() || 'password',
                goal: formData.goal.trim() || 'Generico',
                gymId: formData.gymId,
                activePlan: null,
                history: [],
                messages: [],
                isActive: true
            });
        } else {
            const updateData = {
                ...clientModal.client,
                name: formData.name.trim(),
                email: formData.email.trim(),
                goal: formData.goal.trim() || 'Generico',
                gymId: formData.gymId
            };
            if (formData.password.trim() !== '') {
                updateData.password = formData.password.trim();
            }
            onUpdateClient(updateData);
        }
        setClientModal({ isOpen: false, mode: 'add', client: null });
    };

    return (
        <div className="space-y-6">
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
                        {clientModal.mode === 'add' && (
                            <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm flex gap-2 items-start border border-blue-100">
                                <Key className="w-5 h-5 shrink-0 text-blue-500" />
                                <p>La creazione genererà un <b>Account Cliente</b> per l'accesso alla GymApp Atleti. Compila email e password.</p>
                            </div>
                        )}
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Acc. *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="mario.rossi@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Password {clientModal.mode === 'edit' && '(Opz)'}</label>
                                    <input
                                        type="text"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder={clientModal.mode === 'add' ? "Es. password123" : "Nuova password..."}
                                    />
                                </div>
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