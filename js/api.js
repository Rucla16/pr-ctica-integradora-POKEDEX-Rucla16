export class API {
    static BASE_USR = "https://pokeapi.co/api/v2/pokemon/";

    static async getPokemon(name) {
        try {
            const response = await fetch(`${this.BASE_USR}${name}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching Pokémon data:", error);
            throw error;
        }
    }

    static async getEvolutionChain(pokemonData) {
        const speciesRes = await fetch(pokemonData.species.url);
        const speciesData = await speciesRes.json();

        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        let evolutions = [];
        let current = evoData.chain;
        while (current) {
            evolutions.push(current.species.name);
            current = current.evolves_to[0];
        }
        return evolutions;
    }

    static async getPokemonSprites(namesArray) {
        const promises = namesArray.map(name => this.getPokemon(name));
        const pokemons = await Promise.all(promises);
        return pokemons.map(p => ({
            name: p.name,
            sprite: p.sprites.front_default
        }));
    }
}
