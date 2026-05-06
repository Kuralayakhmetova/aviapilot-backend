-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DISPATCHER', 'PILOT', 'INSTRUCTOR');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('LICENSE', 'MEDICAL', 'RATING', 'ENDORSEMENT', 'PASSPORT', 'VISA', 'TRAINING_RECORD', 'OTHER');

-- CreateEnum
CREATE TYPE "FlightPlanStatus" AS ENUM ('DRAFT', 'FILED', 'APPROVED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PILOT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pilot_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "licenseType" TEXT,
    "medicalClass" TEXT,
    "medicalExpiry" TIMESTAMP(3),
    "totalFlightHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pic" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sic" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nightHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ifrHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratings" TEXT[],
    "endorsements" TEXT[],
    "homeBase" TEXT,
    "nationality" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pilot_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logbook_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "departureIcao" TEXT NOT NULL,
    "arrivalIcao" TEXT NOT NULL,
    "aircraftType" TEXT NOT NULL,
    "aircraftReg" TEXT NOT NULL,
    "flightNumber" TEXT,
    "blockOff" TIMESTAMP(3) NOT NULL,
    "blockOn" TIMESTAMP(3) NOT NULL,
    "totalTime" DOUBLE PRECISION NOT NULL,
    "picTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sicTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nightTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ifrTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "landingsDay" INTEGER NOT NULL DEFAULT 0,
    "landingsNight" INTEGER NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "isSigned" BOOLEAN NOT NULL DEFAULT false,
    "signedAt" TIMESTAMP(3),
    "signedBy" TEXT,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "logbook_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "flightNumber" TEXT,
    "departureIcao" TEXT NOT NULL,
    "arrivalIcao" TEXT NOT NULL,
    "alternateIcao" TEXT,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "aircraftType" TEXT NOT NULL,
    "aircraftReg" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "altitude" TEXT NOT NULL,
    "speed" TEXT NOT NULL,
    "endurance" TEXT NOT NULL,
    "personsOnBoard" INTEGER NOT NULL,
    "status" "FlightPlanStatus" NOT NULL DEFAULT 'DRAFT',
    "fuel" DOUBLE PRECISION,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flight_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather_snapshots" (
    "id" TEXT NOT NULL,
    "flightPlanId" TEXT NOT NULL,
    "icao" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "raw" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION,
    "dewpoint" DOUBLE PRECISION,
    "windDir" INTEGER,
    "windSpeed" INTEGER,
    "visibility" DOUBLE PRECISION,
    "ceiling" INTEGER,
    "qnh" DOUBLE PRECISION,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weather_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pilot_profiles_userId_key" ON "pilot_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "pilot_profiles_licenseNumber_key" ON "pilot_profiles"("licenseNumber");

-- AddForeignKey
ALTER TABLE "pilot_profiles" ADD CONSTRAINT "pilot_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logbook_entries" ADD CONSTRAINT "logbook_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_plans" ADD CONSTRAINT "flight_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weather_snapshots" ADD CONSTRAINT "weather_snapshots_flightPlanId_fkey" FOREIGN KEY ("flightPlanId") REFERENCES "flight_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
