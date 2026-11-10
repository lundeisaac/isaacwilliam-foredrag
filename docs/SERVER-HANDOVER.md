# Til den som skal sette opp serveren

Dette gjelder **isaacwilliam.no**, ikke Heartfold Ink. Nettsiden er en Node 24 / SQLite-applikasjon i GitHub, med ett eierkontrollpanel og vanlige offentlige sider. Klienter sender forespørsel uten konto og følges opp på e-post. Ingen nettbetaling; oppdrag faktureres utenfor nettsiden.

## Aktuell stagingkandidat

Seneste innholds- og lanseringsrettinger samles på `staging/launch-review-20261110`. `main` har den tidligere appen. Se `LAUNCH-AUDIT.md` for bekreftet GitHub-status, før en eventuell ny checkout. Den eksisterende FlowCreate-instansen og dens lagring er beskrevet i `DRIFT-FLOWCREATE-WEB01.md`; bevar driftsdokumentet og databasen.

Ved oppdatering av en eksisterende database: følg `FOREDRAGSKATALOG.md` og `TEKST-OG-TONE.md`. Kodeutrulling alene endrer ikke innhold som allerede ligger i SQLite. Bruk sikkerhetskopi, fersk innholdseksport og gjennomgått import; ikke slett runtime.

## Hent riktig kildekode

Erstatningen er merget til `main` (PR #2, 2026-11-09). Den eldre Jekyll-løsningen er tilgjengelig som tag `legacy-jekyll`.

```sh
git clone https://github.com/lundeisaac/isaacwilliam-foredrag.git
cd isaacwilliam-foredrag
cp .env.example .env
```

Rediger `.env` privat på serveren. Sett et langt, unikt `ADMIN_PASSWORD` og korrekt `PUBLIC_ORIGIN` for staging-adressen, uten avsluttende skråstrek. Behold `NODE_ENV=production`, `ALLOW_INDEXING=false`, `EMAIL_ENABLED=false` og `CLIENT_PORTAL_ENABLED=false` ved første oppstart. Ikke kopier noen lokale testpassord eller legg `.env` i GitHub.

```sh
docker compose up -d --build
```

Compose eksponerer bare `127.0.0.1:3000`. Sett en HTTPS-reversproxy foran og bruk en staging-adresse dere kontrollerer. Det er foreløpig **ikke godkjent å endre DNS for isaacwilliam.no eller slette/endre Durable-siden**. En enkelt Node-prosess og lokal, vedvarende disk kreves. Databasen og bildeopplastinger ligger i Docker-volumet `website_data`.

Se også LAUNCH-AUDIT.md for gjenstående faktiske lanseringskrav. Proxyens klient-IP må settes opp etter DRIFT.md; ikke stol på besøkendes egne headere.

Se STAGING-SERVER.md for separate staging-/driftsmiljøer og kontroll av den faktiske HTTPS-adressen. Kildekodepakken kan brukes direkte dersom GitHub-skrivetilgangen ennå ikke er gjenopprettet.

## Test før åpning

- Logg inn som eier på `/min-side`. Klienter skal aldri få eierpassordet. Private API-er krever gyldig økt; skjult lenke alene er ikke tilgangsbeskyttelsen.
- Kontroller alle offentlige sider og at ingen kunde trenger en konto eller privat lenke.
- Sett opp Google Workspace-sending etter EMAIL.md. Kontaktadressen er **post@isaacwilliam.no**. Taylor opplyser at Workspace hører til eierens Google-konto; bruk den ved eventuell kontotilgang, men ikke anta at en personlig Gmail-tilkobling gir nettstedet rett til å sende som post-adressen.
- Bruk sikre serverinnstillinger for OAuth2, et tillatt Google-app-passord eller administratorgodkjent SMTP-relay. Ikke be om passord i chat eller legg hemmeligheter i kode.
- Fullfør personvern og virksomhetsopplysninger før reelle henvendelser åpnes.
- Åpne skjemaene **bare på staging** i servermiljø og dashboard, og send en kontrollert test med en adresse eieren disponerer. Kontroller varsel, kvittering, Reply-To, faktisk innboks, lagret forespørsel, bekreftet dato og redigering. Fjern testhenvendelsen etterpå.
- Opprett kryptert sikkerhetskopiering av hele datavolumet. Test gjenoppretting før lansering. Ikke legg kundeopplysninger i GitHub.

For lokale automatiske kontroller med Node 24:

```sh
npm ci --ignore-scripts
npm run check
npm test
npm run staging:check
```

Stagingkontrollen starter egne disponible produksjonsprosesser og sender ingen e-post. Den bruker simulerte origin-headere og erstatter ikke en ekte HTTPS-test på verten. GitHub Actions bygger også Docker-imaget og starter en disponibel container for helsesjekk og tilgangskontroll.

## Etter eierens godkjenning

Avtal domenebyttet særskilt med Taylor. Behold Durable som tilbakefallsalternativ til den nye siden er verifisert. Ikke opprett nettbetaling. E-postsvar leses i Google Workspace og importeres ikke automatisk i dashboardet. Se DRIFT.md, EMAIL.md og KONTROLLPANEL.md for detaljer.
