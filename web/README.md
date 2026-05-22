# Web GIS (Leaflet)

Este diretório contém um Web GIS em Leaflet com **5 mapas de fundo** e camadas GeoJSON do Censo 2022 (IBGE).

## Como abrir

> Importante: por causa do `fetch()` dos GeoJSON, evite abrir via `file://`. Use um servidor local.

### Opção A) Python (recomendado)

Na raiz do repositório [quilombos](https://github.com/oaluap/quilombos):

```bash
python -m http.server 8000
```

Depois abra no navegador:

- `http://localhost:8000/web/`

### Opção B) Node (servidor incluído)

Na raiz do projeto:

```bash
npm start
```

Depois abra:

- Local: `http://localhost:8000/web/`
- Online: https://oaluap.github.io/quilombos/

## Mapas de fundo incluídos

- OpenStreetMap
- Satélite (Esri World Imagery)
- Claro (CARTO Positron)
- Escuro (CARTO Dark Matter)
- Topográfico (OpenTopoMap)

## Camadas GeoJSON

O app carrega automaticamente (na raiz do projeto):

| Arquivo | Feições | Descrição |
|---------|---------|-----------|
| `localidadesquilombolas.geojson` | 8 442 pontos | Localidades quilombolas (IBGE CD2022) |
| `setoresquilombolas.geojson` | 5 591 polígonos | Setores censitários quilombolas |
| `AglomeradosPretos.geojson` | 2 032 polígonos | Aglomerados pretos |
| `Dermacacao_Incra.geojson` | 429 polígonos | Demarcação INCRA (territórios quilombolas) |

As camadas **Aglomerados pretos** e **Demarcação INCRA** aparecem no controle do mapa desligadas por padrão (arquivos grandes).

### Atualizar ou exportar do QGIS

- Guia passo a passo: [`../scripts/export-qgis.md`](../scripts/export-qgis.md)
- Baixar localidades oficiais (IBGE): `powershell -File ../scripts/fetch-localidades-ibge.ps1`

Se mover os GeoJSON para dentro de `web/`, ajuste os caminhos em `main.js`.

