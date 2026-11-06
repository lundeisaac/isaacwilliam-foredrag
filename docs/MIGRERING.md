# Inspeksjon og migrering – 6. november 2026

Original: `https://isaac-william-lunde-hwjdm5ba.durable.site/`.

Cloud Browser ble brukt til å åpne Hjem, Om, Foredragstemaer, Bestill foredrag, Kontakt, Priser & Tjenester, Ofte stilte spørsmål og Tilbakemeldinger. Tekst og bilder ble hentet fra gjengitt sideinnhold. Trekkspillene ble åpnet for å hente svarene. Farger, typografi og hovedoppsett ble undersøkt med skjermbilder og beregnede sidestiler. Alle 21 unike bilder er kopiert lokalt; kildene står i `original-assets.json`. Ingen innlogging i eller endring av Durable-editoren var nødvendig.

## Bevart design

Lys grå bakgrunn (#EFEFEF), nesten svart tekst, blå aksentknapper, Inter for brødtekst og hero-overskrifter, Playfair Display for øvrige store overskrifter, rektangulære knapper/kort, brede todelte innholdsseksjoner og de originale bakgrunnsbildene. Responsiv meny erstatter den tettpakkede desktopmenyen på mindre skjermer. Kort flyter over i færre kolonner, og skjemaer stables på mobil.

Det er ny, selvstendig kode. Det er ikke en kopi av Durable sin genererte applikasjonskode. De opprinnelige karusellene er erstattet av stabile, tilgjengelige kort og trekkspill uten automatisk bevegelse.

## Bevisste innholdsendringer

- Kontaktadressen er endret til `post@isaacwilliam.no`; planlagt domene er `isaacwilliam.no`.
- Gamle prislenker til `/pricing` går til `/pricing-and-services` i stedet. Den gamle personvernlenken pekte til forsiden; den er erstattet med en egen, foreløpig personvernside. Generisk «Terms of Service» som også pekte til forsiden, er ikke videreført som en falsk vilkårsside.
- Engelsk «Presentation range» er blitt «Varighet». Åpenbare skrivefeil i en liten prisoverskrift er rettet.
- Eieren bekreftet i samtalen at tilbakemeldingene er reelle og delt med samtykke til anonymisering. Engelske tekster er oversatt til norsk. Navn, stilling, arbeidssted og geografiske signaturer er fjernet. Gjentatte tilbakemeldinger er slått sammen til 13 unike tekster; ingen duplikater er omskrevet til nye påståtte kundeerfaringer. Fire av disse vises også på forsiden.
- Originalens svar til «Hvordan fungerer booking- og tilgjengelighetsprosessen?» lot seg ikke hente ferdig før nettleseren sluttet å svare. Dette ene svaret er en kort ny beskrivelse av den implementerte prosessen, merket i `content/site.json` med `migrationNote`.
- Innsendingsfeltene er utvidet med organisasjon, format, målgruppe, klokkeslett, sted og antall deltakere. Nye forespørsler blir aldri automatisk en bindende, bekreftet booking.
- Originalens medisinske/faglige påstander og biografitekst er overført som eierens nettstedstekst, ikke uavhengig faktasjekket. Ingen rådgivningsinnhold er lagt til.

## Gjenstående kontroll

Cloud Browser sluttet å svare etter kildeinspeksjonen. Desktop-/mobilkontroll og visuell sammenligning av erstatningen er derfor ikke fullført. Den lokale bildekontaktflaten ble gjennomgått for å verifisere de kopierte fotografiene og illustrasjonene. HTTP-tester og syntakskontroll er gjennomført, men de erstatter ikke visuell godkjenning.

Ingen DNS-endringer, ny offentlig produksjonsadresse eller sletting av originalen inngår i denne endringen. Bruk en separat testutrulling og følg `DRIFT.md` før domenebytte.
