# Fra uavhengig nettsted til staging og lansering

Denne applikasjonen kjører på deres egen Node 24-/Docker-server. Durable, ChatGPT-innlogging og GitHub er ikke nødvendige for besøkende eller eierens daglige innholdsredigering. GitHub er kildekodelager; den delte gjennomgangssiden er en statisk designkopi og erstatter ikke app-serveren.

FlowCreate har dokumentert en eksisterende utrulling på `https://isaacwilliam.flowcreate.no`; se DRIFT-FLOWCREATE-WEB01.md. Denne generelle veiledningen utfører ingen utrulling eller DNS-endring. Bruk en egen testadresse verten disponerer; ikke pek isaacwilliam.no om før eierens godkjenning.

## 1. Kildekode og krav

Bruk hele applikasjonen, med package.json, server/, public/, content/ og compose.yml. `main` inneholder den tidligere rekonstruksjonen. Nyeste kandidat ligger i staging-grenen eller i kildekodepakken dersom GitHub-opplasting er blokkert; sjekk LAUNCH-AUDIT.md for bekreftet status. Kildekodepakken kan kjøres uten GitHub. Ikke bruk `legacy-jekyll`.

Verten trenger én Node 24-prosess eller Docker Compose, en vedvarende lokal disk og en HTTPS-reversproxy. Se DRIFT.md for proxyens klient-IP og sikkerhetskopiering. Ikke bruk flyktig/serverless disk til SQLite.

## 2. Isolert staging

I kildekodekatalogen:

```sh
cp .env.example .env.staging
```

Rediger .env.staging privat. Sett:

- APP_ENV_FILE=.env.staging
- APP_PORT=3001
- NODE_ENV=production
- PUBLIC_ORIGIN til den faktiske HTTPS-testadressen, uten avsluttende skråstrek
- ADMIN_PASSWORD til et langt, unikt passord for staging
- DATA_DIR=/app/runtime
- ALLOW_INDEXING=false, EMAIL_ENABLED=false og CLIENT_PORTAL_ENABLED=false
- BOOKING_ENABLED=false ved første oppstart

Start:

```sh
docker compose --env-file .env.staging -p isaacwilliam-staging up -d --build
```

Staging bruker port 127.0.0.1:3001 og et eget navngitt volum under prosjektet isaacwilliam-staging. Reversproxyen peker testadressen dit. App-porten skal ikke eksponeres direkte mot internett. Ikke del passord eller miljøfiler i chat/GitHub. Staging-adressen bør også beskyttes i proxyen når den ikke testes; noindex er ikke tilgangsbeskyttelse.

## 3. Kontroll på den faktiske serveren

Kjør med Node 24 fra en maskin som kan nå testadressen:

```sh
npm run audit:server -- https://DERES-STAGING-ADRESSE
```

Bytt eksempeladressen til den faktiske adressen. Kommandoen kontrollerer HTTPS-forbindelsen, alle offentlige sider, lokale ressurser, sidekart, indekseringssperre og beskyttelse av eierdata. Den logger ikke inn, sender ingen henvendelse og sender ingen e-post. HTTPS kontrolleres med vanlig sertifikatvalidering; sertifikatfeil skal ikke omgås. Proxybeskyttet staging må først åpnes for testmaskinen på kontrollert måte.

Fullfør deretter personvernteksten og aktiver BOOKING_ENABLED=true samt innstillingen «Åpne skjemaene» bare for kontrollerte tester. Test booking og kontaktmelding, kontrollpanel, datoreservasjon, innhold, opplasting, omstart og gjenoppretting. Bruk fiktive opplysninger og eierens egen testadresse.

Autoriser Google Workspace etter EMAIL.md før reell leveringsprøve. E-post skal ikke aktiveres på staging med virkelige kundeopplysninger. En SMTP-forbindelsestest beviser ikke at meldingen kommer i innboksen.

## 4. Overgang til drift etter godkjenning

Opprett separat .env og eget eierpassord for drift. Bruk APP_ENV_FILE=.env og APP_PORT=3000. Start med et annet prosjekt:

```sh
docker compose --env-file .env -p isaacwilliam-production up -d --build
```

Prosjektnavnet gir et eget datavolum. Flytt publiserbart innhold med kontrollert innholdseksport/import ved behov. Ikke kopier staging-databasen med testhenvendelser, testøkter eller passordoppsett til drift. Opprett og test driftsbackup før åpning.

Avklar korrekt fakturautsteder og ferdig personvern, test e-post og få eierens godkjenning. Planlegg deretter domenebytte særskilt, behold Durable som tilbakefallsalternativ, og bevar e-postens DNS-poster. Sett produksjonens PUBLIC_ORIGIN riktig og åpne skjemaer/indeksering etter avtale.

Etter godkjent åpning:

```sh
npm run audit:server -- https://isaacwilliam.no --live
```

Denne sluttkontrollen erstatter ikke manuell leveringstest, eierinnlogging eller kontroll av personvern og faktura. Ingen betaling skjer på nettsiden.
