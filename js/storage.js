const KEY = "pokedex_favorites";

export const getFavorites = () => {
    const favorites = localStorage.getItem(KEY);
    return favorites ? JSON.parse(favorites) : [];
};


export const saveFavorite = (pokemonName) => {
    const favorites = getFavorites();
    if (!favorites.includes(pokemonName)) {
        favorites.push(pokemonName);
        localStorage.setItem(KEY, JSON.stringify(favorites));
        console.log(`${pokemonName} guardado en My Pokemons`);
    }
};
export const removeFavorite = (name) => {
    const favorite = getFavorites().filter(p => p.name !== name);
    localStorage.setItem(KEY, JSON.stringify(favorite));
};