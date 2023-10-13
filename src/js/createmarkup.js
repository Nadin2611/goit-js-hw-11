import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Функція для створення розмітки
export function createMarkup(arr) {
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
  initLightbox();
}

// Функція для ініціалізації Lightbox
export function initLightbox() {
  const lightbox = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}

export function autoScroll() {
  const { height: cardHeight } = document
    .querySelector('.photo-card')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
