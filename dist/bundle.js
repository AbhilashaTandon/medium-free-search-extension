/******/ (() => { // webpackBootstrap
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
//this will tell us if its really a medium article

//<meta data-rh="true" property="og:site_name" content="Medium">

if (isOnMedium()) {
  if (isPaywalled()) {
    var articleTitle = document.querySelector("h1").innerText;

    // Get the author name (usually inside an 'a' or 'span' element within the header section)
    var authorNameElement = document.querySelector('[data-testid="authorName"]').innerText;
    var authorName = authorNameElement ? authorNameElement : "";
    console.log(authorName, articleTitle);
    findArticle({
      title: articleTitle,
      author: authorName
    }, function (response) {
      console.log("response: " + response);
      // Check if the response is defined and has the freeLink property
      if (response && response.freeLink) {
        console.log("Free link found:", response.freeLink);

        // Create a small UI to display the free link along with author information
        var freeLinkDiv = document.createElement("div");
        freeLinkDiv.style.position = "fixed";
        freeLinkDiv.style.top = "10px";
        freeLinkDiv.style.right = "10px";
        freeLinkDiv.style.backgroundColor = "white";
        freeLinkDiv.style.padding = "10px";
        freeLinkDiv.style.border = "1px solid black";
        freeLinkDiv.innerHTML = "<p>Author: ".concat(authorName, "</p><a href=\"").concat(response.freeLink, "\" target=\"_blank\">Free version available</a>");
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
  var _iterator = _createForOfIteratorHelper(document.getElementsByTagName("meta")),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var tag = _step.value;
      if (tag.getAttribute("property") === "og:site_name") {
        //use open graph protocol to check if this site has sitename Medium
        if (tag.getAttribute("content") == "Medium") {
          return true;
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
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
    var query = "\"".concat(request.title, "\" \"").concat(request.author, "\" -site:medium.com");

    // Use DuckDuckGo's HTML search results
    var searchUrl = "https://duckduckgo.com/html/?q=".concat(encodeURIComponent(query));
    console.log("[searchUrl]: " + searchUrl);
    // Fetch the search results
    fetch(searchUrl).then(function (response) {
      return response.text();
    }).then(function (html) {
      // Parse the HTML to extract the first search result
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, "text/html");
      var firstResult = doc.querySelector(".result__a"); // DuckDuckGo search result link

      if (firstResult) {
        var freeLink = firstResult.href;
        console.log("freeLink: " + freeLink);
        sendResponse({
          freeLink: freeLink
        });
      } else {
        sendResponse({
          freeLink: null
        });
      }
    })["catch"](function (error) {
      console.error("Error fetching free version:", error);
      sendResponse({
        freeLink: null
      });
    });

    // Keep the message channel open for async response
    return true;
  }
}
/******/ })()
;
//# sourceMappingURL=bundle.js.map