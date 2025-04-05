import { getImagesByQuery } from './pixabay-api.js';
import { createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton } from './render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
const perPage = 15;

@param { Event } event

async function onSearchSubmit(event) {
    event.preventDefault();
    clearGallery();
    hideLoadMoreButton();

    currentQuery = event.currentTarget.elements.searchQuery.value.trim();
    if (!currentQuery) {
        iziToast.warning({
            title: 'Увага',
            message: 'Будь ласка, введіть пошуковий запит.',
            position: 'topRight',
        });
        return;
    }

    currentPage = 1;
    await fetchImages();
}

async function onLoadMoreClick() {
    currentPage += 1;
    await fetchImages();
}

async function fetchImages() {
    showLoader();

    try {
        const data = await getImagesByQuery(currentQuery, currentPage);
        if (data.hits.length === 0) {
            iziToast.info({
                title: 'Інформація',
                message: 'На жаль, за вашим запитом нічого не знайдено.',
                position: 'topRight',
            });
            return;
        }

        createGallery(data.hits);

        const totalPages = Math.ceil(data.totalHits / perPage);
        if (currentPage >= totalPages) {
            hideLoadMoreButton();
            iziToast.info({
                title: 'Кінець результатів',
                message: 'Ви досягли кінця результатів пошуку.',
                position: 'topRight',
            });
        } else {
            showLoadMoreButton();
        }

        const { height: cardHeight } = document.querySelector('.gallery-item').getBoundingClientRect();
        window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
        });
    } catch (error) {
        iziToast.error({
            title: 'Помилка',
            message: 'Сталася помилка при завантаженні зображень. Спробуйте ще раз.',
            position: 'topRight',
        });
    } finally {
        hideLoader();
    }
}

searchForm.addEventListener('submit', onSearchSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreClick);
