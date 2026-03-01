import {API_BASE_URL, delay, getHeaders, USE_MOCK_API} from "./BaseService.js";
import {MOCK_EXERCISES} from "../modules/mockData.js";

export const exercisesApi = {
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

}