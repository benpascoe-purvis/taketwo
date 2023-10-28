export function scrapeProductDetails_asos() {
  const productTitle = document.querySelector(".jcdpl").innerText;

  //Send to popup
  chrome.runtime.sendMessage({
    productTitle,
  });
}
