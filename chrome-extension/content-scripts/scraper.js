/* 
This script is triggered by background.js. 
This script interacts with the DOM, running extract functions 
and then sends a message back to popup.js.
*/
{
  alert("Scraper: Scraper.JS triggered");
  console.log("Scraper: Scraper.JS triggered");

  const productColor =
    document.getElementsByClassName("color-name")[0].innerText;
  console.log("Scraper: Product color: ", productColor);

  let testMessage = "This is a message from the Scraper JS";
  chrome.runtime.sendMessage({
    testMessage,
    productColor,
  });
}
