import axios from 'axios';

const api = axios.create({
    baseURL: 'https://step-by-backend-production-bec4.up.railway.app'
})

const apiTimezone = axios.create({
  baseURL: 'https://www.timeapi.io/api/Conversion/ConvertTimeZone'
})

export { api, apiTimezone }