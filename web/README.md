# Web GIS (Leaflet)

Este diretório contém um Web GIS simples em Leaflet com **3 mapas de fundo** e suporte a camadas GeoJSON.

## Como abrir

> Importante: por causa do `fetch()` dos GeoJSON, evite abrir via `file://`. Use um servidor local.

### Opção A) Python (recomendado)

Na raiz do projeto (`C:\Trab\Cursor\quilombo`):

```bash
python -m http.server 8000
```

Depois abra no navegador:

- `http://localhost:8000/web/`

### Opção B) Node (se você já usa)

```bash
npx serve .
```

Abra o link que ele mostrar e navegue até `/web/`.

## Mapas de fundo incluídos

- OpenStreetMap
- Satélite (Esri World Imagery)
- Claro (CARTO Positron)

## GeoJSON (opcional)

O app tenta carregar automaticamente:

- `../localidadesquilombolas.geojson`
- `../setoresquilombolas.geojson`

Se você mover os arquivos para dentro de `web/`, ajuste os caminhos no `main.js`.

