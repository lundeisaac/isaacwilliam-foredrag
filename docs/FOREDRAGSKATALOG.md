# Utvalgte foredrag og vinklinger

## Direkte oppdatering fra gammel serverversjon – kontrollert 10. november

Bruk en fersk innholdseksport fra `/min-side` og behold originalen. Den eksisterende FlowCreate-teksten kan nå oppdateres i ett trinn:

```sh
node scripts/prepare-copy-update.mjs eksport.json gjennomgaatt-import.json from-main
```

`from-main` sammenligner med startinnholdet på main `5f554e30c28eca26b2a938fc9df588412dbe20f0`. Den lager bare en ny fil, endrer ikke server/databasen, og bevarer innstillinger og tilbakemeldinger. Kjøringen stopper hvis eieren har endret et berørt felt; gjennomgå slike forskjeller manuelt. Gjennomgå resultatet før import og ta full backup. Ved endringer etter eksport: bruk en ny eksport. Ikke kjør de eldre deloppdateringene før eller etter dette trinnet. Fremgangsmåten er testet mot main-innholdet og simulert på offentlig innhold fra den faktiske serveren, uten noen serverendring.

Den eldre sekvensen topics → professional → featured er ikke kompatibel med dagens eldste innhold og skal ikke kjøres blindt. For ny, isolert stagingdatabase er import ikke nødvendig; startinnholdet lastes inn automatisk.

Nettsiden viser 14 foredragsforslag innen seks temaområder. Utvalget viser bredde og gir arrangøren noe å ta utgangspunkt i. Det er ikke en fullstendig katalog eller en liste over de eneste tilgjengelige oppleggene. Ikke kall forslagene «mest populære» eller «mest bestilte» uten faktisk dokumentasjon.

Hver lukket rad viser tittel, forklaring og målgrupper. Klikk åpner en kort beskrivelse og bookinglenke. Titlene er utgangspunkt for presentasjoner; innhold, varighet og vinkling avklares med arrangøren. Andre ønsker sendes med «Eget tema / tilpasset foredrag» i bookingskjemaet. Ønsket innhold beskrives i meldingsfeltet og lagres sammen med forespørselen.

Tilbudet omfatter barn, ungdom og voksne. Innhold, språk og eksempler tilpasses alder og klassetrinn. Foredrag om selvskading og selvmordstanker krever særskilt avklarte rammer; det generelle ungdomstilbudet gjør ikke alle sensitive opplegg egnet for alle aldre.

«Kropp, selvbilde og identitet» er sjette område. Spiseforstyrrelser og kroppspress har et eget forslag. Kjønnsidentitet, det å være trans og tilhørighet har et annet. Disse beskrives som forskjellige vinklinger.

## Redigering i kontrollpanelet

Velg **Rediger nettsiden → Foredragstemaer**. Tittel, kort forklaring, beskrivelse og målgruppe kan endres, og forslag legges til eller fjernes. Bookinglisten bygges fra samme innhold. En intern stabil ID bevarer bookinglenken ved tittelendring; ikke endre ID-er manuelt.

## Eksisterende server med SQLite-innhold

Kodeutrulling endrer ikke automatisk databaseinnholdet. Ikke slett databasen eller importer standardinnstillinger over driftsoppsettet. Bruk en fersk eier-eksport og behold originalen.

For en server med forrige profesjonelle tekst og 12 foredrag: kjør `node scripts/prepare-copy-update.mjs eksport.json ny-import.json featured`. Kontroller resultatet og importer via kontrollpanelet. Bare avtalte offentlige innholdsfelt oppdateres. Innstillinger, bilder og tilbakemeldinger beholdes. Egne endringer i de samme feltene gir konflikt og stopper filskrivingen. Bookingdata endres ikke.

For dagens eldre FlowCreate-innhold: bruk `from-main` som beskrevet øverst. `prepare-topics-update.mjs` er et historisk verktøy som bare bytter temasiden; det er ikke en komplett oppgradering.

Etter import: kontroller seks temaområder, 14 lukkede forslag, alderstilpassede målgrupper og både valg av foredrag og forespørsel om eget tema i booking. Første gangs installasjon bruker dette innholdet fra `content/site.json`.
