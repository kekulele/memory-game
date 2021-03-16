'use strict'

var emoji = [
  {unicorn: '\u{1F984}'}, 
  {raccoon: '\u{1F43C}'}, 
  {pig: '\u{1F437}'}, 
  {tiger: '\u{1F981}'}, 
  {bag: '\u{1F41E}'}, 
  {frog: '\u{1F438}'},
  {unicorn: '\u{1F984}'}, 
  {raccoon: '\u{1F43C}'}, 
  {pig: '\u{1F437}'}, 
  {tiger: '\u{1F981}'}, 
  {bag: '\u{1F41E}'},
  {frog: '\u{1F438}'}
];

var field = document.getElementsByClassName('memory_card')[0];
var cards = document.querySelectorAll('.card');
const playBtn = document.querySelector('.play');
const endGame = document.querySelector('.end_game');
const timer = document.querySelector('.timer');

var cardContent = '.emoji';
var cardPlaceholder = '.card_placeholder';
var popupText = '.result';

var openCardArr = [];
var time = 60; // колличество секунд
var isClicked = false;
var openCardNum = 0;
var interval = 0;

var cardsNum = emoji.length;
var openCardNum = 0;

// random sorting function 
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// случайно расфасовываем картинки по карточкам
function randomShuffle(card, data, cardContent) {
  var shuffleDivs = shuffle(data);

  for (var i = 0; i < shuffleDivs.length; i++) {
    card[i].dataset.card = Object.keys(data[i]);
    card[i].querySelector(cardContent).innerHTML = Object.values(data[i]);
  }
}

function timerWork() {
  var minutes = Math.trunc(time/60%60);
  var seconds = Math.trunc(time%60);

  if (time < 0) {
    hasWin(openCardNum, cardsNum);
  } else {
    timer.innerHTML = ((minutes > 9) ? minutes : '0' + minutes) + ':' + ((seconds > 9) ? seconds : '0' + seconds);
    --time;
  }
}

function hasWin(current, max) {
  if (current == max) {
    win(interval, endGame);
  } else {
    lose(interval, endGame);
  }
}

function openCard(item) {
  item.getElementsByClassName('front_card')[0].classList.add('anima_front');
  item.getElementsByClassName('back_card')[0].classList.add('anima_back');
}

function closeCards(arr) {
  arr.forEach((item) => {
    item.getElementsByClassName('front_card')[0].classList.remove('anima_front');
    item.getElementsByClassName('back_card')[0].classList.remove('anima_back');
  });
}

function color(arr, color, element) {
  arr.forEach((item) => {
    item.querySelector(element).classList.add(color);
  });

  setTimeout(function() {
    arr.forEach((item) => {
      item.querySelector(element).classList.remove(color);
    });
  }, 300);
}

function win(interval, popup) {
  clearInterval(interval);
  popup.querySelector(popupText).innerHTML = result('Win');
  popup.classList.remove('invisible');
}

function lose(interval, popup) {
  clearInterval(interval);
  popup.querySelector(popupText).innerHTML = result('Lose');
  popup.classList.remove('invisible');
}

function result(text) {
  var html = text.split('').map((item) => {
    return '<span class="jump">' + item + '</span>';
  }).reduce(function(string, item) {
    return string + item;
  });

  return html;
}

randomShuffle(cards, emoji, cardContent);

cards.forEach((card) => {
  card.addEventListener('click', () => {
    if(!isClicked) {
      interval = setInterval(timerWork, 1000);
      isClicked = true;
    }

    if (openCardArr.length < 2) {
      openCard(card);
      openCardArr.push(card);
      card.style.pointerEvents = 'none';
    }

    if (openCardArr.length == 2) {
      field.style.pointerEvents = 'none';

      if (openCardArr[0].dataset.card !== openCardArr[1].dataset.card) {
        setTimeout(color, 300, openCardArr, 'fail', cardPlaceholder);

        setTimeout(function() {
          closeCards(openCardArr);
          openCardArr.forEach((item) => {
            item.style.pointerEvents = '';
          });

          openCardArr = [];
          field.style.pointerEvents = '';
        }, 500);
      } else {
        setTimeout(color, 300, openCardArr, 'success', cardPlaceholder);

        setTimeout(function() {
          openCardNum += 2;
          if (openCardNum == 12) {
            win(interval, endGame);
          }
          
          openCardArr.forEach((item) => {
            item.style.pointerEvents = 'none';
          });

          openCardArr = [];
          field.style.pointerEvents = '';
        }, 500);
      }
    }
  });
});

playBtn.addEventListener('click', function() {
  // обновляем входные данные
  time = 60;
  openCardArr = [];
  openCardNum = 0;
  isClicked = false;

  // переворачиваем и тосуем карты
  closeCards(cards);
  randomShuffle(cards, emoji, cardContent);
  cards.forEach((item) => {
    item.style.pointerEvents = '';
  });

  // обновляем таймер
  var minutes = Math.trunc(time/60%60);
  var seconds = Math.trunc(time%60);
  timer.innerHTML = ((minutes > 9) ? minutes : '0' + minutes) + ':' + ((seconds > 9) ? seconds : '0' + seconds);

  // закрываем попап
  endGame.classList.add('invisible');
});


