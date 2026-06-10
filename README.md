# Serveur Minecraft — Stack Docker

Stack Docker complète déployant un serveur Minecraft Paper avec monitoring Prometheus/Grafana et une landing page Node.js accessible via un reverse proxy Nginx.

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) ≥ 24
- [Docker Compose](https://docs.docker.com/compose/) ≥ 2.20
- 4 Go de RAM disponible minimum
- Ports libres : `12000`, `12001`, `12002`

## Lancement

```bash
git clone https://github.com/JoVibess/Serveur-Minecraft.git
cd Serveur-Minecraft
docker compose up -d --build
```

La stack démarre en arrière-plan. Le serveur Minecraft prend ~60 secondes à être joinable (téléchargement du jar Paper + initialisation du monde).

## Services et ports

| Service | Port local | Description |
|---|---|---|
| Minecraft | `12000` | Serveur Java Edition (Paper) |
| Landing page | `12001` | Page de présentation (via Nginx) |
| Grafana | `12002` | Dashboards de monitoring |

> Prometheus, node-exporter et cAdvisor ne sont **pas** exposés publiquement — ils communiquent uniquement sur le réseau Docker interne `monitoring`.

## Connexion au serveur Minecraft

Dans le client Minecraft Java Edition :

- Adresse : `localhost:12000`  
- Version recommandée : dernière version stable Java Edition

## Accès Grafana

- URL : [http://localhost:12002](http://localhost:12002)
- Login : `admin` / `admin`
- Deux dashboards provisionnés automatiquement :
  - **Infrastructure** — CPU, RAM, disque, réseau, conteneurs
  - **Minecraft** — TPS, joueurs, mémoire JVM, chunks chargés, entités

## Structure du projet

```
.
├── docker-compose.yml
├── landing/
│   ├── Dockerfile
│   ├── index.js              # Serveur Express
│   ├── package.json
│   ├── views/
│   │   └── index.ejs         # Template EJS
│   └── public/
│       └── style.css         # CSS custom
├── nginx/
│   └── nginx.conf            # Reverse proxy vers landing:3000
├── prometheus/
│   └── prometheus.yml        # Scrape configs (node-exporter, cAdvisor, minecraft)
├── grafana/
│   └── provisioning/
│       ├── datasources/
│       │   └── prometheus.yml
│       └── dashboards/
│           ├── dashboards.yml
│           ├── minecraft-dashboard.json
│           └── infra-dashboard.json
└── plugins/
    └── PrometheusExporter/
        └── config.yml        # Plugin écoute sur 0.0.0.0:9940
```

## Architecture réseau

```
Internet
    │
    ▼
[Nginx :12001] ──── réseau public ──── [Landing Node.js]
[Grafana :12002] ─┐
                  │
                  └── réseau monitoring ──── [Prometheus]
                                                  │
                                    ┌─────────────┼─────────────┐
                                    ▼             ▼             ▼
                             [node-exporter] [cAdvisor] [Minecraft:9940]
```

Deux réseaux Docker :
- **`public`** — Nginx + Landing uniquement
- **`monitoring`** — Prometheus, Grafana, node-exporter, cAdvisor, Minecraft

## Volumes persistants

| Volume | Contenu |
|---|---|
| `minecraft-data` | Monde, plugins, configuration serveur |
| `prometheus-data` | Données de métriques Prometheus |
| `grafana-data` | Base Grafana (users, settings) |

Les données Minecraft survivent aux redémarrages et suppressions de conteneur (`docker compose down` sans `--volumes`).

## Plugin Prometheus Minecraft

Le plugin [minecraft-prometheus-exporter v3.1.2](https://github.com/sladkoff/minecraft-prometheus-exporter) est installé automatiquement au premier démarrage via la variable `PLUGINS` dans le `docker-compose.yml`.

Il expose les métriques sur `minecraft:9940` (réseau interne uniquement) et est configuré pour écouter sur `0.0.0.0` via `plugins/PrometheusExporter/config.yml`.

## Arrêt

```bash
# Arrêter sans supprimer les données
docker compose down

# Arrêter ET supprimer tous les volumes (repart de zéro)
docker compose down --volumes
```

## Variables d'environnement notables

| Variable | Valeur | Service |
|---|---|---|
| `EULA` | `TRUE` | minecraft |
| `TYPE` | `PAPER` | minecraft |
| `MEMORY` | `2G` | minecraft |
| `GF_SECURITY_ADMIN_PASSWORD` | `admin` | grafana |
