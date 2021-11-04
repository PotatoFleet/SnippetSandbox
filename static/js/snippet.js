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

let htmlLines = {
  1: "",
};

let cssLines = {
  1: "",
};

let jsLines = {
  1: "",
};

function cursor_position() {
  var sel = document.getSelection();
  sel.modify("extend", "backward", "paragraphboundary");
  var pos = sel.toString().length;
  if (sel.anchorNode != undefined) sel.collapseToEnd();
  return pos;
}

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
    if (htmlLines[selectedHtmlLine] == "") {
      selectedHtmlLine--;
      delete htmlLines[selectedHtmlLine];
    }
  }
});

cssCode.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    let number = document.createElement("span");
    number.innerHTML =
      parseInt(cssSection.querySelector(".numbering").lastChild.innerHTML) + 1;
    cssSection.querySelector(".numbering").appendChild(number);
    selectedCssLine++;
    console.log(selectedCssLine);
  } else if (e.keyCode === 8) {
    if (cssLines[selectedCssLine] == "") {
      selectedCssLine--;
      delete htmlLines[selectedCssLine];
    }
  } else {
    let lineText = cssCode.innerHTML;
    // cssLines[selectedCssLine] += lineText[cursorPosition - 1];
    console.log(cursor_position());
    console.log(cssLines);
  }
});

jsCode.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    let number = document.createElement("span");
    number.innerHTML =
      parseInt(jsSection.querySelector(".numbering").lastChild.innerHTML) + 1;
    jsSection.querySelector(".numbering").appendChild(number);
    selectedJsLine++;
  } else if (e.keyCode === 8) {
    if (jsLines[selectedJsLine] == "") {
      selectedJsLine--;
      delete htmlLines[selectedJsLine];
    }
  }
});

writeToDocument(html, css, js);
