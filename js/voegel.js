const container = document.querySelector('#content');
let warenkorb = [];

const lebensraumMap = {
    "1": "Kulturland / Gebirge", "2": "Seen", "3": "Fliessgewässer",
    "4": "Gebirge", "5": "Wald", "6": "Feuchtgebiete",
    "7": "Wald & Kulturland", "8": "Feuchtgebiete & Gewässer",
    "9": "Fliessgewässer & Wald", "10": "Siedlungen"
};

async function loadBirdList() {
    const response = await fetch('PHP-CORS-BRIDGE/api_bridge_auto.php?endpoint=list');
    if (!response.ok) return [];
    return await response.json();
}

async function loadSpeciesInfo(id) {
    const response = await fetch(`PHP-CORS-BRIDGE/api_bridge_auto.php?endpoint=species&id=${id}`);
    if (!response.ok) return false;
    return await response.json();
}

function getBadgeInfo(values) {
    if (!Array.isArray(values)) values = values ? [String(values)] : [];
    if (values.some(v => ['1', '4'].includes(v)))            return { cls: 'badge-berg',   label: 'Berglandschaften' };
    if (values.some(v => ['2', '3', '8', '9'].includes(v)))  return { cls: 'badge-wasser', label: 'Seen & Gewässer' };
    if (values.some(v => ['5', '6', '7', '10'].includes(v))) return { cls: 'badge-wald',   label: 'Wälder & Wiesen' };
    return { cls: 'badge-wald', label: 'Wälder & Wiesen' };
}

// ── Hilfsfunktion: eine Vogelkarte bauen (für Hauptseite UND Wanderliste) ──
function buildBirdCard(bird) {
    const card = document.createElement('div');
    card.classList.add('card');

    const image = document.createElement('img');
    image.src = `https://www.vogelwarte.ch/wp-content/uploads/2026/03/${bird.artid}_1.jpg`;
    image.alt = bird.artname;

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('card-title');

    const name = document.createElement('h2');
    name.innerText = bird.artname;

    const latin = document.createElement('p');
    latin.classList.add('card-latin');
    latin.innerText = '';

    cardTitle.appendChild(name);
    cardTitle.appendChild(latin);

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    const badge = document.createElement('span');
    const badgeInfo = getBadgeInfo(bird.filterlebensraum);
    badge.classList.add('card-badge', badgeInfo.cls);
    badge.innerText = badgeInfo.label;

    const details = document.createElement('div');
    details.classList.add('card-details');

    const groesseRow = document.createElement('div');
    groesseRow.classList.add('card-detail-row');
    groesseRow.innerHTML = `<span class="card-detail-label">Größe:</span><span class="card-detail-value">—</span>`;

    const nahrungRow = document.createElement('div');
    nahrungRow.classList.add('card-detail-row');
    nahrungRow.innerHTML = `<span class="card-detail-label">Nahrung:</span><span class="card-detail-value">—</span>`;

    const infosRow = document.createElement('div');
    infosRow.classList.add('card-detail-row');
    infosRow.style.display = 'none';
    infosRow.innerHTML = `<span class="card-detail-label">Infos:</span><span class="card-detail-value">—</span>`;

    details.appendChild(groesseRow);
    details.appendChild(nahrungRow);
    details.appendChild(infosRow);
    cardContent.appendChild(badge);
    cardContent.appendChild(details);

    card.appendChild(image);
    card.appendChild(cardTitle);
    card.appendChild(cardContent);

    // Species-Info laden und einsetzen
    loadSpeciesInfo(bird.artid).then(detail => {
        if (!detail) return;
        if (detail.artname_lat) latin.innerText = detail.artname_lat;
        if (detail.eigenschaften) {
            const laenge = detail.eigenschaften.laenge_cm;
            groesseRow.querySelector('.card-detail-value').innerText = laenge ? laenge + ' cm' : '—';
            nahrungRow.querySelector('.card-detail-value').innerText = detail.eigenschaften.nahrung || '—';
        }
        if (detail.infos) {
            infosRow.querySelector('.card-detail-value').innerText = detail.infos;
            infosRow.style.display = 'flex';
        }
    });

    return card;
}

// ── Hauptkarten laden ──
(async () => {
    const birds = await loadBirdList();
    birds
        .sort((a, b) => a.artname.localeCompare(b.artname, 'de'))
        .forEach(bird => {
            const card = buildBirdCard(bird);

            const button = document.createElement('button');
            const bereitsImWarenkorb = warenkorb.some(b => b.artid === bird.artid);
            button.innerText = bereitsImWarenkorb ? '✓ Auf der Liste' : '+ Zur Wanderliste';
            if (bereitsImWarenkorb) card.classList.add('ausgewaehlt');

            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = warenkorb.findIndex(b => b.artid === bird.artid);
                if (index === -1) {
                    warenkorb.push(bird);
                    button.innerText = '✓ Auf der Liste';
                    card.classList.add('ausgewaehlt');
                } else {
                    warenkorb.splice(index, 1);
                    button.innerText = '+ Zur Wanderliste';
                    card.classList.remove('ausgewaehlt');
                }
                updateWarenkorb();
            });

            card.appendChild(button);
            container.appendChild(card);
        });
})();

// ── Wanderliste aktualisieren ──
function updateWarenkorb() {
    const liste         = document.querySelector('#warenkorb-liste');
    const leer          = document.querySelector('#warenkorb-leer');
    const count         = document.querySelector('#warenkorb-count');
    const headerLeer    = document.querySelector('#warenkorb-header-leer');
    const headerGefuellt = document.querySelector('#warenkorb-header-gefuellt');

    count.textContent = `(${warenkorb.length})`;

    if (warenkorb.length === 0) {
        // ── Leerer Zustand ──
        leer.style.display          = 'flex';
        liste.style.display         = 'none';
        headerLeer.style.display    = 'flex';
        headerGefuellt.style.display = 'none';
        liste.innerHTML = '';
        return;
    }

    // ── Befüllter Zustand ──
    leer.style.display          = 'none';
    liste.style.display         = 'block';
    headerLeer.style.display    = 'none';
    headerGefuellt.style.display = 'flex';

    const heute = new Date().toLocaleDateString('de-CH', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    liste.innerHTML = `
        <div class="wanderliste-inhalt">
            <div class="wanderliste-titelbereich">
                <p class="wanderliste-titel">Meine Wanderliste</p>
                <p class="wanderliste-untertitel">Vogelführer für die Schweizer Natur</p>
                <p class="wanderliste-datum">Erstellt am ${heute}</p>
            </div>
            <h3 class="wanderliste-sektion-titel">Vogelarten (${warenkorb.length})</h3>
            <div class="wanderliste-karten" id="wanderliste-karten-container"></div>
            <div class="wanderliste-footer">
                <p>Viel Freude beim Vogelbeobachten in der Schweizer Natur!</p>
                <p>Erstellt mit voegle.ch</p>
            </div>
        </div>
    `;

    const kartenContainer = document.querySelector('#wanderliste-karten-container');

    warenkorb.forEach(bird => {
        const karte = buildBirdCard(bird);
        karte.classList.add('wanderliste-karte');
        // Kein Wanderliste-Button innerhalb der Wanderliste
        kartenContainer.appendChild(karte);
    });
}

// ── Event-Listeners ──
const backdrop = document.querySelector('#warenkorb-backdrop');

document.querySelector('#warenkorb-toggle').addEventListener('click', () => {
    document.querySelector('#warenkorb').classList.toggle('offen');
    backdrop.classList.toggle('offen');
});
document.querySelector('#warenkorb-schliessen').addEventListener('click', () => {
    document.querySelector('#warenkorb').classList.remove('offen');
    backdrop.classList.remove('offen');
});
backdrop.addEventListener('click', () => {
    document.querySelector('#warenkorb').classList.remove('offen');
    backdrop.classList.remove('offen');
});
document.querySelector('#nav-wanderliste-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#warenkorb').classList.add('offen');
    backdrop.classList.add('offen');
});
document.querySelector('#warenkorb-exportieren')?.addEventListener('click', () => {
    window.print();
});