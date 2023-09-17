import { scrapeDetails_iconic } from "./scrapers.js";

let extractProductInfoButton = document.querySelector("#extract-button");

// Run extract functions on click
extractProductInfoButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scrapeDetails_iconic,
  });
});

// Update GUI w/ search details
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
});
