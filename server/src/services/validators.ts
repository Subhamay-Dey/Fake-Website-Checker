class Validator {
    static async isValidUrl(url: string){
        if (!url || typeof url !== 'string') return false;
        
        const regex = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(:\d+)?(\/.*)?$/;
        if (!regex.test(url)) return false;
        
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };
}

export default Validator;

