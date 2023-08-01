const mainContainer = document.getElementsByTagName("main")[0];
const toTopBtn = document.querySelector(".scrollToTopBtn");
const loaderContainer = document.querySelector('.loader');
const modal = document.getElementById("modal");
const modal__close = document.getElementsByClassName("modal__close")[0];
const modalName = document.querySelector(".modal__name-character");
const modalOrigin = document.querySelector(".modal__origin-character");
const modalStatus = document.querySelector(".modal__status-character");
const modalLocation = document.querySelector(".modal__location-character");
const modalSpecies = document.querySelector(".modal__species-character");
const modalGender = document.querySelector(".modal__gender-character");
const modalImage = document.querySelector(".modal__image");
const checkbox = document.querySelector(".form-check__pagination");
const currentPage = document.querySelector(".pagination__current_page");
const nextBtn = document.querySelector(".pagination__button-next");
const prevBtn = document.querySelector(".pagination__button-prev");
const throttleTime = 1000;
let page = 1;



async function getLinkToCharacters() {
    const url = `https://rickandmortyapi.com/api/character?page=${page}`;
    //displayLoading();
    const response = await fetch(url);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const data = await response.json();
    console.log(data)
    return data;
}



function createCharacters(){
    getLinkToCharacters().then((data) => {
        hideLoading();
        data.results.forEach(el=>{

            // create character cards

            let divContainer = document.createElement('div');
            let title = document.createElement('h2');
            let bgContainer = document.createElement('div');
            let image = document.createElement('img');
            image.src = el.image;

            mainContainer.append(divContainer);
            divContainer.append(image);
            divContainer.prepend(bgContainer);
            divContainer.append(title);

            title.innerText = el.name;
            image.alt = el.name;

            divContainer.className = "character";
            bgContainer.className = "character__bg";
            title.className = "character__name";
            image.className = "character__title-image";

            // create a modal window

            divContainer.addEventListener('click', () => {
                modal.style.display = "block";
                document.querySelector("body").style.overflow = 'hidden';
                modalName.innerText = el.name;
                modalOrigin.innerText = el.origin.name;
                modalStatus.innerText = el.status;
                modalLocation.innerText = el.location.name;
                modalSpecies.innerText = el.species;
                modalGender.innerText = el.gender;
                modalImage.src = el.image;
                modalImage.alt = el.name;

            })
        })
    }).catch(error => {
        console.log(error.message);
    });
};
createCharacters();



//check scroll position for infinite loading

function checkPosition(){
    throttle(()=> {
        const height = document.body.offsetHeight;
        const screenHeight = window.innerHeight;
        const scrolled = window.scrollY;
        const border = height - screenHeight/4;
        const position = scrolled + screenHeight;
    
        if (position >= border){
            if(page==42){
                return;
            }else {
                page++;
                return createCharacters();
            }
        }
    }, throttleTime)
}

// slow down the number of calls - performance optimization

function throttle(callback, time){
    let throttleTimer;
    if (throttleTimer){
        console.log ('throttling');
        return;
    }
    throttleTimer = true;
    setTimeout(()=>{
        callback();
        throttleTimer = null;
    }, time);
}



// "to top" with scrolling to the top of the page

function handleScroll() {
    const scrolled = window.pageYOffset;
    const coords = document.documentElement.clientHeight;
    if (scrolled > coords) {
        toTopBtn.classList.add("scrollToTopBtn_visible");
    } else {
        toTopBtn.classList.remove("scrollToTopBtn_visible");
    }
}

function scrollToTop() {
  document.documentElement.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}

toTopBtn.addEventListener("click", scrollToTop);



// loader during data loading

function displayLoading() {
    loaderContainer.style.display = 'block';
};

function hideLoading() {
    loaderContainer.style.display = 'none';
};



// modal window closing

modal__close.onclick = function() {
    modal.style.display = "none";
    document.querySelector("body").style.overflow = 'visible';
}



// pagination

checkbox.addEventListener('click',()=>{
    if (checkbox.checked){
        document.querySelector('.pagination').classList.add("pagination_visible");
        mainContainer.innerHTML="";
        currentPage.innerText = page;
        createCharacters();
    }else{
        document.querySelector('.pagination').classList.remove("pagination_visible");
    }
})

nextBtn.addEventListener('click',()=>{
    if(page !== 42){
        page++;
        recreateCards();
        if(page==42){
            nextBtn.classList.add("pagination__button-next_disable");
            return;
        }
    }
})

prevBtn.addEventListener('click',()=>{
    if(page !== 1){
        page--;
        recreateCards();
        if(page==1){
            prevBtn.classList.add("pagination__button-prev_disable");
            return;
        }
    }
})

function recreateCards(){
    currentPage.innerText = page;
    prevBtn.classList.remove("pagination__button-prev_disable");
    nextBtn.classList.remove("pagination__button-next_disable");
    mainContainer.innerHTML="";
    createCharacters();
}



window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      document.querySelector("body").style.overflow = 'visible';
    }
}

window.addEventListener('scroll', ()=>{
    if (!checkbox.checked){
        checkPosition();
    }
    handleScroll();
});

window.addEventListener('resize', checkPosition);