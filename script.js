require.config({ paths: { "vs": "https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs" } });
var htmlEditor, cssEditor, jsEditor;
require(["vs/editor/editor.main"], function() {
  htmlEditor = monaco.editor.create(document.querySelector(".html-editor"), {
    value: "<!--html file-->\n<h1>hello, CodPro!</h1>",
    language: "html",
    fontSize: 16,
    theme: "vs-dark",
    automaticLayout: true
  });
  cssEditor = monaco.editor.create(document.querySelector(".css-editor"), {
    value: "/*css file*/\nh1{\ncolor:green;\n}",
    language: "css",
    fontSize: 16,
    theme: "vs-dark",
    automaticLayout: true
  });
  jsEditor = monaco.editor.create(document.querySelector(".js-editor"), {
    value: "//js file\nconsole.log('hello,CodPro!')",
    fontSize: 16,
    language: "javascript",
    theme: "vs-dark",
    automaticLayout: true
  });
})
const run = document.querySelector(".run");
let consoleBox = document.querySelector(".console");

const output = document.querySelector("#output");
var chromeText;
var count = 1;
const execute = () => {
  consoleBox.innerHTML = "";
  count = 1;
  let htm = htmlEditor.getValue();
  let css = `<style>${cssEditor.getValue()}</style>`;
  let js = jsEditor.getValue();
  const consoleProgram = `<script>
        const send = (type,...args) =>
          parent.postMessage({type,data:args.join(" ")},"*");
          console.log = (...a) => send("log",...a);
          console.error = (...a) => send("error",...a);
          console.warn = (...a) => send("warn",...a);
          console.info = (...a) => send("info",...a);
        try{
          ${js}
        }catch(error){
          console.error(error)
        }
      <\/script>`;
      chromeText = htm + css + consoleProgram;
  output.srcdoc = htm + css + consoleProgram;
}

run.addEventListener("click", execute);

window.addEventListener("message", (e) => {
  let mess = e.data;
  if (!mess.type) return;
  let div = document.createElement("div");
  div.classList.add(mess.type);
  div.textContent = `${count++} ${mess.type}: ${mess.data}`;
  consoleBox.appendChild(div);
  consoleBox.scrollTop = consoleBox.scrollHeight;
})
let autoRun = document.querySelector("#auto");
autoRun.addEventListener("click",() =>{
  if(autoRun.checked){
    setInterval(() =>{
      run.click()
    },10000)
  }
})

//open chrome
let openInChrome = () =>{
  run.click();
  let targetOpen = window.open("","_blank");
  targetOpen.document.open();
  targetOpen.document.write(chromeText);
  targetOpen.document.close();
}
document.querySelector(".open").addEventListener("click",openInChrome);