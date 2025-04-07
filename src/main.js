import { getImagesByQuery } from './js/pixabay-api.js';
import { createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let searchForm, loadMoreBtn;

document.addEventListener('DOMContentLoaded', () => {
    searchForm = document.querySelector('.form');
    loadMoreBtn = document.querySelector('.load-more');

    if (searchForm) {
        searchForm.addEventListener('submit', onSearchSubmit);
    } else {
        console.error('.form не знайдений');
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', onLoadMoreClick);
    } else {
        console.error('.load-more не знайдений');
    }
});

let currentQuery = '';
let currentPage = 1;
const perPage = 15;

async function onSearchSubmit(event) {
    event.preventDefault();
    clearGallery();
    hideLoadMoreButton();

    const searchQuery = event.currentTarget.elements.searchQuery;
    if (!searchQuery || !searchQuery.value.trim()) {
        iziToast.warning({
            title: 'Увага',
            message: 'Будь ласка, введіть пошуковий запит.',
            position: 'topRight',
        });
        return;
    }

    currentQuery = searchQuery.value.trim();
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
        if (!data || !data.hits || data.hits.length === 0) {
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

        const galleryItem = document.querySelector('.gallery-item');
        if (galleryItem) {
            const { height: cardHeight } = galleryItem.getBoundingClientRect();
            window.scrollBy({
                top: cardHeight * 2,
                behavior: 'smooth',
            });
        }
    } catch (error) {
        console.error('Помилка під час отримання даних: ', error);
        iziToast.error({
            title: 'Помилка',
            message: 'Сталася помилка при завантаженні зображень. Спробуйте ще раз.',
            position: 'topRight',
        });
    } finally {
        hideLoader();
    }
}
