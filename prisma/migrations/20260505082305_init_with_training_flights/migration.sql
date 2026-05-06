/*
  Warnings:

  - The values [DISPATCHER,PILOT,INSTRUCTOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `fileSize` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `verifiedAt` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `verifiedBy` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `alternateIcao` on the `flight_plans` table. All the data in the column will be lost.
  - You are about to drop the column `arrivalIcao` on the `flight_plans` table. All the data in the column will be lost.
  - You are about to drop the column `departureIcao` on the `flight_plans` table. All the data in the column will be lost.
  - You are about to drop the column `fuel` on the `flight_plans` table. All the data in the column will be lost.
  - You are about to drop the column `personsOnBoard` on the `flight_plans` table. All the data in the column will be lost.
  - The `status` column on the `flight_plans` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `aircraftReg` on the `logbook_entries` table. All the data in the column will be lost.
  - You are about to drop the column `aircraftType` on the `logbook_entries` table. All the data in the column will be lost.
  - You are about to drop the column `arrivalIcao` on the `logbook_entries` table. All the data in the column will be lost.
  - You are about to drop the column `blockOff` on the `logbook_entries` table. All the data in the column will be lost.
  - You are about to drop the column `blockOn` on the `logbook_entries` table. All the data in the column will be lost.
  - You are about to drop the column `departureIcao` on the `logbook_entries` table. All the data in the column will be lost.
  - You are about to drop the column `flightNumber` on the `logbook_entries` table. All the data in the column will be lost.
  - You are about to drop the column `isSigned` on the `logbook_entries` table. All the data in the column will be lost.
  - You are about to drop the column `pdfUrl` on the `logbook_entries` table. All the data in the column will be lost.
  - You are about to drop the column `signedAt` on the `logbook_entries` table. All the data in the column will be lost.
  - You are about to drop the column `signedBy` on the `logbook_entries` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `pilot_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `endorsements` on the `pilot_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `homeBase` on the `pilot_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `ifrHours` on the `pilot_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `medicalClass` on the `pilot_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `nationality` on the `pilot_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `nightHours` on the `pilot_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `pic` on the `pilot_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `ratings` on the `pilot_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `sic` on the `pilot_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `ceiling` on the `weather_snapshots` table. All the data in the column will be lost.
  - You are about to drop the column `dewpoint` on the `weather_snapshots` table. All the data in the column will be lost.
  - You are about to drop the column `icao` on the `weather_snapshots` table. All the data in the column will be lost.
  - You are about to drop the column `qnh` on the `weather_snapshots` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `weather_snapshots` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `weather_snapshots` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `weather_snapshots` table. All the data in the column will be lost.
  - You are about to drop the column `windDir` on the `weather_snapshots` table. All the data in the column will be lost.
  - You are about to drop the column `windSpeed` on the `weather_snapshots` table. All the data in the column will be lost.
  - Added the required column `name` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `documents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `arrival` to the `flight_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departure` to the `flight_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `acReg` to the `logbook_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `acType` to the `logbook_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arrIcao` to the `logbook_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arrTime` to the `logbook_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depIcao` to the `logbook_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depTime` to the `logbook_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leftSeatPerson` to the `logbook_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leftSeatPos` to the `logbook_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operationType` to the `logbook_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rightSeatPerson` to the `logbook_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rightSeatPos` to the `logbook_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `logbook_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rules` to the `logbook_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `station` to the `weather_snapshots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropIndex
DROP INDEX "pilot_profiles_licenseNumber_key";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "fileSize",
DROP COLUMN "isVerified",
DROP COLUMN "mimeType",
DROP COLUMN "notes",
DROP COLUMN "title",
DROP COLUMN "verifiedAt",
DROP COLUMN "verifiedBy",
ADD COLUMN     "isValid" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "issueDate" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "fileUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "flight_plans" DROP COLUMN "alternateIcao",
DROP COLUMN "arrivalIcao",
DROP COLUMN "departureIcao",
DROP COLUMN "fuel",
DROP COLUMN "personsOnBoard",
ADD COLUMN     "alternate" TEXT,
ADD COLUMN     "arrival" TEXT NOT NULL,
ADD COLUMN     "departure" TEXT NOT NULL,
ADD COLUMN     "fuelOnBoard" DOUBLE PRECISION,
ADD COLUMN     "pobCount" INTEGER,
ALTER COLUMN "route" DROP NOT NULL,
ALTER COLUMN "altitude" DROP NOT NULL,
ALTER COLUMN "speed" DROP NOT NULL,
ALTER COLUMN "endurance" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "logbook_entries" DROP COLUMN "aircraftReg",
DROP COLUMN "aircraftType",
DROP COLUMN "arrivalIcao",
DROP COLUMN "blockOff",
DROP COLUMN "blockOn",
DROP COLUMN "departureIcao",
DROP COLUMN "flightNumber",
DROP COLUMN "isSigned",
DROP COLUMN "pdfUrl",
DROP COLUMN "signedAt",
DROP COLUMN "signedBy",
ADD COLUMN     "acReg" TEXT NOT NULL,
ADD COLUMN     "acType" TEXT NOT NULL,
ADD COLUMN     "actualImc" DOUBLE PRECISION,
ADD COLUMN     "approachType" TEXT,
ADD COLUMN     "arrDate" TIMESTAMP(3),
ADD COLUMN     "arrIcao" TEXT NOT NULL,
ADD COLUMN     "arrTime" TEXT NOT NULL,
ADD COLUMN     "attendantIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cargo" INTEGER,
ADD COLUMN     "cloudBase" INTEGER,
ADD COLUMN     "cloudTop" INTEGER,
ADD COLUMN     "cloudiness" INTEGER,
ADD COLUMN     "crossCountry" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "depIcao" TEXT NOT NULL,
ADD COLUMN     "depTime" TEXT NOT NULL,
ADD COLUMN     "engineerIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "engineers" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "exerciseNumber" TEXT,
ADD COLUMN     "flightAttendants" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "leftSeatCrewId" TEXT,
ADD COLUMN     "leftSeatPerson" TEXT NOT NULL,
ADD COLUMN     "leftSeatPos" TEXT NOT NULL,
ADD COLUMN     "maxAltitude" INTEGER,
ADD COLUMN     "mechanics" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "minAltitude" INTEGER,
ADD COLUMN     "operationType" TEXT NOT NULL,
ADD COLUMN     "passengers" INTEGER,
ADD COLUMN     "rightSeatCrewId" TEXT,
ADD COLUMN     "rightSeatPerson" TEXT NOT NULL,
ADD COLUMN     "rightSeatPos" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "rules" TEXT NOT NULL,
ADD COLUMN     "simInstrument" DOUBLE PRECISION,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'COMPLETED',
ADD COLUMN     "technicianIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "technicians" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "visibility" INTEGER,
ALTER COLUMN "picTime" DROP NOT NULL,
ALTER COLUMN "picTime" DROP DEFAULT,
ALTER COLUMN "sicTime" DROP NOT NULL,
ALTER COLUMN "sicTime" DROP DEFAULT,
ALTER COLUMN "nightTime" DROP NOT NULL,
ALTER COLUMN "nightTime" DROP DEFAULT,
ALTER COLUMN "ifrTime" DROP NOT NULL,
ALTER COLUMN "ifrTime" DROP DEFAULT;

-- AlterTable
ALTER TABLE "pilot_profiles" DROP COLUMN "dateOfBirth",
DROP COLUMN "endorsements",
DROP COLUMN "homeBase",
DROP COLUMN "ifrHours",
DROP COLUMN "medicalClass",
DROP COLUMN "nationality",
DROP COLUMN "nightHours",
DROP COLUMN "pic",
DROP COLUMN "ratings",
DROP COLUMN "sic",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "licenseExpiry" TIMESTAMP(3),
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "role" SET DEFAULT 'USER';

-- AlterTable
ALTER TABLE "weather_snapshots" DROP COLUMN "ceiling",
DROP COLUMN "dewpoint",
DROP COLUMN "icao",
DROP COLUMN "qnh",
DROP COLUMN "temperature",
DROP COLUMN "type",
DROP COLUMN "visibility",
DROP COLUMN "windDir",
DROP COLUMN "windSpeed",
ADD COLUMN     "station" TEXT NOT NULL;

-- DropEnum
DROP TYPE "DocumentType";

-- DropEnum
DROP TYPE "FlightPlanStatus";

-- CreateTable
CREATE TABLE "crew_members" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "position" TEXT NOT NULL DEFAULT '',
    "rank" TEXT NOT NULL DEFAULT '',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "birthDate" TIMESTAMP(3),
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "photo" TEXT,
    "licenseType" TEXT,
    "licenseExpiry" TIMESTAMP(3),
    "medicalCert" TEXT,
    "medicalExpiry" TIMESTAMP(3),
    "medicalClass" INTEGER,
    "education" TEXT,
    "graduationYear" INTEGER,
    "acTypePrimary" TEXT,
    "acTypeSecondary" TEXT,
    "acClass" TEXT,
    "totalFlightHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalHoursPrimary" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalHoursYear" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPicHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalSicHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalNightHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalIfrHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalLandings" INTEGER NOT NULL DEFAULT 0,
    "checkRideDate" TIMESTAMP(3),
    "simCheckDate" TIMESTAMP(3),
    "lineCheckDate" TIMESTAMP(3),
    "profCheckDate" TIMESTAMP(3),
    "allowNight" BOOLEAN NOT NULL DEFAULT false,
    "allowImc" BOOLEAN NOT NULL DEFAULT false,
    "allowSmu" BOOLEAN NOT NULL DEFAULT false,
    "allowUmp" BOOLEAN NOT NULL DEFAULT false,
    "allowMountain" BOOLEAN NOT NULL DEFAULT false,
    "allowSeaplane" BOOLEAN NOT NULL DEFAULT false,
    "allowCargo" BOOLEAN NOT NULL DEFAULT false,
    "allowDangerous" BOOLEAN NOT NULL DEFAULT false,
    "allowInstructor" BOOLEAN NOT NULL DEFAULT false,
    "allowExaminer" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "hireDate" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crew_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chrono_day_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'ККМЖ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chrono_day_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chrono_rows" (
    "id" TEXT NOT NULL,
    "dayLogId" TEXT NOT NULL,
    "num" INTEGER NOT NULL,
    "acType" TEXT NOT NULL DEFAULT '',
    "acReg" TEXT NOT NULL DEFAULT '',
    "commanderNum" TEXT NOT NULL DEFAULT '',
    "commander" TEXT NOT NULL DEFAULT '',
    "crew" TEXT NOT NULL DEFAULT '',
    "exerciseNum" TEXT NOT NULL DEFAULT '',
    "takeoffH" TEXT NOT NULL DEFAULT '',
    "takeoffM" TEXT NOT NULL DEFAULT '',
    "landingH" TEXT NOT NULL DEFAULT '',
    "landingM" TEXT NOT NULL DEFAULT '',
    "flightH" TEXT NOT NULL DEFAULT '',
    "flightM" TEXT NOT NULL DEFAULT '',
    "kmzTotalH" TEXT NOT NULL DEFAULT '-',
    "kmzTotalM" TEXT NOT NULL DEFAULT '-',
    "kmzCloudsH" TEXT NOT NULL DEFAULT '-',
    "kmzCloudsM" TEXT NOT NULL DEFAULT '-',
    "landingsCount" TEXT NOT NULL DEFAULT '1',
    "touchdownCount" TEXT NOT NULL DEFAULT '1',
    "closedCabinH" TEXT NOT NULL DEFAULT '-',
    "closedCabinM" TEXT NOT NULL DEFAULT '-',
    "weather" TEXT NOT NULL DEFAULT '-/-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chrono_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_flights" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "callSign" TEXT NOT NULL,
    "acType" TEXT NOT NULL,
    "acReg" TEXT NOT NULL,
    "timeOfDay" TEXT NOT NULL DEFAULT 'DAY',
    "leftSeatCrewId" TEXT,
    "leftSeatPos" TEXT NOT NULL DEFAULT 'КВС',
    "rightSeatCrewId" TEXT,
    "rightSeatPos" TEXT NOT NULL DEFAULT 'ВП',
    "landingSeatPos" TEXT,
    "attendantIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "engineerIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "technicianIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mechanicIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "leftSeatName" TEXT NOT NULL DEFAULT '',
    "rightSeatName" TEXT NOT NULL DEFAULT '',
    "attendantNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "engineerNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "technicianNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mechanicNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "exerciseNumber" TEXT,
    "takeoffDate" TEXT NOT NULL,
    "takeoffTime" TEXT NOT NULL,
    "landingDate" TEXT NOT NULL,
    "landingTime" TEXT NOT NULL,
    "totalTime" INTEGER NOT NULL DEFAULT 0,
    "closedCabinTime" INTEGER NOT NULL DEFAULT 0,
    "smuTotal" INTEGER NOT NULL DEFAULT 0,
    "smuClouds" INTEGER NOT NULL DEFAULT 0,
    "altMax" INTEGER,
    "altMin" INTEGER,
    "visibility" INTEGER,
    "cloudiness" INTEGER,
    "cloudTop" INTEGER,
    "cloudBase" INTEGER,
    "takeoffMinimum" BOOLEAN NOT NULL DEFAULT false,
    "approachRmsA" BOOLEAN NOT NULL DEFAULT false,
    "approachRmsD" BOOLEAN NOT NULL DEFAULT false,
    "approachRmsR" BOOLEAN NOT NULL DEFAULT false,
    "approachViz" BOOLEAN NOT NULL DEFAULT false,
    "approachCount" INTEGER NOT NULL DEFAULT 0,
    "landingsCount" INTEGER NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_flights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "crew_members_email_key" ON "crew_members"("email");

-- AddForeignKey
ALTER TABLE "chrono_day_logs" ADD CONSTRAINT "chrono_day_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chrono_rows" ADD CONSTRAINT "chrono_rows_dayLogId_fkey" FOREIGN KEY ("dayLogId") REFERENCES "chrono_day_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_flights" ADD CONSTRAINT "training_flights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
