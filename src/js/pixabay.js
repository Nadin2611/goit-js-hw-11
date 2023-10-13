import axios from 'axios';

export class PixabayService {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '39892147-054eca5fcd8481a2b07ecccd0';

  constructor(perPage) {
    this.q = null;
    this.image_type = 'photo';
    this.orientation = 'horizontal';
    this.safesearch = true;
    this.page = 1;
    this.per_page = perPage;
  }
  getPhotos() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.q,
        image_type: this.image_type,
        orientation: this.orientation,
        safesearch: this.safesearch,
        page: this.page,
        per_page: this.per_page,
      },
    });
  }
}
