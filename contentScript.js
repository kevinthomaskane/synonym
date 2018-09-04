let word;
let definition = "";
let synonyms = [];
let antonyms = [];
let first = true;

//synonym container in modal
let synonymContainer;

//antonym container in modal
let antonymContainer;

//view more button
let viewMore;

//modal
const modal = document.createElement("div");
modal.className = "injected-modal";

//close button
const close = document.createElement("span");
close.className = "close-modal";
close.innerHTML = "x";

//logo
const logo = document.createElement("img");
logo.src = chrome.extension.getURL("./images/synonym_logo.png");
logo.className = "modal-logo";

//selected word line
const definitionContainer = document.createElement("p");
definitionContainer.className = "definition__container";
const wordSpan = document.createElement("span");
wordSpan.className = "selected__word";
const definitionSpan = document.createElement("span");
definitionSpan.className = "selected__definition";

//input
const synonymInput = document.createElement("input");
synonymInput.className = "cs-synonym-input";

//search button
const getSynonymsBtn = document.createElement("button");
getSynonymsBtn.className = "get-synonyms-btn";
getSynonymsBtn.innerText = "Get Synonyms";

//powered by
const powered_by = document.createElement("p");
powered_by.className = "powered-by";
const link = document.createElement("a");
link.href = "http://www.synonym.com";
link.target = "_blank";
link.innerHTML = "synonym.com";
powered_by.innerHTML = "powered by ";
powered_by.appendChild(link);

//append to modal
modal.appendChild(close);
modal.appendChild(logo);
modal.appendChild(synonymInput);
modal.appendChild(getSynonymsBtn);
modal.appendChild(definitionContainer);

//append to doc
document.body.appendChild(modal);

//event listeners
const close_btn = document.querySelector(".close-modal");
close_btn.addEventListener("click", e => {
  modal.setAttribute(
    "style",
    "right: -9999px; visibility: hidden; transition: .2s ease-in-out;"
  );
});

modal.addEventListener("click", e => {
  e.stopPropagation();
});

chrome.runtime.onMessage.addListener(msgObj => {
  if (msgObj) {
    if (first){
      word = msgObj.word;
      fetchData(word);
      modal.style.visibility = "visible";
      modal.style.right = "20px";
      modal.style.animation = "slide .5s";
      first = false;
      closeModal();
    } else {
      word = msgObj.word;
      clearContainers();
      fetchData(word);
      modal.style.visibility = "visible";
      modal.style.right = "20px";
      modal.style.animation = "slide .5s";
      closeModal();
    }
  }
});

//helper functions
function closeModal() {
  document.body.addEventListener("click", () => {
    modal.setAttribute(
      "style",
      "right: -9999px; visibility: hidden; transition: .2s ease-in-out;"
    );
  });
}

function printSynonyms(arr, str) {
  synonymContainer = document.createElement("div");
  let synonymTitle = document.createElement("span");
  synonymTitle.className = "synonym-title";
  synonymTitle.innerHTML = "Synonyms: ";
  synonymContainer.appendChild(synonymTitle);
  for (let i = 0; i < arr.length; i++) {
    let synonym = document.createElement("a");
    synonym.className = "synonym";
    synonym.innerHTML = arr[i];
    synonymContainer.appendChild(synonym);
    synonym.addEventListener("click", () => {
      clearContainers();
      fetchData(arr[i]);
    });
  }
  modal.appendChild(synonymContainer);
}

function printAntonyms(arr, str) {
  antonymContainer = document.createElement("div");
  antonymContainer.className = "antonym-container";
  let antonymTitle = document.createElement("span");
  antonymTitle.className = "antonym-title";
  antonymTitle.innerHTML = "Antonyms: ";
  antonymContainer.appendChild(antonymTitle);
  for (let i = 0; i < arr.length; i++) {
    let antonym = document.createElement("a");
    antonym.className = "synonym antonym";
    antonym.innerHTML = arr[i];
    antonymContainer.appendChild(antonym);
    antonymContainer.appendChild(powered_by)
    antonym.addEventListener("click", () => {
      clearContainers();
      fetchData(arr[i]);
    });
  }
  modal.appendChild(antonymContainer);
  viewMore = document.createElement("a");
  viewMore.className = "view-more";
  viewMore.innerHTML = "View More";
  viewMore.href = "http://www.synonym.com/synonyms/" + str;
  viewMore.target = "_blank";
  modal.appendChild(viewMore);
}

function printInformation(str) {
  definitionContainer.innerHTML = "";
  printDefinition(str);
  printSynonyms(synonyms, str);
  printAntonyms(antonyms, str);
}

function clearContainers() {
  antonymContainer.innerHTML = "";
  synonymContainer.innerHTML = "";
  viewMore.remove();
}

function printDefinition(str) {
  definitionContainer.innerHTML = "";
  definitionSpan.innerText = definition;
  wordSpan.innerText = str + " ";
  definitionContainer.appendChild(wordSpan);
  definitionContainer.appendChild(definitionSpan);
}

function fetchData(query) {
  fetch("http://www.synonym.com/autocomplete?term=" + query + "&format=json")
    .then(response => {
      return response.json();
    })
    .then(body => {
      synonymInput.value = query;
      synonyms = body.documents[0].synonyms;
      antonyms = body.documents[0].antonyms;
      definition = body.documents[0].definition;
      printInformation(query);
    });
}
