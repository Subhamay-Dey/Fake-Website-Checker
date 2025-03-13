import axios from 'axios';

class ContentSimilarityService {
    async checkContentSimilarity(url: string){
        try {
            const response = await axios.post('https://api.sightengine.com/1.0/check.json', {
                url,
                api_user: process.env.SIGHTENGINE_USER,
                api_secret: process.env.SIGHTENGINE_SECRET!
            });
            
            return {
                contentSimilarityScore: response.data.similarity_score || 0,
                logoSimilarityScore: response.data.logo_similarity_score || 0
            };
        } catch (error) {
            console.error('Error checking content similarity:', error);
            return { contentSimilarityScore: 0, logoSimilarityScore: 0 };
        }
    }
}

export default ContentSimilarityService;