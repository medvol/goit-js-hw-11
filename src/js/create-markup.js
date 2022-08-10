export function createMarkup(values) {

    return values.data.hits.reduce((acc, value) => {
        const { webformatURL,largeImageURL, tags, likes, views, comments, downloads } = value;
      return acc + `<div class="photo-card">
       <div class="image-wrapper">
          <a href="${largeImageURL}">
           <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
        </div>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>${likes}
          </p>
          <p class="info-item">
            <b>Views</b>${views}
          </p>
          <p class="info-item">
            <b>Comments</b>${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>${downloads}
          </p>
        </div>
      </div>`
    }, '')
    
}



