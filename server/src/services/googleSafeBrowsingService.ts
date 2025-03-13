import axios from 'axios';

interface ThreatMatch {
  threatType: string;
  platformType: string;
  threat: { url: string };
}

interface GoogleSafeBrowsingResponse {
  matches?: ThreatMatch[];
}

interface SafeBrowsingResult {
  isBlacklisted: boolean;
  raw: GoogleSafeBrowsingResponse;
}

class CheckGoogleSafeBrowsing {

    static async checkGoogleSafeBrowsing(url: string): Promise<SafeBrowsingResult>{
      try {
        const response = await axios.post<GoogleSafeBrowsingResponse>(
          `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_SAFE_BROWSING_API_KEY}`,
          {
            client: {
              clientId: 'website-checker',
              clientVersion: '1.0.0',
            },
            threatInfo: {
              threatTypes: [
                'MALWARE',
                'SOCIAL_ENGINEERING',
                'UNWANTED_SOFTWARE',
                'POTENTIALLY_HARMFUL_APPLICATION',
              ],
              platformTypes: ['ANY_PLATFORM'],
              threatEntryTypes: ['URL'],
              threatEntries: [{ url }],
            },
          }
        );
    
        const data = response.data;
        const isBlacklisted = data.matches?.length > 0 || false;
    
        return {
          isBlacklisted,
          raw: data,
        };
      } catch (error) {
        console.error('Error checking Google Safe Browsing:', error);
        return {
          isBlacklisted: false,
          raw: {},
        };
      }
    };
}

export default CheckGoogleSafeBrowsing;