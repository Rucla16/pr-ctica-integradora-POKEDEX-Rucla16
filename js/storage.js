const KEY = "pokedex_favorites";

export const getFavorites = () => {
    const favorites = localStorage.getItem(KEY);
    return favorites ? JSON.parse(favorites) : [];
};

export const saveFavorite = (name) => {
    const favorites = getFavorites();
    if (!favorites.includes(name)) {
        favorites.push(name);
        localStorage.setItem(KEY, JSON.stringify(favorites));
    }
};

export const removeFavorite = (name) => {
    const favorite = getFavorites().filter(p => p.name !== name);
    localStorage.setItem(KEY, JSON.stringify(favorite));
};