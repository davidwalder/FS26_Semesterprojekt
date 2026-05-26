const container = document.querySelector('#content');
let warenkorb = [];

const lebensraumMap = {
    "1": "Kulturland / Gebirge", 
    "2": "Seen", 
    "3": "Fliessgewässer",
    "4": "Gebirge", 
    "5": "Wald", 
    "6": "Feuchtgebiete",
    "7": "Wald & Kulturland", 
    "8": "Feuchtgebiete & Gewässer",
    "9": "Fliessgewässer & Wald", 
    "10": "Siedlungen"
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

function getBadgeInfo(filterlebensraum) {
    const f = String(filterlebensraum);
    if (['1', '4'].includes(f))           return { cls: 'badge-berg',     label: 'Berglandschaften' };
    if (['2', '3', '8', '9'].includes(f)) return { cls: 'badge-wasser',   label: 'Seen & Gewässer' };
    if (['5', '6', '7'].includes(f))      return { cls: 'badge-wald',     label: 'Wälder & Wiesen' };
    if (f === '10')                        return { cls: 'badge-siedlung', label: 'Siedlungen' };
    return { cls: 'badge-siedlung', label: 'Unbekannt' };
}

(async () => {
    const birds = await loadBirdList();
    birds
            birds
        .sort((a, b) => a.artname.localeCompare(b.artname, 'de'))
        .forEach(bird => {
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
            latin.innerText = bird.artname_lat || '';

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

            const merkmaleRow = document.createElement('div');
            merkmaleRow.classList.add('card-detail-row');
            merkmaleRow.innerHTML = `<span class="card-detail-label">Merkmale:</span><span class="card-detail-value">—</span>`;

            details.appendChild(groesseRow);
            details.appendChild(merkmaleRow);
            cardContent.appendChild(badge);
            cardContent.appendChild(details);

            const button = document.createElement('button');
            const bereitsImWarenkorb = warenkorb.some(b => b.artid === bird.artid);
            button.innerText = bereitsImWarenkorb ? '✓ Auf der Liste' : '+ Zur Wanderliste';
            if (bereitsImWarenkorb) card.classList.add('ausgewaehlt');

            card.addEventListener('click', async () => {
                const detail = await loadSpeciesInfo(bird.artid);
                if (detail?.eigenschaften) {
                    groesseRow.querySelector('.card-detail-value').innerText = detail.eigenschaften.groesse || '—';
                    merkmaleRow.querySelector('.card-detail-value').innerText = detail.eigenschaften.merkmale || '—';
                }
            });

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

            card.appendChild(image);
            card.appendChild(cardTitle);
            card.appendChild(cardContent);
            card.appendChild(button);
            container.appendChild(card);
        });
})();

function updateWarenkorb() {
    const liste = document.querySelector('#warenkorb-liste');
    liste.innerHTML = '';
    warenkorb.forEach(bird => {
        const eintrag = document.createElement('div');
        eintrag.classList.add('warenkorb-card');
        const bild = document.createElement('img');
        bild.src = `https://www.vogelwarte.ch/wp-content/uploads/2026/03/${bird.artid}_1.jpg`;
        const name = document.createElement('p');
        name.innerText = bird.artname;
        eintrag.appendChild(bild);
        eintrag.appendChild(name);
        liste.appendChild(eintrag);
    });
}

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