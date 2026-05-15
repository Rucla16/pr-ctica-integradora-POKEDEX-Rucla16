import * as API from './api.js';
import * as UI from './ui.js';
import * as db from './storage.js';

const typeColors = {
    grass: "#78C850", fire: "#F08030", water: "#6890F0", bug: "#A8B820",
    normal: "#A8A878", poison: "#A040A0", electric: "#F8D030", ground: "#E0C068",
    fairy: "#EE99AC", fighting: "#C03028", psychic: "#F85888", rock: "#B8A038",
    ghost: "#705898", ice: "#98D8D8", dragon: "#7038F8", flying: "#A890F0",
    steel: "#B8B8D0", dark: "#705848"
};


export const initIndex = async () => {
    const grid = document.getElementById("mainPkmGrid");
    const searchInput = document.getElementById("pkmSearchInput");

    
    for (let i = 1; i <= 151; i++) {
        const pokemon = await API.getPokemon(i);
        const card = UI.createPokemonCard(pokemon, typeColors);
        grid.appendChild(card);
    }

    
    searchInput.addEventListener('input', (e) => {
        const text = e.target.value.toLowerCase();
        document.querySelectorAll('.pokemon-block').forEach(card => {
            const name = card.querySelector('.name').textContent.toLowerCase();
            const id = card.querySelector('p').textContent;
            card.style.display = (name.includes(text) || id.includes(text)) ? "flex" : "none";
        });
    });
};


export const initDetails = async (id) => {
    try {
        
        const pokemon = await API.getPokemon(id);
        
        
        const evoNames = await API.getEvolutionChain(pokemon);
        
        
        const evoSprites = await API.getPokemonSprites(evoNames);

        
        UI.renderDetails(pokemon, evoSprites, typeColors);
        
    } catch (error) {
        console.error("Error en details:", error);
    }
};


export const initFavorites = () => {
    const container = document.getElementById("MyPokemons");
    const favorites = db.getFavorites();
    favorites.forEach(async (name) => {
        const pokemon = await API.getPokemon(name);
        const card = UI.createPokemonCard(pokemon, typeColors);
        container.appendChild(card);
    });
};