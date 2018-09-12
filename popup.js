const getSynonymsBtn = document.getElementById("getSynonyms");
const errorContainer = document.querySelector(".error-message-container");
const noResultsContainer = document.querySelector(".no-results-container");
const selectedWordContainer = document.querySelector(
  ".selected-word-container"
);
const synonymInput = document.getElementById("synonym-input");
const synonymLink = document.querySelector(".synonym-link");
let validInput = true;
let contextSelected;

let definition = "";
let synonyms = [];
let antonyms = [];

const eventListeners = ["click", "keypress"];

let url;

const current_tab = { active: true, currentWindow: true };
function callback(tabs) {
  url = tabs[0].url; 
  console.log(url); 
}
chrome.tabs.query(current_tab, callback);

synonymLink.addEventListener("click", () => {
  chrome.tabs.create({ active: true, url: "http://www.synonym.com" });
});

getSynonymsBtn.addEventListener("click", () => {
  if (url.includes("chrome") && url.includes("google")){
    alert("Chrome doesn't allow its extensions to work in the marketplace.")
    return;
  }
  if (synonymInput.value.length > 1) {
    const inputWord = synonymInput.value.trim();
    fetchData(inputWord);
  } else {
    chrome.tabs.executeScript(
      {
        code: "window.getSelection().toString();"
      },
      selection => {
        const term = selection[0];
        synonymInput.value = term;
        fetchData(term);
      }
    );
  }
});

window.onkeydown = e => {
  if (url.includes("chrome") && url.includes("google")){
    alert("Chrome doesn't allow its extensions to work in the marketplace.")
    return;
  }
  let key = e.which || e.keyCode;
  if (key === 13) {
    if (synonymInput.value.length > 1) {
      const inputWord = synonymInput.value.trim();
      fetchData(inputWord);
    }
  }
};

function fetchData(query) {
  fetch("https://www.synonym.com/autocomplete?term=" + query + "&format=json")
    .then(response => {
      return response.json();
    })
    .then(body => {
      if (body.documents.length === 0) {
        console.log("hee");
        noResultsContainer.style.display = "block";
      } else {
        noResultsContainer.style.display = "none";
        synonymInput.value = query;
        synonyms = body.documents[0].synonyms;
        antonyms = body.documents[0].antonyms;
        definition = body.documents[0].definition;
        printInformation(query);
      }
    });
}

function validateSelection(str) {
  const valid = /^[a-zA-Z\s\-\_]+$/;
  if (valid.test(str)) {
    validInput = true;
    errorContainer.style.display = "none";
    synonymInput.value = str.trim();
  } else {
    errorContainer.style.display = "block";
    validInput = false;
  }
}

function printDefinition(str) {
  const definitionContainer = document.createElement("p");
  const wordSpan = document.createElement("span");
  const definitionSpan = document.createElement("span");
  definitionSpan.className = "selected__definition";
  definitionSpan.innerText = definition;
  wordSpan.className = "selected__word";
  wordSpan.innerText = str + " ";
  definitionContainer.appendChild(wordSpan);
  definitionContainer.appendChild(definitionSpan);
  selectedWordContainer.appendChild(definitionContainer);
}

function printSynonyms(arr, str) {
  let final_string;
  let synonymContainer = document.createElement("div");
  let synonymTitle = document.createElement("span");
  synonymTitle.className = "synonym-title";
  synonymTitle.innerHTML = "Synonyms: ";
  synonymContainer.appendChild(synonymTitle);
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].includes("_")) {
      let new_value = arr[i].split("_");
      arr[i] = new_value.join(" ");
    }
    let synonym = document.createElement("a");
    synonym.className = "synonym";
    synonym.innerHTML = arr[i];
    synonymContainer.appendChild(synonym);
    synonym.addEventListener("click", () => {
      fetchData(arr[i]);
    });
  }
  selectedWordContainer.appendChild(synonymContainer);
}

function printAntonyms(arr, str) {
  let antonymContainer = document.createElement("div");
  let antonymTitle = document.createElement("span");
  antonymTitle.className = "antonym-title";
  antonymTitle.innerHTML = "Antonyms: ";
  antonymContainer.appendChild(antonymTitle);
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].includes("_")) {
      let new_value = arr[i].split("_");
      arr[i] = new_value.join(" ");
    }
    let antonym = document.createElement("a");
    antonym.className = "synonym antonym";
    antonym.innerHTML = arr[i];
    antonymContainer.appendChild(antonym);
    antonym.addEventListener("click", () => {
      fetchData(arr[i]);
    });
  }
  selectedWordContainer.appendChild(antonymContainer);
  const viewMore = document.createElement("a");
  viewMore.className = "view-more";
  viewMore.innerHTML = "View More";
  selectedWordContainer.appendChild(viewMore);
  viewMore.addEventListener("click", () => {
    chrome.tabs.create({
      active: true,
      url: "http://www.synonym.com/synonyms/" + str
    });
  });
}

function printInformation(str) {
  selectedWordContainer.innerHTML = "";
  validateSelection(str);
  if (validInput) {
    const trimmed = str.trim();
    printDefinition(trimmed);
    printSynonyms(synonyms, trimmed);
    printAntonyms(antonyms, trimmed);
  }
}
