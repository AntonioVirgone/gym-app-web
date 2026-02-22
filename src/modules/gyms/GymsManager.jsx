// 4.5 Componente Gestione Palestre
import React, {useState} from "react";

import {Building, ClipboardList, Edit, Plus, Trash2} from 'lucide-react';

export default function GymsManager ({ gyms, onAdd, onUpdate, onDelete }) {
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
            onUpdate({ ...formData, id: editId, name: valName });
            setEditId(null);
        } else {
            onAdd({ name: valName });
        }
        setFormData({ name: '' });
    };

    const handleEdit = (gym) => {
        setFormData({ name: gym.name || '' });
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
                            value={formData.name || ''}
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
                        <div key={gym.id || Math.random().toString()} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
              <span className="font-bold text-slate-800 flex items-center gap-2 truncate pr-4">
                <Building className="w-5 h-5 text-slate-400 shrink-0" />
                <span className="truncate">{gym.name}</span>
              </span>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => handleEdit(gym)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button onClick={() => setConfirmDeleteId(gym.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {confirmDeleteId !== null && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Elimina Palestra</h3>
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                Annulla
                            </button>
                            <button
                                onClick={() => {
                                    onDelete(confirmDeleteId);
                                    if (editId === confirmDeleteId) { setEditId(null); setFormData({ name: '' }); }
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
