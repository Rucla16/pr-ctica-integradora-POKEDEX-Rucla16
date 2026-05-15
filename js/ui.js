import * as db from './storage.js';

export const createPokemonCard = (pokemon, typeColors) => {
    
    const carta = document.createElement('div');
    carta.classList.add('pokemon-block');
    
    carta.addEventListener("click", () => {
        window.location.href = `details.html?id=${pokemon.id}`;
    });

    
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');

    const img = document.createElement('img');
    img.src = pokemon.sprites.front_default;
    img.alt = pokemon.name;
    imgContainer.appendChild(img);

    
    const numero = document.createElement('p');
    numero.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;

    
    const name = document.createElement('p');
    name.classList.add('name');
    name.textContent = pokemon.name;

    
    const typesContainer = document.createElement('div');
    typesContainer.classList.add('types-container');

    pokemon.types.forEach(typeInfo => {
        const typeName = typeInfo.type.name;
        const typeBadge = document.createElement('span');
        typeBadge.classList.add('type-badge');
        typeBadge.style.backgroundColor = typeColors[typeName] || '#777';
        typeBadge.textContent = typeName;
        typesContainer.appendChild(typeBadge);
    });

    
    const btnFav = document.createElement('button');
    btnFav.classList.add('btn-fav');
    btnFav.textContent = "⭐";
   
    btnFav.addEventListener("click", (event) => {
        event.stopPropagation();
        
        console.log(`${pokemon.name} añadido a favoritos`);
    });

    
    carta.appendChild(imgContainer);
    carta.appendChild(numero);
    carta.appendChild(name);
    carta.appendChild(typesContainer);
    carta.appendChild(btnFav);

    return carta;
};

export const renderDetails = (pokemon, evoSprites, typeColors) => {
    const container = document.getElementById("pokemonDetail");
    container.textContent = ""; 
    const wrapper = document.createElement("div");
    wrapper.classList.add("details-wrapper");

    
    const leftCol = document.createElement("div");
    leftCol.classList.add("left-column");

    const cardProfile = document.createElement("div");
    cardProfile.classList.add("card", "profile-card");

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

    cardProfile.append(img, name, typesRow);
    leftCol.append(cardProfile);

    
    const rightCol = document.createElement("div");
    rightCol.classList.add("right-column");

    
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

    const cardEvo = document.createElement("div");
    cardEvo.classList.add("card");

    const h3Evo = document.createElement("h3");
    h3Evo.textContent = "Cadena Evolutiva";

    const evoContainer = document.createElement("div");
    evoContainer.classList.add("evo-container");

    evoSprites.forEach((evo, i) => {
        const evoItem = document.createElement("div");
        evoItem.classList.add("evo-item");
        evoItem.onclick = () => window.location.href = `details.html?id=${evo.name}`;

        const imgEvo = document.createElement("img");
        imgEvo.src = evo.sprite;
        imgEvo.classList.add("evo-sprite");

        const pName = document.createElement("p");
        pName.textContent = evo.name;
        pName.classList.add("evo-name-label");

        evoItem.append(imgEvo, pName);
        evoContainer.appendChild(evoItem);

        if (i < evoSprites.length - 1) {
            const arrow = document.createElement("span");
            arrow.classList.add("arrow");
            arrow.textContent = "→";
            evoContainer.appendChild(arrow);
        }
    });

   
    cardEvo.append(h3Evo, evoContainer); 
    rightCol.appendChild(cardEvo); 
    
    
    wrapper.append(leftCol, rightCol);
    container.appendChild(wrapper);
    
    rightCol.append(cardStats, cardSkills, cardEvo);
    wrapper.append(leftCol, rightCol);
    container.appendChild(wrapper);

   
    const cardMoves = document.createElement("div");
    cardMoves.classList.add("card");

    const h3Moves = document.createElement("h3");
    h3Moves.textContent = "Primeros 10 Movimientos";

    
    const table = document.createElement("table");
    table.classList.add("moves-table");

    
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Movimiento", "Nivel"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    
    const tbody = document.createElement("tbody");
    const primerosMovimientos = pokemon.moves.slice(0, 10);

    primerosMovimientos.forEach(m => {
        const row = document.createElement("tr");

        const cellName = document.createElement("td");
        cellName.textContent = m.move.name.replace("-", " "); 
        cellName.style.textTransform = "capitalize";

        const cellLevel = document.createElement("td");
        
        const level = m.version_group_details[0].level_learned_at;
        cellLevel.textContent = level === 0 ? "MT/Evol" : `Lvl ${level}`;

        row.appendChild(cellName);
        row.appendChild(cellLevel);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    cardMoves.append(h3Moves, table);

    
    rightCol.appendChild(cardMoves);
};

export const createHuntAlert = (pokemon, x, y) => {
    const card = document.createElement("div");
    card.classList.add("wild-encounter-card");

    
    const cardWidth = 180;
    const cardHeight = 200;
    let posX = x - cardWidth / 2;
    let posY = y - cardHeight / 2;

    
    if (posX < 10) posX = 10;
    if (posX + cardWidth > window.innerWidth) posX = window.innerWidth - cardWidth - 10;
    if (posY < 10) posY = 10;
    if (posY + cardHeight > window.innerHeight) posY = window.innerHeight - cardHeight - 10;

    card.style.left = `${posX}px`;
    card.style.top = `${posY}px`;

    
    const img = document.createElement("img");
    img.src = pokemon.sprites.other['official-artwork'].front_default;
    img.classList.add("pokemon-silhouette");

    
    const msg = document.createElement("p");
    msg.classList.add("encounter-text");
    msg.textContent = "¡POKÉMON SALVAJE!";

    const instruction = document.createElement("p");
    instruction.textContent = "Haz clic para ATACAR";
    instruction.style.fontSize = "0.7rem";
    instruction.style.color = "#666";

    card.append(img, msg, instruction);

    
    card.addEventListener("click", (event) => {
        event.stopPropagation();

        window.location.href = `battle.html?wildId=${pokemon.id}`;
    });

    return card;
};

export const createHuntMissAlert = (x, y) => {
    const card = document.createElement("div");
    card.classList.add("wild-encounter-card", "miss-card"); 

    
    const cardWidth = 180;
    const cardHeight = 100; 
    let posX = x - cardWidth / 2;
    let posY = y - cardHeight / 2;

    card.style.left = `${posX}px`;
    card.style.top = `${posY}px`;

   
    const title = document.createElement("p");
    title.classList.add("encounter-text");
    title.textContent = "¡NADA POR AQUÍ!";
    title.style.color = "#e74c3c"; 

    
    const subMsg = document.createElement("p");
    subMsg.textContent = "Sigue buscando entre la hierba...";
    subMsg.style.fontSize = "0.75rem";
    subMsg.style.color = "#666";
    subMsg.style.margin = "5px 0 0 0";

    card.append(title, subMsg);

    
    card.addEventListener("click", (e) => {
        e.stopPropagation();
        card.remove();
    });

    
    setTimeout(() => {
        if (card.parentNode) {
            card.remove();
        }
    }, 1500);

    return card;
};