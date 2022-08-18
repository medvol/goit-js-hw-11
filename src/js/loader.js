
const loader = document.querySelector('.scroller-status')

export const hideLoader = () => {
    loader.classList.add('svisually-hidden');
};

export const showLoader = () => {
    loader.classList.remove('visually-hidden');
};