# Siste samlet gjennomgang – 10. november 2026

## Konklusjon

Nyeste kildekode er klar for kontrollert serverstaging. Offentlig lansering er ikke godkjent: e-post fra app-serveren og faktisk innboksmottak må verifiseres, personvernteksten må fullføres, og hoveddomenet må nå riktig utrulling. Ingen DNS, Workspace-innstillinger, kundedata eller Durable-side er endret under denne kontrollen.

## Kandidaten som er kontrollert

- Seks temaområder og 14 utvalgte foredragsforslag. Barn, ungdom og voksne er tydelige målgrupper. Eget tema og tilpasset foredrag kan forespørres. Presentasjonen er i tredjeperson; erfaring og relevant forskning beskrives på om-siden.
- Valgfri fakturareferanse har forklaringen: «Hvis virksomheten krever en referanse på fakturaen, oppgi den her. Kan avklares senere.» Feltet peker på hjelpeteksten med aria-describedby. Ingen nettbetaling eller obligatorisk klientkonto.
- Alle åtte hovedsider, personvern og eierdemo kontrollert i nettleser ved 320, 390 og 768 px: 30 kontroller, én hovedoverskrift per side og ingen horisontal overflyt. Mobilmeny og Escape samt åpnet fakturaseksjon kontrollert. Eierdemoen bruker fiktive data, ikke serverens private henvendelser.
- Syntakskontroll, 19 automatiske tester og sju disponible produksjonskontroller bestått. Testene omfatter autentisering, CSRF, private API-er, innholdsredigering, bilder, bookinger, egne temaønsker, datoreservasjon, e-postkø, omstart og gjenoppretting.
- npm audit --omit=dev rapporterte null kjente sårbarheter ved kontrollen. Dette er ingen generell sikkerhetsgaranti.
- Docker er ikke tilgjengelig i dette arbeidsmiljøet; dagens kandidat er ikke bygget eller startet som Docker-container her. Tidligere Actions-kjøringer beviser ikke dagens kandidat.

## Eksisterende server

GitHub main var `5f554e30c28eca26b2a938fc9df588412dbe20f0` ved kontrollen. PR #2 er merget; den gamle Jekyll-versjonen ligger på taggen legacy-jekyll. FlowCreate-dokumentasjonen beskriver en eldre utrulling på `https://isaacwilliam.flowcreate.no`; driftsdokumentet er bevart i kandidaten.

Lesekontroll av denne HTTPS-adressen ga **50 beståtte og 10 feilede kontroller**. De ni offentlige sidene og lokale ressurser svarte, eier-API-er var beskyttet, private filer var ikke tilgjengelige og skjemaene var stengt. De feilede kontrollene gjaldt kanonisk adresse på ni sider samt sidekart. Dagens kandidat inneholder metadatarettingene som er kontrollert lokalt; de er ikke bekreftet utrullet på denne serveren. Ingen data ble skrevet og ingen e-post sendt.

`https://isaacwilliam.no` svarte HTTP 404 fra dette kontrollmiljøet. Verifiser den planlagte domenerutingen og riktig PUBLIC_ORIGIN på serveren før lansering. Ingen DNS-endring er utført her.

## E-post: post@isaacwilliam.no

Offentlig DNS-oppslag viste Google MX (`1 smtp.google.com`), SPF med include:_spf.google.com, publisert Google DKIM og DMARC med p=none. Navnetjenerne var fortsatt ns1.norgesdns.no og ns2.norgesdns.no. Disse oppslagene bekrefter publiserte poster, ikke levering, aktiv DKIM-signering eller autorisasjon av nettstedet.

Tilgjengelig Gmail-tilkobling tilhører en management-konto, ikke Workspace-postkassen. Lokalt er EMAIL_ENABLED av og ingen Google-senderhemmeligheter er konfigurert. Den eksisterende serverens driftsdokument oppgir også avslått e-post. Nåværende private SMTP-status og levering kan ikke verifiseres uten eiertilgang på serveren.

Før åpning må en autorisert administrator konfigurere Google-sending i serverens sikre miljø, kontrollere forbindelsen i eierpanelet og verifisere faktisk mottak av både varsel til post-adressen og kvittering til en kontrollert testadresse. Test også Reply-To og svar begge veier. Google-veiledning: https://knowledge.workspace.google.com/admin/gmail/send-email-from-a-printer-scanner-or-app . Ikke legg passord eller tokens i GitHub eller chat.

## GitHub og konkret leveranse

Alle siste endringer er samlet i lokal gren `staging/launch-review-20261110`, med siste main innflettet og FlowCreate-dokumentasjonen bevart. App-integrasjonens forsøk på å opprette staging-grenen ble avvist med HTTP 403 «Resource not accessible by integration». Git push-dry-run bekreftet også at terminalmiljøet mangler GitHub-skriveautentisering. Ingen opplasting eller ny PR er bekreftet.

Kildekodepakken inneholder derfor komplett kandidat og en samlet latest-staging.patch mot main-committen ovenfor. Den kan legges inn av en autorisert GitHub-bruker. Ikke bruk historiske delpatcher sammen med den samlede patchen. Se START-HERE.txt i pakken for kommandoer. Kundedata og hemmeligheter er utelatt.

## Før offentlig åpning

1. Legg kandidaten i GitHub og deploy den til kontrollert staging; kjør Actions/Docker og audit:server på den faktiske kandidaten.
2. Oppdater publiserbart innhold fra fersk eier-eksport etter FOREDRAGSKATALOG.md og TEKST-OG-TONE.md. Bevar SQLite og opplastede bilder; kodeutrulling erstatter ikke lagret innhold.
3. Fullfør virksomhets-/personvernopplysninger og verifiser reell e-postflyt, eierinnlogging, sikkerhetskopi og gjenoppretting på verten.
4. Rett hoveddomenets ruting og innhent endelig eiergodkjenning før skjemaer og indeksering åpnes. Behold originalen på Durable til overgangen er godkjent.

## Ny kontroll og rettet innholdsoppdatering – 10. november, kveld

GitHub main er fortsatt 5f554e3. Ny ekstern lesekontroll ga igjen 50 beståtte og 10 feilede kontroller, og både hoveddomene og www svarte 404. Ingen utrulling er utført.

Den tidligere oppdateringskjeden ga konflikter på den gamle serverens innhold. Nytt `from-main`-valg i prepare-copy-update.mjs løser oppdateringen direkte til dagens kandidat, uten å endre innstillinger eller tilbakemeldinger. Oppdateringen er idempotent, nekter å overskrive endrede eierfelt og skriver aldri til databasen. Den er verifisert mot main og simulert mot dagens offentlige serverinnhold. Syntakskontroll, 19 tester og sju disponible stagingkontroller bestod. Se FOREDRAGSKATALOG.md for eksport/gjennomgang/import.

Innholdsfil og patch i kildepakken er oppdatert. GitHub og faktisk server må fortsatt oppdateres av en autorisert operatør. E-postlevering, eierinnlogging på vert, backup på vert, personvern og domenebytte er fortsatt uavklarte lanseringspunkter.
