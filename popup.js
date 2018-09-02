const getSynonymsBtn = document.getElementById("getSynonyms");
const errorContainer = document.querySelector(".error-message-container");
const selectedWordContainer = document.querySelector(
  ".selected-word-container"
);
const synonymInput = document.getElementById("synonym-input");
const synonymLink = document.querySelector(".synonym-link");
let validInput = true;
let contextSelected;

const definition = "this is the definition of the selected word";
const synonyms = ["synonym", "synonym", "synonym", "synonym", "synonym"];

synonymLink.addEventListener("click", () => {
  chrome.tabs.create({ active: true, url: "http://www.synonym.com" });
});

getSynonymsBtn.addEventListener("click", () => {
  if (synonymInput.value.length > 1) {
    const inputWord = synonymInput.value.trim();
    printInformation(inputWord);
  } else {
    chrome.tabs.executeScript(
      {
        code: "window.getSelection().toString();"
      },
      selection => {
        printInformation(selection[0]);
      }
    );
  }
});

function validateSelection(str) {
  const valid = /^[a-zA-Z\s]+$/;
  const secondTest = /[a-zA-Z]+/;
  if (valid.test(str) && secondTest.test(str)) {
    validInput = true;
    const selected = removeSpaces(str);
    errorContainer.style.display = "none";
    synonymInput.value = selected;
  } else {
    errorContainer.style.display = "block";
    validInput = false;
  }
}

function removeSpaces(str) {
  if (str.split(" ").length === 1) {
    return str.split(" ")[0].trim();
  }
  if (str.split(" ").length > 1) {
    const array = str.split(" ");
    let selected;
    for (let i = 0; i < array.length; i++) {
      if (array[i] !== "") {
        selected = array[i];
        break;
      }
    }
    return selected.trim();
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
  for (let i = 0; i < arr.length; i++) {
    let synonym = document.createElement("a");
    synonym.className = "synonym";
    synonym.innerHTML = arr[i];
    selectedWordContainer.appendChild(synonym);
    synonym.addEventListener("click", () => {
      printInformation(arr[i]);
    });
  }
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
    const removedSpaces = removeSpaces(str);
    printDefinition(removedSpaces);
    printSynonyms(synonyms, removedSpaces);
  }
}

