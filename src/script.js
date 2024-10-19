//this will tell us if its really a medium article

//<meta data-rh="true" property="og:site_name" content="Medium">

import axios, { isCancel, AxiosError } from "axios";
console.log("axios testing" + axios.isCancel("something"));

if (isOnMedium()) {
  if (isPaywalled()) {
    const articleTitle = document.querySelector("h1").innerText;

    // Get the author name (usually inside an 'a' or 'span' element within the header section)
    const authorNameElement = document.querySelector(
      '[data-testid="authorName"]'
    ).innerText;

    const authorName = authorNameElement ? authorNameElement : "";

    console.log(authorName, articleTitle);

    findArticle({ title: articleTitle, author: authorName }, (response) => {
      console.log("response: " + response);
      // Check if the response is defined and has the freeLink property
      if (response && response.freeLink) {
        console.log("Free link found:", response.freeLink);

        // Create a small UI to display the free link along with author information
        const freeLinkDiv = document.createElement("div");
        freeLinkDiv.style.position = "fixed";
        freeLinkDiv.style.top = "10px";
        freeLinkDiv.style.right = "10px";
        freeLinkDiv.style.backgroundColor = "white";
        freeLinkDiv.style.padding = "10px";
        freeLinkDiv.style.border = "1px solid black";
        freeLinkDiv.innerHTML = `<p>Author: ${authorName}</p><a href="${response.freeLink}" target="_blank">Free version available</a>`;

        document.body.appendChild(freeLinkDiv);
      } else {
        console.log("No free link found or invalid response");
      }
    });
  }
}

function isOnMedium() {
  //medium allows authors to have their own custom urls
  //so we have to look at the html on a given site to see if its a medium article
  for (const tag of document.getElementsByTagName("meta")) {
    if (tag.getAttribute("property") === "og:site_name") {
      //use open graph protocol to check if this site has sitename Medium
      if (tag.getAttribute("content") == "Medium") {
        return true;
      }
    }
  }
  return false;
}

function isPaywalled() {
  //checks if the medium article has a paywall
  console.log(document.querySelector(".meteredContent"));
  return document.querySelector(".meteredContent") != null;
}

function findArticle(request, sender, sendResponse) {
  console.log("Received message in background script:", request);
  if (request.title && request.author) {
    // Construct DuckDuckGo search query
    const query = `"${request.title}" "${request.author}" -site:medium.com`;

    // Use DuckDuckGo's HTML search results
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(
      query
    )}`;
    console.log("[searchUrl]: " + searchUrl);

    const AXIOS_OPTIONS = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
      },
      params: { q: `${searchUrl}`, hl: "en", gl: "us" },
    };
    // Fetch the search results
    axios
      .get(searchUrl, AXIOS_OPTIONS)
      .then((response) => response.text())
      .then((html) => {
        // Parse the HTML to extract the first search result
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const firstResult = doc.querySelector(".result__a"); // DuckDuckGo search result link

        if (firstResult) {
          const freeLink = firstResult.href;
          console.log("freeLink: " + freeLink);
          sendResponse({ freeLink });
        } else {
          sendResponse({ freeLink: null });
        }
      })
      .catch((error) => {
        console.error("Error fetching free version:", error);
        sendResponse({ freeLink: null });
      });

    // Keep the message channel open for async response
    return true;
  }
}
