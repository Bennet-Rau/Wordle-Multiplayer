import {testDictionary, realDictionary} from './dictionary.js';

const keyboardButtons = document.querySelectorAll('#keyboard button');

console.log('testDictionary', testDictionary);

const dictionary = realDictionary;
const state = {
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,

};

function updateGrid(){
    for(let i = 0; i < state.grid.length; i++){
        for(let j = 0; j < state.grid[i].length; j++){
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawBox(container, row, col, letter = ''){
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;

    container.appendChild(box);
    return box;
}

function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';

    for (let i = 0; i < 6; i++){
        for (let j = 0; j < 5; j++){
            drawBox(grid, i, j);
        }
    }

    container.appendChild(grid);

}

function registerKeyboardEvents(){
    document.body.onkeydown = (e) => {
        const key = e.key;
        if(key === 'Enter'){
            if(state.currentCol === 5){
                const word = getCurrentWord();
                if(isWordValid(word)){
                    revealWord(word);
                    state.currentRow++;
                    state.currentCol = 0;
                }
                else{
                    alert('Not a valid word.');
                }
            }
        }
        if(key === 'Backspace'){
            removeLetter();
        }
        if(isLetter(key)){
            addLetter(key);
        }

        updateGrid();
    };
}

function getCurrentWord(){
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);

}

function isWordValid(word){
    return dictionary.includes(word);

}

function getNumberOccurencesInWord(word, letter){
    let result = 0;
    for (let i = 0; i < word.length; i++){
        if(word[i] === letter){
            result++;
        }
    } 
    return result;
}

function getPositionOccurence(word, letter, position){
    let result = 0;
    for (let i = 0; i <= position; i++){
        if(word[i] === letter){
            result++;
        }
    }
    return result;
}

function revealWord(guess){
    const row = state.currentRow;
    const animation_duration = 400;

    for (let i = 0; i < 5; i++){
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;
        const numOccurencesSecret = getNumberOccurencesInWord(
            state.secret,
            letter
        );

        const numOccurencesGuess = getNumberOccurencesInWord(guess, letter);
        const letterPosition = getPositionOccurence(guess, letter, i);
        
        setTimeout(() => {
            if(
                numOccurencesGuess > numOccurencesSecret &&
                letterPosition > numOccurencesSecret
            ) {
                box.classList.add('empty');
            }
            else {
                if (letter === state.secret[i]){
                    box.classList.add('right');
                    
                }
                else if (state.secret.includes(letter)){
                    box.classList.add('wrong');
                }
                else{
                    box.classList.add('empty');
                }
            }
    }, ((i + 1) * animation_duration) / 2);
    
        box.classList.add('animated');
        box.style.animationDuration = `${i * animation_duration / 2}ms`;
    }

    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 5;

    setTimeout(() => {
        if (isWinner == true){
            alert('Congratulations, you have guessed the word!');
        }
        else if (isGameOver){
            alert(`You fucking suck! The word was ${state.secret}. `);
        }
    }, 3 * animation_duration);
}

function isLetter(key){
    return key.length === 1 && key.match(/[a-z]/i); 

}

//Controls on screen keyboard
keyboardButtons.forEach(button => {
    button.addEventListener('click', () => {
        const letter = button.textContent.toLowerCase();
        if (letter === '⌫') { // Check for backspace button
            removeLetter();
            updateGrid();
        } else if (letter === 'enter') { // Check for enter button
            const word = getCurrentWord().trim();
            if (isWordValid(word)) {
                revealWord(word);
                state.currentRow++;
                state.currentCol = 0;
            } else {
                alert('Not a valid word.');
            }
        } else { // Regular letter buttons
            addLetter(letter);
        }
        updateGrid();
    });
});

function addLetter(letter){
    if(state.currentCol === 5) return;

    const row = state.currentRow;
    const col = state.currentCol;

    updateGrid();

    // Get the grid cell element
    const cell = document.getElementById(`box${row}${col}`);

    // Apply the "pop-out" effect by changing the transform property
    cell.style.transition = 'transform 0.1s ease-in-out'; // Adjust the transition properties as needed
    cell.style.transform = 'scale(1.1)'; // Adjust the scale as needed

    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
    console.log(state.currentRow, state.currentCol, letter);

    // Remove the "pop-out" effect by resetting the transform property
    setTimeout(() => {
        cell.style.transform = 'scale(1)';
        cell.style.transition = ''; // Remove the transition after the animation
        updateGrid();
    }, 100);
    
}

function removeLetter(){
    if(state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
}

function startup(){
    const game = document.getElementById('game');
    drawGrid(game);

    registerKeyboardEvents();

    console.log(state.secret);
}

startup();