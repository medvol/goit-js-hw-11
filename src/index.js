import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import InfiniteScroll from 'infinite-scroll';
import { getPictures } from "./js/fetch-picture";
import { createGalleryMarkup } from "./js/create-markup";
import { slowlyScroll } from './js/slowly-scroll';

const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('.search-input'),
    searchBtn: document.querySelector('.search-btn'),
    loadMoreBtn: document.querySelector('.load-more'),
    galleryWrapper: document.querySelector('.gallery'),
   
}

const urlParams = {
    BASE_URL: 'https://pixabay.com/api',
    KEY:  '17376022-5b12512663328c07708b99c13',
    perPage: '40',    
   
}

let searchItem = ''
let page = 1;

refs.form.addEventListener('submit', handleSubmit);


async function handleSubmit(event) {
    event.preventDefault();
    updateUI(event);
    searchItem = refs.input.value;   
    
    const valueQuery = await searchQuery(searchItem);       
    const markup = createGalleryMarkup(valueQuery);
    refs.galleryWrapper.insertAdjacentHTML('beforeend', markup);
    slowlyScroll()
    
    const lightbox = new SimpleLightbox('.gallery a', {
    
        captionDelay: 250,
    });
   
}

function updateUI(event) {
    if (event.type === 'submit') {
    refs.galleryWrapper.innerHTML = '';
    page = 1;
};
    
}

async function searchQuery(value) {
    if (value === '') return Notify.failure('Please, enter something'); 
    
    const searchQuery = await getPictures(value, page); 
    
    if (searchQuery.hits.length === 0) return Notify.info("Sorry, there are no images matching your search query. Please try again.");    
    
    Notify.success(`Hooray! We found ${searchQuery.totalHits} images.`);
    page += 1;
    return searchQuery;
    
}

let infScroll = new InfiniteScroll(refs.galleryWrapper, {
    path:
        function () {
            return `${urlParams.BASE_URL}/?key=${urlParams.KEY}&q=${searchItem}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${urlParams.perPage}&page=${this.pageIndex+1}`},
    responseBody: 'json',        
    status: '.scroller-status',
    scrollThreshold: 100,        
    history: false,
});
   
let proxyElem = document.createElement('div');
    
infScroll.on( 'load', function(body) {     
    const itemsHTML = createGalleryMarkup(body);  
    proxyElem.innerHTML = itemsHTML;  
    refs.galleryWrapper.append( ...proxyElem.children );
});

infScroll.loadNextPage();
slowlyScroll()
    
