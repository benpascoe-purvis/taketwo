let extractProductInfoButton = document.querySelector("#extract-button");
let productInfoList = document.querySelector("#info-list");

// Run extract functions on click
extractProductInfoButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getProductColor,
  });
});

function updatePopup(newTitle) {
  let productTitle = document.querySelector("#product-title");
}

// // Listen for reponse
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let productDetails = {
    title: request.productTitle,
    color: request.productColor,
    brand: request.productBrand,
    productCategory: request.productCategory,
  };

  if (productDetails == null) {
    let li = document.createElement("li");
    li.innerText = "Product details are NULL";
    productInfoList.appendChild(li);
  } else {
    let originalProductImage = document.createElement("img");
    originalProductImage.src = request.imageLink;
    originalProductImage.width = 100;
    productInfoList.appendChild(originalProductImage);

    // List all product details passed in
    for (const [key, value] of Object.entries(productDetails)) {
      console.log(key, value);
      let li = document.createElement("li");
      li.innerText = key + ": " + value;
      productInfoList.appendChild(li);
    }
  }
});

function getProductColor() {
  //RegEx to parse emails fom HTML code
  const productColor =
    document.getElementsByClassName("color-name")[0].innerText;

  const productTitle =
    document.getElementsByClassName("product-title")[0].innerText;

  const productBrand =
    document.getElementsByClassName("product-brand")[0].innerText;

  const productCategory = document
    .querySelector(".breadcrumbs")
    .querySelector("li:last-child")
    .textContent.trim();

  const imageLink = document.querySelector(".product-image-frame").href;

  //Send emails to popup
  chrome.runtime.sendMessage({
    productColor,
    productTitle,
    productBrand,
    productCategory,
    imageLink,
  });
}
