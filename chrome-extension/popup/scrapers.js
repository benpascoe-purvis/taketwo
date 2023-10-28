export function scrapeProductDetails_asos() {
  const productTitle = document.querySelector(".jcdpl").innerText;
  const productCategory = document
    .querySelector(".breadcrumbs")
    .querySelector("li:last-child")
    .textContent.trim();
    
  //Send to popup
  chrome.runtime.sendMessage({
    productTitle,
    productGender,
    productCategory,
  });
}
