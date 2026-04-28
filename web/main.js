/* global L */

const statusEl = document.getElementById("status");
const searchEl = document.getElementById("featureSearch");
const searchBtnEl = document.getElementById("featureSearchBtn");
const searchResultEl = document.getElementById("featureSearchResult");
const visibleCountEl = document.getElementById("visibleCount");
function setStatus(lines) {
  statusEl.textContent = Array.isArray(lines) ? lines.join("\n") : String(lines ?? "");
}

// Map
const map = L.map("map", {
  center: [-14.235, -51.9253], // Brasil (aprox.)
  zoom: 4,
  zoomControl: true,
});

// Scale
L.control.scale({ imperial: false }).addTo(map);

// Address search (geocoder)
if (L.Control?.Geocoder) {
  L.Control.geocoder({
    defaultMarkGeocode: true,
    position: "topleft",
    placeholder: "Buscar endereço / lugar…",
  })
    .on("markgeocode", (e) => {
      const bbox = e?.geocode?.bbox;
      if (bbox) map.fitBounds(bbox);
    })
    .addTo(map);
}

// --- 3 mapas de fundo (basemaps) ---
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

const esriSat = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19,
    attribution:
      "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
  },
);

const cartoLight = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 20,
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap',
  },
);

// Default basemap
osm.addTo(map);

const baseLayers = {
  "OpenStreetMap": osm,
  "Satélite (Esri)": esriSat,
  "Claro (CARTO)": cartoLight,
};

// --- Overlays (GeoJSON) ---
const overlays = {};
const overlayLoading = [];
let localidadesLayer = null;
let setoresLayer = null;
let localidadesIndex = [];

function styleSetores() {
  return {
    color: "#dc2626",
    weight: 3,
    opacity: 0.7,
    fillColor: "#60a5fa",
    fillOpacity: 0.12,
  };
}

function pointToCircle(_, latlng) {
  return L.circleMarker(latlng, {
    radius: 4,
    color: "#f97316",
    weight: 1,
    fillColor: "#fb923c",
    fillOpacity: 0.8,
  });
}

function firstDefined(props, keys) {
  if (!props) return undefined;
  for (const k of keys) {
    if (props[k] !== undefined && props[k] !== null && String(props[k]).trim() !== "") return props[k];
  }
  return undefined;
}

function buildPopup(feature, kind) {
  const props = feature?.properties || {};

  if (kind === "localidades") {
    const title = firstDefined(props, ["Nome Quilombo", "NM_CQ", "Localidade", "NM_MUNIC", "CD_LQ"]) ?? "Localidade";
    const mun = firstDefined(props, ["NM_MUNIC", "NM_MUN"]);
    const uf = firstDefined(props, ["NM_UF", "UF"]);
    const cd = firstDefined(props, ["CD_LQ"]);

    const rows = [];
    if (mun || uf) rows.push(["Município/UF", [mun, uf].filter(Boolean).join(" — ")]);
    if (cd) rows.push(["Código", cd]);
    const fallback = niceProps(props, ["NM_UF", "NM_MUNIC", "CD_MUNIC", "CD_LQ", "NM_CQ", "Nome Quilombo", "Localidade"]);
    return `
      <div class="popup">
        <div class="popup__title">${escapeHtml(String(title))}</div>
        ${rows.map(([k, v]) => `<div><b>${escapeHtml(k)}</b>: ${escapeHtml(String(v))}</div>`).join("")}
        ${fallback}
      </div>
    `;
  }

  if (kind === "setores") {
    const title = firstDefined(props, ["CD_SETOR", "fid"]) ?? "Setor";
    const mun = firstDefined(props, ["NM_MUN", "NM_MUNIC"]);
    const uf = firstDefined(props, ["NM_UF", "UF"]);
    const situ = firstDefined(props, ["SITUACAO"]);

    const rows = [];
    if (situ) rows.push(["Situação", situ]);
    if (mun || uf) rows.push(["Município/UF", [mun, uf].filter(Boolean).join(" — ")]);
    const fallback = niceProps(props, ["CD_SETOR", "SITUACAO", "NM_UF", "NM_MUN", "CodMiunic"]);
    return `
      <div class="popup">
        <div class="popup__title">Setor ${escapeHtml(String(title))}</div>
        ${rows.map(([k, v]) => `<div><b>${escapeHtml(k)}</b>: ${escapeHtml(String(v))}</div>`).join("")}
        ${fallback}
      </div>
    `;
  }

  return `<div class="popup">${niceProps(props)}</div>`;
}

function niceProps(props, preferredOrder = []) {
  if (!props) return "";
  const keysAll = Object.keys(props);
  if (keysAll.length === 0) return "";

  const preferred = preferredOrder.filter((k) => keysAll.includes(k));
  const rest = keysAll.filter((k) => !preferred.includes(k));
  const keys = [...preferred, ...rest].slice(0, 14);

  return keys
    .map((k) => `<div><b>${escapeHtml(k)}</b>: ${escapeHtml(String(props[k]))}</div>`)
    .join("");
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
}

function normalizeText(s) {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function wireFeatureSearch() {
  function setResult(text) {
    if (searchResultEl) searchResultEl.textContent = text;
  }

  async function doSearch() {
    const q = normalizeText(searchEl?.value);
    if (!q) {
      setResult("Digite um termo para buscar.");
      return;
    }
    if (!localidadesLayer || localidadesIndex.length === 0) {
      setResult("A camada de localidades ainda não carregou.");
      return;
    }

    const hits = localidadesIndex.filter((x) => x.search.includes(q));
    if (hits.length === 0) {
      setResult("Nenhum resultado encontrado.");
      return;
    }

    const first = hits[0];
    map.setView(first.latlng, Math.max(map.getZoom(), 12), { animate: true });
    first.layer.openPopup();
    setResult(`Encontrados: ${hits.length}. Mostrando o 1º (zoom + popup).`);
  }

  if (searchBtnEl) searchBtnEl.addEventListener("click", doSearch);
  if (searchEl) {
    searchEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") doSearch();
    });
  }
}

wireFeatureSearch();

function setVisibleCount(n, enabled) {
  if (!visibleCountEl) return;
  if (!enabled) {
    visibleCountEl.textContent = "Localidades visíveis no mapa: (camada desligada)";
    return;
  }
  visibleCountEl.textContent = `Localidades visíveis no mapa: ${n}`;
}

function countVisibleLocalidades() {
  if (!localidadesLayer) return { enabled: false, count: 0 };
  const enabled = map.hasLayer(localidadesLayer);
  if (!enabled) return { enabled: false, count: 0 };

  const b = map.getBounds();
  let count = 0;
  localidadesLayer.eachLayer((l) => {
    const latlng = l.getLatLng ? l.getLatLng() : null;
    if (latlng && b.contains(latlng)) count += 1;
  });
  return { enabled: true, count };
}

function refreshVisibleCount() {
  const { enabled, count } = countVisibleLocalidades();
  setVisibleCount(count, enabled);
}

map.on("moveend zoomend", refreshVisibleCount);
map.on("overlayadd overlayremove", refreshVisibleCount);

function addLegend() {
  const legend = L.control({ position: "bottomright" });
  legend.onAdd = () => {
    const div = L.DomUtil.create("div", "map-legend");
    const logoSrc =
      "data:image/png;base64,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";
    div.innerHTML = `
      <div class="map-legend__title">Legenda</div>
      <div class="map-legend__logoRow">
        <img class="map-legend__logo" src="${logoSrc}" alt="LEHA" />
      </div>
      <div class="map-legend__item">
        <span class="map-legend__swatch" style="background:#fb923c;border-color:rgba(251,146,60,.6)"></span>
        <span>Localidades (pontos)</span>
      </div>
      <div class="map-legend__item">
        <span class="map-legend__swatch" style="background:rgba(96,165,250,.22);border-color:rgba(37,99,235,.7)"></span>
        <span>Setores (polígonos)</span>
      </div>
    `;
    L.DomEvent.disableClickPropagation(div);
    return div;
  };
  legend.addTo(map);
}

addLegend();

async function loadGeoJson({ label, url, asPoints = false, styleFn, kind }) {
  overlayLoading.push(label);
  setStatus([
    "Camadas disponíveis:",
    "- Basemaps: OpenStreetMap, Satélite (Esri), Claro (CARTO)",
    "",
    `Carregando: ${overlayLoading.join(", ")}`,
  ]);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao carregar ${url} (${res.status})`);
  const data = await res.json();

  const layer = L.geoJSON(data, {
    style: styleFn,
    pointToLayer: asPoints ? pointToCircle : undefined,
    onEachFeature: (feature, l) => {
      const html = buildPopup(feature, kind);
      if (html) l.bindPopup(`<div style="min-width:240px">${html}</div>`);
    },
  });

  overlays[label] = layer;
  overlayLoading.splice(overlayLoading.indexOf(label), 1);

  setStatus([
    "Camadas disponíveis:",
    `- Basemaps: ${Object.keys(baseLayers).join(", ")}`,
    `- Overlays: ${Object.keys(overlays).join(", ") || "nenhum"}`,
  ]);

  return layer;
}

// Control
const layerControl = L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);

// Tenta carregar seus arquivos do diretório raiz do projeto (../)
// Se você mover os GeoJSON para dentro de /web, ajuste os caminhos.
Promise.allSettled([
  loadGeoJson({
    label: "Localidades quilombolas (pontos)",
    url: "../localidadesquilombolas.geojson",
    asPoints: true,
    kind: "localidades",
  }),
  loadGeoJson({
    label: "Setores quilombolas (polígonos)",
    url: "../setoresquilombolas.geojson",
    styleFn: styleSetores,
    kind: "setores",
  }),
]).then((results) => {
  const layers = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  // Adiciona ao controle de camadas (agora que overlays existe)
  for (const [name, layer] of Object.entries(overlays)) {
    layerControl.addOverlay(layer, name);
  }

  // Liga as camadas por padrão, se carregaram
  layers.forEach((l) => l.addTo(map));

  // Guarda referências e monta índice de busca para localidades
  if (overlays["Localidades quilombolas (pontos)"]) {
    localidadesLayer = overlays["Localidades quilombolas (pontos)"];
    localidadesIndex = [];
    localidadesLayer.eachLayer((l) => {
      const props = l?.feature?.properties || {};
      const name = firstDefined(props, ["Nome Quilombo", "NM_CQ", "Localidade"]) ?? "";
      const mun = firstDefined(props, ["NM_MUNIC", "NM_MUN"]) ?? "";
      const uf = firstDefined(props, ["NM_UF", "UF"]) ?? "";
      const cd = firstDefined(props, ["CD_LQ"]) ?? "";
      const search = normalizeText([name, mun, uf, cd].filter(Boolean).join(" "));
      const latlng = l.getLatLng ? l.getLatLng() : null;
      if (latlng) localidadesIndex.push({ layer: l, latlng, search });
    });
    if (searchResultEl) searchResultEl.textContent = `Busca pronta: ${localidadesIndex.length} localidades indexadas.`;
    refreshVisibleCount();
  }

  if (overlays["Setores quilombolas (polígonos)"]) {
    setoresLayer = overlays["Setores quilombolas (polígonos)"];
  }

  // Ajusta enquadramento
  if (layers.length > 0) {
    const group = L.featureGroup(layers);
    map.fitBounds(group.getBounds().pad(0.08));
  }

  const failures = results.filter((r) => r.status === "rejected");
  if (failures.length > 0) {
    setStatus([
      statusEl.textContent,
      "",
      "Avisos:",
      ...failures.map((f) => `- ${String(f.reason?.message || f.reason)}`),
      "",
      "Dica: se você abrir o HTML diretamente (file://), o navegador pode bloquear o fetch do GeoJSON.",
      "Abra com um servidor local (ex.: python -m http.server) e acesse via http://.",
    ]);
  }
});

