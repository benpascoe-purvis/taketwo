/* 
This script is injected into the page by the background.js file. 
This script interacts with the DOM, running extract functions and then sends a message back to popup.js.
*/

function getProductDetails() {
  /* Function to retrieve elements from the Iconic Page. */

  let productTitleElement = document.querySelector(".product-title");
  let productColorElement = document.querySelector(".color-name");

  let productTitle = "Not available...";
  let productColor = "Not available...";

  if (productTitleElement) {
    productTitle = productTitleElement.innerText;
  }
  if (productColorElement) {
    productColor = productColorElement.innerText;
  }

  console.log("Scraper: Title: ", productTitle);
  console.log("Scraper: Color: ", productColor);

  let productResults = {
    productTitle,
    productColor,
  };

  console.log("Scraper: Sending results:", productResults);
  chrome.runtime.sendMessage(productResults);
}

{
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "runScraper") {
      getProductDetails();
    }
  });
}
