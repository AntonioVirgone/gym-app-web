import {MOCK_EXERCISES, MOCK_TEMPLATES} from "../modules/mockData.js";

// ============================================================================
// --- API SERVICE ---
// ============================================================================
const USE_MOCK_API = false; // Imposta a true se il backend è spento
const API_BASE_URL = 'http://localhost:3000/api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getTrainerId = () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user?.id || '';
};

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'trainer-id': getTrainerId()
});

export const api = {
    // --- AUTH ---
    login: async (email, password) => {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) throw new Error('Credenziali errate');
        const data = await res.json();
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        return data;
    },

    register: async (name, email, password) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            if (!res.ok) throw new Error('Errore durante la registrazione');
            return res.json();
        }
        await delay(800);
        return { user: { id: Date.now().toString(), name, email } };
    },

    // --- ATLETI ---
    addClient: async (clientData) => {
        const res = await fetch(`${API_BASE_URL}/clients`, {
            method: 'POST',
            body: JSON.stringify(clientData),
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Errore nella creazione');
        return res.json();
    },

    getClients: async () => {
        const res = await fetch(`${API_BASE_URL}/clients`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Errore nel fetch');
        return res.json();
    },

    updateClient: async (id, clientData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
                method: 'PUT',
                body: JSON.stringify(clientData),
                headers: getHeaders()
            });
            return res.json();
        }
        await delay(400);
        return clientData;
    },

    deleteClient: async (id) => {
        if (!USE_MOCK_API) {
            await fetch(`${API_BASE_URL}/clients/${id}`, { method: 'DELETE', headers: getHeaders() });
            return id;
        }
        await delay(300);
        return id;
    },

    // --- PALESTRE ---
    addGym: async (gymData) => {
        const res = await fetch(`${API_BASE_URL}/gyms`, {
            method: 'POST',
            body: JSON.stringify(gymData),
            headers: getHeaders()
        });
        return res.json();
    },

    getGyms: async () => {
        const res = await fetch(`${API_BASE_URL}/gyms`, { headers: getHeaders() });
        return res.json();
    },

    updateGym: async (id, gymData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/gyms/${id}`, {
                method: 'PUT',
                body: JSON.stringify(gymData),
                headers: getHeaders()
            });
            return res.json();
        }
        await delay(300);
        return gymData;
    },

    deleteGym: async (id) => {
        if (!USE_MOCK_API) {
            await fetch(`${API_BASE_URL}/gyms/${id}`, { method: 'DELETE', headers: getHeaders() });
            return id;
        }
        await delay(300);
        return id;
    },

    // --- ESERCIZI ---
    getExercises: async () => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/exercises`, { headers: getHeaders() });
            return res.json();
        }
        await delay(200);
        return MOCK_EXERCISES;
    },

    addExercise: async (exData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/exercises`, {
                method: 'POST',
                body: JSON.stringify(exData),
                headers: getHeaders()
            });
            return res.json();
        }
        await delay(300);
        return exData;
    },

    updateExercise: async (id, exData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/exercises/${id}`, {
                method: 'PUT',
                body: JSON.stringify(exData),
                headers: getHeaders()
            });
            return res.json();
        }
        await delay(300);
        return exData;
    },

    deleteExercise: async (id) => {
        if (!USE_MOCK_API) {
            await fetch(`${API_BASE_URL}/exercises/${id}`, { method: 'DELETE', headers: getHeaders() });
            return id;
        }
        await delay(300);
        return id;
    },

    // --- MODELLI SCHEDE (TEMPLATES) ---
    getTemplates: async () => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/templates`, { headers: getHeaders() });
            return res.json();
        }
        await delay(200);
        return MOCK_TEMPLATES;
    },

    addTemplate: async (templateData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/templates`, {
                method: 'POST',
                body: JSON.stringify(templateData),
                headers: getHeaders()
            });
            return res.json();
        }
        await delay(300);
        return templateData;
    },

    updateTemplate: async (id, templateData) => {
        if (!USE_MOCK_API) {
            const res = await fetch(`${API_BASE_URL}/templates/${id}`, {
                method: 'PUT',
                body: JSON.stringify(templateData),
                headers: getHeaders()
            });
            return res.json();
        }
        await delay(300);
        return templateData;
    },

    deleteTemplate: async (id) => {
        if (!USE_MOCK_API) {
            await fetch(`${API_BASE_URL}/templates/${id}`, { method: 'DELETE', headers: getHeaders() });
            return id;
        }
        await delay(300);
        return id;
    }
};