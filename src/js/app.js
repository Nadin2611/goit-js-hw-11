import { PixabayService } from './pixabay.js';
import refs from './refs.js';
import { renderPage } from './render-page.js';
import { autoScroll } from './createmarkup.js';

const { form, gallery } = refs;
export let isSubmit = true;
let isFirstLoad = true;

export const pixabayService = new PixabayService(40);

// Обробник події для сабміту форми
form.addEventListener('submit', handleSubmit);

// Функція для обробки сабміту форми
function handleSubmit(event) {
  event.preventDefault();
  isFirstLoad = true;
  isSubmit = true;
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
  renderPage();
  if (isFirstLoad) {
    return (isFirstLoad = false);
  }
  isSubmit = false;
  pixabayService.page += 1;

  autoScroll();
}
