import https from 'https';
import { TLSSocket, PeerCertificate } from 'tls';

interface SSLCheckResult {
  hasSSL: boolean;
  isValid?: boolean;
  issuer?: PeerCertificate['issuer'];
  validFrom?: string;
  validTo?: string;
}

class CheckSSL {

    static async checkSSL(domain: string): Promise<SSLCheckResult>{
      return new Promise((resolve) => {
        try {
          const req = https.request(
            {
              host: domain,
              port: 443,
              method: 'GET',
              rejectUnauthorized: false,
              ciphers: 'ALL',
            },
            (res) => {
              const tlsSocket = res.socket as TLSSocket;
    
              if (!tlsSocket.getPeerCertificate) {
                resolve({ hasSSL: false });
                return;
              }
    
              const certificate = tlsSocket.getPeerCertificate();
    
              if (!certificate || Object.keys(certificate).length === 0) {
                resolve({ hasSSL: false });
                return;
              }
    
              const valid = certificate.valid_to
                ? new Date(certificate.valid_to) > new Date()
                : false;
    
              resolve({
                hasSSL: true,
                isValid: valid,
                issuer: certificate.issuer || undefined,
                validFrom: certificate.valid_from,
                validTo: certificate.valid_to,
              });
            }
          );
    
          req.on('error', () => {
            resolve({ hasSSL: false });
          });
    
          req.end();
        } catch (error) {
          console.error('Error checking SSL:', error);
          resolve({ hasSSL: false });
        }
      });
    };
}

