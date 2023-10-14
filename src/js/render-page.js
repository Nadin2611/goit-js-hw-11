import Notiflix from 'notiflix';

import { createMarkup, initLightbox } from './createmarkup.js';
import { isSubmit, pixabayService } from './app.js';
import { observer } from './observer.js';
import refs from './refs.js';

const { gallery, anchor } = refs;

export async function renderPage() {
  try {
    const response = await pixabayService.getPhotos();

    if (response.data.hits.length === 0) {
      gallery.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (isSubmit) {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
    }

    if (response.data.totalHits > pixabayService.per_page) {
      observer.observe(anchor);
    }
    gallery.insertAdjacentHTML('beforeend', createMarkup(response.data.hits));
    initLightbox();

    if (Math.floor(response.data.totalHits / 40 + 1) === pixabayService.page) {
      observer.unobserve(anchor);
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  } catch (error) {
    if (error.response.status === 404) {
      Notiflix.Notify.failure('Not Found!');
    }
    if (error.response.status === 400) {
      Notiflix.Notify.failure(`Bad Request!`);
    }
    console.log(error);
  }
}