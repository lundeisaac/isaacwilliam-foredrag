# Klar for kontrollert staging – ikke offentlig lansering

Oppdatert 10. november 2026. Se LAUNCH-AUDIT.md for kontrollresultater og konkrete begrensninger.

Kandidaten har seks temaområder, 14 utvalgte foredragsforslag, egne temaønsker og innhold for barn, ungdom og voksne. Norsk tredjeperson, 13 anonymiserte tilbakemeldinger, originale lokale bilder, eierstyrt innhold og bookingadministrasjon er beholdt. Fakturareferansen er valgfri og forklart. Betaling skjer med ekstern faktura.

18 tester, sju produksjonskontroller og 30 responsive nettleserkontroller er bestått. Private data krever eierøkt. Ingen ekte e-post er sendt; nettstedets Google-autorisasjon er ikke verifisert. Hoveddomenet svarte 404 fra kontrollmiljøet. Den eksisterende FlowCreate-versjonen har mangler i kanoniske adresser og sidekart og trenger ny utrulling.

PR #2 er merget til main; legacy-jekyll bevarer den gamle siden. Nyeste kandidat er samlet lokalt på staging/launch-review-20261110 med main innflettet. Opplasting er blokkert av GitHub-integrasjonens 403 og manglende terminalautentisering. Kildekodepakken med samlet patch er alternativ leveranse til en autorisert GitHub-bruker.

Før lansering: publiser kandidaten i GitHub og på faktisk staging, test Google-varsel og klientkvittering i innboks, fullfør personvern og korrekt fakturautsteder, kontroller eierinnlogging og backup, rett domeneruting og få eiergodkjenning. Ingen DNS, e-postkonfigurasjon eller originalside er endret her.
