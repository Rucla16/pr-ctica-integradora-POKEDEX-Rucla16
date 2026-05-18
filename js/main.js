import { App } from './app.js';

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    
    if (path.includes("index.html") || path.endsWith("/")) {
        App.initIndex();
    } else if (path.includes("details.html")) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (id) App.initDetails(id);
    } else if (path.includes("my_pokemons.html")) {
        App.initFavorites();
    } else if (path.includes("hunt.html")) {
        App.initHunt();
    } else if (path.includes("battle.html")) {
        const params = new URLSearchParams(window.location.search);
        const wildId = params.get("wildId");
        const playerId = params.get("playerId");
        
        if (wildId) {

            App.initBattle(wildId, playerId); 
        }
    }
});