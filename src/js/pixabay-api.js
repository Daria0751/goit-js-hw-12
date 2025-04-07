import axios from 'axios';

const API_KEY = '49618803-936837fbab6b031520c07bf29';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1) {
    const perPage = 15;
    const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`;

    try {
        const response = await axios.get(url);
        const { hits, totalHits } = response.data;
        return { hits, totalHits };
    } catch (error) {
        console.error('Помилка при отриманні зображень:', error);
        throw error;
    }
}

