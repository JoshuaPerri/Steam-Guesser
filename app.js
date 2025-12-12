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
        reviewElement.textContent = reviewScores[5];
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

const nameElement = document.getElementById("game-name");
function set_name(name) {
    nameElement.textContent = name;
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

async function init() {
    // const response = await tablesDB.listRows({
    //     databaseId: "6931cde4003199800b9d",
    //     tableId: "games",
    //     queries: [Query.orderDesc("$createdAt"), Query.limit(1)]
    // });
    const response = await fetch("https://69330db900213a8cdc7a.tor.appwrite.run/game");
    let row = response;
    set_name(row["name"])
    set_reviews(row["positive-percent"], row["total-reviews"]);
    set_tags(row["tags"]);
    set_developer(row["developers"]);
    set_publisher(row["publishers"]);
    set_price(row["price-CDN"]);
    set_image(row["image-url"]);
    set_date(row["date"]);
}

document.addEventListener("DOMContentLoaded", () => {
    init();
});
