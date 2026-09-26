# Job Application Tracker Mobile

Mobilversionen av **Job Application Tracker**, byggd med React Native och Expo.

Appen använder samma ASP.NET Web API som webbversionen och gör det möjligt att hantera jobbansökningar direkt från mobilen.

## Funktioner

- Visa alla jobbansökningar
- Visa detaljer för en jobbansökan
- Skapa en ny jobbansökan
- Redigera en befintlig jobbansökan
- Ladda upp och visa bilder
- Navigera mellan olika skärmar
- Visa olika statusar för en ansökan
- Mobilanpassat gränssnitt

## Teknik

Projektet använder bland annat:

- React Native
- Expo
- Expo Router
- TypeScript
- Expo Image Picker
- Expo File System
- REST API
- ASP.NET Web API som backend

## Förutsättningar

För att köra mobilappen behövs:

- Node.js och npm
- Expo Go på mobilen eller en emulator
- Backend-projektet igång
- Datorn och mobilen på samma nätverk om Expo Go används på en fysisk mobil

## Installation

Klona projektet och installera dependencies:

```bash
npm install
```

## Backend

Mobilappen använder samma backend som webbapplikationen.

Starta backend så att den går att nå från mobilen:

```bash
dotnet run --urls "http://0.0.0.0:5250"
```

Backend kör då på port 5250.

## Environment variable

Mobilappen använder en environment variable för adressen till backend.

Skapa en fil som heter `.env` i projektets rot.

Lägg sedan till:

```env
EXPO_PUBLIC_API_BASE_URL=http://DIN-IP-ADRESS:5250
```

Exempel:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.0.4:5250
```

Byt ut IP-adressen mot IP-adressen till datorn där backend körs.

Telefonen och datorn behöver vara anslutna till samma nätverk när Expo Go används på en fysisk mobil.

## Starta appen

Starta Expo med:

```bash
npx expo start
```

En QR-kod visas i terminalen.

Öppna **Expo Go** på mobilen och skanna QR-koden för att starta appen.

## Projektstruktur

Några av de viktigaste filerna är:

### Startsida

`src/app/index.tsx`

Hämtar och visar alla jobbansökningar.

### Detaljsida

`src/app/application/[id].tsx`

Visar detaljer för en vald jobbansökan.

### Ny ansökan

`src/app/application/new.tsx`

Formulär för att skapa en ny jobbansökan.

### Redigera ansökan

`src/app/application/edit.tsx`

Formulär för att redigera en befintlig jobbansökan.

## API

Mobilappen kommunicerar med samma REST API som webbapplikationen.

### Hämta jobbansökningar

`GET /api/JobApplications`

### Skapa jobbansökan

`POST /api/JobApplications`

### Uppdatera jobbansökan

`PUT /api/JobApplications/{id}`

### Ladda upp bild

`POST /api/JobApplications/uploadimage`

## Bildhantering

Användaren kan välja en bild från mobilen.

Bilden laddas först upp till backend och därefter sparas bildens URL tillsammans med jobbansökan.

## Relaterade projekt

Applikationen består av tre delar:

- Webb: https://github.com/TSOLER89/job-application-tracker
- Backend: https://github.com/TSOLER89/job-application-tracker-api
- Mobil: https://github.com/TSOLER89/job-application-tracker-mobile

Webb- och mobilapplikationen använder samma ASP.NET Web API och samma data.
