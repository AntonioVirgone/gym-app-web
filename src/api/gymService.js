import {MOCK_EXERCISES, MOCK_TEMPLATES} from "../modules/mockData.js";

// ============================================================================
// --- API SERVICE ---
// ============================================================================
export const USE_MOCK_API = false; // Imposta a true se il backend è spento
export const API_BASE_URL = 'http://localhost:3000/api';

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getTrainerId = () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user?.id || '';
};

export const getHeaders = () => ({
    'Content-Type': 'application/json',
    'trainer-id': getTrainerId()
});

export const api = {

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