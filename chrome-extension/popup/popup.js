import { scrapeProductDetails_iconic } from "./scrapers.js";

let extractProductInfoButton = document.querySelector("#extract-button");
let extractDepopInfoButton = document.querySelector("#extract-depop-info");

// Extract on click (remove listener to run on extension open)
extractProductInfoButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scrapeProductDetails_iconic,
  });
});

// Listen for message from scraper and update GUI
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let productTitle = document.querySelector("#product-title");
  productTitle.innerText = request.productTitle;

  let productColor = document.querySelector("#product-color");
  productColor.innerText = request.productColor;

  let productBrand = document.querySelector("#product-brand");
  productBrand.innerText = request.productBrand;

  let productGender = document.querySelector("#product-gender");
  productGender.innerText = request.productGender;

  let productCategory = document.querySelector("#product-category");
  productCategory.innerText = request.productCategory;

  let productImage = document.querySelector("#product-image");
  productImage.src = request.productImageLink;
  productImage.width = 100;

  // fetchAndPopulateData("pink");
  // fetchAndPopulateData(productColor.innerText);  //TODO: Fix bug in scraper API
});

extractDepopInfoButton.addEventListener("click", async () => {
  fetchDepopData();
});

function fetchDepopData() {
  fetch(
    // "https://www.depop.com/au/category/womens/dresses/?categories=11&colours=pink&categoryPath=womens&categoryPath=dresses"
    "https://www.depop.com/au/category/womens/dresses/?colours=pink"
  )
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      var parser = new DOMParser();

      var doc = parser.parseFromString(html, "text/html");

      let productList = doc.querySelector('[data-testid="product__items"]');
      let productItems = productList.querySelectorAll("li");

      let alternativeItems = [];

      productItems.forEach((item) => {
        try {
          let productLinkEL = item.querySelector(
            '[data-testid="product__item"]'
          );
          let productURL = new URL(productLinkEL.href);
          let productLink = "https://www.depop.com" + productURL.pathname;

          let imageLinkEl = item.querySelector(
            '[data-testid="primaryProductImage"] img'
          );

          let imageLink = imageLinkEl.src || "NA";

          let itemAttributes = item.querySelector(
            '[data-testid="productListItem__attributes"]'
          );

          let itemPriceEl = itemAttributes.querySelector(
            '[aria-label="Price"]'
          );
          let itemPrice = itemPriceEl.innerText || "NA";

          let itemSizeEl = itemAttributes.querySelector('[aria-label="Size"]');
          let itemSize = itemSizeEl.innerText || "NA";

          alternativeItems.push({
            link: productLink,
            imageLink: imageLink,
            itemPrice: itemPrice,
            itemSize: itemSize,
          });
        } catch (error) {
          console.log("ERROR: ", error);
        }
      });

      addDepopResultsToPopup(alternativeItems);
    })
    .catch(function (err) {
      console.warn("Something went wrong.", err);
    });
}

function addDepopResultsToPopup(alternativeItems) {
  console.log("About to add results to GUI");
  console.log(alternativeItems);

  alternativeItems.forEach((item) => {
    let divElement = document.createElement("div");
    let liElement = document.createElement("li");

    liElement.innerHTML = `
      <a href="${item.link}" border="1px solid blue" target="_blank">
      <div border="1px solid red">
      <img src="${item.imageLink}" width=100 alt="Item Image" />
      <p>Price: <b>${item.itemPrice}</b></p>
      <p>Size: ${item.itemSize}</p>
      </div>
      </a>
    `;

    divElement.appendChild(liElement);

    let depopInfo = document.querySelector("#depop-info");
    depopInfo.appendChild(divElement);
  });
}
