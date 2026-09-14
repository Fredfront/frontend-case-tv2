import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

/**
 * Framdriftspanelet i `src/case/` kaller funksjoner fra appen for å avgjøre om
 * en feil er rettet. Med vanlig hot reload beholder panelet referanser til den
 * gamle versjonen av modulene, slik at et kort blir stående på «Åpen» selv om
 * rettingen er riktig. Vi laster derfor hele siden på nytt ved endringer, så
 * panelet alltid ser den koden som faktisk kjører.
 */
const fullReloadOnChange = (): Plugin => ({
  name: 'case-full-reload-on-change',
  handleHotUpdate({ server }) {
    server.hot.send({ type: 'full-reload' });
    return [];
  },
});

export default defineConfig({
  plugins: [react(), fullReloadOnChange()],
});
