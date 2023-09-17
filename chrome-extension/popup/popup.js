let extractProductInfoButton = document.querySelector("#extract-button");
let productInfoList = document.querySelector("#info-list");

let productTitle = document.querySelector("#product-title");
let productColor = document.querySelector("#product-color");
let productBrand = document.querySelector("#product-brand");
let productCategory = document.querySelector("#product-category");
let productImage = document.querySelector("#product-image");

// Run extract functions on click
extractProductInfoButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getProductDetails,
  });
});

function validateInput(input) {
  if (input == null) {
    return "Not available";
  }

  return input;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  productTitle.innerText = validateInput(request.productTitle);
  productColor.innerText = validateInput(request.productColor);
  productBrand.innerText = validateInput(request.productBrand);
  productCategory.innerText = validateInput(request.productCategory);

  productImage.src = validateInput(request.productImageLink);
  productImage.width = 100;
});

function getProductDetails() {
  const productColor = document.querySelector(".color-name").innerText;
  const productTitle = document.querySelector(".product-title").innerText;
  const productBrand = document.querySelector(".product-brand").innerText;
  const productImageLink = document.querySelector(".product-image-frame").href;
  const productCategory = document
    .querySelector(".breadcrumbs")
    .querySelector("li:last-child")
    .textContent.trim();

  // alert(imageLink);
  //Send to popup
  chrome.runtime.sendMessage({
    productColor,
    productTitle,
    productBrand,
    productCategory,
    productImageLink,
  });
}
