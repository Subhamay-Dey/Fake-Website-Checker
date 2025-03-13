import axios from 'axios';

class RedirectService {

    static async checkRedirects(url: string){
        try {
            const response = await axios.get(`https://redirect-checker.api.com/check?url=${encodeURIComponent(url)}`);
            
            return {
                hasHiddenRedirects: response.data.hasHiddenRedirects || false
            };
        } catch (error) {
            console.error('Error checking redirects:', error);
            return { hasHiddenRedirects: false };
        }
    };
}

export default RedirectService;