import fetchHeroes from "./hero.js";
let heroes = await fetchHeroes();


let firstHero = document.querySelector('.container');
let secondHero = document.querySelector('.second-container');
let displayContainer = document.querySelector('.homepage-characters');
let secondDisplay = document.querySelector('.display-container');



const showBackBtn = () => {
    let back = document.querySelector('#back');
    if(back.style.display === 'none'){
        back.style.display = 'block';
    }
};

const hideBackBtn = () => {
    let back = document.querySelector('#back');
    if(back.style.display === 'block'){
        back.style.display = 'none';
    }
};

// Display Heroes :
function showHeroes(heroes) {
    const cards = heroes.map(hero => {
        const hero_name = hero.name;
        const thumbnail_path = hero.thumbnail.path;
        const thumbnail_extension = hero.thumbnail.extension;

        const span = `<span class='favorite_btn ${hero.isFavorite ? 'favorite' : ''}' title='Add to favorite'>&#9829;</span>`;


        const card = `
            <div class='card'>
                <div class='card_img'>
                    <img src="${thumbnail_path}.${thumbnail_extension}">
                </div>
                <div class='card_info'>
                    <h2>${hero_name}</h2>
                    <div class='card_info_btns'>
                        ${span}
                        <button class='information' title='Show More Information'>View Detail</button>
                    </div>
                </div>
            </div>
        `

        return card;
    }).join("");
    
    secondHero.style.display = 'none';
    firstHero.style.display = 'block';
    displayContainer.innerHTML = cards;

    makeFavourite();
}
showHeroes(heroes);


// Making favorite :
function makeFavourite() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', async (e) => {
            if (e.target.classList.contains('favorite_btn')) {
                e.target.classList.toggle('favorite');
                let name = e.target.parentElement.parentElement.querySelector('h2').textContent;
                let index = heroes.findIndex(hero => hero.name.includes(name));
                
                if (index === -1) {
                    // Hero not found in the main list, fetch details from API
                    const searchValue = name.toLowerCase();
                    const url = `https://gateway.marvel.com/v1/public/characters?ts=1709741495450&apikey=45bf6af7eb8c3857dd3bb83565cff23b&hash=5f3d46cd7fa6d2994aa97ebadea66f83&nameStartsWith=${searchValue}`;
                    
                    try {
                        const response = await fetch(url);
                        const jsonData = await response.json();
                        const searched_hero = jsonData.data.results[0]; // Assuming only one hero is returned
                        heroes.push(searched_hero); // Add the searched hero to the heroes array
                        index = heroes.length - 1; // Get the index of the newly added hero
                    } catch (error) {
                        console.error('Error fetching data:', error);
                        return;
                    }
                }

                // Toggle favorite status
                heroes[index].isFavorite = !heroes[index].isFavorite;

            } else if (e.target.classList.contains('information')) {
                showInformation(e);
            }
        });
    });
}


// Search Hero 
async function searchHeroes() {
    const search_input = document.getElementById('search');
    search_input.addEventListener('keyup', async () => {
        const searchValue = search_input.value.toLowerCase();

        const url = `https://gateway.marvel.com/v1/public/characters?ts=1709741495450&apikey=45bf6af7eb8c3857dd3bb83565cff23b&hash=5f3d46cd7fa6d2994aa97ebadea66f83&nameStartsWith=${searchValue}`;

        try {
            const response = await fetch(url);
            const jsonData = await response.json();
            const searched_heroes = jsonData.data.results; // Access the results array from the API response
            showHeroes(searched_heroes);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });
}
searchHeroes();


// Show favorite heroes :
function showFavorites() {
    const favorite_heroes = heroes.filter(hero => hero.isFavorite);
    if(!favorite_heroes.length) {
        displayContainer.innerHTML = `<h1>You do not have any favorite hero!</h1>`
        return;
    }

    showHeroes(favorite_heroes);
}
const favorite_btn = document.getElementById('show-favorite');
favorite_btn.addEventListener('click', showFavorites);
favorite_btn.addEventListener('click', showBackBtn);


// Show all heroes :
function showAll() {
    const all_heroes = heroes;
    showHeroes(all_heroes);
}
const homeBtn = document.getElementById('home');
const backBtn = document.getElementById('back');
homeBtn.addEventListener('click', showAll);
homeBtn.addEventListener('click', hideBackBtn);
backBtn.addEventListener('click', showAll);
backBtn.addEventListener('click', hideBackBtn);


// Show information about heroes :
async function showInformation(e) {
    secondHero.style.display = 'block';
    firstHero.style.display = 'none';

    let name = e.target.parentElement.parentElement.querySelector('h2').textContent;  
    let index = heroes.findIndex(hero => hero.name.includes(name));
    
    // If the hero is not found in the initial list, fetch details from API
    if (index === -1) {
        const searchValue = name.toLowerCase();
        const url = `https://gateway.marvel.com/v1/public/characters?ts=1709741495450&apikey=45bf6af7eb8c3857dd3bb83565cff23b&hash=5f3d46cd7fa6d2994aa97ebadea66f83&nameStartsWith=${searchValue}`;
        
        try {
            const response = await fetch(url);
            const jsonData = await response.json();
            const searched_hero = jsonData.data.results[0]; // Assuming only one hero is returned
            index = heroes.push(searched_hero) - 1; // Add the searched hero to the heroes array
        } catch (error) {
            console.error('Error fetching data:', error);
            return;
        }
    }

    const hero = heroes[index];

    const heroName = hero.name;
    const thumbnailPath = hero.thumbnail.path;
    const thumbnailExtension = hero.thumbnail.extension;
    const totalComics = hero.comics.items;
    const totalSeries = hero.series.items;

    const mainSection = `
        <div class='info'>
            <div class='info_img_container'>
                <img src="${thumbnailPath}.${thumbnailExtension}">
            </div>
            <h2 class='info_name'>${heroName}</h2>
            <h3 class='total_comics'>Total Comics : ${totalComics.length}</h3>
            <h3 class='total_comics'>Total Seires : ${totalSeries.length}</h3>
        </div>
    `
    const comicsSection = `
        <div class='comic_section'>
            <h2>Comics</h2>
            <ul>
                ${
                    totalComics.map(comic => `<li>${comic.name}</li>`).join("")
                }        
            </ul>
        </div>
    `
    const seriesSection = `
        <div class='series_section'>
            <h2>Series</h2>
            <ul>
                ${
                    totalSeries.map(series => `<li>${series.name}</li>`).join("")
                }        
            </ul>
        </div>
    `

    secondDisplay.innerHTML = mainSection+comicsSection+seriesSection;

    showBackBtn();
}
