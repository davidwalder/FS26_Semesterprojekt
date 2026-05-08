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

(async () => {
    const list    = await loadBirdList();
    const species = await loadSpeciesInfo(700);
    console.log('Bird list:', list);
    console.log('Species 700:', species);
})();

// daten darstellen
function showBirds(id) {
    // container leeren
    container.innerHTML = '';
}

// daten filtern 
let filtered_birds = all_birds.filter(bird => {
    return 
})

