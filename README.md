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

- Node.js 22.13 eller senare i Node 22-serien, samt npm (krävs av Expo SDK 58)
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

Projektet använder **Expo SDK 58**. Expo Go på telefonen måste stödja samma SDK-version.

Efter en SDK-uppdatering: stoppa den gamla Expo-servern med `Ctrl+C` och starta med tömd cache:

```bash
npx expo start --clear
```

Om port 8081 redan används kan en tidigare Expo-server fortfarande vara igång. Stoppa den i dess terminal med `Ctrl+C`, eller välj en annan port när Expo frågar. Skanna alltid QR-koden från den server som du just startat.

### Kontrollera paket efter en uppdatering

```bash
npx expo install --check
npx expo-doctor
npm run lint
npx tsc --noEmit
```

Om Expo Go visar `Project is incompatible with this version of Expo Go` behöver projektets SDK-version och Expo Go-versionen matchas. En patchuppdatering inom SDK 57 löser inte en konflikt med SDK 58. Följ [Expos uppgraderingsguide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/) vid framtida SDK-uppgraderingar.

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

## Gränssnitt och återkoppling

Första gången visas en välkomstsida med **Skapa konto** och **Logga in**. Efter inloggning visas bara kontots egna ansökningar och bilder. **Logga ut** finns i översikten och avslutar den aktuella sessionen.

På iOS och Android sparas sessionstoken i **Expo SecureStore**, inte lösenordet. En giltig session återställs när appen öppnas igen och gäller i högst 30 dagar. Skyddade sidor kräver inloggning även när de öppnas via en direktlänk. Bilder som tillhör API:t hämtas med samma inloggning.

Backend behöver den nya kontomigrationen (`dotnet ef database update`). Äldre ansökningar bevaras utan ägare tills ett konto har skapats och en lokal operatör kopplar dem enligt backendens README. De tilldelas aldrig automatiskt till den första registreringen.

Välj ett nytt lösenord för ditt JobTrack-konto. Registreringen kopplar inte automatiskt Gmail eller skolans Outlook; mejlverifiering, lösenordsåterställning och mejlimport kommer i nästa etapper.

Appen använder samma midnattsblå grund och kopparfärgade accent och neutrala ytor som webben. Statusfärgerna har tydliga textetiketter. Mobilens bakgrund, formulär och texter följer telefonens ljusa eller mörka läge. Gemensamma ikoner ritas direkt med React Native-vyer och behöver inga nya externa bibliotek.

Översikt, Jobbansökningar och Statistik har fast bottennavigation som ligger kvar när innehållet rullas. Konto och utloggning finns i det kompakta sidhuvudet. Plusknappen på översikten öppnar en ny ansökan direkt.

Jobblistan kan sökas på företag, tjänst eller plats och filtreras efter status. Ett tomt sökresultat har **Rensa filter**. När en ny ansökan skapas från listan återställs filtren så att den nya posten kan visas. Dra ned för att uppdatera på telefonens översikt, jobblista och statistiksida. Kontrollera draggesten och större textstorlek på en fysisk telefon inför demo.

- Statistik visas med `—` innan data har hämtats, i stället för missvisande nollor.
- Laddning, tom lista och anslutningsfel har separata vyer. Vid anslutningsfel går det att försöka igen.
- Lyckade sparningar visas som en stängbar bekräftelse som följer med tillbaka till listan eller detaljsidan.
- Sparfel behåller formulärdata och visar valideringsmeddelanden från API:t.
- Formulärfält har tillgänglighetsnamn. Statusval visar både färg, text och valt läge.
- Detaljsidan hämtar den valda ansökan via `GET /api/JobApplications/{id}`.
- På detaljsidan finns **Radera ansökan**, med bekräftelse och möjlighet att avbryta.
- Vid redigering kan du behålla, byta eller ta bort bilden. Bildändringen sparas med **Spara ändringar**. Även vid skapande kan en vald bild tas bort innan du sparar.
- Ett tomt ansökningsdatum accepteras, precis som i webben och API:t.

Kontrollera före en demo på en fysisk telefon: ljust och mörkt läge, större textstorlek, tangentbordet i formulären, sparfel med bevarade uppgifter och bekräftelsen efter en lyckad sparning.

## Statistik på startsidan

Översikten visar fyra små räknare (totalt, ansökta, intervjuer och erbjudanden), **Behöver din uppmärksamhet** (dagens och passerade datum, äldst först) och **Kommande händelser** (framtida datum, närmast först). Varje lista visar först tre händelser och kan utökas. Endast deadlines för intresserade jobb och uppföljningar för ansökta jobb/intervjuer tas med. Avslag, erbjudanden och ogiltiga eller saknade datum ger inga händelser.

Tryck på en händelse för att öppna rätt ansökans detaljsida. Jobbansökningslistan ligger kvar på sin separata sida. Grupperna uppdateras när dagen byts eller du återvänder till översikten. Uppgifterna hämtas via kontots befintliga API; ingen ny databas-migration behövs.

Testa grupperingen med `node --experimental-strip-types --test tests/upcoming-events.test.mjs`.

Om ansökningsdatum är ifyllt får uppföljningsdatum inte ligga före det. Formuläret visar ett fel före sparning och behåller dina uppgifter. Samma dag eller senare tillåts, även efter sista ansökningsdag. Jämförelsen görs inte för intresserade jobb, som saknar sparat ansökningsdatum.

I listan och på detaljsidan visas datummarkeringar: deadlines för **Intresserad**, uppföljningar för **Ansökt** och **Intervju**. Datum inom tre dagar markeras, och förfallna datum samt dagens datum får tydligare färg och text. **Erbjudande** och **Avslag** visar sparade datum utan aktiva uppmaningar. Töm eller flytta uppföljningsdatumet när uppföljningen är klar. Markeringarna uppdateras vid midnatt och när du återvänder till appen eller sidan.

Testa reglerna med `node --experimental-strip-types --test tests/planning-notices.test.mjs`. Det här är markeringar inne i appen; bakgrundsnotiser kommer senare.

När du skapar eller redigerar ett jobb kan du ange **Sista ansökningsdag** och **Uppföljningsdatum** som `YYYY-MM-DD`. Fälten är valfria och fungerar även för intresserade jobb. Töm ett fält och spara för att ta bort datumet. Sparade datum visas i listan och på detaljsidan. Backend behöver migrationen `AddApplicationPlanningDates`. Schemalagda notiser kommer i ett senare delsteg.

Efter inloggning öppnas den korta **Översikt**. **Jobbansökningar** är en separat sida med lista och möjlighet att lägga till, visa, redigera och radera jobb. **Statistik** är en egen skyddad sida för alla statusräknare och månadsdiagrammet. Växla med bottennavigationen. Sidhuvudet och händelsekorten är kompaktare på mobilen. Efter att en ny ansökan sparats eller en ansökan raderats visas listan igen.

Statistiksidan visar totalt antal jobb, alla fem nuvarande statusar och ett månadsdiagram för innevarande månad och fem månader bakåt. Diagrammet använder ansökningsdatum, även om status senare ändras. Intresserade jobb räknas inte som skickade ansökningar.

Saknade eller ogiltiga datum samt framtida datum redovisas separat utanför diagrammet. Dessa jobb finns fortfarande med i statusräknarna. Statistiken uppdateras när startsidan åter får fokus efter att du skapat, redigerat eller raderat en ansökan. Den stöder ljust och mörkt tema och visar siffror tillsammans med diagrammets staplar.

Kontrollera datumberäkningarna med Node.js 22.20 eller senare:

```bash
node --experimental-strip-types --test tests/application-statistics.test.mjs
```

## Relaterade projekt

**Mejlkonton** öppnas via länken i sidhuvudet och kräver inloggning. Samma Gmail-kopplingar som i webbappen visas och kan kopplas från efter bekräftelse. Börja Google-anslutningen i datorns webbapp enligt API-repositoryts `docs/GMAIL_SETUP.md`. Detta delsteg importerar ännu inga mejl och ansluter inte Outlook.

Applikationen består av tre delar:

- Webb: https://github.com/TSOLER89/job-application-tracker
- Backend: https://github.com/TSOLER89/job-application-tracker-api
- Mobil: https://github.com/TSOLER89/job-application-tracker-mobile

Webb- och mobilapplikationen använder samma ASP.NET Web API och samma data.
