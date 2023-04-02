const pets = await fetch('../../assets/pets.json').then(response => response.json());

// For Sidebar
const toggleBtn = document.querySelector('.toggle-btn');
const nav = document.querySelector('.nav');
const body = document.querySelector('.body');
const overlay = document.querySelector('.overlay');

// For Pagination
const sliderTemplate = document.querySelector('#slider-item-template').content;
const sliderTemplateItem = sliderTemplate.querySelector('.slider-item');
const sliderWrapper = document.querySelector('.slider-wrapper');
let sliderList = document.querySelector('.slider-list');
const sliderBtnStart = document.querySelector('.slider-btn-start');
const sliderBtnPrev = document.querySelector('.slider-btn-prev');
const sliderBtnNext = document.querySelector('.slider-btn-next');
const sliderBtnEnd = document.querySelector('.slider-btn-end');
const sliderBtnNum = document.querySelector('.slider-btn-selected');
let memOfpage = 0;
let memOfCards = [];
let maxPages = 0;
const param = {
                1280: {maxCards: 8, width: 1080},
                768: {maxCards: 6, width: 620},
                320: {maxCards: 3, width: 310}
              };
let memOfWindowSize = window.innerWidth;

// For Popup
const popup = document.querySelector('.popup');
const popupImage = popup.querySelector('.modal-image');
const popupHeader = popup.querySelector('.modal-header');
const popupSubgeader = popup.querySelector('.modal-subheader');
const age = popup.querySelector('.modal-list-age');
const inoculations = popup.querySelector('.modal-list-inoculations');
const diseases = popup.querySelector('.modal-list-diseases');
const parasites = popup.querySelector('.modal-list-parasites');

// ----------- Sidebar -----------

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

// ----------- Pagination -----------

// Initial
removeAllCards();
memOfCards = generateAllCards(param[getBp()].maxCards);
addCardsAfter(param[getBp()].maxCards, memOfpage);
maxPages = 48 / param[getBp()].maxCards - 1;

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

// Generating array of random arrays (48 cards)
function generateAllCards(maxCardsOnPage) {
  const result = [];
  for (let i = 0; i < 48; i++) {
    result.push(arrOfRandNum(maxCardsOnPage));
  }
  return result;
}

// Listener: Changing initial set of cards depending on the screen width
window.addEventListener('resize', function(evt) {
  if (window.innerWidth !== memOfWindowSize) {
    removeAllCards();
    addCardsAfter(param[getBp()].maxCards, 0);
    memOfWindowSize = window.innerWidth;
    maxPages = 48 / param[getBp()].maxCards - 1;
    memOfpage = 0;
    changeBtnsConditions();
    sliderBtnNum.innerText = memOfpage + 1;
  }
});

// Creating card from template
function createCard(name, link, id) {
  const cardItem = sliderTemplateItem.cloneNode(true);
  const cardItemImage = cardItem.querySelector('.slider-item-image');
  const cardItemName = cardItem.querySelector('.slider-item-name');
  cardItem.dataset.id = id;
  cardItemImage.setAttribute('alt', name);
  cardItemImage.setAttribute('src', link);
  cardItemName.textContent = name;
  cardItem.addEventListener('click', (evt) => {
    const petName = cardItem.querySelector('.slider-item-name').textContent;
    const pet = pets.filter((item) => item.name === petName)[0];
    popupImage.setAttribute('alt', pet.name);
    popupImage.setAttribute('src', pet.img);
    popupHeader.textContent = pet.name;
    popupSubgeader.textContent = pet.type + ' - ' + pet.breed;
    age.textContent = pet.age;
    inoculations.textContent = pet.inoculations.join(', ');
    diseases.textContent = pet.diseases.join(', ');
    parasites.textContent = pet.parasites.join(', ');
    popup.classList.add('opened');
    body.classList.add('body-fixed');
  });
  return cardItem;
}

// Creating cards
function createCards(num, pos) {
  return memOfCards[pos].map((item) => {
    return createCard(pets[item].name, pets[item].img, item);
  });
}

// Removimg all cards
function removeAllCards() {
  while (sliderList.firstChild) {
    sliderList.removeChild(sliderList.firstChild);
  }
}

// Adding cards to DOM after another
function addCardsAfter(num, pos) {
  createCards(num, pos).forEach(item => {
    sliderList.append(item);
  });
}

// Getting breakpoint of window
function getBp() {
  if(window.innerWidth >= 1280) return 1280;
  if(window.innerWidth >= 768 && window.innerWidth < 1280) return 768;
  if(window.innerWidth >= 320 && window.innerWidth < 768) return 320;
}

// Changing conditions of buttons
function changeBtnsConditions () {
  if (memOfpage == maxPages) {
    sliderBtnEnd.setAttribute('disabled', 'disabled');
    sliderBtnNext.setAttribute('disabled', 'disabled');
    sliderBtnStart.removeAttribute('disabled', 'disabled');
    sliderBtnPrev.removeAttribute('disabled', 'disabled');
  }
  if (memOfpage > 0 && memOfpage < maxPages) {
    sliderBtnEnd.removeAttribute('disabled', 'disabled');
    sliderBtnNext.removeAttribute('disabled', 'disabled');
    sliderBtnStart.removeAttribute('disabled', 'disabled');
    sliderBtnPrev.removeAttribute('disabled', 'disabled');
  }
  if (memOfpage == 0) {
    sliderBtnStart.setAttribute('disabled', 'disabled');
    sliderBtnPrev.setAttribute('disabled', 'disabled');
    sliderBtnEnd.removeAttribute('disabled', 'disabled');
    sliderBtnNext.removeAttribute('disabled', 'disabled');
  }
}

// Redrawing cards and buttons
function redrawCardsAndBtns() {
  removeAllCards();
  changeBtnsConditions();
  addCardsAfter(param[getBp()].maxCards, memOfpage);
  sliderBtnNum.innerText = memOfpage + 1;
}

// Listener: Actions after next button click
sliderBtnNext.addEventListener('click', (evt) => {
  memOfpage++;
  redrawCardsAndBtns();
});

// Listener: Actions after previos button click
sliderBtnPrev.addEventListener('click', (evt) => {
  memOfpage--;
  redrawCardsAndBtns();
});

// Listener: Actions after end button click
sliderBtnEnd.addEventListener('click', (evt) => {
  memOfpage = maxPages;
  redrawCardsAndBtns();
});

// Listener: Actions after start button click
sliderBtnStart.addEventListener('click', (evt) => {
  memOfpage = 0;
  redrawCardsAndBtns();
});

// ----------- Popup -----------

// Listener: Close popup
popup.addEventListener('click', (evt) => {
  if (!evt.target.className.includes('modal')) {
    popup.classList.remove('opened');
    body.classList.remove('body-fixed');
  };
});

console.log('Part 1: 100 / 100\n1. Main: Проверка верстки +7\n2. Main: Вёрстка соответствует макету +35\n3. Main: Требования к css +6\n4. Main: Интерактивность элементов +12\n5. Pets: Проверка верстки +7\n6. Pets: Вёрстка соответствует макету +15\n7. Pets: Требования к css +4\n8. Pets: Интерактивность элементов +14\n');
console.log('Part 2: 100 / 100\n1. Main соответствует макету при ширине экрана 1280px: +14\n2. Main соответствует макету при ширине экрана 768px: +14\n3. Main соответствует макету при ширине экрана 320px: +14\n4. Pets соответствует макету при ширине экрана 1280px: +6\n5. Pets соответствует макету при ширине экрана 768px: +6\n6. Pets соответствует макету при ширине экрана 320px: +6\n7. Не появляется горизонтальная полоса прокрутки +20\n8. Верстка резиновая +8\n9. Меню в хедере скрывается, появляется иконка бургер-меню +4\n10. Верстка обеих страниц валидна +8');
console.log('Part 3: 110 / 110\n1. Реализация burger menu на обеих страницах +26\n2. Реализация слайдера-карусели на странице Main +36\n3. Реализация пагинации на странице Pets +36\n4. Реализация попап на обеих страницах +12');
