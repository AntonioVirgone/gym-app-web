import {API_BASE_URL, delay, getHeaders, USE_MOCK_API} from "./BaseService.js";

export const gymApi = {
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


};