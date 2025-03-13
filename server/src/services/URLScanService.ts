import axios from 'axios';

interface URLScanResponse {
  verdicts?: {
    overall: {
      malicious: boolean;
    };
  };
}

interface URLScanResult {
  isBlacklisted: boolean;
  raw: URLScanResponse;
}

class URLScanService {
  static async checkURL(url: string): Promise<URLScanResult> {
    try {
      const apiKey = process.env.URLSCAN_API_KEY;
      const response = await axios.post<URLScanResponse>(
        "https://urlscan.io/api/v1/scan/",
        { url },
        {
          headers: { "API-Key": apiKey, "Content-Type": "application/json" },
        }
      );

      const isBlacklisted = response.data.verdicts?.overall?.malicious ?? false;
      return { isBlacklisted, raw: response.data };
    } catch (error) {
      console.error("Error checking URLScan.io:", error);
      return { isBlacklisted: false, raw: {} };
    }
  }
}

export default URLScanService;
