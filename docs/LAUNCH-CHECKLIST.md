# Lanseringssjekkliste – isaacwilliam.no

Oppdatert 11. november 2026. Til Isaac William/Taylor og Christer/Devin.
Dette er gjeldende arbeidsordre. Eldre stagingrapporter er historikk, ikke dagens lanseringsstatus.

## Bekreftet status og åpne punkter

- [x] PR #3 og #4 er merget til main. Godkjent applikasjonsversjon: 258b66dfeab35edc7ae2d881c6c4adee231c3c1c (eller senere main med disse endringene).
- [x] GitHub-kontrollene for PR-ene bestod, inkludert 19 tester, sju disponible stagingkontroller, Docker-bygg og container-smoketest.
- [x] Hoveddomenet er observert tilgjengelig over HTTPS.
- [x] Eierinnlogging er observert på https://isaacwilliam.no/min-side. Siden er skjult fra offentlig meny med vilje.
- [x] Eier opplyser at Durable-nettsiden er slettet. Den er ikke lenger et tilgjengelig tilbakefallsalternativ.
- [ ] Nyeste kode og innhold er verifisert på faktisk produksjonsserver.
- [ ] Eier kan logge inn på hoveddomenet med riktig, separat eierpassord.
- [ ] Oppdatert personvern og virksomhetsinformasjon er publisert.
- [ ] Booking og kontaktskjema er aktivert og testet fra nettleser til dashboard.
- [ ] Google Workspace-varsler og kundekvitteringer er levert og kontrollert.
- [ ] Kanoniske URL-er, sidekart, www-videresending og indeksering er kontrollert.
- [ ] Backup/gjenoppretting er bekreftet på verten.

Siste fullførte lesekontroll av hoveddomenet ga 50 beståtte og 10 feilede kontroller (ni kanoniske adresser og sidekart). Eldre innhold, fem temaer og fra-pris 2 000 kr var fortsatt synlig. Begge skjemaer var stengt. Nyere endringer som Christer utfører må verifiseres på nytt; denne listen hevder ikke at hans nåværende arbeid er ferdig.

## 1. Sikre data og fastslå hva som kjører — Christer

- [ ] Inspiser faktisk container, image-ID, monteringer, port og Git-SHA. Historiske stier må bekreftes før kommandoer brukes.
- [ ] Ta konsistent backup av SQLite og opplastede bilder. Ved stopp–kopier–start: ta med hele runtime-katalogen, inklusive eventuelle WAL/SHM-filer. Ikke kopier bare en aktiv hovedfil.
- [ ] Behold tidligere fungerende image og miljøoppsett for rollback. Oppbevar hemmeligheter privat; skriv kun ufølsomme kontrollresultater i denne loggen.
- [ ] Bekreft at runtime fortsatt er vedvarende lokal disk med riktige eiere/rettigheter.

Bruk det eksisterende private driftsoppsettet for serverstier, nettverk og datamontering. Kontroller disse på verten før utrulling; ikke publiser infrastrukturen eller hemmeligheter i sjekklisten.

## 2. Deploy siste main og last inn miljøverdiene

- [ ] Hent origin/main uten å overskrive lokale endringer. Registrer full commit-SHA.
- [ ] Bygg Docker-image fra denne committen; behold image-tag/SHA for rollback.
- [ ] Sett PUBLIC_ORIGIN nøyaktig til https://isaacwilliam.no, uten avsluttende skråstrek, www eller /min-side.
- [ ] NODE_ENV=production og DATA_DIR=/app/runtime i containeren; behold samme korrekte datamontering.
- [ ] Gjenskap containeren med det nye imaget og eksisterende volum, miljøfil, nettverks- og restartoppsett.
- [ ] Kontroller containerhelse og at siden fortsatt svarer over HTTPS.

VIKTIG: docker restart leser ikke endrede verdier fra --env-file på nytt. Gjenskap containeren når PUBLIC_ORIGIN, ADMIN_PASSWORD, BOOKING_ENABLED eller e-postverdier endres. Ikke slett runtime, kjør volumfjerning eller bruk tom database som snarvei.

## 3. Få eierinnlogging til å fungere — Christer + Isaac

- [ ] Åpne https://isaacwilliam.no/min-side.
- [ ] Ved «Forespørselen må komme fra denne nettsiden»: sammenlign nettleserens Origin med PUBLIC_ORIGIN i den KJØRENDE containeren. Undersøk proxy hvis de fortsatt avviker. Ikke slå av origin-/CSRF-beskyttelsen.
- [ ] Ved «Feil passord»: bruk applikasjonens separate ADMIN_PASSWORD, ikke automatisk Gmail-, GitHub- eller Durable-passordet.
- [ ] Gi Isaac eierpassordet gjennom en privat, sikker kanal, eller hjelp ham å sette et nytt unikt passord på minst 16 tegn direkte i serverens miljøoppsett. Ikke legg det i chat, GitHub eller denne filen.
- [ ] Ved passordendring: gjenskap containeren, kontroller at gamle økter blir ugyldige og test ny innlogging.
- [ ] Verifiser innlogging, utlogging, innholdsredigering og tilgang til henvendelser. En synlig innloggingsside er ikke bevis på vellykket innlogging.

Isaac bør bokmerke /min-side. Offentlig publikum skal ikke få eierdata; klientene trenger ikke konto. Etter PUBLIC_ORIGIN-bytte skal eierinnlogging og innsending testes på hoveddomenet, ikke den midlertidige FlowCreate-adressen.

## 4. Oppdater lagret innhold — ikke bare kode

content/site.json importeres bare ved første databaseopprettelse. Kodeutrulling alene erstatter ikke gamle tekster/priser.

- [ ] Last ned en fersk innholdseksport fra dashboardet. Behold originalen og unngå parallelle innholdsredigeringer under oppdateringen.
- [ ] For dagens eldre femtema-innhold, forbered begge trinn fra siste main:

```sh
node scripts/prepare-copy-update.mjs eksport.json innhold-trinn1.json from-main
node scripts/prepare-copy-update.mjs innhold-trinn1.json innhold-til-gjennomgang.json prices-formats
```

Hvis PR #3-innholdet allerede er lastet inn, trengs bare prices-formats. Ved konflikt: stopp og gjennomgå eierendringene; ikke tving overskriving. Bruk nye filnavn og ny eksport hvis innhold er endret siden eksporten.

- [ ] Gjennomgå filen, importer via dashboardet og kontroller at innstillinger, anmeldelser og bilder er bevart. Ingen bookingdatabase skal erstattes.
- [ ] Verifiser seks temaområder og 14 lukkede foredragsforslag, tydelige tilbud til barn/ungdom/voksne, eget tema og tredjeperson i presentasjonsteksten.
- [ ] Verifiser priser: foredrag 3 000, workshop 5 000, seminar 6 000, fagdag 9 000, panel 1 500 kr; tilpasset etter avtale. Forside og FAQ skal samsvare.
- [ ] Verifiser seks lukkede formatforklaringer på prissiden og hjelpeteksten ved valgfri fakturareferanse.

Ingen nettbetaling. Tilbud, bekreftelse og fakturering avtales skriftlig. Foreslåtte foredrag er ikke påstander om ferdigproduserte eller mest bestilte presentasjoner.

## 5. Fullfør personvern og praktiske opplysninger — Isaac + drift

- [ ] Publiser korrekt behandlingsansvarlig/virksomhet, faktisk driftsleverandør, avklart behandlingsgrunnlag, konkrete lagrings- og sletterutiner og kontakt for rettighetsforespørsler.
- [ ] Erstatt teksten som sier at opplysningene skal avklares før åpning. Ikke finn på organisasjonsnummer, lagringstid eller avgiftsstatus.
- [ ] Bekreft fakturautsteder, reise/overnatting og hvordan oppdrag avtales og eventuelt avbestilles.
- [ ] Bekreft at kontaktinformasjon og beskrivelser av erfaring/kompetanse stemmer.

## 6. Autoriser og test post@isaacwilliam.no — Christer + Isaac

Vanlig sending/mottak i Workspace beviser ikke at app-serveren er autorisert.

- [ ] Følg EMAIL.md. Velg Google-app-passord dersom tillatt, OAuth2 eller administratorgodkjent Workspace-relay.
- [ ] Sett SMTP_USER=post@isaacwilliam.no og BOOKING_EMAIL_TO=post@isaacwilliam.no. Hold hemmeligheter i vertens sikre miljøoppsett.
- [ ] Aktiver EMAIL_ENABLED=true først når konfigurasjonen er komplett, og gjenskap containeren.
- [ ] Bruk «Kontroller Google-forbindelsen» i dashboardets e-postdel. Dette beviser bare forbindelsen, ikke levering.
- [ ] Send en avtalt testhenvendelse med adresse Isaac kontrollerer. Verifiser varsel i post-innboksen, kvittering hos testklienten, spammappe og Reply-To begge veier.
- [ ] Kontroller utboks og feilhåndtering. SMTP-aksept/«sendt» er ikke bevis på innbokslevering.

Kundesvar leses i Workspace; de importeres ikke automatisk i dashboardet. Bevar MX, SPF, DKIM, DMARC og Google-verifisering. Ikke endre DNS for å fikse eierpassord eller en deaktivert knapp.

## 7. Åpne og test booking og kontakt

Først etter punkt 3–6 og kontrollert klargjøring:

- [ ] Sett BOOKING_ENABLED=true i servermiljøet og gjenskap containeren.
- [ ] Aktiver «Åpne skjemaene» i dashboardets innstillinger. BEGGE brytere kreves for aktiv send-knapp.
- [ ] La CLIENT_PORTAL_ENABLED=false. Konto eller privat klientlenke skal ikke være obligatorisk.
- [ ] Test ett valgt foredrag, eget tema og én kontaktmelding. Bruk kun tydelige testopplysninger uten sensitivt innhold.
- [ ] Verifiser vellykket innsending, lagring i dashboard, varsel/kvittering, statusendring, notat og pristilbud. Ikke opprett ekte klientavtaler under testen.
- [ ] Test datotilgjengelighet og bekreftelse. Dagens modell reserverer hele datoen for bekreftede bookinger. Rydd testopplysninger og testreservasjon etterpå.
- [ ] Test at valideringsfeil kan rettes uten å miste hele meldingen og at feil ikke gir falsk mottaksbekreftelse.

## 8. Domene, design, tilgjengelighet og sikker drift

- [ ] https://isaacwilliam.no returnerer riktig nettsted med gyldig sertifikat.
- [ ] www videresender til hoveddomenet og bevarer stier og query-parametre.
- [ ] Alle åtte hovedsider og personvern laster; CSS, JavaScript, bilder og skrifter fungerer uten Durable.
- [ ] Test mobil og desktop, zoom, tastaturfokus, mobilmeny/Escape, tema- og formatåpning, skjemaetiketter og lesbare feilmeldinger.
- [ ] Kontroller at lenke fra foredrag velger riktig tittel i booking. Ingen kundekonto eller nettbetaling.
- [ ] Eier-API-er krever autentisering; miljøfiler, SQLite og interne testverktøy er ikke offentlig tilgjengelige.
- [ ] Verifiser konkret proxy-IP-oppsett før TRUST_PROXY aktiveres. Proxyen må overskrive X-Real-IP, og app-porten må bare være tilgjengelig fra kjent proxy. Ikke stol på vilkårlige forwarded-headere.
- [ ] Verifiser backupplan, separat gjenopprettingsprøve og hvem som følger opp feil og oppdateringer.

## 9. Sluttkontroll og åpning

Før søkeindeksering åpnes, kjør fra siste kildekode med Node 24:

```sh
npm run audit:server -- https://isaacwilliam.no
```

Denne kontrollen forventer noindex og skriver ingen data. Den erstatter ikke eierinnlogging, faktisk innsending eller e-postlevering.

- [ ] Isaac gjennomgår nettstedet og bekrefter at tilbud og innhold er riktig.
- [ ] Etter bestått leveringstest og godkjent åpning: sett ALLOW_INDEXING=true og gjenskap containeren.
- [ ] Kjør og oppnå grønt resultat:

```sh
npm run audit:server -- https://isaacwilliam.no --live
```

- [ ] Kontroller en avtalt testforespørsel etter endelig utrulling. Ingen ekte kunder skal brukes som testdata.
- [ ] Gi Isaac eieradressen, sikker tilgang og enkel rutine for nye henvendelser, e-postfeil og innholdsredigering.

## Ferdigmelding fra operatøren

Fyll inn uten hemmeligheter:

| Kontroll | Faktisk resultat |
| --- | --- |
| Dato/operatør | Ikke bekreftet |
| Deployed Git-SHA og image-ID | Ikke bekreftet |
| PUBLIC_ORIGIN i kjørende container | Ikke bekreftet |
| Backup og restore-test | Ikke bekreftet |
| Innholdsimport og seks temaer / nye priser | Ikke bekreftet |
| Isaac har logget inn på hoveddomenet | Ikke bekreftet |
| Booking og kontakt lagret i dashboard | Ikke bekreftet |
| Varsel og kvittering mottatt; Reply-To testet | Ikke bekreftet |
| Personvern og fakturautsteder gjennomgått | Ikke bekreftet |
| www, canonical, sitemap, mobil og tastatur | Ikke bekreftet |
| Endelig live-audit | Ikke bekreftet |
| Eierens lanseringsgodkjenning | Ikke bekreftet |

Ikke merk punkter som ferdige fordi de finnes i kildekoden eller bestod en lokal test. Bekreft dem på faktisk vert og hoveddomene. Hvis noe er blokkert: oppgi konkret tilgang eller informasjon som mangler, ansvarlig person og neste steg.
