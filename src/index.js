import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import InfiniteScroll from 'infinite-scroll';
import throttle from 'lodash.throttle';
import { getPictures } from "./js/fetch-picture";
import { createGalleryMarkup } from "./js/create-markup";
import { slowlyScroll } from './js/slowly-scroll';

const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('.search-input'),
    searchBtn: document.querySelector('.search-btn'),
    loadMoreBtn: document.querySelector('.load-more'),
    galleryWrapper: document.querySelector('.gallery'),
    infiniteScroll: document.querySelector('.pagination__next')

}

const urlParams = {
    BASE_URL: 'https://pixabay.com/api',
    KEY:  '17376022-5b12512663328c07708b99c13',
    perPage: '40',
    page: 1,
   
}

let searchItem = ''
let page = 1;

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', handleSubmit)

async function handleSubmit(event) {
    event.preventDefault();
    const { BASE_URL, KEY, perPage, page} = urlParams;
    updateUI(event);
    searchItem = refs.input.value;   
    
    const valueQuery = await searchQuery(searchItem);
    refs.infiniteScroll.href=`${BASE_URL}/?key=${KEY}&q=${searchItem}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page+1}.html`
    
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




addEventListener('scroll', throttle(onScroll, 500) )

function onScroll(event) {
    
    let infScroll = new InfiniteScroll(refs.galleryWrapper, {
        path: function () {
                return `${urlParams.BASE_URL}/?key=${urlParams.KEY}&q=cat&image_type=photo&orientation=horizontal&safesearch=true&per_page=${urlParams.perPage}&page=${this.pageIndex+1}`},
        responseBody: 'json',        
        status: '.scroller-status',      
        history: false,
    });
   

 
    infScroll.loadNextPage().then(function (loaded) {
  
        let { body } = loaded;
        const markup = createGalleryMarkup(body);
        refs.galleryWrapper.insertAdjacentHTML('beforeend', markup);
        

    }).catch(error => console.log(error.message));

    
}