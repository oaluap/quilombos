# Exportar GeoJSON no QGIS

Use este guia para gerar ou atualizar os arquivos na raiz do projeto:

- `localidadesquilombolas.geojson` (pontos)
- `setoresquilombolas.geojson` (polígonos)

## Localidades quilombolas (pontos)

1. Abra no QGIS a camada de localidades (shapefile, GeoPackage ou conexão).
2. **Camada → Exportar → Salvar feições como…**
3. Formato: **GeoJSON**
4. Nome do arquivo: `localidadesquilombolas.geojson`
5. CRS de destino: **EPSG:4674** (SIRGAS 2000) ou **EPSG:4326** (WGS 84).
6. Salve na pasta raiz do repositório (`quilombo/`).

Campos usados pelo Web GIS (mantenha nomes compatíveis):

| Campo | Uso no mapa |
|-------|-------------|
| `Nome Quilombo` / `NM_CQ` / `Localidade` | Título do popup e busca |
| `NM_MUNIC` | Município |
| `NM_UF` | UF |
| `CD_LQ` | Código da localidade |

## Setores quilombolas (polígonos)

1. Abra a camada de setores censitários quilombolas.
2. **Camada → Exportar → Salvar feições como…**
3. Formato: **GeoJSON**
4. Nome: `setoresquilombolas.geojson`
5. CRS: **EPSG:4674** ou **EPSG:4326**
6. Salve na raiz do projeto.

Campos esperados:

| Campo | Uso no mapa |
|-------|-------------|
| `CD_SETOR` | Identificação do setor |
| `SITUACAO` | Urbana / Rural |
| `NM_UF` | UF |
| `NM_MUN` / `NM_MUNIC` | Município |

## Dica: dados oficiais IBGE (Censo 2022)

- **Localidades:** [IBGE — Localidades quilombolas 2022](https://www.ibge.gov.br/geociencias/downloads-geociencias.html?caminho=organizacao_do_territorio/estrutura_territorial/localidades/localidades_quilombolas_2022)
- **Setores:** malha de setores censitários com recorte quilombola (Censo 2022), disponível no portal de malhas do IBGE.

Depois de exportar, reinicie o servidor (`npm start`) e recarregue `http://localhost:8000/web/`.
