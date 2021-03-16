let emoji = ['\u{1F984}', '\u{1F43C}', '\u{1F437}', '\u{1F981}', '\u{1F41E}', '\u{1F438}', '\u{1F984}', '\u{1F43C}', '\u{1F437}', '\u{1F981}', '\u{1F41E}', '\u{1F438}'];
const rotate = document.querySelectorAll('.card');
const emojis = document.querySelectorAll('.emoji');
const front = document.querySelectorAll('.back_card');

let time = 60;
let conditions = randomCard();
const timer = document.querySelector('.timer');
timer.textContent = '0' + (time - time % 60) / 60 + ':' + ((time < 10) ? '0' + time : (time % 60 < 10) ? '0' + time % 60 : time % 60);

const playBtn = document.querySelector('.play');

const endGame = document.querySelector('.end_game');
// Для первого клика 
let isClicked = false;
playBtn.addEventListener('click', newGame);
// let conditions = randomCard();
//массив, в котором будут хранится выбранные карты
let pickArr = []
var intervalId;
function anima_cards(target) {
    if (!isClicked) {
        isClicked = true;
        intervalId = setInterval(gameIter, 1000);
    }
    if (pickArr.length < 2) {
        target.children[0].classList.add('anima_front');
        target.children[1].classList.add('anima_back');
        pickArr.push(target)
    }
    if (pickArr.length == 2) {
        //запускаем проверку на совпадение с некоторой задержкой, т.к. дом дерево надо перерисовать.
        setTimeout(checker, 500)
    }
    if (hasWon()) {
        win();
    }
}

//проверяет совпадение, подствечивает плейсхолдер.
const checker = () => {
    let color = pickArr[0].querySelector('.emoji').textContent == pickArr[1].querySelector('.emoji').textContent ? 'success' : 'fail';
    pickArr.forEach((item) => {
        item.querySelector('.card_placeholder').classList.toggle(color)
    })
    //оканчиваем ход
    setTimeout(finisher, 500, color)
}

//заканчивает ход - отключает плейсхолдер, поворачивает обратно карты, если не угадал.
const finisher = (color) => {
    pickArr.forEach((item) => {
        item.querySelector('.card_placeholder').classList.toggle(color);
        if (color == 'fail') {
            item.children[0].classList.toggle('anima_front');
            item.children[1].classList.toggle('anima_back');
        }
    })
    pickArr = pickArr.slice(-1, 0)
}

rotate.forEach((card) => card.addEventListener('click', ({
    currentTarget
}) => {
    //Если необходимо, здесь вы можете передавать индексы в anima_cards, 
    //т.к. каллбек ф-я forEach вторым аргументом принимает индекс элемента, который можно пробросить дальше
    anima_cards(currentTarget);
}));

function newGame() {
    uncertainCardsNumber = 0

    for (var card of rotate) {
        card.children[0].classList.remove('anima_front');
        card.children[1].classList.remove('anima_back');
    }

    time = 60;
    timer.textContent = '0' + (time - time % 60) / 60 + ':' + ((time < 10) ? '0' + time : (time % 60 < 10) ? '0' + time % 60 : time % 60);
    isClicked = false;
    endGame.classList.add('invisible');
    document.querySelector('.jump:nth-child(4)').classList.remove('invisible');
    conditions = randomCard();
}

function randomCard() {
    emojis.forEach((elem => {
        let max = emoji.length;
        let index = getRandom(0, max);
        elem.textContent = emoji[index];
        emoji.splice(index, 1);
    }));
}
function gameIter() {
    time--;
    timer.textContent = '0' + (time - time % 60) / 60 + ':' + ((time < 10) ? '0' + time : (time % 60 < 10) ? '0' + time % 60 : time % 60);
    if (time == 0) {
        clearInterval(intervalId);
        timeIsOver();
    }
}
function win() {
    showResult(true);
    clearInterval(intervalId);
}

// Функция вызывается при окончании времени, те при поражении 
function timeIsOver() {
    showResult(false);
}
function hasWon() {
    for (var condition of conditions) {
        if (condition['state'] != SOLVED) {
            return false;
        }
    }
    return true;
}
function showResult(res) {
    var spans = Array.from(document.querySelectorAll('.jump'));
    var letters;
    if (res) {
        playBtn.textContent = 'Play again';
        letters = ['W', 'i', 'n'];
        spans[3].classList.add('invisible');
    } else {
        playBtn.textContent = 'Try again';
        letters = ['L', 'o', 's', 'e'];
    }
    for (var i = 0; i < letters.length; i++) {
        spans[i].textContent = letters[i];
    }
    endGame.classList.remove('invisible');
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// randomCard();