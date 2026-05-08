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


async function loadData(endpoint) {
    const url = `PHP-CORS-BRIDGE/api_cors_bridge.php?endpoint=${endpoint}`;
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
    const list    = await loadData('list');
    const species = await loadData('species_700');
    console.log('Bird list:', list);
    console.log('Species 700:', species);
})();