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
        tagsHTML.push(`<li class="tag-list-item">${tag}</li>`);
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
const labelElement = document.getElementById("price-label");
function set_price(price) {
    if (price === 0) {
        priceElement.textContent = "Free";
    } else if (price === -1) {
        labelElement.textContent = "No Longer for Sale";
    } else if (price === -2) {
        labelElement.textContent = "Only in Bundle";
    } else if (price === -3) {
        labelElement.textContent = "Only in Subscription";
    } else {
        priceElement.textContent = price.toLocaleString();
    }
}

const canvasElement = document.getElementById("canvas");
let canvasContext = canvasElement.getContext("2d");
let imageBitmap = null;

// const imageElement = document.getElementById("cover-image");
async function set_image(url) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            // imageElement.src = URL.createObjectURL(blob);
            window.createImageBitmap(blob)
                .then(bitmap => {
                    imageBitmap = bitmap;
                    canvasContext.filter = "blur(50px)";
                    canvasContext.drawImage(bitmap, 0, 0);
                });
        });
    // imageElement.setAttribute("src", url);
}

const dateElement = document.getElementById("date");
const options = {year: 'numeric', month: 'long', day: 'numeric'};
function set_date(dateString) {
    let date = new Date(dateString);
    dateElement.textContent = date.toLocaleString("en-US", options);
}

function days_since(start) {
    const dayLength = 24 * 60 * 60 * 1000;
    const now = new Date();

    return Math.round(Math.abs((start - now) / dayLength));
}

async function get_games_list() {
    return await (await fetch("json/games.json")).json()
}

async function get_tags_list() {
    return await (await fetch("json/tags.json")).json()
}

async function get_puzzle_list() {
    return await (await fetch("json/order.json")).json()
}

function create_tag_sublist(indexList, tagList) {
    let sublist = [];
    for (let i = 0; i < indexList.length; i++) {
        sublist.push(tagList[indexList[i]]);
    }
    return sublist;
}


let gamesData = [];
let tagsList = [];
let gameNum = 0;
async function init() {

    let params = new URLSearchParams(document.location.search);
    gameNum = params.get("game");

    if (gameNum === null) {
        let puzzleOrder = await get_puzzle_list();
        gameNum = puzzleOrder[days_since(new Date(2025, 11, 19))];
    }

    gamesData = await get_games_list();
    tagsList  = await get_tags_list();

    let gameData = gamesData[gameNum]
    set_reviews(gameData[5], gameData[4]);
    set_tags(create_tag_sublist(gameData[8], tagsList));
    set_developer(gameData[6]);
    set_publisher(gameData[7]);
    set_price(gameData[2]);
    set_image("https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/" + gameData[9]);
    set_date(gameData[3]);
}

document.addEventListener("DOMContentLoaded", init);

const answerBox = document.getElementById("answer-box");
const nameElement = document.getElementById("name-container");
const answerGroup = document.getElementById("answer-group");
document.getElementById("submit-button").addEventListener("click", (e) => {
    let answer = answerBox.value;
    if (answer === gamesData[gameNum][0]) {
        answerGroup.classList += " correct"
    } else {
        answerGroup.classList += " incorrect"
    }
    answerBox.setAttribute("disabled", "true");
    suggestionBox.setAttribute("hidden", "");
    canvasContext.filter = "none";
    canvasContext.drawImage(imageBitmap, 0, 0);
    nameElement.innerHTML = gamesData[gameNum][0];
});

function binarySearch(arr, x) {
    let left = 0;
    let right = arr.length - 1;

    let mid = 0
    while (left <= right) {
        mid = Math.floor((left + right) / 2);

        let compare = key(arr[mid]).substring(0, x.length).localeCompare(x);
        if (compare == 0) {
            break;
        } else if (compare < 0) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    let next = mid;

    let suggestionList = []
    while (next >= 0) {
        let compare = key(arr[next]).substring(0, x.length).localeCompare(x);
        if (compare != 0) {
            break;
        } else {
            suggestionList.unshift(arr[next][0]);
            next -= 1;
        }
    }
    next = mid + 1;
    while (next < arr.length) {
        let compare = key(arr[next]).substring(0, x.length).localeCompare(x);
        if (compare != 0) {
            break;
        } else {
            suggestionList.push(arr[next][0]);
            next += 1;
        }
    }

    return suggestionList;
}

function key(item) {
    return item[0].toLowerCase();
}

const suggestionBox = document.getElementById("suggestion-box");
const suggestionList = document.getElementById("suggestion-list");
document.getElementById("answer-box").addEventListener("input", (e) => {
    let answer = answerBox.value;
    if (answer.length > 1) {
        let suggestions = binarySearch(gamesData, answer.toLowerCase());
        suggestionList.innerHTML = "";
        for (let i = 0; i < Math.min(5, suggestions.length); i++) {

            let listItem = document.createElement("li");
            listItem.classList += "suggestion-item";

            let button = document.createElement("button");
            button.classList += "suggestion-button";
            button.innerHTML += suggestions[i];

            button.addEventListener("click", () => {
                answerBox.value = suggestions[i];
                suggestionBox.setAttribute("hidden", "");
            });

            listItem.appendChild(button);
            suggestionList.appendChild(listItem);
        }
        suggestionBox.removeAttribute("hidden");
    } else {
        suggestionBox.setAttribute("hidden", "");
    }
});
