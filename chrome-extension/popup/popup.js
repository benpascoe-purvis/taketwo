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

  let productCategory = document.querySelector("#product-category");
  productCategory.innerText = request.productCategory;

  let productImage = document.querySelector("#product-image");
  productImage.src = request.productImageLink;
  productImage.width = 100;

  // fetchAndPopulateData("pink");
  // fetchAndPopulateData(productColor.innerText);  //TODO: Fix bug in scraper API
});

// Hit Depop Scraper Endpoint + Populate GUI
async function fetchAndPopulateData(item_color) {
  const options = {
    method: "GET",
  };

  const res = await fetch(
    `http://127.0.0.1:5000/?item_colour=${item_color}`,
    options
  );

  const record = await res.json();

  console.log("record", record);

  let alternativeOptions = "";

  for (const key in record) {
    console.log(`${key}: ${record[key].item_link}`);
    let listing = record[key];
    alternativeOptions =
      alternativeOptions +
      `<li>
          <div>
            <img src=${listing.item_pic_url} width='50px'/>
            <a href=${listing.item_link}>${listing.item_name}</a><br />
            <p> Price: ${listing.item_price} </p>
            <p> Size: ${listing.item_size} </p>
          <div>
        </li>
        `;
  }

  document.getElementById("alternatives-list").innerHTML = alternativeOptions;
}

extractDepopInfoButton.addEventListener("click", async () => {
  alert("Fetching depop");
  fetchDepopData();
});

function fetchDepopData() {
  fetch(
    "https://www.depop.com/au/category/womens/dresses/?categories=11&colours=pink&categoryPath=womens&categoryPath=dresses"
  )
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      var parser = new DOMParser();

      var doc = parser.parseFromString(html, "text/html");

      let productList = doc.querySelector('[data-testid="product__items"]');
      let productItems = productList.querySelectorAll("li");

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

          console.log("Product Link: ", productLink);
          console.log("Image Link: ", imageLink);
          console.log("Price: ", itemPrice);
          console.log("Size: ", itemSize);
        } catch (error) {
          console.log("ERROR: ", error);
        }
      });

      let depopInfo = document.querySelector("#depop-info");
      depopInfo.innerText = productList;
    })
    .catch(function (err) {
      console.warn("Something went wrong.", err);
    });
}
