# PokeDex
# Pràctica Integradora: **PokeDex Web**

> **Cicle:** CFGS Desenvolupament d'Aplicacions Web (DAW) **Mòduls implicats:** 0485 Programació · 0612 DWEC · 0615 Disseny d'interfícies web · 0489 Programació multimèdia i dispositius mòbils.

---

## 1. Descripción general
En este proyecto tenía que crear una PokeDex Web utilizando una estructura de 5 archivos html, cada uno correspondiente a una página de la PokeDex. También tenía que crear los correspondientes css y 5 archivos js que serían los encargados de hacer que la web fuera funcional.

---

## 2. HTML
Como he dicho  tengo 5 archivos **HTML**, que son los siguientes: index.html (este corresponde a la página de inicio de la Pokedex), details.html (este pertenece a la página de detalles de cada Pokemon), my_pokemons.html (que corresponde a la página de los Pokemons que se guardan despues de cazarlos), hunt.html (este pertenece a la sección de caza Pokemon) y battle.html (pertenece a la sección de batallas Pokemon).
Los 5 archivos comparten el mismo encabezado para permitir el acceso de una página a la otra. El index tiene un buscador funcional para poder buscar cualquiera de los 151 primeros Pokemons, tambien los carga en pantalla.
El details tiene 5 contenedores, uno para la imagen en alta resolución de cada Pokemón con su nombre y tipos correspondientes, otro para la media de poder del Pokemón, otro para sus habilidades, otro para su cadena evoutiva y el último para mostrar los 10 primeros movimientos de cada Pokemon.
El my_pokemons muestra todos los Pokemon que se te van guardando automáticamente después de derrotarlos en combate.
El hunt muestra una pantalla en la que puedes hacer click en cualquier lugar de esta para intentar encontrar un Pokemon salvaje.
El battle muestra una pantalla en la que puedes librar batallas con los Pokemons salvajes que encuentres, pudiendo escoger entre los Pokemons de my_pokemons para usarlos en combate.

---

## 3. CSS
Tengo un CSS para cada HTML, los he usado para darles el estilo visual a cada página usando las clases o id de los html o bien los que he creado en el ui.js con document.createElement. He usado elementos como por ejemplo: 
- **display:grid** para mostrar las listas Pokemon en formato de filas y columnas, lo he usado en el catálogo principal del Inicio, en el menú de ataques inferior de la sección de battle. 
- **grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))** para crear de forma automática tantas columnas como quepan en pantalla.
- **display:flex** para alinear elementos en una sola dirección ya sea horizontal o vertical como en las barras de navegación, en las tarjetas individuales de cada Pokemon y en el contenedor de evoluciones.
- **position:relative** en el contenedor del escenario de combate, **position:absolute** en el menú de selección Pokemon de battle.
- **width: 100vw; y height: 100vw;** esto fuerza a cualquier elemento a ocupar exactamente el 100% del ancho y alto de la ventana del navegador.
- **background-size: cover; y background-position: center;** esto sirve para que los fondos de hunt y battle se adapten e incrementen su tamaño proporcionalmente si pixelarse ni deformarse.
- **object-fit: contain;** evita que los sprites oficiales de la API se estiren o se aplasten si cambias el ancho o alto de la caja.
- **transition: all 0.2s ease; y transform: translateY(-5px);** Crea animaciones fluidas en el navegador. Cuando pasas el cursor por encima de un Pokémon, este se eleva suavemente hacia arriba (translateY) o aumenta su escala (scale).
- **box-shadow** Añade sombras profundas difuminadas o sólidas de estilo a los contenedores de datos.
---

### 4. JavaScript
Tengo 6 archivos js en total: main, app, api, storage, models y ui.
- **main.js** es el primero que se ejecuta al abrir la PokeDex en el navegador, básicamente indica al programa donde se encuentra el usuario para ejecutar el código correspondiente y que la página funcione adecuadamente.
- **app.js** es el que contiene la lógica de cada sección, aquí es donde tengo los inicializadores de cada página (initHome, initHunt, initBattle, initFavorites, etc.).
- **En Hunt**: Controla cuándo aparece un Pokémon en la hierba al azar.
- **En Battle**: Contiene todo el motor de turnos del combate (calcula de forma aleatoria el daño de los ataques, resta los puntos de vida, procesa la IA del rival, decide quién gana o pierde, etc).
- **En my_pokemons/Details**: Solicita la información necesaria y le manda las órdenes a ui.js para que lo pinte todo en su sitio.
- **api.js** Su función principal: Se conecta a la base de datos pública de Pokémon (PokéAPI) para descargar la información de cualquier Pokemon, contiene funciones con fetch que le piden a la API los datos de un Pokémon por su nombre o ID (sus imágenes, estadísticas base, tipos y lista de movimientos disponibles). 
Devuelve esa información en formato de objeto ordenado para que el resto del juego pueda trabajar con ella.
- **storage.js** Gestiona el almacenamiento local en el navegador utilizando localStorage, guarda y lee la lista de los Pokémon (my_pokemons) que vas capturando en hunt. Cuando derrotas a un Pokémon en combate, lo registra en el disco duro del navegador para que no se borre al cerrar la pestaña o refrescar la página.
- **models.js** contiene 2 clases Pokemon y Battle que gestionan todos los datos de los Pokemon y de la parte de battle.
- **ui.js** Manipula el DOM del navegador creando elementos HTML dinámicos desde cero utilizando document.createElement, construye las tarjetas de los Pokémon con sus colores correspondientes según el tipo en el Inicio y en my_pokemons.
Genera el menú flotante interactivo para elegir qué Pokémon enviar a combatir, modifica las barras de salud (HP) en tiempo real en la pantalla de batalla y pinta los textos del registro de combate.
Monta las tablas de ataques y los gráficos de barras en la sección de detalles de la Pokédex.

