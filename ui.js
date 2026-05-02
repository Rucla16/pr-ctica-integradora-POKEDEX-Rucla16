export const createCard = (pokemon) => {
    const card = document.createElement("div");
    card.className = `pokemon-card type-${pokemon.types[0].type.name}`;
    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        <h3>${pokemon.name.toUpperCase()}</h3>
        <button class="btn-fav" data-name="${pokemon.name}">Add to Favorites</button>
    `;
    return card;
}