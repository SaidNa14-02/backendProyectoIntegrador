import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

export const geocodeAddress = async (address) => {
    try {
        const response = await axios.get(NOMINATIM_BASE_URL, {
            params: {
                q: address,
                format: 'json',
                limit: 1, 
                countrycodes: 'ec'
            },
            headers: {
                'User-Agent': 'backendProyectoIntegrador/1.0 (msnavarretem@puce.edu.ec)'
            }
        });

        if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return { lat: parseFloat(lat), lon: parseFloat(lon) };
        } else {
            return null; 
        }
    } catch (error) {
        console.error('Error geocoding address:', address, error.message);
        throw new Error('Failed to geocode address');
    }
};