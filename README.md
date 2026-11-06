# Isaac William Lunde – uavhengig foredragsnettsted

En selvstendig rekonstruksjon av den publiserte Durable-nettsiden, med norsk innholdsredigering og bookingadministrasjon. Planlagt domene er **isaacwilliam.no**, og kontaktadressen er **post@isaacwilliam.no**. Ingen DNS-poster er endret, og Durable-nettsiden er ikke endret eller slettet.

## Hva som finnes

- Alle åtte hovedsider: Hjem, Om, Foredragstemaer, Bestill foredrag, Kontakt, Priser & Tjenester, Ofte stilte spørsmål og Tilbakemeldinger.
- Tekst, 21 lokale bildeoriginaler og lokale Inter-/Playfair-skrifter fra det inspiserte designet. Bilder er optimalisert som WebP. Ingen Durable-kode, Durable API-er eller eksternt CMS kreves.
- Responsiv navigasjon, fleksible rutenett, tastaturbetjente trekkspill, tydelige skjemaetiketter og en personvernside.
- `/admin`: norsk redigerer for sidetekster, lenker, bilder, kort, spørsmål og anmeldelser. Bilder kan lastes opp direkte.
- Private booking-/kontaktforespørsler i SQLite; status, interne notater, pristilbud i hele NOK, søk og filtrering.
- Kalender med sperrede perioder og bekreftede bookinger. En bekreftet booking reserverer **hele datoen**, ikke bare klokkeslettet. Dato og klokkeslett gjelder norsk tid.
- Passordbeskyttet administrasjon, HttpOnly-økt, CSRF-kontroll, servervalidering, begrensning av innsendingsforsøk og personopplysninger utenfor GitHub.
- Innholdseksport og innholdshistorikk på serveren. Ulagrede endringer varsles i redigereren.

## Lokal kjøring / første test

Krever **Node.js 24 eller nyere**. Prosjektet har ingen npm-avhengigheter.

1. Kopier `.env.example` til `.env` og sett et unikt `ADMIN_PASSWORD` på minst 16 tegn.
2. For en lokal test: sett `NODE_ENV=development` og `PUBLIC_ORIGIN=http://localhost:3000`.
3. Kjør `npm start`, åpne `http://localhost:3000`, og logg inn på `/admin`.

For å prøve innsending må både `BOOKING_ENABLED=true` i servermiljøet og «Åpne skjemaene» i administrasjonens innstillinger være aktivert. Begge er av som standard. Bruk kun testopplysninger du kontrollerer. `npm test` prøver hele forløpet i en egen midlertidig database uten å påvirke driftsdata.

**Det sendes ikke automatiske e-postvarsler.** Nye henvendelser vises i administrasjonen. «Skriv e-post til arrangør» åpner e-postprogrammet med et utkast; du kontrollerer og sender selv. E-postkontoen `post@isaacwilliam.no` må opprettes og testes separat hos e-postleverandøren.

## Rediger selv

Åpne `/admin` og velg **Rediger innhold**. Velg side, åpne seksjonen, endre tekst eller bilde og trykk **Lagre innhold**. Endringen vises direkte uten Durable eller ny bygging.

Under **Innstillinger** kan navn, kontaktopplysninger og personverninformasjon endres. Innstillingene oppretter ikke e-postkontoer og endrer ikke DNS. Last ned en innholdseksport når du vil oppbevare en kopi i GitHub. Eksporten inneholder bare nettsideinnhold, ikke forespørsler eller økter.

`content/site.json` er det versjonerte startinnholdet. Det importeres **bare når databasen opprettes første gang**. Senere Git-pull eller utrulling overskriver ikke redigeringer du har gjort i administrasjonen. Ikke slett databasen for å oppdatere nettsidetekst.

## Drift på egen server

Dette er nå en Node-/SQLite-applikasjon, **ikke en Jekyll-side eller en ren GitHub Pages-side**. GitHub lagrer kildekoden. En server med vedvarende lagring og HTTPS kreves for bookingadministrasjonen.

Se [driftsveiledningen](docs/DRIFT.md) for Docker, sikkerhetskopiering, test og kontrollert domenebytte. Ikke flytt domenet før erstatningen er gjennomgått og godkjent. Ikke slett Durable-siden ved denne utrullingen.

## Validering og status

- `npm run check`: syntakskontroll av server og klientkode.
- `npm test`: HTTP-integrasjonstester for innhold, autentisering, CSRF, validering, lagring etter omstart, datoer, booking, kalender, personverngrenser og alle lokale bilder.
- GitHub Actions kjører kontrollene ved push og pull requests.
- Nettleseren ble brukt til å inspisere originalen, men sluttkontroll av erstatningen på desktop og mobil er **ikke fullført**: Cloud Browser sluttet å svare under arbeidet.
- Ingen produksjonsserver er valgt eller konfigurert i denne endringen. Det er ikke opprettet en offentlig erstatningsadresse.
- Innsending er stengt og søkeindeksering er blokkert som standard.
- Personverninformasjon og faktisk driftsleverandør må ferdigstilles før skjemaene åpnes.

Se [migreringsnotatene](docs/MIGRERING.md) for tekstendringer og avvik fra originalen.
