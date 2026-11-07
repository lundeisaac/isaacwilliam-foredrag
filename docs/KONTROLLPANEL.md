# Drift fra kontrollpanelet

Eierens adresse på serverversjonen er `/min-side`. Bokmerk den. Bare innlogget eier kan hente private opplysninger og endre nettstedet. Offentlige menyer viser ikke administrasjonslenken.

## Arbeidsflyt uten e-post

1. Arrangøren sender en uforpliktende forespørsel uten å opprette konto.
2. Kvitteringen viser en unik, privat lenke til `/foresporsel`. Arrangøren må lagre lenken. Alle med lenken kan lese og skrive i denne ene samtalen.
3. Åpne **Forespørsler** i kontrollpanelet. Les behov, dato og meldinger, og skriv svar under **Dialog på forespørselssiden**.
4. Arrangøren sjekker sin lagrede side og kan svare der. Begge parter oppdaterer siden for å se nye meldinger. Ingen e-post eller SMS sendes automatisk.
5. Marker klientmeldinger som lest. Oppdater status, interne notater og honorar etter behov. En bekreftet booking reserverer datoen i kalenderen.

Interne notater og honorarfelt deles ikke på arrangørsiden. Skriv tilbud, avtaler og vilkår i en melding når de skal deles. En statusendring sender ingen melding. Faktura opprettes og håndteres utenfor nettstedet; ingen betaling trekkes på nettsiden.

## Innhold og kalender

**Rediger innhold** endrer sidetekster, temaer, priser, anmeldelser, lenker og bilder. **Kalender** viser bekreftede oppdrag og lar deg sperre perioder. **Innstillinger** har kontaktinformasjon, personvern, åpning av skjemaer og innholdseksport. Endring av e-postfeltet oppretter ikke et postmottak.

## Tilgang og lagring

Klientlenken består av et kryptografisk tilfeldig token på 256 bit. Bare SHA-256-hashen lagres i databasen. Tokenet er i URL-fragmentet, ikke i spørringen eller serverens URL-logger; siden har ingen tredjepartsressurser og bruker `no-referrer`. API-kall bruker Bearer-header. Lenken gjelder i 180 dager. Dette er en tilgangsperiode, ikke en automatisk slettingsfrist for opplysningene.

Hvis en arrangør mister lenken: avklar kontaktpersonens identitet direkte, lag en ny lenke under forespørselens tilgangsseksjon og del den privat. Gammel lenke tilbakekalles. Det finnes ingen offentlig oppslagstjeneste med navn, e-post eller bookingreferanse. Sletting av forespørselen sletter også samtale og tilgang fra aktiv database. Sikkerhetskopier må følge avklart lagringsrutine.

Databasen og opplastinger må ha vedvarende lagring, HTTPS og sikkerhetskopiering før åpning. Fullfør personverninformasjonen. E-post er ikke en teknisk forutsetning for meldingene, men uten varsler må både du og arrangørene aktivt følge opp sidene. Ingen automatiske løfter om svartid gis.

## Gjennomgangskopien

`/kontrollpanel-demo` bruker den samme administrasjonsvisningen med en egen adapter og tydelig fiktive data. Du kan prøve faner, svar, status, kalender og innholdsredigering. Bare minnet i den åpne siden endres; oppdatering tilbakestiller demoen. Den separate `/foresporsel-demo` illustrerer klientens side og er ikke koblet til eierdemoen. Private tilgangslenker og bildeopplasting krever serverversjonen.

Den statiske gjennomgangskopien tar ikke imot ekte henvendelser. Den fullstendige Node/SQLite-versjonen ligger i GitHub og må driftes før ekte data kan mottas. Gjennomgangskopi kan bygges fra samme kode med `node scripts/export-review.mjs /absolutt/utdatamappe`.
