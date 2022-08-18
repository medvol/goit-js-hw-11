import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import InfiniteScroll from 'infinite-scroll';
import updateUI from './js/updateUI';
import { fetchPictures } from "./js/fetch-picture";
import {createURL, urlParams} from './js/create-url';
import { createGalleryMarkup } from "./js/create-markup";
import { slowlyScroll } from './js/slowly-scroll';

const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('.search-input'),
    searchBtn: document.querySelector('.search-btn'),
    loadMoreBtn: document.querySelector('.load-more'),
    galleryWrapper: document.querySelector('.gallery'),
    nextPage: document.querySelector('.pagination__next'),
   
}

let totalPage = 0;

 let infScroll = new InfiniteScroll(refs.galleryWrapper, {
    path:  
         function () {  
              console.log('count', this.loadCount)
    console.log('total',totalPage)
            if ( this.loadCount <= totalPage ) {
    let nextIndex = this.loadCount + 2;
    return  `${urlParams.BASE_URL}/?key=${urlParams.KEY}&q=${urlParams.category}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${urlParams.perPage}&page=${nextIndex}`;
  }       
    },  
       
    responseBody: 'json',        
    status: '.scroller-status',
    scrollThreshold: 400,
    checkLastPage: false,
     history: false,
    debug: true,
   
});



refs.form.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
    event.preventDefault();
    updateUI(event, refs.galleryWrapper);
    
    infScroll.loadCount = 0
    infScroll.option({
  
  loadOnScroll: true,
} )
   
    
    urlParams.category = refs.input.value.trim();    
    if (urlParams.category === '') return Notify.failure('Please, enter something'); 
    const url = createURL(urlParams)
    
    const valueQuery = await fetchPictures(url);
    if (valueQuery.hits.length === 0) return Notify.info("Sorry, there are no images matching your search query. Please try again.");  
    Notify.success(`Hooray! We found ${valueQuery.totalHits} images.`);
    totalPage = Math.ceil(valueQuery.totalHits/40)
    
    const markup = createGalleryMarkup(valueQuery);
    refs.galleryWrapper.insertAdjacentHTML('beforeend', markup);

    if (totalPage===1) infScroll.option({
  // initial options...
  // disable loading on scroll
  loadOnScroll: false,
} )
   


   
let proxyElem = document.createElement('div');
    
infScroll.on('load', function (body) {
    console.log(body)
    console.log('inbox count', infScroll.loadCount)
    console.log('inbox tota',totalPage)
    
    const itemsHTML = createGalleryMarkup(body);  
    proxyElem.innerHTML = itemsHTML;  
    refs.galleryWrapper.append(...proxyElem.children);
    if(totalPage ===1 ){infScroll.loadCount = 0}
   
    console.log('inbox count after', infScroll.loadCount)


   
    const lightbox = new SimpleLightbox('.gallery a', {
        captionDelay: 250,
    });
    slowlyScroll();
});

 
infScroll.loadNextPage();
slowlyScroll();
    
   


    const lightbox = new SimpleLightbox('.gallery a', {
        captionDelay: 250,
    });


};
