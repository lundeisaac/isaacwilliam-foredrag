# Profesjonell presentasjon av foredragene

## Direkte oppdatering fra gammel serverversjon – kontrollert 10. november

Bruk en fersk innholdseksport fra `/min-side` og behold originalen. Den eksisterende FlowCreate-teksten kan nå oppdateres i ett trinn:

```sh
node scripts/prepare-copy-update.mjs eksport.json gjennomgaatt-import.json from-main
```

`from-main` sammenligner med startinnholdet på main `5f554e30c28eca26b2a938fc9df588412dbe20f0`. Den lager bare en ny fil, endrer ikke server/databasen, og bevarer innstillinger og tilbakemeldinger. Kjøringen stopper hvis eieren har endret et berørt felt; gjennomgå slike forskjeller manuelt. Gjennomgå resultatet før import og ta full backup. Ved endringer etter eksport: bruk en ny eksport. Ikke kjør de eldre deloppdateringene før eller etter dette trinnet. Fremgangsmåten er testet mot main-innholdet og simulert på offentlig innhold fra den faktiske serveren, uten noen serverendring.

Den eldre sekvensen topics → professional → featured er ikke kompatibel med dagens eldste innhold og skal ikke kjøres blindt. For ny, isolert stagingdatabase er import ikke nødvendig; startinnholdet lastes inn automatisk.

Nettsiden bruker konsekvent tredjeperson om foredragsholderen. «Isaac William» brukes der avsender eller ansvar må være tydelig; ellers beskrives innholdet direkte. Arrangøren tiltales med «dere». Førsteperson beholdes i ekte sitater, foredragstitler med et publikumsperspektiv og samtykketekst der besøkende snakker på egne vegne.

Beskrivelsene skal gi svar på hva foredraget dekker og hvilken sammenheng det passer i. Unngå gjentakelser om «egne erfaringer», generelle løfter om forandring og påstander om ekspertise som ikke er dokumentert. Foredragsholderens bakgrunn forklares på om-siden. Relevant forskning og statistikk støtter formidlingen, mens formålet er forståelse, forebygging og læring. Ikke legg inn tall, forskningshenvisninger eller resultater som ikke er kontrollert.

## Oppdatering på eksisterende server

Den nyeste endringen viser seks temaområder og 14 utvalgte forslag, med tydelig adgang til andre temaer og opplegg for barn og ungdom. For en server med forrige profesjonelle tekst: bruk `node scripts/prepare-copy-update.mjs eksport.json ny-import.json featured`. Dette bruker `content/featured-selection-update.json`, inkludert nye oversikter og foredragsforslag. Se `FOREDRAGSKATALOG.md` for kontroll og import. Fremgangsmåten nedenfor beskriver den eldre språkoppdateringen og skal ikke kjøres ukritisk over nyere innhold.

Innhold i en eksisterende SQLite-database oppdateres ikke ved en kodeutrulling. Ikke slett databasen og ikke importer standardinnstillinger over eierens oppsett.

For dagens eldre main-versjon brukes den direkte `from-main`-oppdateringen øverst i dokumentet. De opprinnelige språk- og featured-filene beholdes for kjente mellomversjoner; de skal ikke kjedes over dagens eldre innhold.

De offentlig synlige tekstendringene er samlet i `content/professional-copy-update.json`. Denne inneholder bare offentlige nettsidetekster, ingen innstillinger eller bookingdata.
