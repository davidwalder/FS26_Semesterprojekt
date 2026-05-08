async function loadData() {
    const url1 = 'https://www.vogelwarte.ch/wp-content/assets/json/bird/list_de.json'; // mit korrekter API-URL ersetzen
    const url2 = 'https://www.vogelwarte.ch/wp-content/assets/json/bird/species/700_de.json'; // mit korrekter API-URL ersetzen
    try {
        const response1 = await fetch(url1);
        return await response1.json();
    } catch (error) {
        console.error(error);
        return false;
    }
}
const data = await loadData();
console.log(data); // gibt die Daten der API oder false in der Konsole aus


