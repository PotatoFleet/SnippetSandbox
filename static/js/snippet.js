const iFrame = document.getElementById("snippet-iframe");
const snippetId = document.getElementById("snippet-id").value;
const saveButton = document.querySelector(".save-btn");
const codes = document.querySelectorAll(".code");
const htmlSection = document.querySelector(".html");
const htmlCode = htmlSection.querySelector(".code");
const cssSection = document.querySelector(".css");
const cssCode = cssSection.querySelector(".code");
const jsSection = document.querySelector(".js");
const jsCode = jsSection.querySelector(".code");

const spaces = "\u00a0\u00a0";

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
  html = htmlCode.textContent.replaceAll("  ", "");
  css = cssCode.textContent.replaceAll("  ", "");
  js = jsCode.textContent;
  writeToDocument(html, css, js);

  data = new FormData();

  data.append("html", html);
  data.append("css", cssCode.innerHTML);
  data.append("js", js);

  $.ajax({
    url: new URL(
      `/save-snippet/${snippetId}`,
      window.location.origin
    ).toString(),
    processData: false,
    contentType: false,
    type: "POST",
    data: data,
  });
});

function moveCaret(win, charCount) {
  var sel, range;
  if (win.getSelection) {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var textNode = sel.focusNode;
      var newOffset = sel.focusOffset + charCount;
      sel.collapse(textNode, Math.min(textNode.length, newOffset));
    }
  } else if ((sel = win.document.selection)) {
    if (sel.type != "Control") {
      range = sel.createRange();
      range.move("character", charCount);
      range.select();
    }
  }
}

for (const code of codes) {
  code.addEventListener("keydown", (e) => {
    if (e.keyCode === 9 && !e.shiftKey) {
      e.preventDefault();

      var editor = code;
      var doc = editor.ownerDocument.defaultView;
      var sel = doc.getSelection();
      var range = sel.getRangeAt(0);

      var tabNode = document.createTextNode(spaces);
      range.insertNode(tabNode);

      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    if (e.keyCode === 13) {
      var editor = code;
      var doc = editor.ownerDocument.defaultView;
      var sel = doc.getSelection();
      var range = sel.getRangeAt(0);

      var lastLetter = range.endContainer.textContent
        .replaceAll(/\s/g, "")
        .slice(-1);

      if (lastLetter === "{" || lastLetter === ">") {
        setTimeout(function () {
          sel = doc.getSelection();
          range = sel.getRangeAt(0);
          var tabNode = document.createTextNode(spaces);
          range.insertNode(tabNode);
          range.setStartAfter(tabNode);
          range.setEndAfter(tabNode);
          sel.removeAllRanges();
          sel.addRange(range);
        }, 20);
      }
    }
    if (e.keyCode === 222) {
      var editor = code;
      var doc = editor.ownerDocument.defaultView;
      var sel = doc.getSelection();
      var range = sel.getRangeAt(0);
      var endQuotation = document.createTextNode("'");
      if (e.shiftKey) {
        endQuotation = document.createTextNode('"');
      }
      range.insertNode(endQuotation);
      range.setStartAfter(endQuotation);
      range.setEndAfter(endQuotation);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  });
}

htmlCode.addEventListener("keydown", (e) => {
  setTimeout(function () {
    let line =
      htmlCode.offsetHeight /
      parseInt(
        window.getComputedStyle(htmlCode).getPropertyValue("line-height")
      );

    let htmlNumbering = htmlSection.querySelector(".numbering");

    htmlNumbering.innerHTML = "";

    for (let i = 1; i <= line; i++) {
      let span = document.createElement("span");
      span.textContent = i;
      htmlNumbering.appendChild(span);
    }
  }, 20);
});

cssCode.addEventListener("keydown", (e) => {
  setTimeout(function () {
    let line =
      cssCode.offsetHeight /
      parseInt(
        window.getComputedStyle(cssCode).getPropertyValue("line-height")
      );

    let cssNumbering = cssSection.querySelector(".numbering");

    cssNumbering.innerHTML = "";

    for (let i = 1; i <= line; i++) {
      let span = document.createElement("span");
      span.textContent = i;
      cssNumbering.appendChild(span);
    }
  }, 20);
});

jsCode.addEventListener("keydown", (e) => {
  setTimeout(function () {
    let line =
      jsCode.offsetHeight /
      parseInt(window.getComputedStyle(jsCode).getPropertyValue("line-height"));

    let jsNumbering = jsSection.querySelector(".numbering");

    jsNumbering.innerHTML = "";

    for (let i = 1; i <= line; i++) {
      let span = document.createElement("span");
      span.textContent = i;
      jsNumbering.appendChild(span);
    }
  }, 20);
});

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.keyCode === 83) {
    e.preventDefault();
    saveButton.click();
  }
});

saveButton.click();
