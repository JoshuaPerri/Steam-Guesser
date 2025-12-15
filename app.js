import { Client, Query, TablesDB } from "appwrite";

const reviewThresholds = [0, 20, 40, 70, 80, 95];
const reviewScores = [
    "Overwhelmingly Negative",
    "Mostly Negative",
    "Mixed",
    "Mostly Positive",
    "Very Positive",
    "Overwhelmingly Positive",
];

const reviewElement = document.getElementById("review-data")
function set_reviews(percent, total) {
    for (let i=0; i < reviewThresholds.length-1; i++) {
        if (percent >= reviewThresholds[i] && percent < reviewThresholds[i+1]) {
            reviewElement.textContent = reviewScores[i] + " (" + total.toLocaleString() + ")";
            return;
        }
    }
    if (percent >= reviewThresholds[5]) {
        reviewElement.textContent = reviewScores[5] + " (" + total.toLocaleString() + ")";
    }
}

const tagsElement = document.getElementById("tags-list");
function set_tags(tags) {
    let tagsHTML = [];
    tags.forEach(tag => {
        tagsHTML.push(`<li>${tag}</li>`);
    });
    tagsElement.innerHTML = tagsHTML.join("");
}

const developerElement = document.getElementById("developer");
function set_developer(developer) {
    developerElement.textContent = developer;
}

const publisherElement = document.getElementById("publisher");
function set_publisher(publisher) {
    publisherElement.textContent = publisher;
}

const priceElement = document.getElementById("price");
function set_price(price) {
    priceElement.textContent = price.toLocaleString();
}

const imageElement = document.getElementById("cover-image");
function set_image(url) {
    imageElement.setAttribute("src", url);
}

const dateElement = document.getElementById("date");
const options = {year: 'numeric', month: 'long', day: 'numeric'};
function set_date(dateString) {
    let date = new Date(dateString);
    dateElement.textContent = date.toLocaleString("en-US", options);
}




// const client = new Client()
//     .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
//     .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// const tablesDB = new TablesDB(client);

let game = ""
async function init() {
    // const response = await tablesDB.listRows({
    //     databaseId: "6931cde4003199800b9d",
    //     tableId: "games",
    //     queries: [Query.orderDesc("$createdAt"), Query.limit(1)]
    // });
    fetch("https://69330db900213a8cdc7a.tor.appwrite.run/game")
        .then((response) => response.json())
        .then((data) => {
            game = data["name"];
            set_reviews(data["positive-percent"], data["total-reviews"]);
            set_tags(data["tags"]);
            set_developer(data["developers"]);
            set_publisher(data["publishers"]);
            set_price(data["price-CDN"]);
            set_image(data["image-url"]);
            set_date(data["date"]);
    });
    // game = "Hollow Knight: Silksong"
    // set_reviews(92, 112292);
    // set_tags(["Metroidvania", "Difficult", "Indie", "Souls-like", "Great Soundtrack", "2D", "Singleplayer", "Platformer", "Exploration", "Female Protagonist", "Adventure", "Beautiful", "Atmospheric", "Story Rich", "Sequel", "Hand-drawn", "Action", "Open World", "Multiple Endings", "Cute"]);
    // set_developer("Team Cherry");
    // set_publisher("Team Cherry");
    // set_price(25.99);
    // set_image("https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1030300/7983574d464e6559ac7e24275727f73a8bcca1f3/header.jpg");
    // set_date("2025-09-04");
}

document.addEventListener("DOMContentLoaded", init);

const answerBox = document.getElementById("answer-box");
document.getElementById("submit-button").addEventListener("click", (e) => {
    let answer = answerBox.value
    // if (answer === game) {
    //     alert(true);
    // } else {
    //     alert(false);
    // }
    answerBox.setAttribute("disabled", "true")
    imageElement.classList = ""
});