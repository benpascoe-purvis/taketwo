export function scrapeProductDetails_asos() {
  const productTitle = document.querySelector(".jcdpl").innerText;

  //Send to popup
  chrome.runtime.sendMessage({
    productTitle,
  });
}

export function scrapeProductDetails_iconic() {
  const productColor = document.querySelector(".color-name").innerText;
  const productTitle = document.querySelector(".product-title").innerText;
  const productBrand = document.querySelector(".product-brand").innerText;

  //Send to popup
  chrome.runtime.sendMessage({
    productColor,
    productTitle,
    productBrand,
  });
}
