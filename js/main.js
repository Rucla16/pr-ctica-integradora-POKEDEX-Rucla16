import * as App from './app.js';

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
    }
});