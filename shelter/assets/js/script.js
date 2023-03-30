const toggleBtn = document.querySelector('.toggle-btn');
const nav = document.querySelector('.nav');
const body = document.querySelector('.body');
const overlay = document.querySelector('.overlay');

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



//console.log('100 / 100\n1. Main соответствует макету при ширине экрана 1280px: +14\n2. Main соответствует макету при ширине экрана 768px: +14\n3. Main соответствует макету при ширине экрана 320px: +14\n4. Pets соответствует макету при ширине экрана 1280px: +6\n5. Pets соответствует макету при ширине экрана 768px: +6\n6. Pets соответствует макету при ширине экрана 320px: +6\n7. Не появляется горизонтальная полоса прокрутки +20\n8. Верстка резиновая +8\n9. Меню в хедере скрывается, появляется иконка бургер-меню +4\n10. Верстка обеих страниц валидна +8');
