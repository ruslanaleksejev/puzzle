function startGame() {
    if (!img.src) return;

    puzzleGrid.innerHTML = '';
    storage.innerHTML = '';
    let pieces = [];

    // 1. Фиксируем размер контейнера, чтобы сетка не «гуляла»
    const containerSize = 500; 
    const pieceSize = containerSize / gridSize;

    puzzleGrid.style.gridTemplateColumns = `repeat(${gridSize}, ${pieceSize}px)`;
    puzzleGrid.style.gridTemplateRows = `repeat(${gridSize}, ${pieceSize}px)`;

    // 2. Готовим холст строго под размер контейнера (убирает дубликаты)
    const workCanvas = document.createElement('canvas');
    workCanvas.width = containerSize; 
    workCanvas.height = containerSize;
    const workCtx = workCanvas.getContext('2d');
    
    // Рисуем фото, вписывая его в квадрат 500x500 без искажений
    workCtx.drawImage(img, 0, 0, containerSize, containerSize);

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const canvas = document.createElement('canvas');
            canvas.width = pieceSize; 
            canvas.height = pieceSize;
            const ctx = canvas.getContext('2d');
            
            // Вырезаем четкий квадрат
            ctx.drawImage(
                workCanvas, 
                x * pieceSize, y * pieceSize, pieceSize, pieceSize, 
                0, 0, pieceSize, pieceSize
            );
            
            const url = canvas.toDataURL('image/jpeg', 0.9);
            const correctIdx = y * gridSize + x;
            pieces.push({ url, idx: correctIdx });

            const cell = document.createElement('div');
            cell.className = 'grid-square';
            cell.style.width = pieceSize + 'px';
            cell.style.height = pieceSize + 'px';
            cell.dataset.correct = correctIdx;
            cell.ondragover = e => e.preventDefault();
            cell.ondrop = handleDrop;
            puzzleGrid.appendChild(cell);
        }
    }

    // 3. Вывод в хранилище
    pieces.sort(() => Math.random() - 0.5).forEach(p => {
        const div = document.createElement('div');
        div.className = 'puzzle-piece';
        // Ограничиваем размер кусочков внизу, чтобы они не растягивали панель
        const displaySize = Math.min(pieceSize, 80); 
        div.style.width = displaySize + 'px';
        div.style.height = displaySize + 'px';
        
        // Используем фон вместо тега img для стабильности
        div.style.backgroundImage = `url(${p.url})`;
        div.style.backgroundSize = 'cover';
        
        div.draggable = true;
        div.dataset.idx = p.idx;
        div.dataset.url = p.url;
        
        div.ondragstart = (e) => {
            e.dataTransfer.setData('idx', p.idx);
            e.dataTransfer.setData('url', p.url);
        };
        storage.appendChild(div);
    });

    startTimer();
}

function handleDrop(e) {
    e.preventDefault();
    const idx = e.dataTransfer.getData('idx');
    const url = e.dataTransfer.getData('url');
    const cell = e.currentTarget;

    if (cell.style.backgroundImage === '') {
        // Устанавливаем картинку как фон ячейки
        cell.style.backgroundImage = `url(${url})`;
        cell.style.backgroundSize = 'cover';
        cell.dataset.currentIdx = idx; // Для проверки победы
        
        // Удаляем из хранилища
        const pieces = storage.querySelectorAll('.puzzle-piece');
        pieces.forEach(p => {
            if (p.dataset.idx === idx) p.remove();
        });
        
        checkWin();
    }
}

// Не забудьте обновить checkWin, так как мы сменили способ хранения индекса
function checkWin() {
    const cells = document.querySelectorAll('.grid-square');
    let correct = 0;
    cells.forEach(c => {
        if (c.dataset.currentIdx == c.dataset.correct) correct++;
    });

    if (correct === gridSize * gridSize) {
        clearInterval(timerInterval);
        alert("VÕIT!");
    }
}