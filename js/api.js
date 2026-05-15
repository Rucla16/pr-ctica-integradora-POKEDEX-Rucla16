export const BASE_USR = "https://pokeapi.co/api/v2/pokemon/";

export const getPokemon = async (name) => {
    try {
        const response = await fetch(`${BASE_USR}${name}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        throw error;
    }
};

export const getEvolutionChain = async (pokemonData) => {
    // 1. Obtenemos los datos de la especie
    const speciesRes = await fetch(pokemonData.species.url);
    const speciesData = await speciesRes.json();
    
    // 2. Obtenemos la cadena evolutiva
    const evoRes = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoRes.json();
    
    // 3. Extraemos los nombres de la cadena
    let evolutions = [];
    let current = evoData.chain;
    while (current) {
        evolutions.push(current.species.name);
        current = current.evolves_to[0];
    }
    return evolutions; // Devuelve array de nombres: ["pichu", "pikachu", "raichu"]
};

// NUEVA: Obtener sprites de una lista de nombres
export const getPokemonSprites = async (namesArray) => {
    const promises = namesArray.map(name => getPokemon(name));
    const pokemons = await Promise.all(promises);
    return pokemons.map(p => ({
        name: p.name,
        sprite: p.sprites.front_default
    }));
};