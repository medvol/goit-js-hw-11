import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';


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
    if(value.data.hits.length < 0) {Notify.info('Cogito ergo sum')};
    console.log(value.data.hits.length)
    const markup = createMarkup(value);
    refs.galleryWrapper.insertAdjacentHTML('beforeend', markup)
   

}