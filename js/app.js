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

// Lógica para la Home
export const initIndex = async () => {
    const grid = document.getElementById("mainPkmGrid");
    const searchInput = document.getElementById("pkmSearchInput");

    // Cargar los 151 originales
    for (let i = 1; i <= 151; i++) {
        const pokemon = await API.getPokemon(i);
        const card = UI.createPokemonCard(pokemon, typeColors);
        grid.appendChild(card);
    }

    // Buscador
    searchInput.addEventListener('input', (e) => {
        const text = e.target.value.toLowerCase();
        document.querySelectorAll('.pokemon-block').forEach(card => {
            const name = card.querySelector('.name').textContent.toLowerCase();
            const id = card.querySelector('p').textContent;
            card.style.display = (name.includes(text) || id.includes(text)) ? "flex" : "none";
        });
    });
};

// Lógica para Detalles
// Busca tu función initDetails y déjala así:
export const initDetails = async (id) => {
    try {
        // 1. Obtenemos el pokemon base
        const pokemon = await API.getPokemon(id);
        
        // 2. Obtenemos la lista de nombres de su línea evolutiva
        const evoNames = await API.getEvolutionChain(pokemon);
        
        // 3. Obtenemos los objetos {name, sprite} de esos nombres (ESTO ES LO QUE FALTABA)
        const evoSprites = await API.getPokemonSprites(evoNames);

        // 4. Ahora sí, evoSprites existe y se puede pasar a UI
        UI.renderDetails(pokemon, evoSprites, typeColors);
        
    } catch (error) {
        console.error("Error en details:", error);
    }
};

// Lógica para Favoritos
export const initFavorites = () => {
    const container = document.getElementById("MyPokemons");
    const favorites = db.getFavorites();
    favorites.forEach(async (name) => {
        const pokemon = await API.getPokemon(name);
        const card = UI.createPokemonCard(pokemon, typeColors);
        container.appendChild(card);
    });
};