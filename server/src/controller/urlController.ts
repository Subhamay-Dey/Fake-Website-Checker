
import { Request, Response } from 'express';
import Validator from '../services/validators.js';
import RiskCalculator from '../services/RiskCalculator.js';
import WhoisService from '../services/whoisService.js';
import GoogleSafeBrowsingService from '../services/googleSafeBrowsingService.js';
import PhishTankService from '../services/phishTankService.js';
import SslService from '../services/SslService.js';
import ContentSimilarityService from '../services/contentSimilarityService.js';
import RedirectService from '../services/redirectService.js';
import ScriptAnalysisService from '../services/scriptAnalysisService.js';
import prisma from '../config/db.config.js';

class CheckUrl {
    static async checkUrl(req: Request, res: Response){
      try {
        const { url } = req.body;
    
        if (!url || !Validator.isValidUrl(url)) {
          return res.status(400).json({ success: false, message: 'Invalid URL provided' });
        }
    
        const urlObj = new URL(url);
        const domain: string = urlObj.hostname;
    
        const existingCheck = await prisma.uRLCheck.findFirst({
          where: {
            url,
            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          },
          orderBy: { createdAt: 'desc' },
        });
    
        if (existingCheck) {
          return res.json({
            success: true,
            data: existingCheck,
            message: 'Retrieved existing check',
          });
        }
    
        const [
          whoisData,
          googleSafeBrowsingData,
          phishTankData,
          sslData,
          contentSimilarityData,
          redirectData,
          scriptAnalysisData,
        ] = await Promise.all([
            WhoisService.checkDomain(domain),
            GoogleSafeBrowsingService.checkGoogleSafeBrowsing(url),
            PhishTankService.checkPhishTank(url),
            SslService.checkSSL(domain),
            ContentSimilarityService.checkContentSimilarity(url),
            RedirectService.checkRedirects(url),
            ScriptAnalysisService.checkMaliciousScripts(url),
        ]);
    
        const riskScore = await RiskCalculator.calculateRiskScore({
          domainAge: whoisData.domainAge,
          hasSSL: sslData.hasSSL,
          isBlacklisted: googleSafeBrowsingData.isBlacklisted || phishTankData.isBlacklisted,
          contentSimilarityScore: contentSimilarityData.contentSimilarityScore,
          logoSimilarityScore: contentSimilarityData.logoSimilarityScore,
          hasHiddenRedirects: redirectData.hasHiddenRedirects,
          hasMaliciousScripts: scriptAnalysisData.hasMaliciousScripts,
        });
    
        let status: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' = 'SAFE';
        if (riskScore > 70) {
          status = 'MALICIOUS';
        } else if (riskScore > 30) {
          status = 'SUSPICIOUS';
        }
    
        const result = await prisma.uRLCheck.create({
          data: {
            url,
            domain,
            domainAge: whoisData.domainAge,
            hasSSL: sslData.hasSSL,
            isBlacklisted: googleSafeBrowsingData.isBlacklisted || phishTankData.isBlacklisted,
            contentSimilarityScore: contentSimilarityData.contentSimilarityScore,
            logoSimilarityScore: contentSimilarityData.logoSimilarityScore,
            hasHiddenRedirects: redirectData.hasHiddenRedirects,
            hasMaliciousScripts: scriptAnalysisData.hasMaliciousScripts,
            riskScore,
            status,
            ipAddress: whoisData.ipAddress,
            registrar: whoisData.registrar,
            whoisData: whoisData.raw,
            blacklistData: JSON.stringify(googleSafeBrowsingData.raw),
            phishTankData: JSON.stringify(phishTankData.raw),
          },
        });
    
        return res.json({
          success: true,
          data: result,
          message: 'URL checked successfully',
        });
      } catch (error) {
        console.error('Error checking URL:', error);
        return res.status(500).json({
          success: false,
          message: 'Error checking URL',
          error: process.env.NODE_ENV === 'production' ? {} : error.message,
        });
      }
    };
}

export default CheckUrl;