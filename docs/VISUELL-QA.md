# Visuell kontroll – 6. november 2026

Kontrollen ble gjentatt i Cloud Browser etter at nettleseren fungerte igjen.

## Gjennomført

- De åtte offentlige sidene ble åpnet og inspisert på desktop (1363 CSS-piksler).
- Hjem, Om, Temaer, Booking, Kontakt, Priser, FAQ, Tilbakemeldinger og inngangen til kontrollpanelet ble kontrollert i 320, 390 og 768 CSS-pikslers rammer. Samme sjekk ble gjort for kontrollpanelets oversiktslayout med eksplisitt merkede testdata. Alle 30 kombinasjoner var uten horisontal dokumentoverflyt etter retting.
- Mobilmenyen ble åpnet, og en lenke i menyen ble brukt til å navigere. Tematrekkspill ble åpnet og innholdet kontrollert.
- Alle offentlige desktop-sider hadde én hovedoverskrift og ingen feil i ferdiglastede bilder ved kontrollen.
- Kontrollpanelets innloggingsside viser ingen private opplysninger. Oversiktens prioriteringer og beregninger er enhetstestet. Autoriserte og uautoriserte kall er kontrollert i HTTP-integrasjonstestene.
- Alle fire automatiserte tester og syntakskontrollen passerer.

## Rettet ved kontrollen

- Skriftfilene var statiske svarte vekter, feilaktig deklarert som variable. De er erstattet med ekte variable Inter- og Playfair-filer med normal standardvekt.
- Dupliserte numre i trekkspilloverskrifter er fjernet.
- Importøren hadde koblet flere trekkspill til feil tekst. Alle 16 tematiske erfarings-/temaelementer er koblet til de opprinnelige, distinkte svarene fra nettleserinspeksjonen. Regresjonstest dekker dette.
- Seksjonsklasser kolliderte med kort-, sitat- og statistikkrutenettene. Seksjonene har nå egne klassenavn.
- Lange norske ord, flexelementer og skjemafelt fikk enkelte smale visninger til å flyte over. Innhold kan nå brytes og krympes innenfor riktig kolonne.
- Skjulte kontroller følger nå `hidden` også når de har knappestil.
- Det siste originale FAQ-svaret er hentet fra Durable og lagt inn.

## Omfang og begrensninger

Telefon-/nettbrettkontrollene brukte ekte separate visningsrammer i nettleseren, ikke fysiske telefoner eller Safari. En avsluttende kontroll på eierens egne enheter anbefales før offentlig godkjenning. Kontrollpanelets visuelle skjermbilde bruker fiktive testdata; det er ikke et bilde av private kundehenvendelser. Endepunktene `/__qa/*` er bare tilgjengelige når `VISUAL_QA=true` og miljøet ikke er produksjon. Ingen slik tilgang gis i produksjon.

Skjermbilder: `screenshots/dashboard-testdata.jpg` og `screenshots/mobile-booking.jpg`.

Ingen DNS-poster eller innhold hos Durable er endret. Produksjonshosting, e-postkonto og endelig personverntekst er fortsatt separate oppsettspunkter.
