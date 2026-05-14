export const createPokemonCard = (pokemon, typeColors) => {
    const carta = document.createElement('div');
    carta.classList.add('pokemon-block');
    
    carta.addEventListener("click", () => {
        window.location.href = `details.html?id=${pokemon.id}`;
    });

    const typeTags = pokemon.types.map(typeInfo => {
        const name = typeInfo.type.name;
        return `<span class="type-badge" style="background-color: ${typeColors[name] || '#777'}">${name}</span>`;
    }).join('');

    carta.innerHTML = `
        <div class="img-container">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        </div>
        <p>#${pokemon.id.toString().padStart(3, '0')}</p>
        <p class="name">${pokemon.name}</p>
        <div class="types-container">${typeTags}</div>
        <button class="btn-fav" onclick="event.stopPropagation();">⭐</button>
    `;
    return carta;
};

export const renderDetails = (pokemon, evoData, typeColors) => {
    const container = document.getElementById("pokemonDetail");
    container.textContent = ""; // Limpiamos el contenedor de forma segura

    const wrapper = document.createElement("div");
    wrapper.classList.add("details-wrapper");

    // --- COLUMNA IZQUIERDA ---
    const leftCol = document.createElement("div");
    leftCol.classList.add("left-column");

    const img = document.createElement("img");
    img.src = pokemon.sprites.other['official-artwork'].front_default;
    img.alt = pokemon.name;

    const name = document.createElement("h2");
    name.classList.add("poke-name");
    name.textContent = pokemon.name.toUpperCase();

    const typesRow = document.createElement("div");
    typesRow.classList.add("types-row");
    pokemon.types.forEach(t => {
        const span = document.createElement("span");
        span.classList.add("type-badge");
        span.style.backgroundColor = typeColors[t.type.name] || "#777";
        span.textContent = t.type.name;
        typesRow.appendChild(span);
    });

    leftCol.append(img, name, typesRow);

    // --- COLUMNA DERECHA ---
    const rightCol = document.createElement("div");
    rightCol.classList.add("right-column");

    // 1. Card de Poder (Media)
    const cardStats = document.createElement("div");
    cardStats.classList.add("card");
    const h3Stats = document.createElement("h3");
    h3Stats.textContent = "Poder Total (Media)";
    
    const totalStats = pokemon.stats.reduce((acc, s) => acc + s.base_stat, 0);
    const avg = totalStats / pokemon.stats.length;
    
    const barBg = document.createElement("div");
    barBg.classList.add("stat-bar-bg");
    const barFill = document.createElement("div");
    barFill.classList.add("stat-bar-fill");
    barFill.style.width = `${(avg / 255) * 100}%`;
    barBg.appendChild(barFill);

    const pStats = document.createElement("p");
    pStats.textContent = `${Math.round(avg)} pts`;
    cardStats.append(h3Stats, barBg, pStats);

    // 2. Card de Habilidades
    const cardSkills = document.createElement("div");
    cardSkills.classList.add("card");
    const h3Skills = document.createElement("h3");
    h3Skills.textContent = "Habilidades";
    const ulSkills = document.createElement("ul");
    ulSkills.classList.add("skills-list");
    pokemon.abilities.forEach(a => {
        const li = document.createElement("li");
        li.textContent = a.ability.name;
        ulSkills.appendChild(li);
    });
    cardSkills.append(h3Skills, ulSkills);

    // 3. Card de Evoluciones
    const cardEvo = document.createElement("div");
    cardEvo.classList.add("card");
    const h3Evo = document.createElement("h3");
    h3Evo.textContent = "Cadena Evolutiva";
    const evoContainer = document.createElement("div");
    evoContainer.classList.add("evo-container");

    let evolutions = [];
    let current = evoData.chain;
    while (current) {
        evolutions.push(current.species.name);
        current = current.evolves_to[0];
    }

    evolutions.forEach((evoName, i) => {
        const spanName = document.createElement("span");
        spanName.classList.add("evo-name");
        spanName.textContent = evoName;
        evoContainer.appendChild(spanName);

        if (i < evolutions.length - 1) {
            const arrow = document.createElement("span");
            arrow.classList.add("arrow");
            arrow.textContent = "→";
            evoContainer.appendChild(arrow);
        }
    });
    cardEvo.append(h3Evo, evoContainer);

    // Ensamblaje final
    rightCol.append(cardStats, cardSkills, cardEvo);
    wrapper.append(leftCol, rightCol);
    container.appendChild(wrapper);
};