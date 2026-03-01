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
