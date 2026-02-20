// --- MOCK DATA (Simulazione iniziale per il DB locale) ---
export const MOCK_GYMS = [
    { id: 'g1', name: 'Palestra Centrale' },
    { id: 'g2', name: 'FitActive Sud' }
];

export const MOCK_CLIENTS = [
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

export const MOCK_EXERCISES = [
    { id: '1', name: 'Panca Piana', description: 'Esercizio fondamentale per il petto con bilanciere.', defaultRest: 90 },
    { id: '2', name: 'Squat', description: 'Accosciata profonda per lo sviluppo delle gambe.', defaultRest: 120 },
    { id: '4', name: 'Trazioni', description: 'Esercizio a corpo libero per il dorso.', defaultRest: 90 },
];

export const MOCK_TEMPLATES = [
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