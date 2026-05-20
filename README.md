# Quilombos — Web GIS (Leaflet)

Mapa interativo das **localidades** e **setores** quilombolas (IBGE, Censo 2022), com pesquisa por **Nome Quilombo** e **NM_MUNIC**.

## Acesso online (GitHub Pages)

**https://oaluap.github.io/quilombos/**

> Na primeira publicação, ative em *Settings → Pages → Build and deployment → Source: **GitHub Actions***.

## Desenvolvimento local

```bash
npm start
```

Abra: http://localhost:8000/web/

## Estrutura

| Pasta / arquivo | Descrição |
|-----------------|-----------|
| `web/` | Interface Leaflet (HTML, CSS, JS) |
| `*.geojson` | Camadas de dados |
| `scripts/` | Exportação QGIS e download IBGE |

## Repositório

Único repositório e deploy:

- Código: https://github.com/oaluap/quilombos
- Site: https://oaluap.github.io/quilombos/
- Remote Git: `origin` → `https://github.com/oaluap/quilombos.git`
