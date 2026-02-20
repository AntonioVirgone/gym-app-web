// 4. Componente Gestione Esercizi
import {useState} from "react";

import {Edit, Trash2} from 'lucide-react';

export default function ExercisesManager ({ exercises, onAdd, onUpdate, onDelete }) {
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