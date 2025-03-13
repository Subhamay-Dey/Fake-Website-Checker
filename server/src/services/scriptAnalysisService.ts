import axios from 'axios';

class CheckMaliciousScripts {
    static async checkMaliciousScripts(url: string){
        try {
            const response = await axios.get(`https://www.virustotal.com/api/v3/urls/${encodeURIComponent(url)}`, {
                headers: { 'x-apikey': process.env.VIRUSTOTAL_API_KEY }
            });
    
            const malicious = response.data.data.attributes.last_analysis_stats.malicious > 0;
    
            return { hasMaliciousScripts: malicious };
        } catch (error) {
            console.error('Error analyzing scripts:', error);
            return { hasMaliciousScripts: false };
        }
    };
}

export default CheckMaliciousScripts;