# Frontend case – Kampanjeoversikt

Velkommen! Dette er en liten intern oversikt over annonsekampanjer, bygget med
Vite, React og TypeScript. Appen fungerer stort sett, men den har en håndfull
feil som har sneket seg inn.

**Oppgaven din er å finne og rette så mange av feilene du klarer, og forklare
underveis hva du gjør og hvorfor.**

Vi er mer interessert i hvordan du jobber og tenker enn i hvor mange feil du
rekker. Tenk høyt, still spørsmål, og si fra hvis noe er uklart.

## Kom i gang

Du trenger Node 20 eller nyere.

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
- **Fire av dem må du verifisere og huke av selv.** Disse kan ikke oppdages
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

## Feilene

Under er symptomene slik en bruker ville beskrevet dem – de samme seks som står
som saker i framdriftspanelet. Årsaken må du finne selv. Ta dem i den
rekkefølgen du synes er mest fornuftig, og prioriter gjerne høyt hvis tiden blir
knapp.

Merk at prioriteringene på lappene er satt av den som meldte saken. Du behøver
ikke være enig i dem.

1. **Søk gir feil treff.** Skriv `nyhet` i søkefeltet uten å stoppe mellom
   tegnene. Når du er ferdig å skrive viser lista helt andre kampanjer enn det du
   søkte på – ofte etter å ha vist det riktige treffet et kort øyeblikk. Skriver
   du påfallende sakte, ett tegn i sekundet, oppfører den seg riktig. Det er en
   del av symptomet.

2. **Avkrysning gjør ingenting.** Kryss av en kampanje i lista. Teksten over
   tabellen står fortsatt på «0 valgt · totalt budsjett 0 kr».

3. **Detaljpanelet henger igjen.** Klikk på en kampanje for å åpne panelet til
   høyre. Klikk deretter på en annen kampanje – panelet viser fortsatt den
   første.

4. **Lagring henger og feiler stille.** Åpne en kampanje og lagre et nytt
   budsjett to ganger. Serveren feiler på annenhver lagring, og da blir knappen
   stående på «Lagrer …» for alltid. Brukeren får aldri vite om lagringen gikk
   bra eller galt.

5. **«NaN %» i forbrukskolonnen.** Kampanjen «Ny app-lansering» viser `NaN %`
   under «Forbruk».

6. **Skjermleser mangler informasjon.** Søkefeltet har ingen ordentlig ledetekst,
   og statuskolonnen i tabellen formidler status utelukkende med farge.

## To saker som ikke er feilretting

Nederst i framdriftspanelet ligger to saker under «Krever en vurdering». De
teller ikke i framdriften, fordi det ikke nødvendigvis finnes en kodeendring som
løser dem.

- **ADWB-4508** – en salgssjef mener et tall er feil. Avgjør selv om han har
  rett. Konklusjonen er svaret her, ikke en commit.
- **ADWB-4512** – et krav fra en planlegger som legger en føring på hvordan du
  kan løse ADWB-4471. Les det før du bestemmer deg for en løsning der.

Disse to er de vi kommer til å snakke mest om etterpå.

## Verktøy

Bruk hva du vil: din egen editor, debugger, React DevTools, dokumentasjon,
Google og AI-verktøy som Copilot, Cursor eller Claude. Vi bruker det selv, og vi
forventer at du gjør det.

Men én regel gjelder uansett hvordan du kommer fram til en endring:

> **Du må kunne forsvare hver linje du leverer.**

Vi kommer til å plukke ut minst to av endringene dine og spørre hvorfor du løste
det slik, hva alternativene var, og hva som kunne gått galt. En fiks du ikke kan
forklare, er ikke en fiks vi kan stole på i produksjon.

Hvis du bruker et AI-verktøy, vil vi gjerne se hvordan – hva du spør om, og
hvordan du vurderer svaret du får tilbake. Det er en ferdighet vi er interessert
i på lik linje med å lese kode.

## Hva vi ser etter

- At du klarer å gå fra symptom til årsak på en systematisk måte
- At rettingen faktisk løser problemet, og ikke bare skjuler symptomet
- At du kan forklare hvorfor feilen oppstod
- At du sier fra når noe er en avveiing framfor et fasitsvar

## Til diskusjon hvis vi har tid

- Når en lagring går bra, oppdaterer ikke tabellen seg. Hvordan ville du løst
  det?
- Hvilke av disse feilene ville blitt fanget av tester? Hvilke tester ville du
  skrevet først?
- Hvordan ville du hindret at samme type feil kommer inn på nytt?
