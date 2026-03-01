import {API_BASE_URL, delay, getHeaders, USE_MOCK_API} from "./BaseService.js";
import {MOCK_TEMPLATES} from "../modules/mockData.js";

export const templatesApi = {
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
}