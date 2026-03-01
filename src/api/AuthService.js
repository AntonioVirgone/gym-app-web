import {API_BASE_URL, delay, USE_MOCK_API} from "./BaseService.js";

export const authApi = {
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

}