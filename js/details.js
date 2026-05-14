const params = new URLSearchParams(window.location.search);
const pokemonId = params.get("id");

async function getMoveDetails(moveUrl) {
    const res = await fetch(moveUrl);
    const data = await res.json();
    
    return {
        name: data.name,
        // El tipo del movimiento
        type: data.type ? data.type.name : "normal",
        // El poder (algunos movimientos no tienen poder, devolvemos 0)
        power: data.power || 0,
        // Los Puntos de Poder (PP)
        pp: data.pp || 0
    };
}