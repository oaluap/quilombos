# Quilombos — Web GIS (Leaflet)

Mapa interativo das **localidades** e **setores** quilombolas (IBGE, Censo 2022), com pesquisa por **Nome Quilombo** e **NM_MUNIC**.

## Acesso online (GitHub Pages)

**https://oaluap.github.io/quilombos/**

### Se a URL retornar 404 (ativar Pages uma vez)

1. Confira se o workflow **Deploy GitHub Pages** terminou com sucesso em [Actions](https://github.com/oaluap/quilombos/actions)
2. Abra **https://github.com/oaluap/quilombos/settings/pages**
3. Em **Build and deployment → Source**, escolha **Deploy from a branch**
4. Branch: **gh-pages** — Folder: **/ (root)** — clique **Save**
5. Aguarde 1–2 minutos e acesse **https://oaluap.github.io/quilombos/**

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
- Publicação: branch `gh-pages` (gerada pelo workflow)
