"use client";

import { useState } from "react";
import axios from "axios";

interface UrlCheckResponse {
  id: number;
  url: string;
  domain: string;
  domainAge: number;
  hasSSL: boolean;
  isBlacklisted: boolean;
  contentSimilarityScore: number;
  logoSimilarityScore: number;
  hasHiddenRedirects: boolean;
  hasMaliciousScripts: boolean;
  riskScore: number;
  status: "SAFE" | "SUSPICIOUS" | "MALICIOUS";
  createdAt: string;
}

export default function UrlChecker() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<UrlCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckUrl = async () => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await axios.post<{ success: boolean; data: UrlCheckResponse }>(
        "http://localhost:8000/api/check-url",
        { url }
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError("Failed to check URL.");
      }
    } catch (err) {
      setError("Error checking URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-black shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Check Website URL</h2>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter website URL..."
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={handleCheckUrl}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Checking..." : "Check URL"}
      </button>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {data && (
        <div className="mt-4 p-4 border rounded bg-black">
          <h3 className="text-lg font-semibold">Results:</h3>
          <p><strong>URL:</strong> {data.url}</p>
          <p><strong>Domain:</strong> {data.domain}</p>
          <p><strong>Domain Age:</strong> {data.domainAge} days</p>
          <p><strong>SSL:</strong> {data.hasSSL ? "✅ Secure" : "❌ Not Secure"}</p>
          <p><strong>Blacklisted:</strong> {data.isBlacklisted ? "⚠️ Yes" : "✅ No"}</p>
          <p><strong>Risk Score:</strong> {data.riskScore}</p>
          <p><strong>Hidden Redirects:</strong> {data.hasHiddenRedirects ? "⚠️ Yes" : "✅ No"}</p>
          <p><strong>Malicious Scripts:</strong> {data.hasMaliciousScripts ? "⚠️ Yes" : "✅ No"}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded ${
                data.status === "SAFE"
                  ? "bg-green-500 text-black"
                  : data.status === "SUSPICIOUS"
                  ? "bg-yellow-500 text-black"
                  : "bg-red-500 text-black"
              }`}
            >
              {data.status}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
