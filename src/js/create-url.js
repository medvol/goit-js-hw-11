export const urlParams = {
    BASE_URL: 'https://pixabay.com/api',
    KEY: '17376022-5b12512663328c07708b99c13',
    perPage: '40',
    currentPage: 1,
    category: '',
    
}


export function createURL(urlParams) {
    const { BASE_URL, KEY, perPage, currentPage,category} = urlParams;
    return `${BASE_URL}/?key=${KEY}&q=${category}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${currentPage}`
     
}
 
