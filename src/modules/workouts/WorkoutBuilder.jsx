// src/modules/workouts/WorkoutBuilder.jsx
import React, {useEffect, useState} from 'react';
import {Save, Plus, Trash2, Bell, MessageSquare, ChevronRight} from 'lucide-react';

// 5. Componente Creazione Scheda (Workout Builder) Adattabile a Clienti/Modelli
export default function WorkoutBuilder ({ clientName, onCancel, onSave, initialWorkout, availableExercises, isTemplate }) {
    const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9);

    const [workoutName, setWorkoutName] = useState(initialWorkout?.name || (isTemplate ? 'Nuovo Modello' : `Scheda per ${clientName}`));

    const [days, setDays] = useState(() => {
        if (initialWorkout?.days) return initialWorkout.days;
        if (initialWorkout?.exercises?.length > 0) {
            return [{ id: generateId(), name: 'Giorno Unico', exercises: initialWorkout.exercises }];
        }
        return [{ id: generateId(), name: 'Giorno 1', exercises: [] }];
    });

    const [errorMsg, setErrorMsg] = useState('');

    const addDay = () => setDays([...days, { id: generateId(), name: `Giorno ${days.length + 1}`, exercises: [] }]);
    const removeDay = (dayId) => setDays(days.filter(d => d.id !== dayId));
    const updateDayName = (dayId, newName) => setDays(days.map(d => d.id === dayId ? { ...d, name: newName } : d));

    const addExercise = (dayId) => {
        const defaultEx = availableExercises[0] || { name: 'Nuovo Esercizio', defaultRest: 60 };
        setDays(days.map(d => d.id === dayId ? { ...d, exercises: [...d.exercises, { id: generateId(), name: defaultEx.name, sets: 3, reps: 10, rest: defaultEx.defaultRest }] } : d));
    };

    const updateExercise = (dayId, exId, field, value) => {
        setDays(days.map(d => d.id === dayId ? { ...d, exercises: d.exercises.map(ex => ex.id === exId ? { ...ex, [field]: value } : ex) } : d));
    };

    const handleExerciseChange = (dayId, exId, newName) => {
        const selectedEx = availableExercises.find(ex => ex.name === newName);
        setDays(days.map(d => d.id === dayId ? { ...d, exercises: d.exercises.map(ex => ex.id === exId ? { ...ex, name: newName, rest: selectedEx ? selectedEx.defaultRest : 60 } : ex) } : d));
    };

    const removeExercise = (dayId, exId) => {
        setDays(days.map(d => d.id === dayId ? { ...d, exercises: d.exercises.filter(ex => ex.id !== exId) } : d));
    };

    const handleSave = () => {
        if (!workoutName) return setErrorMsg('Inserisci un nome');
        if (days.length === 0) return setErrorMsg('Aggiungi almeno un giorno di allenamento');
        if (days.some(d => d.exercises.length === 0)) return setErrorMsg('Ogni giorno deve contenere almeno un esercizio');

        setErrorMsg('');
        onSave({ id: initialWorkout?.id, name: workoutName, days });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800 shrink-0">
                    {isTemplate ? (initialWorkout ? 'Modifica Modello' : 'Crea Modello Base') : (initialWorkout?.id ? 'Modifica Scheda Cliente' : 'Nuova Scheda Cliente')}
                </h2>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
                    <button onClick={onCancel} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg flex-1 sm:flex-none text-center transition-colors">Annulla</button>
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
                    value={workoutName || ''}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-6"
                />

                <div className="space-y-6">
                    {days.map((day, dayIndex) => (
                        <div key={day.id || Math.random().toString()} className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-6 relative">
                            <div className="flex justify-between items-center mb-4 gap-2">
                                <input
                                    type="text"
                                    value={day.name || ''}
                                    onChange={(e) => updateDayName(day.id, e.target.value)}
                                    className="font-bold text-lg bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-colors px-1 w-full max-w-sm"
                                    placeholder={`Nome Giorno (es. Giorno ${dayIndex + 1})`}
                                />
                                <button onClick={() => removeDay(day.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm flex items-center gap-1 shrink-0">
                                    <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Elimina Giorno</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {day.exercises.map((exercise, index) => (
                                    <div key={exercise.id || Math.random().toString()} className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row items-end md:items-center gap-4 animate-fadeIn shadow-sm">
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
                                                    value={exercise.sets || 0}
                                                    onChange={(e) => updateExercise(day.id, exercise.id, 'sets', parseInt(e.target.value))}
                                                    className="w-full p-2 border border-slate-300 rounded text-center"
                                                />
                                            </div>
                                            <div className="flex-1 md:w-20">
                                                <label className="text-xs text-slate-500 mb-1 block">Reps</label>
                                                <input
                                                    type="number"
                                                    value={exercise.reps || 0}
                                                    onChange={(e) => updateExercise(day.id, exercise.id, 'reps', parseInt(e.target.value))}
                                                    className="w-full p-2 border border-slate-300 rounded text-center"
                                                />
                                            </div>
                                            <div className="flex-1 md:w-24">
                                                <label className="text-xs text-slate-500 mb-1 block">Rec (s)</label>
                                                <input
                                                    type="number"
                                                    value={exercise.rest || 0}
                                                    onChange={(e) => updateExercise(day.id, exercise.id, 'rest', parseInt(e.target.value))}
                                                    className="w-full p-2 border border-slate-300 rounded text-center"
                                                />
                                            </div>
                                        </div>

                                        <button onClick={() => removeExercise(day.id, exercise.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full md:w-auto flex justify-center mt-2 md:mt-0">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => addExercise(day.id)} className="mt-4 w-full py-2 border-2 border-dashed border-slate-300 text-slate-500 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 font-medium text-sm">
                                <Plus className="w-4 h-4" /> Aggiungi Esercizio
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={addDay} className="mt-6 w-full py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-bold">
                    <Plus className="w-5 h-5" /> Aggiungi Nuovo Giorno
                </button>
            </div>
        </div>
    );
};
