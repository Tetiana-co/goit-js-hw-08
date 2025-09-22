// Дані
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

// 2) Рендер галереї (СТРОГО за шаблоном)
const galleryContainer = document.querySelector('ul.gallery');

function createImages(items) {
  return items
    .map(
      ({ preview, original, description }) => `
<li class="gallery-item">
  <a class="gallery-link" href="${original}">
    <img class="gallery-image" src="${preview}" data-source="${original}" alt="${description}" />
  </a>
</li>`
    )
    .join('');
}

galleryContainer.insertAdjacentHTML('beforeend', createImages(images));

// 3) Модалка з навігацією (кнопки + клавіші)
let currentIndex = null;
let instance = null;

galleryContainer.addEventListener('click', onGalleryClick);

function onGalleryClick(evt) {
  evt.preventDefault(); // не завантажуємо зображення по href
  const img = evt.target.closest('.gallery-image');
  if (!img) return;

  currentIndex = images.findIndex(i => i.original === img.dataset.source);
  openModal(currentIndex);
}

function openModal(index) {
  const { original, description } = images[index];

  instance = basicLightbox.create(
    `
    <div class="lightbox" role="dialog" aria-label="Перегляд зображень">
      <button class="nav-btn nav-prev" aria-label="Попереднє зображення" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
      <img class="modal-image" src="${original}" alt="${description}">
      <button class="nav-btn nav-next" aria-label="Наступне зображення" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
        </svg>
      </button>
    </div>
    `,
    {
      onShow: () => {
        document.addEventListener('keydown', onKeydown);

        const root = instance.element();
        root.querySelector('.nav-prev').addEventListener('click', showPrev);
        root.querySelector('.nav-next').addEventListener('click', showNext);
      },
      onClose: () => {
        document.removeEventListener('keydown', onKeydown);
      },
    }
  );

  instance.show();
}

function onKeydown(e) {
  if (e.key === 'Escape') return instance.close();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
}

function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  updateModalImage();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateModalImage();
}

function updateModalImage() {
  const node = instance.element().querySelector('.modal-image');
  node.src = images[currentIndex].original;
  node.alt = images[currentIndex].description;
}
