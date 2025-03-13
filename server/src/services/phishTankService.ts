import axios from 'axios';

interface PhishTankResponse {
  results?: {
    in_database: boolean;
    verified: boolean;
  };
}

interface PhishTankResult {
  isBlacklisted: boolean;
  raw: PhishTankResponse;
}

class CheckPhishTank {

    static async checkPhishTank(url: string): Promise<PhishTankResult>{
      try {
        const response = await axios.post<PhishTankResponse>(
          'https://checkurl.phishtank.com/checkurl/',
          `url=${encodeURIComponent(url)}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'website-checker/1.0',
              'X-PhishTank-API-Key': process.env.PHISHTANK_API_KEY || '',
            },
          }
        );
    
        const data = response.data;
        const isBlacklisted = Boolean(data.results?.in_database && data.results?.verified);
    
        return {
          isBlacklisted,
          raw: data,
        };
      } catch (error) {
        console.error('Error checking PhishTank:', error);
        return {
          isBlacklisted: false,
          raw: {},
        };
      }
    };
}

export default CheckPhishTank;