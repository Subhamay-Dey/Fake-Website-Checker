
class RiskCalculator {
    static async calculateRiskScore(factors: any){
        let score = 0;
        if (factors.domainAge < 30) score += 30;
        if (!factors.hasSSL) score += 20;
        if (factors.isBlacklisted) score += 40;
        if (factors.contentSimilarityScore > 80) score += 30;
        if (factors.hasHiddenRedirects) score += 10;
        if (factors.hasMaliciousScripts) score += 40;
        return score;
    };
}

export default RiskCalculator;