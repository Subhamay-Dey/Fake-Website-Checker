-- CreateTable
CREATE TABLE "URLCheck" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "domainAge" INTEGER,
    "hasSSL" BOOLEAN,
    "isBlacklisted" BOOLEAN,
    "contentSimilarityScore" DOUBLE PRECISION,
    "logoSimilarityScore" DOUBLE PRECISION,
    "hasHiddenRedirects" BOOLEAN,
    "hasMaliciousScripts" BOOLEAN,
    "riskScore" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "ipAddress" TEXT,
    "registrar" TEXT,
    "whoisData" JSONB,
    "blacklistData" JSONB,
    "phishTankData" JSONB,

    CONSTRAINT "URLCheck_pkey" PRIMARY KEY ("id")
);
