export class Storage {
    static KEY = "pokedex_favorites";

    static getFavorites() {
        const favorites = localStorage.getItem(this.KEY);
        return favorites ? JSON.parse(favorites) : [];
    }

    static saveFavorite(pokemonName) {
        const favorites = this.getFavorites();
        if (!favorites.includes(pokemonName)) {
            favorites.push(pokemonName);
            localStorage.setItem(this.KEY, JSON.stringify(favorites));
            console.log(`${pokemonName} guardado en My Pokemons`);
        }
    }

    static removeFavorite(name) {
        const favorites = this.getFavorites().filter(p => p.name !== name);
        localStorage.setItem(this.KEY, JSON.stringify(favorites));
    }
}
