export class Pokemon {
    constructor(apiData) {
        this.id = apiData.id;
        this.name = apiData.name.toUpperCase();
        this.type = apiData.types[0].type.name;
        
        
        this.maxHp = apiData.stats[0].base_stat;
        this.currentHp = this.maxHp;
        this.attack = apiData.stats[1].base_stat;
        
        
        this.moves = apiData.moves.slice(0, 4).map(m => m.move.name);
        this.spriteFront = apiData.sprites.front_default;
        this.spriteBack = apiData.sprites.back_default || apiData.sprites.front_default;
    }

    get isFainted() {
        return this.currentHp <= 0;
    }

    takeDamage(damage) {
        this.currentHp = Math.max(0, this.currentHp - damage);
        return this.currentHp;
    }
}

export class Battle {
    constructor(playerPokemon, wildPokemon) {
        this.player = playerPokemon;
        this.wild = wildPokemon;
        this.isPlayerTurn = true;
    }

    get isOver() {
        return this.player.isFainted || this.wild.isFainted;
    }

    executePlayerTurn(moveName) {
        if (!this.isPlayerTurn || this.isOver) return null;
        
        const baseDamage = Math.floor(this.player.attack * 0.15);
        const randomFactor = Math.floor(Math.random() * 8) + 4;
        const totalDamage = baseDamage + randomFactor;

        this.wild.takeDamage(totalDamage);
        this.isPlayerTurn = false;
        
        return totalDamage;
    }

    executeEnemyTurn() {
        if (this.isOver) return null;

        const randomMove = this.wild.moves[Math.floor(Math.random() * this.wild.moves.length)];
        const baseDamage = Math.floor(this.wild.attack * 0.12);
        const randomFactor = Math.floor(Math.random() * 7) + 3;
        const totalDamage = baseDamage + randomFactor;

        this.player.takeDamage(totalDamage);
        this.isPlayerTurn = true;

        return { moveName: randomMove, damage: totalDamage };
    }
}