export function scrapeDetails_iconic() {
  const productColor = document.querySelector(".color-name").innerText;
  const productTitle = document.querySelector(".product-title").innerText;
  const productBrand = document.querySelector(".product-brand").innerText;
  const productImageLink = document.querySelector(".product-image-frame").href;
  const productCategory = document
    .querySelector(".breadcrumbs")
    .querySelector("li:last-child")
    .textContent.trim();

  //Send to popup
  chrome.runtime.sendMessage({
    productColor,
    productTitle,
    productBrand,
    productCategory,
    productImageLink,
  });
}
