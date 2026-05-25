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

(async () => {
    const birds = await loadBirdList();
    birds
        .sort((a, b) => a.artname.localeCompare(b.artname, 'de'))
        .forEach(bird => {
            const card = document.createElement('div');
            card.classList.add('card');

            const img = document.createElement('img');
            img.src = `https://www.vogelwarte.ch/wp-content/uploads/2026/03/${bird.artid}_1.jpg`;
            img.alt = bird.artname;

            const name = document.createElement('h2');
            name.innerText = bird.artname;

            const lebensraum = document.createElement('p');
            lebensraum.innerText = lebensraumMap[bird.filterlebensraum] || 'Unbekannt';

            const infos = document.createElement('p');
            infos.innerText = 'Klicke für mehr Infos';

            const button = document.createElement('button');
            const bereitsImWarenkorb = warenkorb.some(b => b.artid === bird.artid);
            button.innerText = bereitsImWarenkorb ? '✓ Auf der Liste' : '+ Zur Wanderliste';
            if (bereitsImWarenkorb) card.classList.add('ausgewaehlt');

            card.addEventListener('click', async () => {
                if (infos.innerText !== 'Klicke für mehr Infos') {
                    infos.innerText = 'Klicke für mehr Infos';
                    return;
                }
                const detail = await loadSpeciesInfo(bird.artid);
                if (detail) infos.innerText = detail.infos || 'Keine Infos verfügbar';
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

            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(lebensraum);
            card.appendChild(infos);
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