import axios from "axios";

export async function fetchPictures(url) {
   
        const response = await axios.get(url);
        return response.data;
   
   
}

