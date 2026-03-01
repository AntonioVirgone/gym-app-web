import {API_BASE_URL, delay, getHeaders, USE_MOCK_API} from "./gymService.js";

export const clientApi = {
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

}