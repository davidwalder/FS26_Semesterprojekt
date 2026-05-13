//async function loadData() {
    //const url1 = 'https://www.vogelwarte.ch/wp-content/assets/json/bird/list_de.json'; // mit korrekter API-URL ersetzen
   // try {
        //const response1 = await fetch(url1);
        //return await response1.json();
    //} catch (error) {
       // console.error(error);
       // return false;
   // }
//}
//const data = await loadData();
//console.log(data); // gibt die Daten der API oder false in der Konsole aus

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


(async () => {
     all_birds = await loadBirdList();
     all_infos = await loadSpeciesInfo(700);
    console.log('Bird list:', all_birds);
    console.log('Species 700:', all_infos);
})();

// Daten darstellen
function showSpeciesInfo(eigenschaften){}
function showBirdsList(artid){
    // container leeren
    container.innerHTML = '';

    // daten filtern
    let filtered_birds = all_birds.filter(bird => {
        return bird.lebensraum === artid;
    });
    if (artid === '' || artid === undefined) {
        filtered_birds = all_birds;
    }

    // daten aufbereiten und in html schreiben
    filtered_birds.forEach(bird => {
        // einzelne card erstellen
        const card = document.createElement('div');

        // h2 mit name erstellen & befüllen
        const name = document.createElement('h2');
        name.innerText = bird.artname;   // Feld heisst in deiner API "artname", nicht "name"
        
        // p mit Lebensraum erstellen & befüllen
        //const text = all_infos?.eigenschaften?.lebensraum ?? 'unbekannt';
        const lebensraum = document.createElement('p');
        lebensraum.innerText = bird.eigenschaften.lebensraum || 'Nichts definiert';
        
        // p mit allg. infos
        const infos = document.createElement('p');
        infos.innerText = bird.infos;

        container.appendChild(card);
        card.appendChild(name);
        card.appendChild(lebensraum);
        card.appendChild(infos);

    });
}
showBirdsList('');
showSpeciesInfo('');

// -> filtern
const filter_select = document.querySelector('#filter');
filter_select.addEventListener('change', function(event) {
    // filterwert auslesen
    const selected_filter = event.target.value;
    // gefilterte daten anzeigen
    showBirdsList(selected_filter)
    showSpeciesInfo(selected_filter)
})