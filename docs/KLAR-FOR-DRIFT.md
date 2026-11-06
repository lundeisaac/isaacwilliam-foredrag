# Nettstedet er klart til gjennomgang og utrulling

## Ferdig

Alle åtte opprinnelige sider er rekonstruert. Tekst, bilder, priser, FAQ og tilbakemeldinger kan redigeres uten Durable. Kontrollpanelet finnes på `/min-side`, med innlogging, oversikt, neste steg, forespørsler, pristilbud, kalender og innholdsredigering. Ingen offentlig lenke vises når eieren er logget ut.

Innhold kan eksporteres og gjenopprettes fra kontrollpanelet. Sidetekst, metadata og navigasjon leveres fra serveren, slik at innholdet er tilgjengelig før JavaScript starter. Skjemaene krever JavaScript og har validering og mottakskvittering. Testbooking i Cloud Browser er kontrollert mot den lagrede forespørselen og deretter slettet.

Fire automatiserte tester passerer, med kontroll av tilgang, CSRF, ugyldige felt/datoer, dobbeltbooking, data etter omstart, innholdsversjoner, sikker HTML-gjengivelse og ugyldiggjøring av gamle økter ved passordendring. Alle 30 responsive side-/breddekombinasjoner passerer uten horisontal overflyt.

## Før offentlig åpning

1. Eier velger eller gir tilgang til en server med Node 24 og vedvarende lagring. Docker-oppsettet er klart; se `DRIFT.md`.
2. Sett eierpassord og HTTPS-adresse i serverens private miljø. Ikke bruk utviklingsmiljøets testpassord i produksjon. Bokmerk `https://isaacwilliam.no/min-side` etter at domenet faktisk er koblet til.
3. Fullfør de konkrete virksomhets- og driftsopplysningene i personvernteksten, og kontroller innholdet på egne enheter. Deretter kan skjemaene åpnes i både servermiljø og kontrollpanel.
4. Bytt domenets nettsideruting først når eieren har godkjent erstatningen. Behold Durable-nettstedet til overgangen er verifisert og eventuell nedstenging er særskilt godkjent.

E-postarbeidet er pauset på eierens forespørsel. Google Workspace, DNS og originalnettsiden er ikke endret. Automatiske e-postvarsler er ikke aktivert; nettsidens forespørsler finnes i kontrollpanelet.
