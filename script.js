document.addEventListener('DOMContentLoaded', () => {
    // Puzzle code
    const puzzleContainer = document.querySelector('.puzzle-container');
    const size = 4; // Tamaño del puzzle (4x4)
    const pieceSize = 100; // Tamaño de cada pieza en píxeles
    const pieces = [];
    const positions = [];

    // Crea un array de posiciones y mezcla aleatoriamente
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            positions.push({ x, y });
        }
    }
    shuffleArray(positions);

    // Crea las piezas del puzzle
    positions.forEach((pos) => {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.width = pieceSize + 'px';
        piece.style.height = pieceSize + 'px';
        piece.style.backgroundPosition = `-${pos.x * pieceSize}px -${pos.y * pieceSize}px`;
        piece.dataset.x = pos.x;
        piece.dataset.y = pos.y;
        piece.draggable = true;
        piece.addEventListener('dragstart', dragStart);
        piece.addEventListener('dragover', dragOver);
        piece.addEventListener('drop', drop);
        pieces.push(piece);
        puzzleContainer.appendChild(piece);
    });

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', `${e.target.dataset.x},${e.target.dataset.y}`);
        e.dataTransfer.effectAllowed = 'move';
    }

    function dragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function drop(e) {
        e.preventDefault();
        const [x1, y1] = e.dataTransfer.getData('text/plain').split(',').map(Number);
        const piece1 = document.querySelector(`.piece[data-x="${x1}"][data-y="${y1}"]`);
        const piece2 = e.target;

        if (piece1 === piece2) return;

        const x2 = piece2.dataset.x;
        const y2 = piece2.dataset.y;

        piece1.dataset.x = x2;
        piece1.dataset.y = y2;
        piece2.dataset.x = x1;
        piece2.dataset.y = y1;

        const tempBackgroundPosition = piece1.style.backgroundPosition;
        piece1.style.backgroundPosition = piece2.style.backgroundPosition;
        piece2.style.backgroundPosition = tempBackgroundPosition;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Sopa de letras code
    const palabras = ['NEGRITA', 'CAT', 'SUN', 'STARS', 'MOON', 'LOVE', 'TONTITA', 'KITTY', 'PERUANITO', 'CATALANA'];
    const tamaño = 10;
    const sopa = document.getElementById('sopa');
    const cuadrícula = Array.from({ length: tamaño }, () => Array(tamaño).fill(''));

    function colocarPalabra(palabra) {
        const dirección = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        let fila, col;

        if (dirección === 'horizontal') {
            fila = Math.floor(Math.random() * tamaño);
            col = Math.floor(Math.random() * (tamaño - palabra.length));
            for (let i = 0; i < palabra.length; i++) {
                cuadrícula[fila][col + i] = palabra[i];
            }
        } else {
            fila = Math.floor(Math.random() * (tamaño - palabra.length));
            col = Math.floor(Math.random() * tamaño);
            for (let i = 0; i < palabra.length; i++) {
                cuadrícula[fila + i][col] = palabra[i];
            }
        }
    }

    palabras.forEach(colocarPalabra);

    for (let i = 0; i < tamaño; i++) {
        for (let j = 0; j < tamaño; j++) {
            if (cuadrícula[i][j] === '') {
                cuadrícula[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }

    cuadrícula.forEach(fila => {
        fila.forEach(letra => {
            const div = document.createElement('div');
            div.classList.add('letra');
            div.textContent = letra;
            div.onclick = function() {
                div.classList.toggle('seleccionada');
            };
            sopa.appendChild(div);
        });
    });

    // Películas code
    const listaPeliculas = document.getElementById('listaPeliculas');
    const inputPelicula = document.getElementById('nuevaPelicula');
    const btnAgregarPelicula = document.getElementById('agregarPelicula');

    function cargarPeliculas() {
        const peliculas = JSON.parse(localStorage.getItem('peliculas')) || [];
        peliculas.forEach(pelicula => {
            agregarPeliculaLista(pelicula);
        });
    }

    function agregarPelicula() {
        const pelicula = inputPelicula.value.trim();
        if (pelicula) {
            const peliculas = JSON.parse(localStorage.getItem('peliculas')) || [];
            peliculas.push(pelicula);
            localStorage.setItem('peliculas', JSON.stringify(peliculas));
            agregarPeliculaLista(pelicula);
            inputPelicula.value = '';
        }
    }

    function agregarPeliculaLista(pelicula) {
        const li = document.createElement('li');
        li.textContent = pelicula;
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.classList.add('borrarPelicula');
        btnEliminar.onclick = function() {
            eliminarPelicula(pelicula, li);
        };
        li.appendChild(btnEliminar);
        listaPeliculas.appendChild(li);
    }

    function eliminarPelicula(pelicula, li) {
        let peliculas = JSON.parse(localStorage.getItem('peliculas')) || [];
        peliculas = peliculas.filter(p => p !== pelicula);
        localStorage.setItem('peliculas', JSON.stringify(peliculas));
        listaPeliculas.removeChild(li);
    }

    btnAgregarPelicula.addEventListener('click', agregarPelicula);

    inputPelicula.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            agregarPelicula();
        }
    });

    cargarPeliculas();
});
