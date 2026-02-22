// 3. Componente Dettaglio Cliente
import React, {useEffect, useRef, useState} from "react";

import {Calendar, ClipboardList, Edit, MessageSquare, Plus, Send, Trash2} from 'lucide-react';

export default function ClientDetail ({ client, templates, onBack, onCreateWorkout, onAssignTemplate, onEditWorkout, onDeleteWorkout, onSendMessage }) {
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
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteId(workout.id || index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                            className="flex-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm min-w-0"
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
