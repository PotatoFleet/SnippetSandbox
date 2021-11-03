const iFrame = document.getElementById('snippet-iframe');
const saveButton = document.querySelector('.save-btn');
const htmlCode = document.querySelector('.html').querySelector('.code');
const cssCode = document.querySelector('.css').querySelector('.code');
const jsCode = document.querySelector('.js').querySelector('.code');

let html = htmlCode.innerHTML;
let css = cssCode.innerHTML;
let js = jsCode.innerHTML;

function writeToDocument(html, css, js) {
    let code = `<style>${css}</style>${html}<script>${js}<\/script>`;
        console.log(code);
    iFrame.src = "data:text/html," + encodeURIComponent(code);
}

saveButton.addEventListener('click', () => {
    html = htmlCode.innerHTML;
    css = cssCode.innerHTML;
    js = jsCode.innerHTML;
    writeToDocument(html, css, js);
})

writeToDocument(html, css, js)