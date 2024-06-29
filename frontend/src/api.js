// In src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ocr-text-editor-backend.vercel.app',
});

export default api;
