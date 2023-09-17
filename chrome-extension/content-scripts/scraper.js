/* 
This script is injected into the page by the background.js file. 
This script interacts with the DOM, running extract functions and then sends a message back to popup.js.
*/

// Function to retrieve elements from the Iconic Page.
function getProductDetails() {
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

  return productResults;
}

{
  // Add a flag to ensure the script runs only once
  let hasRun = false;
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "runScraper" && !hasRun) {
      hasRun = true; // Set the flag to prevent multiple executions
      let scrapedResults = getProductDetails();
      console.log("Scraper: Updated scraper results:", scrapedResults);
      chrome.runtime.sendMessage(scrapedResults);
    }
  });
}
