const BASE_USR = "https://pokeapi.co/api/v2/pokemon/";

const getPokemon = async (name) => {
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