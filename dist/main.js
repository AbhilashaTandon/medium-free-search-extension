(()=>{if(function(){for(const e of document.getElementsByTagName("meta"))if("og:site_name"===e.getAttribute("property")&&"Medium"==e.getAttribute("content"))return!0;return!1}()&&(console.log(document.querySelector(".meteredContent")),null!=document.querySelector(".meteredContent"))){const e=document.querySelector("h1").innerText,t=document.querySelector('[data-testid="authorName"]').innerText||"";console.log(t,e),chrome.runtime.sendMessage({title:e,author:t},(e=>{if(console.log("response: "+e),e&&e.freeLink){console.log("Free link found:",e.freeLink);const o=document.createElement("div");o.style.position="fixed",o.style.top="10px",o.style.right="10px",o.style.backgroundColor="white",o.style.padding="10px",o.style.border="1px solid black",o.innerHTML=`<p>Author: ${t}</p><a href="${e.freeLink}" target="_blank">Free version available</a>`,document.body.appendChild(o)}else console.log("No free link found or invalid response")}))}})();