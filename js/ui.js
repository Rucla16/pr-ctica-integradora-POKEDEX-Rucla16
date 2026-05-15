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

    card.addEventListener("click", (event) => {
        event.stopPropagation();
        
        
        sessionStorage.setItem("pokemonEncontrado", pokemon.id);
        
        
        window.location.href = `battle.html?wildId=${pokemon.id}`;
    });
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



export const setupBattleField = (wild, player, wildMaxHP, playerMaxHP) => {
    // Nombres y stats
    document.getElementById("wild-name").textContent = wild.name;
    document.getElementById("player-name").textContent = player.name;
    
    document.getElementById("wild-hp-text").textContent = `${wildMaxHP}/${wildMaxHP}`;
    document.getElementById("player-hp-text").textContent = `${playerMaxHP}/${playerMaxHP}`;

    
    document.getElementById("wild-img").src = wild.sprites.front_default;
    document.getElementById("player-img").src = player.sprites.back_default || player.sprites.front_default;
    
    document.getElementById("battle-text").textContent = `¡Un ${wild.name.toUpperCase()} salvaje apareció! ¡Adelante ${player.name.toUpperCase()}!`;
};

export const createAttackButtons = (moves, onClickCallback) => {
    const panel = document.getElementById("actions-panel");
    panel.textContent = ""; 

    moves.forEach(m => {
        const btn = document.createElement("button");
        btn.classList.add("btn-attack");
        btn.textContent = m.move.name.replace("-", " ");
        btn.addEventListener("click", () => onClickCallback(m.move.name));
        panel.appendChild(btn);
    });
};

export const updateBattleLog = (text) => {
    document.getElementById("battle-text").textContent = text;
};

export const toggleAttackButtons = (disable) => {
    document.querySelectorAll(".btn-attack").forEach(btn => btn.disabled = disable);
};

export const updateHPBar = (side, currentHP, maxHP) => {
    const percentage = (currentHP / maxHP) * 100;
    const bar = document.getElementById(`${side}-hp`);
    const text = document.getElementById(`${side}-hp-text`);

    bar.style.width = `${percentage}%`;
    text.textContent = `${currentHP}/${maxHP}`;

    
    if (percentage > 50) {
        bar.style.backgroundColor = "#2ecc71";
    } else if (percentage > 20) {
        bar.style.backgroundColor = "#f1c40f";
    } else {
        bar.style.backgroundColor = "#e74c3c";
    }
};

export const renderTeamSelector = (favorites, wildId) => {
    const arena = document.getElementById("battle-arena");
    arena.textContent = ""; 

    
    const selectorWrapper = document.createElement("div");
    selectorWrapper.classList.add("selector-wrapper");

    const title = document.createElement("h2");
    title.textContent = favorites.length > 0 ? "ELIGE TU POKÉMON PARA COMBATIR" : "¡NO TIENES POKÉMON! ELIGE UN INICIAL";
    title.classList.add("selector-title");

    const grid = document.createElement("div");
    grid.classList.add("selector-grid");

    
    const listToRender = favorites.length > 0 ? favorites : ["bulbasaur", "charmander", "squirtle"];

    listToRender.forEach(async (name) => {
        const choiceCard = document.createElement("div");
        choiceCard.classList.add("choice-card");

        
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();

        const img = document.createElement("img");
        img.src = data.sprites.front_default;
        img.alt = name;
        img.classList.add("choice-img");

        const pName = document.createElement("p");
        pName.textContent = name.toUpperCase();
        pName.classList.add("choice-name");

        choiceCard.append(img, pName);

        
        choiceCard.addEventListener("click", () => {
            window.location.href = `battle.html?wildId=${wildId}&playerId=${data.id}`;
        });

        grid.appendChild(choiceCard);
    });

    selectorWrapper.append(title, grid);
    arena.appendChild(selectorWrapper);
};