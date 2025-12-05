const reviewElement = document.getElementById("review-data")

//  0 - 19  Overwhelmingly Negative
// 20 - 39  Mostly Negative
// 40 - 69  Mixed
// 70 - 89  Mostly Positive
// 80 - 94  Very Positive
// 95 - 100 Overwhelmingly Positive


const reviewThresholds = [0, 20, 40, 70, 80, 95]
const reviewScores = [
    "Overwhelmingly Negative",
    "Mostly Negative",
    "Mixed",
    "Mostly Positive",
    "Very Positive",
    "Overwhelmingly Positive",
]

function set_reviews(percent, total) {
    for (i=0; i < reviewThresholds.length-1; i++) {
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
    tagsHTML = [];
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

const nameElement = document.getElementById("game-name");
function set_name(name) {
    nameElement.textContent = name;
}


document.addEventListener("DOMContentLoaded", () => {
    // set_reviews(93, 107658);
    // set_tags(["Metroidvania", "Difficult", "Indie", "Souls-like", "Great Soundtrack", "2D", "Singleplayer", "Platformer", "Exploration", "Female Protagonist", "Adventure", "Beautiful", "Atmospheric", "Story Rich", "Sequel", "Hand-drawn", "Action", "Open World", "Multiple Endings", "Cute"]);
    // set_developer("Team Cherry");
    // set_publisher("Team Cherry");
    // set_price(25.99);
});
