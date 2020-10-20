import galleryItems from './gallery-items.js';

const galleryListRef = document.querySelector('.js-gallery');
const lightboxRef = document.querySelector('.js-lightbox');
const lightboxImageRef = document.querySelector('.lightbox__image');
const modalCloseBtnRef = document.querySelector(
  '[data-action="close-lightbox"]',
);
const lightboxOverlayRef = document.querySelector('.lightbox__overlay');

const galleryCardsMarkup = createGalleryCardsMarkup(galleryItems);
galleryListRef.insertAdjacentHTML('beforeend', galleryCardsMarkup);

function createGalleryCardsMarkup(items) {
  return items
    .map(({ preview, original, description }, index) => {
      return `
        <li class="gallery__item">
        <a class="gallery__link"
        href="${original}"
        >
        <img
            data-index="${index}"
            class="gallery__image"
            src="${preview}"
            data-source="${original}"
            alt="${description}"
        />
    </a>
</li>
`;
    })
    .join('');
}

galleryListRef.addEventListener('click', onGalleryItemClick);

function onGalleryItemClick(e) {
  e.preventDefault();
  if (e.target.tagName !== 'IMG') {
    return;
  }
  onOpenModal(e);
}

function onOpenModal(e) {
  window.addEventListener('keydown', onEscCloseModal);
  galleryListRef.addEventListener('keydown', onClickImageSlider);

  lightboxRef.classList.add('is-open');
  setImageAttribute(e);
}

function setImageAttribute(e) {
  lightboxImageRef.src = e.target.dataset.source;
  lightboxImageRef.alt = e.target.alt;
  lightboxImageRef.setAttribute('data-index', e.target.dataset.index);
}

lightboxRef.addEventListener('click', onOverlayAndBtnClick);

function onCloseModal() {
  window.removeEventListener('keydown', onEscCloseModal);
  galleryListRef.removeEventListener('keydown', onClickImageSlider);
  lightboxRef.classList.remove('is-open');
  unsetImageAttributes();
}

function unsetImageAttributes() {
  lightboxImageRef.src = '';
  lightboxImageRef.alt = '';
}

function onOverlayAndBtnClick(e) {
  if (e.target === lightboxOverlayRef || e.target === modalCloseBtnRef) {
    onCloseModal();
  }
}

function onEscCloseModal(e) {
  if (e.code === 'Escape') {
    onCloseModal();
  }
}

function onClickImageSlider(e) {
  const {
    dataset: { index },
  } = lightboxImageRef;
  const parsedIndex = parseInt(index);
  const firstChild = 0;
  const lastChild = galleryItems.length - 1;

  if (e.code === 'ArrowRight') {
    const newIndex = parsedIndex === lastChild ? firstChild : parsedIndex + 1;
    setNewAttributes(newIndex);
  }

  if (e.code === 'ArrowLeft') {
    const newIndex = parsedIndex === firstChild ? lastChild : parsedIndex - 1;
    setNewAttributes(newIndex);
  }
}

function setNewAttributes(newIndex) {
  const { original, description } = galleryItems[newIndex];
  lightboxImageRef.src = original;
  lightboxImageRef.alt = description;
  lightboxImageRef.dataset.index = newIndex;
}
