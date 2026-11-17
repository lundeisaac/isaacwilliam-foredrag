# Gjenstående lanseringsarbeid – til Christer og Devin
Oppdatert 17. november 2026. Denne listen erstatter uavklarte statuspunkter i eldre overleveringer. Kontroller faktisk produksjon før punkter krysses av.

## Bekreftet av eieren
- [x] Isaac har logget inn i kontrollpanelet.
- [x] Google-app-passord er opprettet og lagt inn av drift.
- [x] Eieren har testet både kontaktskjema og booking med en virkelig e-postadresse og opplyser at begge fungerer, inkludert e-post.
- [x] Siste Om-/målgruppeoppdatering fra PR #7 er observert live.
- [x] Eieren har oppdatert priser direkte i dashboardet. Databasen er nå gjeldende innholdskilde for disse prisene.

Dette er eierbekreftelser og tidligere offentlige observasjoner, ikke en påstand om at backup eller alle produksjonskontroller er bestått.

## 1. Bevar dashboardendringene før videre utrulling
- [ ] Ta en fersk innholdseksport og kontroller faktisk pris-/tekstinnhold med Isaac.
- [ ] Ta konsistent sikkerhetskopi av SQLite og opplastinger med dokumentert metode. Behold vedvarende datamontering ved deploy/recreate.
- [ ] Ikke importer content/site.json eller eldre innholdsmigreringer over eierens nye priser. En merge eller kodeutrulling skal ikke nullstille databasen.
- [ ] Sammenlign offentlige innholdsendringer med GitHub hvis seed-/migreringsfiler skal oppdateres. Ikke legg bookingdata, kundeeksport, passord eller runtime-database i repoet.
- [ ] Dokumenter backupfrekvens, oppbevaring, tilgang og ansvarlig. Gjør en separat gjenopprettingsprøve uten å erstatte produksjonsdata.

## 2. Avslutt kontrollen av drift og sikkerhet
- [ ] Registrer faktisk deployed commit/image og bekreft at riktig main-versjon kjører.
- [ ] Kontroller HTTPS, sertifikat og www-videresending med sti og query-parametre bevart.
- [ ] Kontroller PUBLIC_ORIGIN=https://isaacwilliam.no i kjørende container, canonical-lenker og sitemap. Bruk ikke midlertidig FlowCreate-hostnavn i disse.
- [ ] Kontroller at eier-API-er krever autentisering, at eierinnlogging ikke caches/indekseres og at miljøfiler, database og opplastingsadministrasjon ikke eksponeres.
- [ ] Bekreft riktig proxyoppsett og klient-IP-håndtering før tillit til forwarded-headere.
- [ ] Kontroller e-postutboks og logger for feil etter de vellykkede testene. Tidligere bounce til test@example.org skyldtes en testadresse; det var ikke dokumentasjon på feil app-passord.
- [ ] Bekreft med eieren at begge testhenvendelsene finnes i dashboardet, og at Reply-To gir riktig svaradresse. Test kun eventuelle gjenstående deler; ikke gjenta tester som allerede er dokumentert.
- [ ] Rydd avtalte testhenvendelser og eventuelle testreservasjoner. Ikke slett ekte forespørsler.

## 3. Få endelig innholdsgodkjenning
- [ ] Be Isaac godkjenne faktisk live innhold, dashboardpriser, kontaktopplysninger og vilkår for oppdrag/fakturering. Ingen nettbetaling eller obligatoriske kundekontoer.
- [ ] Bekreft korrekt virksomhet/fakturautsteder og behandlingsansvarlig med Isaac.
- [ ] Drift bekrefter faktiske leverandører, hosting, lagring/sletting og sikkerhetskopier slik at personverninformasjonen stemmer med løsningen. Ikke anta at fjernet utkasttekst alene betyr at innholdet er korrekt.
- [ ] Test offentlig navigasjon og skjemaoppsett på mobil/desktop, tastatur og zoom, samt kollapsseksjoner, bilder og lenker fra foredrag til booking.

## 4. Åpne for søkemotorer etter godkjenning
Siste offentlige kontroll viste fortsatt robots.txt med Disallow: /. Dette må kontrolleres på nytt.
- [ ] Før åpning, kjør fra gjeldende kode: npm run audit:server -- https://isaacwilliam.no
- [ ] Be Isaac bekrefte at nettstedet kan åpnes for indeksering etter fullført kontroll.
- [ ] Sett ALLOW_INDEXING=true i privat serveroppsett. Gjenskap containeren hvis miljøet endres; docker restart laster ikke --env-file på nytt. Behold data og øvrig nødvendig konfigurasjon.
- [ ] Kjør: npm run audit:server -- https://isaacwilliam.no --live
- [ ] Bekreft at offentlige sider ikke har noindex, at robots tillater indeksering og viser korrekt sitemap, og at /min-side fortsatt er noindex.
- [ ] Rett eventuelle feil og kjør relevante kontroller igjen. Automatisert audit erstatter ikke innholdsgodkjenning, faktisk e-postlevering eller backup-/restoreprøve.

## Ferdigmelding
Noter bare ufølsomme resultater:
| Punkt | Resultat / dato |
| --- | --- |
| Deployed commit | Ikke bekreftet |
| Eierens priser bevart | Ikke bekreftet |
| Backup og separat restoreprøve | Ikke bekreftet |
| HTTPS / www / canonical / sitemap | Ikke bekreftet |
| Eierdata beskyttet | Ikke bekreftet |
| Testhenvendelser lagret / Reply-To kontrollert | Ikke bekreftet |
| Personvern og innhold godkjent av Isaac | Ikke bekreftet |
| ALLOW_INDEXING og live-audit | Ikke bekreftet |
| Ansvarlig for videre drift | Ikke bekreftet |

Denne PR-en dokumenterer resterende arbeid. Å merge den endrer ikke produksjonsmiljø, indeksering eller databaseinnhold.
