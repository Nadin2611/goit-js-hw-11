import { PixabayService } from './pixabay.js';
import refs from './refs.js';
import { renderPage } from './render-page.js';
import { autoScroll } from './createmarkup.js';
import Notiflix from 'notiflix';
import { observer } from './observer.js';

const { form, gallery, searchInput, anchor } = refs;
export let isSubmit = true;
let isFirstLoad = true;

export const pixabayService = new PixabayService(40);

// Обробник події для сабміту форми
form.addEventListener('submit', handleSubmit);

// Обробник події для інтупу
searchInput.addEventListener('input', () => {
  if (searchInput.value === '  ') {
    Notiflix.Notify.info('WARNING! Please enter text!');
  }
});

// Функція для обробки сабміту форми
function handleSubmit(event) {
  event.preventDefault();
  isFirstLoad = true;
  isSubmit = true;
  observer.unobserve(anchor);
  gallery.innerHTML = '';
  pixabayService.page = 1;

  const searchValue = event.target.elements['searchQuery'].value.trim();

  if (!searchValue) {
    gallery.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  pixabayService.q = searchValue;

  renderPage();
}

export function loadMoreData() {
  pixabayService.page += 1;
  renderPage();
  if (isFirstLoad) {
    return (isFirstLoad = false);
  }
  isSubmit = false;

  autoScroll();
}
