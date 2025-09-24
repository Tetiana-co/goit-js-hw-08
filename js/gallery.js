// // Дані для галереї: масив обʼєктів з превʼю, оригіналом і описом картинки
const images = [
  {
    preview: 'https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820__480.jpg',
    original: 'https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820_1280.jpg',
    description: 'Hokkaido Flower',
  },
  {
    preview: 'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677__340.jpg',
    original: 'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677_1280.jpg',
    description: 'Container Haulage Freight',
  },
  {
    preview: 'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785__340.jpg',
    original: 'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg',
    description: 'Aerial Beach View',
  },
  {
    preview: 'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__340.jpg',
    original: 'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg',
    description: 'Flower Blooms',
  },
  {
    preview: 'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334__340.jpg',
    original: 'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334_1280.jpg',
    description: 'Alpine Mountains',
  },
  {
    preview: 'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571__340.jpg',
    original: 'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571_1280.jpg',
    description: 'Mountain Lake Sailing',
  },
  {
    preview: 'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272__340.jpg',
    original: 'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272_1280.jpg',
    description: 'Alpine Spring Meadows',
  },
  {
    preview: 'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__340.jpg',
    original: 'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255_1280.jpg',
    description: 'Nature Landscape',
  },
  {
    preview: 'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843__340.jpg',
    original: 'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843_1280.jpg',
    description: 'Lighthouse Coast Sea',
  },
];

// Знаходимо контейнер галереї в DOM
const galleryContainer = document.querySelector('.gallery');
// Рендеримо у галерею список картинок (li > a > img)
galleryContainer.insertAdjacentHTML(
  'beforeend',
  images
    .map(
      ({ preview, original, description }) => `
    <li class="gallery-item">
      <a class="gallery-link" href="${original}">
        <img class="gallery-image" src="${preview}" data-source="${original}" alt="${description}" />
      </a>
    </li>`
    )
    .join('')
);

// Модалка
let currentIndex = null; // індекс поточної зображення в модалці
let instance = null; // екземпляр basicLightbox
// Відстежуємо клік по галереї
galleryContainer.addEventListener('click', e => {
  e.preventDefault(); // забороняємо переходити по href посиланню
  const img = e.target.closest('.gallery-image'); // шукаємо, що клік був по картинці
  if (!img) return; // якщо ні - нічого не робимо
  currentIndex = images.findIndex(x => x.original === img.dataset.source);

  // Відкриваємо модалку для цього індексу
  openModal(currentIndex);
});
// Функція відкриття модалки
function openModal(index) {
  const { original, description } = images[index]; // беремо url і текст для картинки

  instance = basicLightbox.create(
    `
    <div class="lb-frame" role="dialog" aria-label="Перегляд зображень">
      <div class="lb-top">
        <div class="lb-counter"></div>
        <button class="lb-close" aria-label="Закрити">×</button>
      </div>

      <button class="lb-btn lb-prev" aria-label="Попереднє">‹</button>

        <div class="lb-stage">
+        <img class="lb-img" src="${original}" alt="${description}">
+      </div>

      <button class="lb-btn lb-next" aria-label="Наступне">›</button>

      <div class="lb-caption"></div>
    </div>
  `,
    {
      // При показі модалки реєструємо обробники подій
      onShow: i => {
        document.addEventListener('keydown', onKeydown); // клавіатурні події
        const root = i.element();

        // Кнопка "Попереднє"
        root.querySelector('.lb-prev').addEventListener('click', showPrev);
        // Кнопка "Наступне"
        root.querySelector('.lb-next').addEventListener('click', showNext);
        // Кнопка закриття
        root.querySelector('.lb-close').addEventListener('click', () => i.close());

        // Закриття по кліку поза видимими елементами
        root.addEventListener('click', e => {
          if (e.target.closest('.lb-img, .lb-btn, .lb-close, .lb-caption, .lb-top')) return;
          i.close();
        });

        // Оновлюємо лічильник і підпис
        updateHud();
      },
      // При закритті модалки видаляємо обробник клавіатури
      onClose: () => document.removeEventListener('keydown', onKeydown),
    }
  );

  instance.show(); // показуємо модалку
}

// Обробка клавіш: Esc - закрити, стрілки - навігація по картинках
function onKeydown(e) {
  if (e.key === 'Escape') return instance.close();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
}

// Флаг для контролю анімації, щоб не запускати нову поки іде поточна
let isAnimating = false;
// Показати наступну картинку (з анімацією)
function showNext() {
  animateTo((currentIndex + 1) % images.length, 'next');
}
// Показати попередню картинку (з анімацією)
function showPrev() {
  animateTo((currentIndex - 1 + images.length) % images.length, 'prev');
}

// Функція анімації переходу між картинками
function animateTo(newIndex, dir) {
  if (isAnimating) return;
  isAnimating = true;

  const root = instance.element();
  const img = root.querySelector('.lb-img');

  // Очищаємо клас анімації перед новим циклом
  img.classList.remove('slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');
  // Ставимо клас анімації "зникнення" для поточної картинки
  img.addEventListener('animationend', handleOutEnd, { once: true });
  img.classList.add(dir === 'next' ? 'slide-out-left' : 'slide-out-right');

  // Функція, яка відпрацьовує після завершення анімації зникнення
  function handleOutEnd() {
    currentIndex = newIndex;
    img.src = images[currentIndex].original;
    img.alt = images[currentIndex].description;
    updateHud();

    // Знімаємо клас анімації "зникнення"
    img.classList.remove('slide-out-left', 'slide-out-right');
    img.addEventListener(
      'animationend',
      () => {
        isAnimating = false; // розблоковуємо анімації для наступного переходу
      },
      { once: true }
    );
    // Ставимо клас анімації "появи" для нової картинки
    img.classList.add(dir === 'next' ? 'slide-in-right' : 'slide-in-left');
  }
}

// Оновлює HUD (лічильник і підпис) у модальному вікні
function updateHud() {
  const root = instance.element();
  root.querySelector('.lb-counter').textContent = `${currentIndex + 1}/${images.length}`;
  root.querySelector('.lb-caption').textContent = images[currentIndex].description || '';
}
