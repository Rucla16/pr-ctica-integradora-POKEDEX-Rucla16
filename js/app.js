import { API } from './api.js';
import { UI } from './ui.js';
import { Storage } from './storage.js';

const TYPE_COLORS = {
    grass: "#78C850", fire: "#F08030", water: "#6890F0", bug: "#A8B820",
    normal: "#A8A878", poison: "#A040A0", electric: "#F8D030", ground: "#E0C068",
    fairy: "#EE99AC", fighting: "#C03028", psychic: "#F85888", rock: "#B8A038",
    ghost: "#705898", ice: "#98D8D8", dragon: "#7038F8", flying: "#A890F0",
    steel: "#B8B8D0", dark: "#705848"
};

class BattleState {
    constructor(wildPokemon, playerPokemon) {
        this.wild = wildPokemon;
        this.player = playerPokemon;

        this.wildMaxHP = wildPokemon.stats[0].base_stat;
        this.wildHP = this.wildMaxHP;

        this.playerMaxHP = playerPokemon.stats[0].base_stat;
        this.playerHP = this.playerMaxHP;

        this.isPlayerTurn = true;
    }

    get isBattleOver() {
        return this.wildHP <= 0 || this.playerHP <= 0;
    }

    playerAttack(moveName) {
        if (!this.isPlayerTurn || this.isBattleOver) return null;
        this.isPlayerTurn = false;

        const damage = Math.floor(Math.random() * 15) + 5;
        this.wildHP = Math.max(0, this.wildHP - damage);
        return damage;
    }

    enemyAttack() {
        if (this.isBattleOver) return null;

        const availableMoves = this.wild.moves.slice(0, 4);
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)].move.name;
        const damage = Math.floor(Math.random() * 12) + 4;

        this.playerHP = Math.max(0, this.playerHP - damage);
        return { moveName: randomMove, damage };
    }
}


export class App {

    static async initIndex() {
        const grid = document.getElementById("mainPkmGrid");
        const searchInput = document.getElementById("pkmSearchInput");

        
        for (let i = 1; i <= 151; i++) {
            const pokemon = await API.getPokemon(i);
            const card = UI.createPokemonCard(pokemon, TYPE_COLORS);
            grid.appendChild(card);
        }

        
        searchInput.addEventListener('input', (e) => {
            const text = e.target.value.toLowerCase();
            document.querySelectorAll('.pokemon-block').forEach(card => {
                const name = card.querySelector('.name').textContent.toLowerCase();
                const id = card.querySelector('p').textContent.toLowerCase();
                card.style.display = (name.includes(text) || id.includes(text)) ? "flex" : "none";
            });
        });
    }

    static async initDetails(id) {
        try {
            const pokemon = await API.getPokemon(id);
            const evoNames = await API.getEvolutionChain(pokemon);
            const evoSprites = await API.getPokemonSprites(evoNames);

            UI.renderDetails(pokemon, evoSprites, TYPE_COLORS);
        } catch (error) {
            console.error("Error en details:", error);
        }
    }

    static async initFavorites() {
        const container = document.getElementById("mainPkmGrid");
        const favorites = Storage.getFavorites();

        console.log("Contenedor encontrado en Favoritos:", container);
        console.log("Pokémon detectados en LocalStorage:", favorites);

        if (!container) {
            console.error("⚠️ ERROR: No se ha encontrado ningún elemento HTML con el ID 'mainPkmGrid' en esta página.");
            return;
        }

        for (const name of favorites) {
            try {
                const pokemon = await API.getPokemon(name);
                console.log(`Cargando a ${name} de la API...`);
                const card = UI.createPokemonCard(pokemon, TYPE_COLORS);
                container.appendChild(card);
            } catch (error) {
                console.error("Error en el bucle de favoritos:", error);
            }
        }
    }


    static initHunt() {
        const huntZone = document.getElementById("hunt-zone");
        console.log("Zona de caza detectada:", huntZone);

        if (!huntZone) {
            console.error("⚠️ ERROR: No se encuentra el elemento '#hunt-zone' en el HTML.");
            return;
        }

        huntZone.addEventListener("click", async (e) => {
            console.log("¡Hiciste clic en la zona de caza!");
            console.log("Qué es App en este momento?", App);
            const activeCard = document.querySelector(".wild-encounter-card");
            if (activeCard) {
                console.log("Había una tarjeta activa, la elimino.");
                activeCard.remove();
                return;
            }

            const luck = Math.random();
            console.log("Probabilidad calculada (luck):", luck);

            if (luck < 0.6) {
                console.log("Mala suerte (no sale nada). Intentando llamar a UI...");
                const missCard = UI.createHuntMissAlert(e.clientX, e.clientY);
                console.log("Resultado devuelto por UI.createHuntMissAlert:", missCard);
                huntZone.appendChild(missCard);
                return;
            }

            const randomId = Math.floor(Math.random() * 151) + 1;
            try {
                const pokemon = await API.getPokemon(randomId);
                console.log(`¡Pokémon salvaje encontrado!: ${pokemon.name}`);
                const encounterCard = UI.createHuntAlert(pokemon, e.clientX, e.clientY);
                console.log("Resultado devuelto por UI.createHuntAlert:", encounterCard);
                huntZone.appendChild(encounterCard);
            } catch (error) {
                console.error("Error en la petición de caza:", error);
            }
        });
    }


    static async initBattle(wildId, playerId = null) {
        try {
            const wildPokemon = await API.getPokemon(wildId);
            const favorites = Storage.getFavorites();

            
            if (!playerId) {
                UI.renderTeamSelector(favorites, wildId);
                return;
            }

            const playerPokemon = await API.getPokemon(playerId);
            
            
            const combat = new BattleState(wildPokemon, playerPokemon);

            UI.setupBattleField(wildPokemon, playerPokemon, combat.wildMaxHP, combat.playerMaxHP);

            
            const handleEnemyTurn = () => {
                const action = combat.enemyAttack();
                if (!action) return;

                UI.updateBattleLog(`¡${combat.wild.name.toUpperCase()} salvaje usó ${action.moveName.replace("-", " ")} y causó ${action.damage} de daño!`);
                UI.updateHPBar("player", combat.playerHP, combat.playerMaxHP);

                if (combat.playerHP <= 0) {
                    setTimeout(() => {
                        UI.updateBattleLog(`¡Tu ${combat.player.name.toUpperCase()} se ha debilitado! Fin de la batalla.`);
                        setTimeout(() => window.location.href = "hunt.html", 2500);
                    }, 1500);
                    return;
                }

                setTimeout(() => {
                    UI.updateBattleLog(`¿Qué debería hacer ${combat.player.name.toUpperCase()}?`);
                    UI.toggleAttackButtons(false);
                    combat.isPlayerTurn = true;
                }, 1500);
            };

            const handlePlayerTurn = async (moveName) => {
                const damage = combat.playerAttack(moveName);
                if (damage === null) return;

                UI.toggleAttackButtons(true);
                UI.updateBattleLog(`¡${combat.player.name.toUpperCase()} usó ${moveName.replace("-", " ")} y causó ${damage} de daño!`);
                UI.updateHPBar("wild", combat.wildHP, combat.wildMaxHP);

                if (combat.wildHP <= 0) {
                    setTimeout(() => {
                        UI.updateBattleLog(`¡${combat.wild.name.toUpperCase()} ha sido debilitado!`);
                        Storage.saveFavorite(combat.wild.name);
                        
                        setTimeout(() => {
                            alert(`¡Has capturado a ${combat.wild.name.toUpperCase()}! Registrado en My Pokemons.`);
                            window.location.href = "my_pokemons.html";
                        }, 2000);
                    }, 1500);
                    return;
                }

                setTimeout(handleEnemyTurn, 1500);
            };

            
            const playerMoves = playerPokemon.moves.slice(0, 4);
            UI.createAttackButtons(playerMoves, handlePlayerTurn);

        } catch (error) {
            console.error("Error iniciando la batalla:", error);
        }
    }
}


