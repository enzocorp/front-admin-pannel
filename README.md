
# ENVOYER EN PRODUCTION 
```sh
docker build -f ./prod/prod.Dockerfile -t enzo13/front-arbitrage-p:3.0 .
docker push enzo13/front-arbitrage-p:3.0
```

# ENV VARIABLES UTILISEES

### ---Site web---
- SITE_HOSTNAME={string} (pour le DNS docker)
- SITE_PORT={number}
