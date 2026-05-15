import * as API from './api.js';
import * as UI from './ui.js';
import * as db from './storage.js';

const typeColors = {
    grass: "#78C850", fire: "#F08030", water: "#6890F0", bug: "#A8B820",
    normal: "#A8A878", poison: "#A040A0", electric: "#F8D030", ground: "#E0C068",
    fairy: "#EE99AC", fighting: "#C03028", psychic: "#F85888", rock: "#B8A038",
    ghost: "#705898", ice: "#98D8D8", dragon: "#7038F8", flying: "#A890F0",
    steel: "#B8B8D0", dark: "#705848"
};


export const initIndex = async () => {
    const grid = document.getElementById("mainPkmGrid");
    const searchInput = document.getElementById("pkmSearchInput");

    
    for (let i = 1; i <= 151; i++) {
        const pokemon = await API.getPokemon(i);
        const card = UI.createPokemonCard(pokemon, typeColors);
        grid.appendChild(card);
    }

    
    searchInput.addEventListener('input', (e) => {
        const text = e.target.value.toLowerCase();
        document.querySelectorAll('.pokemon-block').forEach(card => {
            const name = card.querySelector('.name').textContent.toLowerCase();
            const id = card.querySelector('p').textContent;
            card.style.display = (name.includes(text) || id.includes(text)) ? "flex" : "none";
        });
    });
};


export const initDetails = async (id) => {
    try {
        
        const pokemon = await API.getPokemon(id);
        
        
        const evoNames = await API.getEvolutionChain(pokemon);
        
        
        const evoSprites = await API.getPokemonSprites(evoNames);

        
        UI.renderDetails(pokemon, evoSprites, typeColors);
        
    } catch (error) {
        console.error("Error en details:", error);
    }
};


export const initFavorites = () => {
    const container = document.getElementById("MyPokemons");
    const favorites = db.getFavorites();
    favorites.forEach(async (name) => {
        const pokemon = await API.getPokemon(name);
        const card = UI.createPokemonCard(pokemon, typeColors);
        container.appendChild(card);
    });
};

export const initHunt = () => {
    const huntZone = document.getElementById("hunt-zone");

    huntZone.addEventListener("click", async (e) => {
        const activeCard = document.querySelector(".wild-encounter-card");
        if (activeCard) {
            activeCard.remove();
            return;
        }

    
        const luck = Math.random();
        if (luck < 0.6) { 
            const missCard = UI.createHuntMissAlert(e.clientX, e.clientY);
            huntZone.appendChild(missCard);
            return; 
        }

        
        const randomId = Math.floor(Math.random() * 151) + 1;
        try {
            const pokemon = await API.getPokemon(randomId);

            
            
            const encounterCard = UI.createHuntAlert(pokemon, e.clientX, e.clientY);
            huntZone.appendChild(encounterCard);
        } catch (error) {
            console.error("Error en la caza:", error);
        }
    });
};



export const initBattle = async (wildId, playerId = null) => {
   try {
        
        const wildPokemon = await API.getPokemon(wildId);
        const favorites = db.getFavorites();

        
        if (!playerId) {
            
            UI.renderTeamSelector(favorites, wildId);
            return; 
        }

        
        const playerPokemon = await API.getPokemon(playerId);

        let wildHP = wildPokemon.stats[0].base_stat;
        let wildMaxHP = wildHP;
        
        let playerHP = playerPokemon.stats[0].base_stat;
        let playerMaxHP = playerHP;

        let isPlayerTurn = true;

        
        UI.setupBattleField(wildPokemon, playerPokemon, wildMaxHP, playerMaxHP);

        
        const executePlayerAttack = async (moveName) => {
            if (!isPlayerTurn || wildHP <= 0 || playerHP <= 0) return;
            isPlayerTurn = false;

            UI.toggleAttackButtons(true);

            const damage = Math.floor(Math.random() * 15) + 5;
            wildHP = Math.max(0, wildHP - damage);
            
            UI.updateBattleLog(`¡${playerPokemon.name.toUpperCase()} usó ${moveName.replace("-", " ")} y causó ${damage} de daño!`);
            UI.updateHPBar("wild", wildHP, wildMaxHP);

            if (wildHP <= 0) {
                setTimeout(() => {
                    UI.updateBattleLog(`¡${wildPokemon.name.toUpperCase()} ha sido debilitado!`);
                    db.saveFavorite(wildPokemon.name);
                    
                    setTimeout(() => {
                        alert(`¡Has capturado a ${wildPokemon.name.toUpperCase()}! Registrado en My Pokemons.`);
                        window.location.href = "my_pokemons.html";
                    }, 2000);
                }, 1500);
                return;
            }

            setTimeout(executeEnemyAttack, 1500);
        };

        const executeEnemyAttack = () => {
            if (playerHP <= 0) return;

            const randomMove = wildPokemon.moves[Math.floor(Math.random() * Math.min(wildPokemon.moves.length, 4))].move.name;
            const damage = Math.floor(Math.random() * 12) + 4;
            
            playerHP = Math.max(0, playerHP - damage);
            
            UI.updateBattleLog(`¡${wildPokemon.name.toUpperCase()} salvaje usó ${randomMove.replace("-", " ")} y causó ${damage} de daño!`);
            UI.updateHPBar("player", playerHP, playerMaxHP);

            if (playerHP <= 0) {
                setTimeout(() => {
                    UI.updateBattleLog(`¡Tu ${playerPokemon.name.toUpperCase()} se ha debilitado! Fin de la batalla.`);
                    setTimeout(() => {
                        window.location.href = "hunt.html";
                    }, 2500);
                }, 1500);
                return;
            }

            setTimeout(() => {
                UI.updateBattleLog(`¿Qué debería hacer ${playerPokemon.name.toUpperCase()}?`);
                UI.toggleAttackButtons(false);
                isPlayerTurn = true;
            }, 1500);
        };

        const playerMoves = playerPokemon.moves.slice(0, 4);
        UI.createAttackButtons(playerMoves, executePlayerAttack);

    } catch (error) {
        console.error("Error iniciando la batalla:", error);
    }
};