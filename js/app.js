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
    initCarouselDelegation();
});

function initCarouselDelegation() {
    document.getElementById("species-details-container").addEventListener("click", (e) => {
        const carousel = e.target.closest(".species-carousel");
        if (!carousel) return;

        const slides = carousel.querySelectorAll(".carousel-slide");
        const dots = carousel.querySelectorAll(".carousel-dot");
        const total = slides.length;
        let current = [...slides].findIndex(s => s.classList.contains("active"));
        if (current < 0) current = 0;

        if (e.target.classList.contains("carousel-prev")) {
            current = (current - 1 + total) % total;
        } else if (e.target.classList.contains("carousel-next")) {
            current = (current + 1) % total;
        } else if (e.target.classList.contains("carousel-dot")) {
            current = parseInt(e.target.dataset.index, 10);
        } else {
            return;
        }

        slides.forEach((s, i) => s.classList.toggle("active", i === current));
        dots.forEach((d, i) => d.classList.toggle("active", i === current));
    });
}


/* =========================
   NAVEGACIÓN
========================= */

let speciesGridScrollPosition = 0;

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
    speciesGridScrollPosition = 0;
    hideAllSections();
    document.getElementById("main-section").classList.add("active");
}

function showSpecies() {
    hideAllSections();
    document.getElementById("especies-section").classList.add("active");
    window.scrollTo({ top: speciesGridScrollPosition, behavior: "smooth" });
}

function showSpeciesDetail(id) {
    speciesGridScrollPosition = window.scrollY;
    hideAllSections();

    let detail = document.getElementById(`detail-${id}`);

    if (!detail) {
        createPlaceholderSpecies(id);
        detail = document.getElementById(`detail-${id}`);
    }

    detail.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
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

            <div class="species-carousel" data-species-id="${s.id}">
                <button class="carousel-btn carousel-prev" aria-label="Anterior">‹</button>
                <div class="carousel-viewport">
                    <div class="carousel-track">
                        ${s.images.map((img, i) => `
                            <div class="carousel-slide ${i === 0 ? 'active' : ''}">
                                <img src="${img}" alt="${s.name}">
                            </div>
                        `).join("")}
                    </div>
                </div>
                <button class="carousel-btn carousel-next" aria-label="Siguiente">›</button>
                <div class="carousel-dots">${s.images.map((_, i) => `
                    <button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Ir a foto ${i + 1}"></button>
                `).join("")}</div>
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
