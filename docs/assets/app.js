const COPY = {
  en: {
    catalogFile: "./data/apps.en.json",
    detailFile: "../../data/apps.en.json",
    langHref: "./es/",
    langLabel: "ES",
    navCatalog: "Catalog",
    navRoadmap: "Roadmap",
    navPolicy: "Policy",
    ctaCatalog: "Browse catalog",
    ctaCpt: "Open 6SNT.CPT",
    heroKicker: "Windows radio utilities",
    heroTitleA: "6SNT",
    heroTitleB: "Micro Apps",
    heroCopy: "Small local-first tools for station preflight, diagnostics and data cleanup. Each app has one job, clear safety limits and a Windows-first build path.",
    meta: ["Local-first", "No telemetry", "AS IS distribution"],
    catalogTitle: "Catalog",
    catalogCopy: "Current apps and release channels. Private source means the code repository requires access; release availability is listed per app.",
    roadmapTitle: "Next tools",
    roadmapCopy: "The backlog is intentionally small and operational: each tool should solve one station problem without becoming a platform.",
    policyTitle: "Distribution policy",
    policyCopy: "Apps are distributed AS IS, without warranty and without any promise of future versions, maintenance or compatibility. The portal can be public while individual app repositories remain private.",
    details: "Details",
    release: "Release",
    repo: "Repository",
    accessNote: "Distributed AS IS. Access may be restricted for private-source tools, and future versions are not promised.",
    sha: "SHA256",
    features: "What it does",
    safety: "Safety boundaries",
    notFor: "Not for",
    back: "Back to catalog",
    footer: "6SNT.RADIO - local-first radio tools",
    filters: ["All", "CAT / Serial", "Logbook / ADIF", "Private source", "Public source"]
  },
  es: {
    catalogFile: "../data/apps.es.json",
    detailFile: "../../../data/apps.es.json",
    langHref: "../",
    langLabel: "EN",
    navCatalog: "Catalogo",
    navRoadmap: "Ruta",
    navPolicy: "Politica",
    ctaCatalog: "Ver catalogo",
    ctaCpt: "Abrir 6SNT.CPT",
    heroKicker: "Utilidades Windows para radio",
    heroTitleA: "6SNT",
    heroTitleB: "Micro Apps",
    heroCopy: "Herramientas pequenas y local-first para preflight de estacion, diagnostico y limpieza de datos. Cada app tiene una tarea, limites de seguridad claros y build Windows.",
    meta: ["Local-first", "Sin telemetria", "Distribucion AS IS"],
    catalogTitle: "Catalogo",
    catalogCopy: "Apps actuales y canales de release. Fuente privada significa que el repositorio requiere acceso; la disponibilidad de descarga se indica por app.",
    roadmapTitle: "Siguientes herramientas",
    roadmapCopy: "El backlog es pequeno y operativo: cada herramienta debe resolver un problema de estacion sin convertirse en plataforma.",
    policyTitle: "Politica de distribucion",
    policyCopy: "Las apps se distribuyen AS IS, sin garantia y sin promesa de versiones futuras, mantenimiento o compatibilidad. El portal puede ser publico mientras los repositorios de app siguen privados.",
    details: "Detalles",
    release: "Release",
    repo: "Repositorio",
    accessNote: "Distribuido AS IS. El acceso puede estar restringido en herramientas con fuente privada y no se prometen versiones futuras.",
    sha: "SHA256",
    features: "Que hace",
    safety: "Limites de seguridad",
    notFor: "No es para",
    back: "Volver al catalogo",
    footer: "6SNT.RADIO - herramientas local-first para radio",
    filters: ["Todo", "CAT / Serial", "Logbook / ADIF", "Fuente privada", "Fuente publica"]
  }
};

function getLang() {
  return document.documentElement.lang === "es" ? "es" : "en";
}

function rootPrefix() {
  const lang = getLang();
  if (document.body.dataset.page === "detail") {
    return lang === "es" ? "../../../" : "../../";
  }
  return lang === "es" ? "../" : "./";
}

async function loadCatalog(detail = false) {
  const copy = COPY[getLang()];
  const response = await fetch(detail ? copy.detailFile : copy.catalogFile);
  if (!response.ok) throw new Error(`Catalog load failed: ${response.status}`);
  return response.json();
}

function assetPath(path) {
  if (!path) return "";
  if (/^https?:/.test(path)) return path;
  return rootPrefix() + path.replace(/^\.?\//, "");
}

function languageHref() {
  const lang = getLang();
  const page = document.body.dataset.page;
  if (page === "detail") {
    const id = document.body.dataset.app;
    return lang === "es" ? `../../../apps/${id}/` : `../../es/apps/${id}/`;
  }
  return COPY[lang].langHref;
}

function initChrome() {
  const lang = getLang();
  const copy = COPY[lang];
  document.querySelectorAll("[data-copy]").forEach((node) => {
    const key = node.dataset.copy;
    if (copy[key]) node.textContent = copy[key];
  });
  document.querySelectorAll("[data-lang-link]").forEach((node) => {
    node.href = languageHref();
    node.textContent = copy.langLabel;
  });
  const meta = document.querySelector("[data-meta]");
  if (meta) meta.innerHTML = copy.meta.map((item) => `<span>${item}</span>`).join("");
}

function renderFilters(apps) {
  const copy = COPY[getLang()];
  const container = document.querySelector("[data-filters]");
  if (!container) return;
  container.innerHTML = "";
  copy.filters.forEach((filter, index) => {
    const button = document.createElement("button");
    button.className = `filter ${index === 0 ? "active" : ""}`;
    button.type = "button";
    button.textContent = filter;
    button.addEventListener("click", () => {
      container.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderCatalog(apps, filter, copy.filters[0]);
    });
    container.appendChild(button);
  });
}

function matchesFilter(app, filter, allLabel) {
  if (filter === allLabel) return true;
  return app.category === filter || app.source === filter;
}

function renderCatalog(apps, filter, allLabel) {
  const copy = COPY[getLang()];
  const container = document.querySelector("[data-catalog]");
  if (!container) return;
  const visible = apps.filter((app) => matchesFilter(app, filter, allLabel));
  container.innerHTML = visible.map((app) => appCard(app, copy)).join("");
}

function appCard(app, copy) {
  const badgeClass = app.accent === "amber" ? "amber" : "green";
  const icon = app.assets.icon
    ? `<img class="app-icon" src="${assetPath(app.assets.icon)}" alt="">`
    : `<div class="fallback-icon">${app.name.split(".").pop().slice(0, 2)}</div>`;
  return `
    <article class="app-card">
      <a class="app-shot" href="${app.links.details}"><img src="${assetPath(app.assets.screenshot)}" alt="${app.name} screenshot"></a>
      <div class="app-info">
        <div class="app-head">
          <div class="app-name">${icon}<div><h3>${app.name}</h3><small>${app.subtitle}</small></div></div>
          <span class="badge ${badgeClass}">${app.stage}</span>
        </div>
        <p class="app-summary">${app.summary}</p>
        <div class="chips">
          <span class="chip">${app.version}</span>
          <span class="chip">${app.platform}</span>
          <span class="chip">${app.source}</span>
          <span class="chip">${app.license}</span>
        </div>
        <div class="app-actions">
          <a class="mini-link" href="${app.links.details}">${copy.details}</a>
          <a class="mini-link" href="${app.links.release}">${copy.release}</a>
          <a class="mini-link" href="${app.links.repository}">${copy.repo}</a>
        </div>
      </div>
    </article>`;
}

async function renderHome() {
  initChrome();
  const catalog = await loadCatalog(false);
  renderFilters(catalog.apps);
  renderCatalog(catalog.apps, COPY[getLang()].filters[0], COPY[getLang()].filters[0]);
  const roadmap = document.querySelector("[data-roadmap]");
  if (roadmap) roadmap.innerHTML = catalog.roadmap.map((item) => `<span>${item}</span>`).join("");
}

async function renderDetail() {
  initChrome();
  const catalog = await loadCatalog(true);
  const id = document.body.dataset.app;
  const app = catalog.apps.find((item) => item.id === id);
  if (!app) return;
  const copy = COPY[getLang()];
  document.title = `${app.name} - 6SNT Micro Apps`;
  document.querySelector("[data-app-name]").textContent = app.name;
  document.querySelector("[data-app-subtitle]").textContent = app.subtitle;
  document.querySelector("[data-app-summary]").textContent = app.summary;
  document.querySelector("[data-app-description]").textContent = app.description;
  document.querySelector("[data-app-shot]").src = assetPath(app.assets.screenshot);
  document.querySelector("[data-app-shot]").alt = `${app.name} screenshot`;
  document.querySelector("[data-app-stage]").textContent = app.stage;
  document.querySelector("[data-app-version]").textContent = app.version;
  document.querySelector("[data-app-platform]").textContent = app.platform;
  document.querySelector("[data-app-source]").textContent = app.source;
  document.querySelector("[data-app-license]").textContent = app.license;
  document.querySelector("[data-app-features]").innerHTML = app.features.map((item) => `<li>${item}</li>`).join("");
  document.querySelector("[data-app-safety]").innerHTML = app.safety.map((item) => `<li>${item}</li>`).join("");
  document.querySelector("[data-app-notfor]").textContent = app.notFor;
  document.querySelector("[data-release-link]").href = app.links.release;
  document.querySelector("[data-repo-link]").href = app.links.repository;
  document.querySelector("[data-sha-exe]").textContent = app.sha256.exe || "-";
  document.querySelector("[data-sha-zip]").textContent = app.sha256.zip || "-";
}

if (document.body.dataset.page === "detail") {
  renderDetail().catch((error) => console.error(error));
} else {
  renderHome().catch((error) => console.error(error));
}
