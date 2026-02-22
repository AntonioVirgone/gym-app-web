// ============================================================================
// --- API SERVICE (PREDISPOSIZIONE BACKEND NESTJS) ---
// ============================================================================
import {MOCK_CLIENTS, MOCK_EXERCISES, MOCK_TEMPLATES} from "../modules/mockData.js";

export const USE_MOCK_API = false;
export const API_BASE_URL = 'http://localhost:3000/api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    login: async (email, password) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                body: JSON.stringify(email, password),
                headers: {'Content-Type': 'application/json'}
            });
            if (!res.ok) throw new Error('Errore server');
            return res.json();
        }
        await delay(500);
        return JSON.parse(localStorage.getItem('gymClientsData')) || MOCK_CLIENTS.map(c => ({...c, isActive: true}));
    },

    // --- ATLETI ---
    getClients: async () => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/clients`);
            if (!res.ok) throw new Error('Errore server');
            return res.json();
        }
        await delay(500);
        return JSON.parse(localStorage.getItem('gymClientsData')) || MOCK_CLIENTS.map(c => ({...c, isActive: true}));
    },

    addClient: async (clientData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/clients`, {
                method: 'POST',
                body: JSON.stringify(clientData),
                headers: {'Content-Type': 'application/json'}
            });
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
            const res = await fetch(`${API_BASE_URL}/clients/${clientData.id}`, {
                method: 'PUT',
                body: JSON.stringify(clientData),
                headers: {'Content-Type': 'application/json'}
            });
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
            await fetch(`${API_BASE_URL}/clients/${id}`, {method: 'DELETE'});
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
            const res = await fetch(`${API_BASE_URL}/gyms`, {
                method: 'POST',
                body: JSON.stringify(gymData),
                headers: {'Content-Type': 'application/json'}
            });
            return res.json();
        }
        await delay(300);
        const list = JSON.parse(localStorage.getItem('gymLocationsData')) || MOCK_GYMS;
        localStorage.setItem('gymLocationsData', JSON.stringify([...list, gymData]));
        return gymData;
    },

    updateGym: async (gymData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/gyms/${gymData.id}`, {
                method: 'PUT',
                body: JSON.stringify(gymData),
                headers: {'Content-Type': 'application/json'}
            });
            return res.json();
        }
        await delay(300);
        const list = JSON.parse(localStorage.getItem('gymLocationsData')) || MOCK_GYMS;
        localStorage.setItem('gymLocationsData', JSON.stringify(list.map(g => g.id === gymData.id ? gymData : g)));
        return gymData;
    },

    deleteGym: async (id) => {
        if (!USE_MOCK_API) {
            await fetch(`${API_BASE_URL}/gyms/${id}`, {method: 'DELETE'});
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
            rawData = rawData.map((name, i) => ({id: `migrated-${i}`, name, description: '', defaultRest: 60}));
            localStorage.setItem('gymExercisesData', JSON.stringify(rawData));
        }
        return rawData || MOCK_EXERCISES;
    },

    addExercise: async (exData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/exercises`, {
                method: 'POST',
                body: JSON.stringify(exData),
                headers: {'Content-Type': 'application/json'}
            });
            return res.json();
        }
        await delay(300);
        const list = JSON.parse(localStorage.getItem('gymExercisesData')) || MOCK_EXERCISES;
        localStorage.setItem('gymExercisesData', JSON.stringify([...list, exData]));
        return exData;
    },

    updateExercise: async (exData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/exercises/${exData.id}`, {
                method: 'PUT',
                body: JSON.stringify(exData),
                headers: {'Content-Type': 'application/json'}
            });
            return res.json();
        }
        await delay(300);
        const list = JSON.parse(localStorage.getItem('gymExercisesData')) || MOCK_EXERCISES;
        localStorage.setItem('gymExercisesData', JSON.stringify(list.map(e => e.id === exData.id ? exData : e)));
        return exData;
    },

    deleteExercise: async (id) => {
        if (!USE_MOCK_API) {
            await fetch(`${API_BASE_URL}/exercises/${id}`, {method: 'DELETE'});
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
            const res = await fetch(`${API_BASE_URL}/templates`, {
                method: 'POST',
                body: JSON.stringify(templateData),
                headers: {'Content-Type': 'application/json'}
            });
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
            const res = await fetch(`${API_BASE_URL}/templates/${templateData.id}`, {
                method: 'PUT',
                body: JSON.stringify(templateData),
                headers: {'Content-Type': 'application/json'}
            });
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
            await fetch(`${API_BASE_URL}/templates/${id}`, {method: 'DELETE'});
            return id;
        }
        await delay(300);
        const list = JSON.parse(localStorage.getItem('gymTemplatesData')) || MOCK_TEMPLATES;
        localStorage.setItem('gymTemplatesData', JSON.stringify(list.filter(t => t.id !== id)));
        return id;
    }
};