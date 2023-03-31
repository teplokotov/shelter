//import pets from '../pets.json' assert {type: 'json'};

const pets = await fetch('../../assets/pets.json').then(response => response.json());

// For Sidebar
const toggleBtn = document.querySelector('.toggle-btn');
const nav = document.querySelector('.nav');
const body = document.querySelector('.body');
const overlay = document.querySelector('.overlay');

// For Slider
const sliderTemplate = document.querySelector('#slider-item-template').content;
const sliderTemplateItem = sliderTemplate.querySelector('.slider-item');
const sliderWrapper = document.querySelector('.slider-wrapper');
let sliderList = document.querySelector('.slider-list');
const sliderBtnRight = document.querySelector('.slider-btn-right');
const sliderBtnLeft = document.querySelector('.slider-btn-left');
let memOfCards = [];
let newCards = [];

// Opening and closing sidebar
function toggleSidebar() {
  nav.classList.toggle('opened');
  toggleBtn.classList.toggle('opened');
  body.classList.toggle('body-fixed');
  overlay.classList.toggle('show');
}

toggleBtn.addEventListener('click', evt => {
  toggleSidebar();
});

overlay.addEventListener('click', evt => {
  toggleSidebar();
});

// Getting array of random unique numbers
function arrOfRandNum(size, exceptions) {
  if(!exceptions) exceptions = [];
  const result = [];
  let randNum;
  for (let i = 0; i < size; i++) {
    randNum = Math.round(Math.random() * 7);
    while (result.indexOf(randNum) >= 0 || exceptions.indexOf(randNum) >= 0) {
      randNum = Math.round(Math.random() * 7);
    }
    result.push(randNum);
  }
  return result;
}

//console.log(arrOfRandNum(9));

// Creating card from template
function createCard(name, link, id) {
  const cardItem = sliderTemplateItem.cloneNode(true);
  const cardItemImage = cardItem.querySelector('.slider-item-image');
  const cardItemName = cardItem.querySelector('.slider-item-name');
  cardItem.dataset.id = id;
  cardItemImage.setAttribute('alt', name);
  cardItemImage.setAttribute('src', link);
  cardItemName.textContent = name;
  return cardItem;
}

// Creating cards
function createCards(num) {
  memOfCards.length == 0 ? memOfCards = arrOfRandNum(num) : memOfCards = arrOfRandNum(num, memOfCards);
  return memOfCards.map((item) => {
    return createCard(pets[item].name, pets[item].img, item);
  });
}
//console.log(createCards(9));

// Removimg all cards
function removeAllCards() {
  while (sliderList.firstChild) {
    sliderList.removeChild(sliderList.firstChild);
  }
}
removeAllCards();

// Adding cards to DOM after another
function addCardsAfter(num) {
  createCards(num).forEach(item => {
    sliderList.append(item);
  });
}

// Adding cards to DOM before another
function addCardsBefore(num) {
  createCards(num).forEach(item => {
    sliderList.prepend(item);
  });
}

// Написать функцию, которая добавляет начальные карты в зависимости от разрешения !!
addCardsAfter(3);

// Getting current value of translateX
function getTranslateX(element) {
  const style = window.getComputedStyle(element);
  const matrix = new DOMMatrixReadOnly(style.transform);
  return matrix.m41;
}

const param = {
                1280: {maxCards: 3, width: 1080},
                768: {maxCards: 2, width: 1080}, // исправить width
                320: {maxCards: 1, width: 1080} // исправить width
              };

// Getting breakpoint of window
function getBp() {
  if(window.innerWidth >= 1280) return 1280;
  if(window.innerWidth >= 768 && window.innerWidth < 1280) return 768;
  if(window.innerWidth >= 320 && window.innerWidth < 768) return 320;
}

// Making translation
function makeTranslate(sign, getWidth) {
  const curPos = getTranslateX(sliderList);
  const setPos = sign * getWidth + curPos;
  sliderList.style.transform = 'translateX(' + setPos + 'px)';
}

sliderBtnRight.addEventListener('click', (evt) => {
  const curBreakpoint = getBp();
  const getWidth = param[curBreakpoint].width;
  const maxCards = param[curBreakpoint].maxCards;
  sliderList.style.transition = 'all 0.8s ease-in-out';
  if (sliderList.childElementCount === maxCards) {
    addCardsAfter(maxCards);
    makeTranslate(-1, getWidth);
  } else {

    if (sliderList.childElementCount == maxCards * 2 && getTranslateX(sliderList) == 0) {
      sliderList.style.transform = 'translateX(-1080px)';
    } else {
      addCardsAfter(maxCards);
      makeTranslate(-1, getWidth);
      setTimeout(() => {
        while (sliderList.childElementCount > maxCards * 2) {
          sliderList.removeChild(sliderList.firstChild);
        }
        sliderList.style.transition = 'all 0s ease-in-out';
        sliderList.style.transform = 'translateX(-1080px)';
      }, 800);
    }

  }
});

sliderBtnLeft.addEventListener('click', (evt) => {
  const curBreakpoint = getBp();
  const getWidth = param[curBreakpoint].width;
  const maxCards = param[curBreakpoint].maxCards;
  sliderList.style.transition = 'all 0.8s ease-in-out';
  if (sliderList.childElementCount === maxCards) {
    addCardsBefore(maxCards);
    sliderList.style.transition = 'all 0s ease-in-out';
    sliderList.style.transform = 'translateX(-1080px)';
    setTimeout(() => {
      sliderList.style.transition = 'all 0.8s ease-in-out';
      sliderList.style.transform = 'translateX(0)';
    }, 100);
    //makeTranslate(1, getWidth);
  } else {

    if (sliderList.childElementCount == maxCards * 2 && getTranslateX(sliderList) == -1080) {
      sliderList.style.transform = 'translateX(0)';
    } else {
      addCardsBefore(maxCards);
      sliderList.style.transition = 'all 0s ease-in-out';
      sliderList.style.transform = 'translateX(-1080px)';
      setTimeout(() => {
        while (sliderList.childElementCount > maxCards * 2) {
          sliderList.removeChild(sliderList.lastChild);
        }
        sliderList.style.transition = 'all 0.8s ease-in-out';
        makeTranslate(1, getWidth);
      }, 100);
    }
  }

});


//console.log(pets);
//console.log(addCards(9));

// Рамзер slider-wrapper
//transform: translate3d(-1060px, 0px, 0px);

//console.log('100 / 100\n1. Main соответствует макету при ширине экрана 1280px: +14\n2. Main соответствует макету при ширине экрана 768px: +14\n3. Main соответствует макету при ширине экрана 320px: +14\n4. Pets соответствует макету при ширине экрана 1280px: +6\n5. Pets соответствует макету при ширине экрана 768px: +6\n6. Pets соответствует макету при ширине экрана 320px: +6\n7. Не появляется горизонтальная полоса прокрутки +20\n8. Верстка резиновая +8\n9. Меню в хедере скрывается, появляется иконка бургер-меню +4\n10. Верстка обеих страниц валидна +8');
