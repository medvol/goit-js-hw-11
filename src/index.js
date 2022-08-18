import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import "simplelightbox/dist/simple-lightbox.min.css";

import updateUI from './js/updateUI';
import { fetchPictures } from "./js/fetch-picture";
import {createURL, urlParams} from './js/create-url';
import { createGalleryMarkup } from "./js/create-markup";
import { slowlyScroll } from './js/slowly-scroll';
import { showLoader, hideLoader } from './js/loader';
import simpleLightbox from 'simplelightbox';

const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('.search-input'),
    searchBtn: document.querySelector('.search-btn'),
    loadMoreBtn: document.querySelector('.load-more'),
    galleryWrapper: document.querySelector('.gallery'), 
    endContent: document.querySelector('.last-page')
   
}

let totalPage = 1;

refs.form.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
    event.preventDefault();
    updateUI(event, refs.galleryWrapper);
    refs.endContent.classList.add('visually-hidden')
    urlParams.currentPage = 1;
        
    urlParams.category = refs.input.value.trim();    
    if (urlParams.category === '') return Notify.failure('Please, enter something'); 
    const url = createURL(urlParams);
    try {
        const valueQuery = await fetchPictures(url);
        if (valueQuery.hits.length === 0) return Notify.info("Sorry, there are no images matching your search query. Please try again.");  
        Notify.success(`Hooray! We found ${valueQuery.totalHits} images.`);
        totalPage = Math.ceil(valueQuery.totalHits / 40);
        
        createGalleryMarkup(valueQuery, refs.galleryWrapper);
        urlParams.currentPage += 1;
        slowlyScroll();
        const lightbox = new SimpleLightbox('.gallery a', {
        captionDelay: 250,
        });
       

    } catch (error) {
        console.log(error);
    }   
    
};


addEventListener('scroll', onScroll);

async function onScroll() {

    if (urlParams.currentPage > totalPage) {
        refs.endContent.classList.remove('visually-hidden');
            return
         }
      const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
     if (scrollTop + clientHeight >= scrollHeight - 5) {
         const url = createURL(urlParams);
         showLoader();
         try {
             const valueQuery = await fetchPictures(url);
             urlParams.currentPage += 1;    
             createGalleryMarkup(valueQuery, refs.galleryWrapper);
             slowlyScroll();           
         
            const lightbox = new SimpleLightbox('.gallery a', {
            captionDelay: 250,
        });
         } catch (error) {
             console.log(error);
         } finally {
             hideLoader();
         }        
    }
}
