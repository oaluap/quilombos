# Baixa localidades quilombolas (IBGE CD2022) e orienta a conversão para GeoJSON.
# Requer: curl + QGIS (ogr2ogr) OU conversão manual no QGIS (ver export-qgis.md).

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$ZipUrl = "https://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/localidades/localidades_quilombolas_2022/Arquivos_vetoriais/shp/BR/BR_LQs_CD2022.zip"
$ZipPath = Join-Path $Root "_tmp_BR_LQs.zip"
$ExtractDir = Join-Path $Root "_tmp_lq"
$OutGeoJson = Join-Path $Root "localidadesquilombolas.geojson"

Write-Host "Baixando IBGE BR_LQs_CD2022.zip ..."
curl.exe -fSL --max-time 120 $ZipUrl -o $ZipPath

Write-Host "Extraindo ..."
if (Test-Path $ExtractDir) { Remove-Item $ExtractDir -Recurse -Force }
Expand-Archive -Path $ZipPath -DestinationPath $ExtractDir -Force

$Shp = Get-ChildItem -Path $ExtractDir -Filter "*.shp" -Recurse | Select-Object -First 1
if (-not $Shp) { throw "Shapefile não encontrado em $ExtractDir" }

$Ogr2Ogr = @(
  "C:\Program Files\QGIS 3.40.9\bin\ogr2ogr.exe",
  "C:\Program Files\QGIS 3.34.15\bin\ogr2ogr.exe",
  "C:\OSGeo4W\bin\ogr2ogr.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($Ogr2Ogr) {
  Write-Host "Convertendo com ogr2ogr -> $OutGeoJson"
  & $Ogr2Ogr -f GeoJSON -t_srs EPSG:4674 $OutGeoJson $Shp.FullName
  Write-Host "OK: $OutGeoJson"
} else {
  Write-Host ""
  Write-Host "ogr2ogr não encontrado. Shapefile extraído em:"
  Write-Host "  $($Shp.FullName)"
  Write-Host ""
  Write-Host "No QGIS: Camada -> Exportar -> Salvar feições como -> GeoJSON"
  Write-Host "Destino: $OutGeoJson"
  Write-Host "Consulte também: scripts/export-qgis.md"
}
