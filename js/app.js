/* =========================
   CARGA DE SECCIONES HTML
========================= */

function loadSection(id, file) {
    fetch(file)
        .then(res => res.text())
        .then(html => {
            document.getElementById(id).innerHTML = html;
        })
        .catch(err => console.error("Error cargando sección:", err));
}

document.addEventListener("DOMContentLoaded", () => {
    loadSection("main-section", "secciones/main.html");
    loadSection("estaciones-section", "secciones/estaciones.html");
    loadSection("especies-section", "secciones/especies.html");

    loadSpeciesData();
});


/* =========================
   NAVEGACIÓN
========================= */

function hideAllSections() {
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("active");
    });
}

function showSeason(season) {
    // Ocultar sección principal
    hideAllSections();

    document.getElementById("estaciones-section").classList.add('active')
    // Mostrar la estación seleccionada
    document.getElementById(season + '-section').classList.add('active');

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function showMain() {
    hideAllSections();
    document.getElementById("main-section").classList.add("active");
}

function showSpecies() {
    hideAllSections();
    document.getElementById("especies-section").classList.add("active");
}

function showSpeciesDetail(id) {
    hideAllSections();

    let detail = document.getElementById(`detail-${id}`);

    if (!detail) {
        createPlaceholderSpecies(id);
        detail = document.getElementById(`detail-${id}`);
    }

    detail.classList.add("active");
}

function createPlaceholderSpecies(id) {
    const container = document.getElementById("species-details-container");

    const div = document.createElement("div");
    div.id = `detail-${id}`;
    div.className = "section active";

    div.innerHTML = `
        <button class="back-button" onclick="showSpecies()">← Volver a especies</button>

        <div class="species-detail">
            <h2>🌿 Información en preparación</h2>
            <p class="scientific">(Próximamente)</p>

            <div class="species-text">
                <p>
                    Estamos trabajando para incorporar la información completa
                    de esta especie.
                </p>
                <p>
                    Gracias por tu interés y por ayudarnos a valorar nuestra flora nativa.
                </p>

                <div class="species-info-box">
                    <p>🚧 Página en mantenimiento</p>
                </div>
            </div>
        </div>
    `;

    container.appendChild(div);
}

/* =========================
   ESPECIES (JSON)
========================= */

function loadSpeciesData() {
    fetch("data/especies.json")
        .then(res => res.json())
        .then(species => {
            species.forEach(createSpeciesDetail);
        })
        .catch(err => console.error("Error cargando especies:", err));
}

function createSpeciesDetail(s) {
    const container = document.getElementById("species-details-container");

    const div = document.createElement("div");
    div.id = `detail-${s.id}`;
    div.className = "section";

    div.innerHTML = `
        <button class="back-button" onclick="showSpecies()">← Volver a especies</button>

        <div class="species-detail">
            <h2>${s.name}</h2>
            <p class="scientific">(${s.scientific})</p>

            <div class="species-images">
                ${s.images.map(img => `
                    <img src="${img}" alt="${s.name}">
                `).join("")}
            </div>

            <div class="species-text">
                ${s.description.map(p => `<p>${p}</p>`).join("")}

                <div class="species-info-box">
                    <p>🦋 ${s.pollination}</p>
                    <p>🌼 ${s.flowering}</p>
                    <p>⚕ <strong>Uso medicinal:</strong> ${s.medicinal}</p>
                </div>
            </div>
        </div>
    `;

    container.appendChild(div);
}
