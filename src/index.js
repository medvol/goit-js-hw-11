import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


import { getPictures } from "./js/fetch-picture";
import { createMarkup } from "./js/create-markup";




const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('.search-input'),
    searchBtn: document.querySelector('.search-btn'),
    loadMoreBtn: document.querySelector('.load-more'),
    galleryWrapper: document.querySelector('.gallery')

}

refs.form.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
    event.preventDefault();
    refs.galleryWrapper.innerHTML = '';
    const searchValue = refs.input.value;
    const value = await getPictures(searchValue);
    Notify.success(`Hooray! We found ${value.data.totalHits} images.`);
 
     console.log(value)
    console.log('1')
    
    if (value.data.hits.length > 0) {
        console.log('center')
        // return  Notify.info('Cogito ergo sum')
    };
    console.log('2')
   
    const markup = createMarkup(value);
    refs.galleryWrapper.insertAdjacentHTML('beforeend', markup);
    const lightbox = new SimpleLightbox('.gallery a', { 
    
    captionDelay: 250,
});
   

}