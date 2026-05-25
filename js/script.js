// DOM element 
const container = document.querySelector('#content')

// daten holen
async function loadBirdList () {
    return await fetchFromBridge ('list');
}

async function loadSpeciesInfo (id) {
    return await fetchFromBridge ('species', id);
}

async function fetchFromBridge(endpoint, id = null) {
    let url = `PHP-CORS-BRIDGE/api_bridge_auto.php?endpoint=${endpoint}`;
    if (id !== null) url += `&id=${id}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return false;
    }
}

let all_birds = [];
let all_infos = [];
let warenkorb = [];


//(async () => {
    // all_birds = await loadBirdList();
   //  all_infos = await loadSpeciesInfo(700);
// console.log('Bird list:', all_birds);
   // console.log('Species 700:', all_infos);
  //  showBirdsList('');
  //  showSpeciesInfo('');
//})();

(async () => {
    all_birds = await loadBirdList();
})();

// lebensraum map mit listenwerten aus API und bedeutungen
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

// detail lebensraum map mit 425 detailwerten aus API
const detailMap = {
    "10": ["3"],
    "20": ["3"],
    "25": ["3"],
    "30": ["3"],
    "40": ["3"],
    "50": ["2","3"],
    "60": ["3"],
    "70": ["2","3"],
    "80": ["2","3"],
    "90": ["3"],
    "171": ["3"],
    "172": ["3"],
    "190": ["3"],
    "200": ["3"],
    "205": ["3"],
    "290": ["3"],
    "300": ["3"],
    "310": ["3"],
    "320": ["3"],
    "325": ["3"],
    "330": ["3"],
    "340": ["3"],
    "350": ["3"],
    "360": ["3"],
    "370": ["3"],
    "390": ["2","3","5","8","9"],
    "400": ["2","3"],
    "420": ["2","3"],
    "430": ["2","9"],
    "440": ["2","3","8","9"],
    "450": ["2","3"],
    "460": ["2","3","5"],
    "470": ["2","3"],
    "480": ["2","3"],
    "500": ["2","8","9","10"],
    "510": ["2","3","5","9"],
    "520": ["2","3"],
    "530": ["2","3","8","9"],
    "531": ["2","7"],
    "532": ["2","3","8","9"],
    "540": ["3"],
    "550": ["3","8","9"],
    "560": ["3","8","9"],
    "570": ["3","9"],
    "580": ["2","3","8","9"],
    "590": ["2","3","8","9"],
    "600": ["2","3","8","9"],
    "610": ["2","3","8","9"],
    "620": ["2","3","8","9"],
    "622": ["2","3","8","9"],
    "660": ["2","3","8","9"],
    "670": ["2","3","8","9"],
    "680": ["2","3","8","9"],
    "690": ["2","3","8","9"],
    "700": ["2","3","8","9","10"],
    "704": ["2","3","8","9","10"],
    "710": ["3","9"],
    "720": ["2","3","8","9","10"],
    "730": ["2","3"],
    "740": ["2","3"],
    "750": ["2","3"],
    "780": ["2","3"],
    "790": ["2","3"],
    "800": ["2","3","9"],
    "810": ["2","3","10"],
    "811": ["2","3","10"],
    "820": ["2","3"],
    "830": ["2","3"],
    "850": ["2","3"],
    "860": ["2","3"],
    "870": ["2","3"],
    "875": ["2","3"],
    "880": ["2","3"],
    "890": ["2","3"],
    "895": ["3"],
    "900": ["3"],
    "930": ["3"],
    "950": ["3"],
    "980": ["3"],
    "990": ["3"],
    "1020": ["3"],
    "1021": ["3"],
    "1040": ["3"],
    "1050": ["3"],
    "1060": ["3"],
    "1070": ["6","7","8","9"],
    "1080": ["5","7"],
    "1090": ["5","7","8","9","10"],
    "1100": ["2","3","5","8","9","10"],
    "1110": ["5","7"],
    "1130": ["5","7","10"],
    "1140": ["1","6"],
    "1150": ["5","7","8","9"],
    "1170": ["6","8","9"],
    "1190": ["5","7"],
    "1200": ["4"],
    "1240": ["2","3","5","9"],
    "1250": ["2","5","9"],
    "1270": ["2","3","5"],
    "1290": ["4","5","9"],
    "1300": ["1","4","6","9"],
    "1310": ["1","6"],
    "1320": ["4"],
    "1330": ["2","8","9"],
    "1340": ["2","6","8","9"],
    "1350": ["2","8","9"],
    "1360": ["2","3","8"],
    "1370": ["1","5","6"],
    "1380": ["3"],
    "1400": ["7"],
    "1410": ["2","3","6","8","9"],
    "1420": ["1","2","7","8","9","10"],
    "1430": ["2","3","5"],
    "1440": ["1","7","8","9"],
    "1450": ["2","8","9"],
    "1460": ["2","7","8","9"],
    "1470": ["6","7","8","9","10"],
    "1480": ["4","5","7","8","9","10"],
    "1500": ["5"],
    "1510": ["2","5","9"],
    "1540": ["4"],
    "1550": ["5"],
    "1560": ["1","4"],
    "1570": ["6","8","9"],
    "1600": ["7","8","9"],
    "1610": ["8","9"],
    "1620": ["7","8","9"],
    "1640": ["2","5","8","9"],
    "1670": ["2","3"],
    "1680": ["9"],
    "1690": ["2","3"],
    "1700": ["2"],
    "1710": ["2","3"],
    "1720": ["2","3"],
    "1730": ["2","3"],
    "1750": ["2","3"],
    "1770": ["2","3"],
    "1790": ["6","7","8","9"],
    "1800": ["6","8","9"],
    "1810": ["6","8","9"],
    "1815": ["6","8","9"],
    "1820": ["2","3"],
    "1840": ["6","8","9"],
    "1850": ["2","3","8","9"],
    "1870": ["2","3","8","9"],
    "1880": ["8","9"],
    "1890": ["2","3","9"],
    "1910": ["2","3"],
    "1920": ["2","3","7"],
    "1930": ["2","3"],
    "1940": ["2","3","8","9"],
    "1970": ["6","8","9"],
    "2000": ["2","3","6","8","9"],
    "2010": ["2","3","9"],
    "2020": ["2","3","8","9"],
    "2030": ["2","3","8","9"],
    "2040": ["2","3","6","8","9"],
    "2050": ["2","3","5","6","8","9"],
    "2060": ["2","3","9"],
    "2080": ["2","3","9"],
    "2090": ["2","3","6","8","9"],
    "2110": ["2","3","5"],
    "2130": ["2","3","8","9"],
    "2140": ["2","3"],
    "2150": ["2","3"],
    "2160": ["2","3"],
    "2180": ["2","3","6"],
    "2200": ["2","3","8","9"],
    "2210": ["2","3","8","9"],
    "2220": ["2","3","8","9"],
    "2230": ["5"],
    "2240": ["2","3","6"],
    "2250": ["2","3","6"],
    "2270": ["2","3","6"],
    "2280": ["2","3","6"],
    "2300": ["2","3","6"],
    "2320": ["2","3","6","8","9"],
    "2340": ["1","2","3","6"],
    "2350": ["2","3","6"],
    "2360": ["2","3","6"],
    "2370": ["2","3"],
    "2380": ["6","8","9"],
    "2390": ["2","3","6","9"],
    "2400": ["2","3","8","9"],
    "2410": ["2","3"],
    "2420": ["3","6"],
    "2430": ["3","6"],
    "2440": ["6","8"],
    "2460": ["6","8"],
    "2470": ["2","3","6","8"],
    "2480": ["6","8","9"],
    "2490": ["3"],
    "2500": ["3","6"],
    "2510": ["2","3","6"],
    "2520": ["3","6"],
    "2530": ["3"],
    "2540": ["3"],
    "2550": ["2","3","8","9","10"],
    "2561": ["2","3","8","9"],
    "2563": ["2","3","8","9","10"],
    "2564": ["2","3","8","9"],
    "2570": ["2","3","8","9"],
    "2580": ["3"],
    "2590": ["3"],
    "2600": ["3"],
    "2620": ["2","3"],
    "2625": ["3"],
    "2630": ["2","3","8","9","10"],
    "2635": ["3"],
    "2640": ["3"],
    "2660": ["3"],
    "2680": ["3"],
    "2690": ["3"],
    "2700": ["2","3"],
    "2710": ["2","3"],
    "2720": ["2","3"],
    "2730": ["3"],
    "2740": ["3"],
    "2750": ["2","3"],
    "2760": ["3"],
    "2770": ["3"],
    "2800": ["2","3"],
    "2810": ["3"],
    "2820": ["3"],
    "2880": ["3"],
    "2895": ["3","5"],
    "2930": ["6","8"],
    "2971": ["10"],
    "2980": ["5","8"],
    "2990": ["5","7","8","10"],
    "3000": ["5","7","8"],
    "3020": ["10"],
    "3030": ["5","7"],
    "3040": ["2","5","7","9","10"],
    "3070": ["8","9","10"],
    "3080": ["5","7","10"],
    "3090": ["1","2","3","5","8","9"],
    "3110": ["5"],
    "3120": ["5"],
    "3130": ["7","8","9","10"],
    "3140": ["5","7","10"],
    "3170": ["5","7","8","9","10"],
    "3180": ["2","6","8","9"],
    "3200": ["5"],
    "3230": ["1","5","6"],
    "3260": ["1","10"],
    "3270": ["10"],
    "3280": ["10"],
    "3320": ["3"],
    "3330": ["7"],
    "3340": ["6","8"],
    "3350": ["5","6","7","8","9"],
    "3360": ["6","7","8","9","10"],
    "3370": ["5","7","9","10"],
    "3380": ["5","7","9","10"],
    "3390": ["5","7","9","10"],
    "3400": ["5"],
    "3410": ["5","7","10"],
    "3430": ["5"],
    "3440": ["5"],
    "3450": ["5","7","10"],
    "3460": ["5"],
    "3480": ["6","8"],
    "3485": ["6","8"],
    "3490": ["6","8"],
    "3500": ["6","8"],
    "3510": ["6","8"],
    "3540": ["6","8","10"],
    "3560": ["7","8","9"],
    "3570": ["8","9"],
    "3600": ["6","8","9"],
    "3610": ["2","7","9","10"],
    "3620": ["1","2","7","9","10"],
    "3630": ["1","10"],
    "3640": ["1","10"],
    "3650": ["2","3","7"],
    "3660": ["5"],
    "3670": ["1","4","5","7"],
    "3681": ["5","7","8","9","10"],
    "3683": ["5","7","8","9","10"],
    "3700": ["5","7","8","9","10"],
    "3710": ["1","5","7","8","9","10"],
    "3720": ["7","8","9","10"],
    "3740": ["5"],
    "3750": ["5","7"],
    "3770": ["4"],
    "3780": ["4"],
    "3790": ["5","7","10"],
    "3800": ["5","7","10"],
    "3820": ["5","10"],
    "3830": ["5","10"],
    "3860": ["5","7","10"],
    "3870": ["5"],
    "3871": ["5"],
    "3872": ["5"],
    "3880": ["5","7","10"],
    "3890": ["2"],
    "3900": ["2"],
    "3910": ["5","7","10"],
    "3940": ["5"],
    "3950": ["5","7","10"],
    "3960": ["4"],
    "3970": ["3"],
    "3980": ["2","5","7","10"],
    "4000": ["5","7","10"],
    "4010": ["2","5","7"],
    "4020": ["2","5","7"],
    "4040": ["2","5"],
    "4055": ["5","7"],
    "4060": ["4","10"],
    "4070": ["5","7"],
    "4090": ["9"],
    "4100": ["6","7"],
    "4120": ["1","4","9"],
    "4130": ["6","8","9"],
    "4140": ["5","6","7"],
    "4180": ["1","4","7","9"],
    "4190": ["1","7"],
    "4200": ["5"],
    "4230": ["5"],
    "4240": ["5","7","10"],
    "4290": ["5","7","8","9","10"],
    "4300": ["2","5","7","9"],
    "4310": ["5","7","10"],
    "4320": ["5","9"],
    "4370": ["2","3"],
    "4390": ["2","6"],
    "4420": ["2","3","5"],
    "4430": ["2","3"],
    "4440": ["2","3"],
    "4450": ["2","3"],
    "4460": ["2","3"],
    "4470": ["2"],
    "4480": ["2"],
    "4490": ["2","3"],
    "4500": ["2","3"],
    "4510": ["2"],
    "4520": ["6","7"],
    "4530": ["2","5","7"],
    "4560": ["2","5"],
    "4570": ["2","5","7","10"],
    "4580": ["7"],
    "4590": ["5"],
    "4600": ["2","5","7","10"],
    "4610": ["6","7"],
    "4620": ["5","10"],
    "4650": ["5","7"],
    "4660": ["5","7"],
    "4670": ["5","6","7"],
    "4680": ["5","7"],
    "4700": ["5","7"],
    "4710": ["2","9"],
    "4720": ["2","5"],
    "4730": ["5","7","10"],
    "4733": ["5"],
    "4735": ["5"],
    "4740": ["5"],
    "4750": ["5"],
    "4760": ["2","5"],
    "4770": ["5"],
    "4780": ["2","5","7","10"],
    "4785": ["2","5"],
    "4790": ["5","10"],
    "4810": ["5"],
    "4820": ["5"],
    "4830": ["5","10"],
    "4840": ["5","7","10"],
    "4860": ["5","7","10"],
    "4870": ["5","7"],
    "4875": ["5","7"],
    "4890": ["5","7"],
    "4900": ["5","7"],
    "4910": ["1","4"],
    "4930": ["2","9"],
    "4940": ["2","6","8","9"],
    "4950": ["1","6"],
    "4960": ["2","5","8","9"],
    "4970": ["5","6","7","9"],
    "4990": ["2","6","8","9"],
    "5000": ["2","3","4","8","9"],
    "5030": ["2","3","8","9","10"],
    "5050": ["2","3"],
    "5060": ["8","9"],
};

// Daten darstellen
function showSpeciesInfo(eigenschaften){}
function showBirdsList(artid){
    // container leeren
    container.innerHTML = '';

    // daten filtern
  const filterValues = artid ? artid.split(',') : [];
    let filtered_birds = artid === '' || artid === undefined
    ? all_birds
    : all_birds.filter(bird =>
        filterValues.some(f => detailMap[bird.artid]?.includes(f) ?? false)
);

    if (artid === '' || artid === undefined) {
        filtered_birds = all_birds;
    }

filtered_birds.forEach(bird => {
    const card = document.createElement('div');
    const name = document.createElement('h2');
    name.innerText = bird.artname;
    card.classList.add('card');

    const lebensraum = document.createElement('p');
    lebensraum.innerText = lebensraumMap[bird.filterlebensraum] || 'Unbekannt';

    const infos = document.createElement('p');
    infos.innerText = 'Klicke für mehr Infos';

    const image = document.createElement('img');
    image.src = `https://www.vogelwarte.ch/wp-content/uploads/2026/03/${bird.artid}_1.jpg`;
    image.alt = `Bild von ${bird.artname}`;

    // ← button hier, VOR den listeners
    const button = document.createElement('button');
    button.innerText = '+ Zur Wanderliste';

    const bereitsImWarenkorb = warenkorb.some(b => b.artid === bird.artid);
    button.innerText = bereitsImWarenkorb ? '✓ Auf der Liste' : '+ Zur Wanderliste';
    if (bereitsImWarenkorb) card.classList.add('ausgewaehlt');

    // ← card listener
    card.addEventListener('click', async () => {
        if (infos.innerText !== 'Klicke für mehr Infos') {
            infos.innerText = 'Klicke für mehr Infos';
            return;
        }
        const detail = await loadSpeciesInfo(bird.artid);
        if (detail) {
            infos.innerText = detail.infos || 'Keine Infos verfügbar';
            lebensraum.innerText = detail.eigenschaften?.lebensraum || lebensraum.innerText;
        }
    }); // ← card listener schliesst hier

    // ← button listener, NACH dem card listener
    button.addEventListener('click', () => {
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

    container.appendChild(card);
    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(lebensraum);
    card.appendChild(infos);
    card.appendChild(button);
});
}
function updateWarenkorb() {
    const warenkorbContainer = document.querySelector('#warenkorb-liste');
    warenkorbContainer.innerHTML = '';
    warenkorb.forEach(bird => {
        const eintrag = document.createElement('div');
        eintrag.classList.add('warenkorb-card');
        
        const bild = document.createElement('img');
        bild.src = `https://www.vogelwarte.ch/wp-content/uploads/2026/03/${bird.artid}_1.jpg`;
        bild.alt = `Bild von ${bird.artname}`;

        const name = document.createElement('p');
        name.innerText = bird.artname;

        const lebensraum = document.createElement('p');
        lebensraum.innerText = lebensraumMap[bird.filterlebensraum] || 'Unbekannt';

        eintrag.appendChild(bild);
        eintrag.appendChild(name);
        eintrag.appendChild(lebensraum);
        warenkorbContainer.appendChild(eintrag);
    });
}

// -> filtern
//const filter_select = document.querySelector('#filter');
//filter_select.addEventListener('change', function(event) {
    // filterwert auslesen
    //const selected_filter = event.target.value;
    // gefilterte daten anzeigen
   // showBirdsList(selected_filter)
    //showSpeciesInfo(selected_filter)
//})
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

document.querySelectorAll('#lebensraum-map path[data-filter]').forEach(path => {
    path.addEventListener('click', () => {
        showBirdsList(path.dataset.filter);
    });
});
