import { getPokemon } from "./api.js";
import * as UI from "./ui.js";
import * as db from "./storage.js";

const init = async () => {
    const favorites = db.getFavorites();
    //UI.renderFavorites(favorites);
};

document.querySelector("#search-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const dades = await getPokemon(e.target.pokemonName.value);
    document.querySelector("#pokedex-vessel").appendChild(UI.createCard(dades));
});

init();