# Serveur Minecraft — Stack Docker

Stack Docker complète avec serveur Minecraft, monitoring Prometheus/Grafana et landing page Node.js.

## Lancement

\`\`\`bash
docker compose up -d --build
\`\`\`

## Services

| Service | Port | Description |
|---|---|---|
| Minecraft | 12000 | Serveur Minecraft Java (Paper) |
| Landing page | 12001 | Page de présentation (via Nginx) |
| Grafana | 12002 | Dashboards de monitoring |

## Structure

\`\`\`
.
├── docker-compose.yml
├── landing/          # App Node.js Express + EJS
├── nginx/            # Config reverse proxy
├── prometheus/       # Config Prometheus
└── grafana/          # Provisioning datasources + dashboards
\`\`\`

## Accès Grafana

- URL : http://<ip-vps>:12002
- Login : admin / admin
