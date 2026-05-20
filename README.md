# Quilombos — Web GIS (Leaflet)

Mapa interativo das **localidades** e **setores** quilombolas (IBGE, Censo 2022), com pesquisa por **Nome Quilombo** e **NM_MUNIC**.

## Acesso online (GitHub Pages)

**https://oaluap.github.io/quilombos/**

### Se a URL retornar 404

1. Abra **https://github.com/oaluap/quilombos/settings/pages**
2. Em **Build and deployment → Source**, escolha **GitHub Actions**
3. Vá em **Actions** → workflow **Deploy GitHub Pages** → **Run workflow** (ou faça um novo push)
4. Aguarde o job ficar verde; a URL acima deve responder em 1–2 minutos

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
