import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import InfiniteScroll from 'infinite-scroll';
import throttle from 'lodash.throttle';
import { getPictures } from "./js/fetch-picture";
import { createGalleryMarkup } from "./js/create-markup";

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


// function createURL(urlParams, searchTerm) {
//     const{BASE_URL, KEY, perPage,page} =urlParams
//     const url = `${BASE_URL}/?key=${KEY}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page+1}`
//     return url
// }

// const url = createURL(urlParams, "cat")
// console.log(url)

// let nextPages = [
//   'index',
//   'options',
//   'api',
//   'events',
//   'extras',
//   'license',
// ];



addEventListener('scroll', throttle(onScroll, 500) )

// let nextURL;

// function updateNextURL( doc ) {
//   nextURL = doc.querySelector('.pagination__next').getAttribute('href');
// }
// // get initial nextURL
// console.log(updateNextURL( document ));

function onScroll(event) {
    
    let infScroll = new InfiniteScroll( refs.galleryWrapper, {
        path:
            function () {
    return (`${urlParams.BASE_URL}/?key=${urlParams.KEY}&q=cat&image_type=photo&orientation=horizontal&safesearch=true&per_page=${urlParams.perPage}&page=${this.pageIndex+1}`)},
    responseBody: 'json',
  append: '.photo-card',
  status: '.scroller-status',
        hideNav: '.pagination',
  history: false,
    });
   

infScroll.on('load', function (body) {
    console.log(body)
  // compile body data into HTML
    // const parseJson = JSON.parse(body)
    const itemsHTML = createGalleryMarkup(body);
     refs.galleryWrapper.insertAdjacentHTML('beforeend', itemsHTML);
  // convert HTML string into elements
//   proxyElem.innerHTML = itemsHTML;
  // append item elements
//   container.append( ...proxyElem.children );
});
   
    console.log(infScroll.pageIndex)
    
//     infScroll.loadNextPage().then( function( loaded ) {
//   // next page has been loaded
//         console.log(loaded)
//   let { response, body, items } = loaded;
//   console.log( response.path );
//   console.log( body );
//         console.log(items);
//          const markup = createGalleryMarkup(body);
//     refs.galleryWrapper.insertAdjacentHTML('beforeend', markup);
//     });
    
    infScroll.loadNextPage()
    // let path = infScroll.getPath()
    // infScroll.options.path = path
    // console.log(path)
 
//     infScroll.on('load', function (event, data) {
//         const markup = createGalleryMarkup(body);
//     refs.galleryWrapper.insertAdjacentHTML('beforeend', markup);
//   console.log(`Loaded: ${path}`,
//     `Status: ${response.status}`,
//     `Current page: ${infScroll.pageIndex}`,
//     `${infScroll.loadCount} pages loaded`
    
//         );
//         console.log(data)
// });
    

    
}

