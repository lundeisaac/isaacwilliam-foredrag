# isaacwilliam.no – uavhengig norskspråklig foredragsnettsted

Dette er **ny kode** for et foredragsnettsted. Det ligger i GitHub, separat fra den opprinnelige Durable-nettsiden. Den originale Durable-nettsiden er **ikke kopiert eller overskrevet**. Originalens utseende og tekst må verifiseres før en trofast rekonstruksjon kan ferdigstilles.

## Gjennomført i GitHub

- [x] Responsiv nettside med forside, foredrag, om meg, booking og foreløpig personvern
- [x] Norsk grensesnitt
- [x] Redigerbart hovedinnhold i `_data/innhold.yml`
- [x] Redigerbare foredrag i `_foredrag/*.md`
- [x] Pages CMS-oppsett i `.pages.yml`
- [x] Valgfrie bilder i innholdsredigereren
- [x] Bookingforespørsel med dato, sted, målgruppe og arrangør
- [ ] Kontroller og kopier design, bilder og tekst fra original Durable-side
- [ ] Gjennomfør personlig gjennomgang av all tekst og foredrag
- [ ] Fullfør personvern- og databehandlerinformasjon
- [ ] Konfigurer skjematjeneste og test mottak
- [ ] Aktiver GitHub Pages og test nettsiden på test-URL
- [ ] Koble domene og test HTTPS, DNS og e-post
- [ ] Fjern `noindex,nofollow` etter endelig godkjenning

## Redigering (uten å endre kode)

1. Åpne [Pages CMS](https://app.pagescms.org/).
2. Logg inn med GitHub-kontoen som eier `taylorcolonwrites/isaacwilliam-foredrag`.
3. Gi Pages CMS-appen tilgang til dette repositoryet.
4. Åpne **Nettsidens tekster og innstillinger** for forsiden, kontakt, bilder og bookingoverskrifter.
5. Åpne **Foredrag** for å opprette, endre, sortere eller skjule foredrag.
6. Lagre. Endringene lagres i GitHub. Etter at publisering er satt opp, bygges nettsiden på nytt.

På nettsiden finnes også `rediger.html` som lenker til redigereren. Dette er kun en snarvei; besøkende får ikke tilgang til redigering uten GitHub-autorisasjon.

## Hosting

**Anbefalt løsning for denne Jekyll-versjonen: GitHub Pages.** Denne nettsiden bruker Jekyll/Liquid (`_config.yml`, `_data`, `_foredrag`). En ren kopiering av filene til en statisk server **uten Jekyll-bygging vil ikke fungere riktig**.

Slik aktiveres testversjonen i GitHub:

1. Gå til repository **Settings → Pages**.
2. Sett **Build and deployment → Source: Deploy from a branch**.
3. Velg branch **main**, mappe **/(root)**, deretter **Save**.
4. Test nettstedet på URL-en GitHub viser under Pages. Vanlig prosjekt-URL vil være `https://taylorcolonwrites.github.io/isaacwilliam-foredrag/` etter at publiseringen fungerer.

Ikke endre DNS for `isaacwilliam.no` før den nye versjonen er godkjent. Når den er klar, sett custom domain i **Settings → Pages**, og konfigurer DNS ut fra GitHubs gjeldende instruksjoner. Ikke fjern eller overskriv MX-, SPF-, DKIM- eller DMARC-poster som brukes til e-post. Sikre HTTPS.

Cloudflare Pages kan brukes senere, men da må Jekyll bygges og resultatet fra `_site` publiseres – det er **ikke** tilstrekkelig å bruke `exit 0` og katalogen `.`.

## Booking og personvern

Forespørslene er **ikke aktivert**. Skjemaet lagrer eller sender ingen data før et Formspree-endepunkt er satt i `_data/innhold.yml` (felt `booking_endepunkt`). Fylles feltet inn, sender skjemaet data fra besøkerens nettleser direkte til Formspree, ikke til GitHub.

Ved behov kan du opprette [Formspree](https://formspree.io/) og bruke deres eget dashboard for forespørslene. Det gir **ikke** automatisk bekreftelse av kalender eller avtale.

Før aktivering må personvernerklæringen fullføres med behandlingsansvarlig, behandlingsgrunnlag, leverandør/databehandler, lagring, sletting og rettigheter. Test deretter med testopplysninger du selv kontrollerer. Ikke lagre persondata i det offentlige repositoryet.

## Innhold og videre design

Innholdet er foreløpig og inneholder ingen påstander om foredrag, kvalifikasjoner eller kundeuttalelser som vi ikke har fått fra eieren. Styling finnes i `assets/style.css`. Når originalen i Durable er tilgjengelig for gjennomgang, kan design, tekster og brukstillatte bilder overføres til en mer trofast rekonstruksjon.
