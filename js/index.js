const grid = document.getElementById("mainPkmGrid");
const search = document.getElementById("pkmSearchInput");

const typeColors = {
    grass: "#78C850", fire: "#F08030", water: "#6890F0", bug: "#A8B820",
    normal: "#A8A878", poison: "#A040A0", electric: "#F8D030", ground: "#E0C068",
    fairy: "#EE99AC", fighting: "#C03028", psychic: "#F85888", rock: "#B8A038",
    ghost: "#705898", ice: "#98D8D8", dragon: "#7038F8", flying: "#A890F0",
    steel: "#B8B8D0", dark: "#705848"
};


async function carregarPokemon(id) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then((res) => res.json());
}

async function carregarPokemons(numero) {
    const promeses = [];
    for (let i = 1; i <= numero; i++) {
        promeses.push(carregarPokemon(i));
    }

    try {
        const totsElsPokemon = await Promise.all(promeses);
        totsElsPokemon.forEach(pokemon => {
            crearPokemon(pokemon);
        })
    } catch (error) {
        console.error("Error carregant la Pokédex", error);
    }
}

function crearPokemon(pokemon) {
    const carta = document.createElement('div');
    
    carta.classList.add('pokemon-block');
    
    carta.addEventListener("click", () => {
        window.location.href = `details.html?id=${pokemon.id}`;
    });

    const contenidorSprites = document.createElement('div');
    contenidorSprites.classList.add('img-container');

    const sprite = document.createElement('img');
    sprite.src = pokemon.sprites.front_default;

    contenidorSprites.appendChild(sprite);

    const numero = document.createElement('p');
    numero.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;

    const name = document.createElement('p');
    name.classList.add('name');
    name.textContent = pokemon.name;

    const typesContainer = document.createElement('div');
    typesContainer.classList.add('types-container');

    pokemon.types.forEach(typeInfo => {
        const typeTag = document.createElement('span');
        const typeName = typeInfo.type.name;
        typeTag.textContent = typeName;
        typeTag.classList.add('type-badge');

        typeTag.style.backgroundColor = typeColors[typeName] || "#777";
        typesContainer.appendChild(typeTag);

    });
    carta.appendChild(contenidorSprites);
    carta.appendChild(numero);
    carta.appendChild(name);
    carta.appendChild(typesContainer);
    grid.appendChild(carta);
}

function buscador() {
    search.addEventListener('input', (event) => {
        const textUsuari = event.target.value.toLowerCase();
        const pokemonsEnPantalla = document.querySelectorAll('.pokemon-block');

        pokemonsEnPantalla.forEach(tarjeta => {
            const nombrePokemon = tarjeta.querySelector('.name').textContent.toLowerCase();
            const numeroPokemon = tarjeta.querySelector('p').textContent;
            
            if (nombrePokemon.includes(textUsuari) || numeroPokemon.includes(textUsuari)) {
                tarjeta.style.display = "block";
            } else {
                tarjeta.style.display = "none";
            }
        });
    });
}

carregarPokemons(151);
buscador();

