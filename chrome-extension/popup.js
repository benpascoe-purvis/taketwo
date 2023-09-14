// TUTORIAL - https://www.youtube.com/watch?v=LtF3mCn0GUs&ab_channel=HashDefine

let findAlternatives = document.getElementById("findAlternatives");
let list = document.getElementById("emailList");

//Handler to receive emails from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //Get Emails
  let product_color = request.product_color;

  if (product_color == null) {
    // couldln't find color
    let li = document.createElement("li");
    li.innerText = "No color found";
    list.appendChild(li);
  } else {
    //Display color
    let li = document.createElement("li");
    li.innerText = product_color;
    list.appendChild(li);
  }
});

// Buttons click event listener
findAlternatives.addEventListener("click", async () => {
  //Get current active tab of chrome window
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Execute script to parse emails on page
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: findProductColor,
  });
});

// Function to scrape emails
function findProductColor() {
  //RegEx to parse emails fom HTML code
  const product_color =
    document.getElementsByClassName("color-name")[0].innerText;

  //Send emails to popup
  chrome.runtime.sendMessage({ product_color });
}
