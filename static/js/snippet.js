const iFrame = document.getElementById("snippet-iframe");
const saveButton = document.querySelector(".save-btn");
const codes = document.querySelectorAll(".code");
const htmlSection = document.querySelector(".html");
const htmlCode = htmlSection.querySelector(".code");
const cssSection = document.querySelector(".css");
const cssCode = cssSection.querySelector(".code");
const jsSection = document.querySelector(".js");
const jsCode = jsSection.querySelector(".code");

let html = htmlCode.innerHTML;
let css = cssCode.innerHTML;
let js = jsCode.innerHTML;

let selectedHtmlLine = 1;
let selectedCssLine = 1;
let selectedJsLine = 1;

function writeToDocument(html, css, js) {
  html = `<html>
            <head>
              <meta charset="UTF-8" />
              <title>Snippet</title>
              <style>body{background:white;}${css}</style>
            </head>
            <body>
              ${html}
            </body>
            <script>${js}</script
          </html>`;
  iFrame.src = "data:text/html," + encodeURIComponent(html);
}

saveButton.addEventListener("click", () => {
  html = htmlCode.textContent;
  css = cssCode.textContent.replaceAll(/\s/g, "");
  js = jsCode.textContent;
  writeToDocument(html, css, js);
});

htmlCode.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    // enter
    let number = document.createElement("span");
    number.innerHTML =
      parseInt(htmlSection.querySelector(".numbering").lastChild.innerHTML) + 1;
    htmlSection.querySelector(".numbering").appendChild(number);
    selectedHtmlLine++;
  } else if (e.keyCode === 8) {
    // backspace
  }
});

cssCode.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    let number = document.createElement("span");
    number.innerHTML =
      parseInt(cssSection.querySelector(".numbering").lastChild.innerHTML) + 1;
    cssSection.querySelector(".numbering").appendChild(number);
    selectedCssLine++;
  }
});

jsCode.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    let number = document.createElement("span");
    number.innerHTML =
      parseInt(jsSection.querySelector(".numbering").lastChild.innerHTML) + 1;
    jsSection.querySelector(".numbering").appendChild(number);
    selectedJsLine++;
  }
});

writeToDocument(html, css, js);
