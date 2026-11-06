# IsaacWilliam.no – foredrag

Dette er et første utkast til en **norskspråklig** nettside for foredrag og bookingforespørsler. Det er ikke en ferdig publisert nettside.

## Status

- [x] Grunnstruktur og responsivt design
- [x] Norske tekster og tydelig merking av innhold som mangler
- [x] Bookingforespørsel med relevante felter
- [ ] Faktiske foredragstitler, beskrivelser og målgrupper
- [ ] Godkjent biografi og eventuelle bilder
- [ ] Velge/aktivere skjemamottak
- [ ] Fullføre personvernerklæring og teste databehandling
- [ ] Teste, konfigurere hosting, SSL og domenet isaacwilliam.no
- [ ] Fjerne `noindex` når nettsiden er lanseringsklar

## Filoversikt

- `index.html` – forside med seksjonene Hjem, Foredrag, Om og Kontakt
- `booking.html` – bookingforespørsel
- `personvern.html` – foreløpig personverntekst
- `assets/style.css` – design og responsiv utforming
- `assets/site.js` – mobilmeny, dato og skjemahåndtering

Ingen betalingsløsning er nødvendig.

## Booking (ikke aktivert ennå)

Skjemaet er synlig, men **sender ikke informasjon** før et skjemasystem er konfigurert. Det viser tydelig beskjed om dette.

Forslag: Opprett en konto og et skjema i [Formspree](https://formspree.io/). Der kan forespørsler ses i et eget dashboard. Når kontoen er opprettet, sett den fullstendige endepunkt-URL-en (f.eks. `https://formspree.io/f/XXXXXXXX`) i `BOOKING_ENDPOINT` øverst i `assets/site.js`.

Formspree håndterer bare forespørselen, ikke automatisk bekreftelse av dato eller avtale. Foredragsholder må godkjenne forespørselen.

**Før aktivering:** Ferdigstill personvernerklæringen og bekreft leverandør, lagring og sletterutiner. Test en innsendelse og bekreft at den vises i dashboard. Opprett aldri dummy-bookinger med reelle persondata.

## Publisering

Dette er vanlige statiske HTML-/CSS-/JS-filer uten byggeprosess. Nettsiden kan hostes på Cloudflare Pages (med GitHub-integrasjon), annen statisk hosting eller en egen webserver. GitHub er **kildekodelageret**, ikke automatisk produksjonshosting. Domenet er ikke konfigurert av dette repoet.

Cloudflare Pages: Koble dette repoet til et nytt Pages-prosjekt, velg `main`, byggkommando `exit 0`, publiseringskatalog `.`. Koble først `isaacwilliam.no` til prosjektet når nettstedet er godkjent og testet. Kontroller eksisterende DNS før endringer, slik at e-postposter ikke påvirkes.

## Innhold

Tekst, foredragstitler, foto og bakgrunnsinformasjon er foreløpige. Vi har ikke fylt inn uverifiserte erfaringer, kundesitater, priser, kursinnhold eller andre påstander. Visuell profil kan endres ved å justere variablene i `assets/style.css`.
