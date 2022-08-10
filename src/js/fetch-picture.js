import axios from "axios";

const BASE_URL = 'https://pixabay.com/api';
const KEY = '17376022-5b12512663328c07708b99c13';

export async function getPictures(searchTerm) {
    try {
        const response = await axios.get(`${BASE_URL}/?key=${KEY}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true`);
        
        return response;
   
    } catch (error) {
        console.error(error);
    }
}

