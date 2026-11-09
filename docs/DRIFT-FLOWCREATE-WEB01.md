# Driftsdokument — isaacwilliam.no på FlowCreate web-01

> **Tjeneste:** Isaac William foredragsnettsted (Node 24 + SQLite)
> **Vert:** `flowcreate-web-01` (`10.0.0.17`), container `isaacwilliam`, port `8099 -> 3000`
> **Status:** Live på provisorisk adresse `https://isaacwilliam.flowcreate.no` (2026-11-09).
> Apex `isaacwilliam.no` er klarlagt på edge, men sonen ligger fortsatt hos
> norgesdns -> Vercel. DNSSEC ble frigitt av eier 2026-11-09 ~21:16 UTC;
> soneflytting til Cloudflare forventes innen ~4 timer.
> **Sist verifisert:** 2026-11-09 · **Dokumentversjon:** 1.0

Dette dokumentet beskriver driften av den faktiske utrullingen. Generell
driftskunnskap om applikasjonen står i `DRIFT.md`; dette dokumentet er
bindeleddet mellom appen og serveren den kjører på.

---

## 1. Tjenesteoversikt

| Felt | Innhold |
|---|---|
| Formål | Uavhengig norsk foredragsnettsted med eierstyrt innhold, booking- og kontaktadministrasjon |
| Forretningsverdi | Erstatter Durable-nettstedet; eier kontrollerer innhold og henvendelser selv |
| Kritikalitet | Lav–middels. Nedetid påvirker omdømme/markedsføring, men ingen betaling eller kundedataleveranse |
| Tjenesteeier | Isaac William Lunde (innhold, godkjenning av lansering, DNS, Google Workspace) |
| Teknisk drift | FlowCreate-infrastruktur (web-01/edge-01), se `flowcreatetime/flowcreate-infrastructure` |
| Applikasjonskilde | `lundeisaac/isaacwilliam-foredrag`, gren `main` (rebuild-grenen ble merget til `main` via PR #2 2026-11-09; tag `legacy-jekyll` peker på den gamle Jekyll-versjonen) |

### Omfang

- Inkludert: offentlige sider (8 sider, serverrendret), `/min-side`
  eierkontrollpanel, SQLite-lagring av forespørsler/innhold, bildeopplasting,
  innholdseksport.
- Ikke inkludert (ennå): `isaacwilliam.no`-cutover, bookingåpning,
  e-postsending, søkindeksering, klientportal — alt av per
  `SERVER-HANDOVER.md` til eier godkjenner.
- Utenfor omfang: e-postkonto, MX/SPF/DKIM/DMARC, betaling, Durable-siden.

### Tjenestenivå (foreløpig)

Best-effort, én Node-prosess, én vert. Ingen formell SLO. Manuell utrulling —
ingen CI-lane ennå.

---

## 2. Konfigurasjon

### Miljø

| Miljø | Opprinnelse | Intern origin | Offentlig adresse |
|---|---|---|---|
| produksjon | manuell `git pull` + `docker build` på web-01 | `10.0.0.17:8099` | `isaacwilliam.flowcreate.no` (live); `isaacwilliam.no` + `www` (edge-klar, avventer soneflytting) |

### Runtime-lagt på web-01

```text
/srv/projects/isaacwilliam-foredrag/      # git checkout, gren main
/opt/isaacwilliam/production/runtime/   # DATA_DIR: site.sqlite (+ -wal/-shm) + uploads/ (uid 1000)
/etc/flowcreate-web/env/isaacwilliam.env # root:root 0600 — runtime-miljøvariabler
```

### Container

```text
navn    isaacwilliam
image   isaacwilliam:<full-app-sha>   (bygget på web-01 fra repoets Dockerfile)
port    10.0.0.17:8099 -> 3000
env     --env-file /etc/flowcreate-web/env/isaacwilliam.env
volum   /opt/isaacwilliam/production/runtime -> /app/runtime
restart unless-stopped
```

### Miljøvariabler (gjeldende)

| Variabel | Verdi | Merknad |
|---|---|---|
| `NODE_ENV` | `production` | Påkrevd — øktskapsel er Secure/HTTPS |
| `PORT` / `HOST` | `3000` / `0.0.0.0` | Bindes kun til `10.0.0.17` via `-p` |
| `PUBLIC_ORIGIN` | `https://isaacwilliam.flowcreate.no` | **Må** stemme eksakt med nettleser-origin; endres til `https://isaacwilliam.no` ved cutover |
| `ADMIN_PASSWORD` | `<hemmelig>` | Generert på verten; ligger kun i env-filen (`sudo cat`) |
| `DATA_DIR` | `/app/runtime` | Bind-mountet til `/opt/isaacwilliam/production/runtime` |
| `BOOKING_ENABLED` | `false` | Krever også «Åpne skjemaene» i admin |
| `ALLOW_INDEXING` | `false` | Slås på først etter godkjent lansering |
| `CLIENT_PORTAL_ENABLED` | `false` | Standard av |
| `EMAIL_ENABLED` | `false` | Se `EMAIL.md` før aktivering |

### Trafikkflyt

```text
nettleser
  -> Cloudflare (proxied CNAME, sonen flowcreate.no)
  -> cloudflared på flowcreate-edge-01 (tunnel)
  -> https://10.0.0.10:443 (edge-nginx, vhost isaacwilliam.conf)
  -> http://10.0.0.17:8099 (container isaacwilliam -> :3000)
```

### Avhengigheter

```text
isaacwilliam avhenger av:
- flowcreate-edge-01 (10.0.0.10): edge-nginx + cloudflared
- Cloudflare-tunnelen og flowcreate.no-sonen (provisorisk hostname)
- GitHub (kildekode)
- lokal disk /opt/isaacwilliam/production/runtime (SQLite WAL — ikke NFS)

avhengig av isaacwilliam:
- ingenting internt; isolert tredjepartsbane
```

---

## 3. Vanlige prosedyrer

### 3.1 Oppdatere nettsiden (manuell utrulling)

```bash
ssh ubuntu@10.0.0.17
cd /srv/projects/isaacwilliam-foredrag
git pull --ff-only                       # gren: main
SHA=$(git rev-parse HEAD)
docker build -t "isaacwilliam:$SHA" .
sudo docker stop isaacwilliam && sudo docker rm isaacwilliam
sudo docker run -d --name isaacwilliam --restart unless-stopped \
  -p 10.0.0.17:8099:3000 \
  --env-file /etc/flowcreate-web/env/isaacwilliam.env \
  -v /opt/isaacwilliam/production/runtime:/app/runtime \
  "isaacwilliam:$SHA"
curl -fsS http://10.0.0.17:8099/api/content   # forvent 200
```

`content/site.json` importeres **kun** når databasen opprettes første gang.
Redigeringer i `/min-side` overskrives ikke av utrulling. Ikke slett
`runtime/` for å «oppdatere tekst».

### 3.2 Helsekontroll

```bash
curl -fsS http://10.0.0.17:8099/api/content                  # app-helsesjekk (docker HEALTHCHECK)
curl -fsS http://10.0.0.17:8099/ | grep -F 'Hjem | Isaac William Lunde'
curl -fsSI https://isaacwilliam.flowcreate.no/               # offentlig sti
docker inspect isaacwilliam --format '{{.State.Health.Status}}'
docker logs --tail 50 isaacwilliam
```

### 3.3 Eierinnlogging

- Åpne `https://isaacwilliam.flowcreate.no/min-side`, logg inn med
  `ADMIN_PASSWORD` fra env-filen (`sudo cat /etc/flowcreate-web/env/isaacwilliam.env`).
- Økten er HttpOnly + Secure — innlogging krever HTTPS (ikke rå `http://10.0.0.17:8099`).
- Økter utløper etter maks 8 timer; passordbytte i env + restart
  ugyldiggjør alle økter.

### 3.4 Åpne skjemaer (etter godkjenning)

1. Sett `BOOKING_ENABLED=true` i env-filen, `sudo docker restart isaacwilliam`.
2. Aktiver «Åpne skjemaene» i admin-innstillinger.
3. Send kontrollert testbooking + kontaktmelding; verifiser mottak i
   dashboard, endre status/pris, bekreft dato, slett testdata.
4. E-post: følg `EMAIL.md` — ikke aktiver før Google Workspace er autorisert
   og leveranse er verifisert.

---

## 4. Feilsøking

| Symptom | Sannsynlig årsak | Tiltak |
|---|---|---|
| `curl 10.0.0.17:8099` feiler | Container nede/bygget feil | `docker ps -a`, `docker logs isaacwilliam`; manglende `ADMIN_PASSWORD` (<16 tegn) krasjer produksjonsstart med tydelig feilmelding |
| Offentlig URL 502/1033 | Edge/tunnel, ikke appen | Se `docs/runbooks/cloudflare-tunnel.md` i infra-repoet — verifiser edge-VM og cloudflared før appen mistenkes |
| Offentlig URL svarer, men feil innhold | Feil image-tag | `docker inspect isaacwilliam --format '{{.Config.Image}}'` mot ønsket SHA |
| Innlogging på `/min-side` «fester ikke» | HTTP uten TLS | Secure-cookie krever HTTPS — bruk den offentlige adressen, ikke `http://10.0.0.17:8099` |
| Rate-limit på tvers av besøkende | Delt bucket via proxy | Appen bruker tilkoblings-IP med vilje; alle besøkende deler edge-01-IP. Kjent begrensning — ikke en feil |
| Endringer i `/min-side` forsvant | `runtime/` slettet/gjenopprettet | Gjenopprett `DATA_DIR` fra backup; `content/site.json` importeres kun ved første oppstart |
| `booking`/`contact` gir 403 | Vakter av | Forventet: `BOOKING_ENABLED=false` og/eller admin-bryter — ikke en feil |

---

## 5. Backup og gjenoppretting

### Omfang

`/opt/isaacwilliam/production/runtime/` = `site.sqlite` (+`-wal`/`-shm`) +
`uploads/` — eneste persistente tilstand. VM-backup (vzdump) dekker verten;
for filkopi brukes stopp–kopier–start:

```bash
sudo docker stop isaacwilliam
sudo cp -a /opt/isaacwilliam/production/runtime /opt/isaacwilliam/runtime-backup-$(date +%F)
sudo docker start isaacwilliam
```

Admin «innholdseksport» erstatter ikke DB/bilde-backup (kun innhold).

### Gjenoppretting

1. Stopp appen, erstatt `runtime/` med backupkopi, sikre eierskap `1000:1000`.
2. Start appen; verifiser innhold, forespørsler og opplastede bilder.
3. Katastrofetap av VM: ny web-01 -> git clone -> `docker build` ->
   `docker run` med env-fil + gjenopprettet `runtime/` -> edge-vhost ->
   tunnel-hostname (se infra-runbook).

---

## 6. Domenebytte til isaacwilliam.no (venter)

Forutsetninger før cutover:

1. **DNSSEC av** — eier frigav DNSSEC 2026-11-09 ~21:16 UTC. Verifiser at
   `dig +short DS isaacwilliam.no` er **tom** (var fortsatt satt ved
   frigivingen; forventet borte innen ~4 timer). Ikke bytt NS mens DS står —
   resolvere vil feile (bogus).
2. **Sone i Cloudflare-kontoen** — legg til `isaacwilliam.no` i samme
   CF-konto som flowcreate.no; noter tildelte navnetjenere.
3. **NS-bytte hos registrar** — pek `isaacwilliam.no` til CF-navnetjenerne.
   **Bevar MX/SPF/DKIM/DMARC** — `post@isaacwilliam.no` skal ikke røres.
   Gjenskap eksisterende DNS-poster i CF-sonen først.

Deretter (samme mønster som skapdegselv 2026-10-26):

4. Tunnel-ingress `isaacwilliam.no` + `www` -> `https://10.0.0.10:443`
   (noTLSVerify) og proxiede CNAME-er -> `<tunnel>.cfargotunnel.com`.
   Merk: `cloudflare-tunnel-hostname`-workflowen er låst til
   `flowcreate.no`-sonen — for `isaacwilliam.no` brukes CF-dashbordet eller
   en API-nøkkel med den sonens omfang (samme fravær av token-scope som
   skapdegselv).
5. Edge-vhosten dekker allerede alle tre hostnames — ingen edge-endring
   nødvendig.
6. `PUBLIC_ORIGIN=https://isaacwilliam.no` i env-filen + `sudo docker
   restart isaacwilliam`.
7. Verifiser `https://isaacwilliam.no/` og `https://www.isaacwilliam.no/`.
8. Først etter eiergodkjenning: `ALLOW_INDEXING=true`, booking (§3.4),
   e-post (`EMAIL.md`). Behold Durable/Vercel-siden som fallback til
   overgangen er verifisert; pensjoner `isaacwilliam.flowcreate.no` etter
   innkjøring (fjern ingress + CNAME, dropp fra `server_name`, reload edge).

---

## 7. Kjente begrensninger og forbedringsbacklogg

| # | Punkt | Tiltak |
|---|---|---|
| 1 | Delt rate-limit-bucket (alle bak edge deler én IP) | Akseptert før lansering; vurder trusted-proxy-støtte i appen |
| 2 | Ingen CI-utrullingslane — manuell `docker build`/`run` | Vurder `deploy-isaacwilliam.yml` etter skapdegselv-mønsteret ved behov |
| 3 | `runtime/` ikke bekreftet i backupkjøring ennå | Verifiser vzdump-dekning + test en stopp–kopier–start-syklus |
| 4 | Provisorisk hostname `isaacwilliam.flowcreate.no` | Pensjoner etter apex-cutover + soak |
| 5 | Ingen monitor/blackbox-probe ennå | Vurder Prometheus-probe på `https://isaacwilliam.flowcreate.no/` |
| 6 | Booking/e-post/indeksering av | Eiergodkjenning per `SERVER-HANDOVER.md` |

---

## Relatert dokumentasjon

- `docs/DRIFT.md` — generell applikasjonsdrift
- `docs/SERVER-HANDOVER.md` — oppstartskontrakt (fortsatt gjeldende regler)
- `docs/EMAIL.md` — e-postaktivering
- `docs/KONTROLLPANEL.md` — eierkontrollpanel
- Infra: `flowcreate-infrastructure/deploy/isaacwilliam/web-01/README.md`,
  `docs/runbooks/isaacwilliam-web.md`,
  `docs/changelog/2026-11-09-isaacwilliam-web01-lane.md`
