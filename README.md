# Frontend case – Kampanjeoversikt

Velkommen! Dette er en liten intern oversikt over annonsekampanjer, bygget med
Vite, React og TypeScript. Appen fungerer stort sett, men den har en håndfull
feil som har sneket seg inn.

**Oppgaven din er å finne og rette så mange av feilene du klarer, og forklare
underveis hva du gjør og hvorfor.**

Vi er mer interessert i hvordan du jobber og tenker enn i hvor mange feil du
rekker. Tenk høyt, still spørsmål, og si fra hvis noe er uklart.

## Kom i gang

Du trenger Node 20 eller nyere

```bash
npm install
npm run dev
```

Appen kjører på http://localhost:5173.

Andre nyttige kommandoer:

```bash
npm run typecheck   # TypeScript
npm run build       # produksjonsbygg
npm run format      # Prettier
```

## Framdriftspanelet

Øverst i appen ligger et panel som holder oversikt for deg.

- **To av feilene sjekker appen selv.** De huker seg av i det rettingen din
  virker – du trenger ikke gjøre noe. Sjekkene er bevisst romslige og godtar
  flere gyldige løsninger.
- **Fem av dem må du verifisere og huke av selv.** Disse kan ikke oppdages
  automatisk på en pålitelig måte. Hvert punkt har en kort instruks for hvordan
  du reproduserer feilen, og dermed hvordan du vet at den er borte.

Avkryssingen lagres i nettleseren, så den overlever en refresh. Panelet ligger i
`src/case/` og er stillaset rundt oppgaven, ikke en del av appen du skal
feilsøke – **du trenger ikke endre noe der.**

## Om appen

- All data kommer fra et mocket API i `src/api/mockApi.ts`. Det later som det er
  en server i andre enden, med ujevn responstid og en lagring som er ustabil.
  **Du skal ikke trenge å endre denne filen** – oppfør deg som om du ikke kan
  endre backend.
- Det er ingen tester i prosjektet, og ingen linter er satt opp. Du står fritt
  til å legge til det du selv ville hatt.

## Verktøy

Bruk hva du vil: din egen editor, debugger, React DevTools, dokumentasjon,
Google og AI-verktøy som Copilot, Cursor eller Claude.

Én av sakene er meldt fra en annen nettleser enn den du sannsynligvis utvikler
i. Det er verdt å lese hvor sakene kommer fra.
