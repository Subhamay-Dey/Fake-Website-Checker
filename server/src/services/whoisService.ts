import axios from 'axios';

interface WhoisResponse {
  createdDate?: string;
  ips?: string[];
  registrarName?: string;
  [key: string]: any;
}

interface WhoisResult {
  domainAge: number;
  ipAddress: string | null;
  registrar: string | null;
  raw: WhoisResponse;
}

class CheckDomain {
    static async checkDomain(domain: string): Promise<WhoisResult>{
      try {
        const response = await axios.get<WhoisResponse>('https://whoisapi.whoisxmlapi.com/api/v1', {
          params: {
            apiKey: process.env.WHOIS_API_KEY,
            domainName: domain,
            outputFormat: 'JSON',
          },
        });
    
        const data = response.data;
    
        let domainAge = 0;
        if (data.createdDate) {
          const createdDate = new Date(data.createdDate);
          const now = new Date();
          domainAge = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
        }
    
        return {
          domainAge,
          ipAddress: data.ips?.[0] || null,
          registrar: data.registrarName || null,
          raw: data,
        };
      } catch (error) {
        console.error('Error checking WHOIS:', error);
        return {
          domainAge: 0,
          ipAddress: null,
          registrar: null,
          raw: {},
        };
      }
    };
}

export default CheckDomain;