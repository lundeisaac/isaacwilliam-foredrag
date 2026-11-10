# Oppdaterte priser og formatforklaringer

Godkjent av eier 10. november 2026. Fra-priser: foredrag 3 000 kr, workshop 5 000 kr, seminar 6 000 kr, fagdag 9 000 kr og panelsamtale 1 500 kr. Tilpasset opplegg prises etter avtale. Betaling skjer med faktura utenfor nettsiden. Reise, eventuell overnatting, eventuell avgift og totalpris avklares i skriftlig tilbud.

Prissiden har seks lukkede forklaringer om gjennomføring, deltakelse, eksempler og praktiske avklaringer. Eksemplene er forslag til opplegg, ikke påstander om tidligere oppdrag. Bilder er beholdt etter eierens ønske.

## Eksisterende database

Kodeutrulling oppdaterer ikke databaseinnhold. Last ned en fersk innholdseksport fra /min-side og ta full backup. For innhold fra PR #3, kjør:

```sh
node scripts/prepare-copy-update.mjs eksport.json ny-import.json prices-formats
```

Gjennomgå resultatet før import via kontrollpanelet. Innstillinger og anmeldelser beholdes; egne endringer på de tre berørte sidene stopper oppdateringen og krever manuell gjennomgang. Ikke importer gammel eksport over nyere redigeringer.

Fra serverens enda eldre main-versjon: forbered først `from-main`, deretter `prices-formats` på den resulterende filen, og gjennomgå samlet før import. En ny tom database bruker nyeste content/site.json direkte.

## Til serverchatten

Hent siste godkjente main i lundeisaac/isaacwilliam-foredrag. Deploy først separat staging etter docs/STAGING-SERVER.md. Bevar eksisterende data og bilder. Gjennomfør innholdsoppdateringen ovenfor dersom staging bruker eksisterende innhold. Kontroller de fem prisene på prissiden, 3 000 kr på forside og FAQ, og seks lukkede formatforklaringer. Kjør audit:server mot den faktiske HTTPS-testadressen. Ikke endre DNS eller åpne offentlig booking/indeksering før eiergodkjenning.
