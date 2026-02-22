import React, {useEffect, useState} from 'react';
import {Bell, Building, ClipboardList, Dumbbell, List, Loader2, LogOut, Users} from 'lucide-react';
import {api} from "./api/gymService.js";
import ClientsList from "./modules/clients/ClientsList.jsx";
import WorkoutBuilder from "./modules/workouts/WorkoutBuilder.jsx";
import ClientDetail from "./modules/clients/ClientDetail.jsx";
import ExercisesManager from "./modules/exercises/ExercisesManager.jsx";
import GymsManager from "./modules/gyms/GymsManager.jsx";
import TemplatesManager from "./modules/templates/TemplatesManager.jsx";
import NotificationsView from "./modules/notifications/NotificationsView.jsx";
import LoginScreen from "./modules/auth/LoginScreen.jsx";

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
            setToastMessage('Atleta (e utenza) creati con successo sul server!');
            setTimeout(() => setToastMessage(''), 4000);
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
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-x-hidden">
            <aside className="w-64 bg-slate-900 text-white flex-col hidden md:flex shrink-0">
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

            <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden flex flex-col relative w-full">
                <header className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10 shrink-0 w-full">
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
                    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
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