import axios from 'axios';

const api = axios.create({
    baseURL: 'https://step-by-backend-production-bec4.up.railway.app'
})

export { api }