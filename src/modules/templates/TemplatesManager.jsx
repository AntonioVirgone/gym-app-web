// 3.5 Componente Gestione Modelli (Templates)
import React, {useState} from "react";
import {ClipboardList, Edit, Plus, Trash2} from 'lucide-react';

export default function TemplatesManager({templates, onCreateTemplate, onEditTemplate, onDeleteTemplate}) {
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
                        <div key={tpl.id || Math.random().toString()} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                            <div className="min-w-0 pr-4">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2 truncate">
                                    <ClipboardList className="w-5 h-5 text-slate-400 shrink-0" />
                                    <span className="truncate">{tpl.name}</span>
                                </h4>
                                <p className="text-sm text-slate-500 mt-1">{tpl.days?.length || 0} giorni allenanti configurati</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => onEditTemplate(tpl)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button onClick={() => setConfirmDeleteId(tpl.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Elimina Modello</h3>
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                Annulla
                            </button>
                            <button
                                onClick={() => { onDeleteTemplate(confirmDeleteId); setConfirmDeleteId(null); }}
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
