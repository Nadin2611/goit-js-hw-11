import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SmoothScroll from 'smooth-scroll';

// Змінні
const refs = {
  seachForm: document.getElementById('search-form'),
  seachInput: document.getElementById('search-input'),
  seachBtn: document.querySelector('button[type="submit"]'),
  gallery: document.querySelector('.gallery'),
};

const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 800,
  speedAsDuration: true,
  easing: 'easeInOutQuint',
});

let currentPage = 1;
const perPage = 40;
let totalHits = 0;
let isLoading = false;

//Обробник події для активації кнопки пошуку
refs.seachInput.addEventListener('input', handleInput);

// Обробник події для сабміту форми
refs.seachForm.addEventListener('submit', handleSubmit);

//Функція для активації кнопки пошуку
function handleInput() {
  const isSearchInputEmpty = !refs.seachInput.value.trim();
  refs.seachBtn.disabled = isSearchInputEmpty;
}

// Функція для обробки сабміту форми
async function handleSubmit(event) {
  event.preventDefault();
  const seachValue = refs.seachInput.value.trim();
  currentPage = 1;
  refs.gallery.innerHTML = '';
  await fetchImages(seachValue);
}

// Функція, яка виконує HTTP-запит до сервісу Pixabay
async function fetchImages(seachValue) {
  if (isLoading) return;
  isLoading = true;

  try {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '39892147-054eca5fcd8481a2b07ecccd0';
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: seachValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: perPage,
      },
    });

    const images = response.data.hits;
    totalHits = response.data.totalHits;

    //Перевірка чи не порожній масив
    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      const markup = createMarkup(images);
      appendMarkupToGallery(markup);

      const lastCard = document.querySelector('.photo-card:last-child');
      const lastCardHeight = lastCard.offsetHeight;
      window.scrollBy({
        top: lastCardHeight,
        behavior: 'smooth',
      });

      initLightbox();

      currentPage += 1;

      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
  } catch (error) {
    console.error('Error:', error);

    Notiflix.Notify.failure('Something went wrong. Please try again later.');
  } finally {
    isLoading = false;
  }
}

// Функція для додавання розмітки до галереї
function appendMarkupToGallery(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

// Функція для створення розмітки
function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
       <div class="photo-card">
        <a href="${largeImageURL}" target="_blank">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes: </b>${likes}</p>
          <p class="info-item"><b>Views: </b>${views}</p>
          <p class="info-item"><b>Comments: </b>${comments}</p>
          <p class="info-item"><b>Downloads: </b>${downloads}</p>
        </div>
      </div>`
    )
    .join('');
}

// Функція для ініціалізації Lightbox
function initLightbox() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}

// Обробник подій для прокручування сторінки
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 200 &&
    currentPage * perPage < totalHits
  ) {
    fetchImages(refs.seachInput.value.trim());
  }
});
