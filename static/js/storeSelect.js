'use strict';
const selectContainer = document.querySelector("#categories-selector");
const cards =  document.querySelectorAll(".store-card");
if(!selectContainer) throw new Error("No selector container found");
if(!cards || cards.length == 0 ) throw new Error("No store items found");

const parent = cards[0].parentNode;

const categories = new Set();
for (let card of cards){
  for(let c of card.classList){
    if(c.startsWith("store-category--")) categories.add(c);
  }
}

if(categories.size == 0) throw new Error("No categories found");

let stylesheet = [], btns = [];
let pageURL = new URL(window.location.toString());
for (let categoryClass of categories){
  const name = categoryClass.slice("store-category--".length);
  const qString = `h${name.toLowerCase()}`
  const btn = document.createElement("BUTTON");
  btn.className = "btn btn-primary";

  function toggle(){
    parent.classList.toggle(`hide-${name}`);
    btn.classList.toggle("btn-outline-primary");
    btn.classList.toggle("btn-primary");
  }


  if(pageURL.searchParams.has(qString)){
    toggle();
  }
  btn.textContent = name;
  btn.onclick = ()=>{
    toggle();
    let url = new URL(window.location.toString());
    if(url.searchParams.has(qString)){
      url.searchParams.delete(qString);
    }else{
      url.searchParams.set(qString, true);
    }    
    console.log("Push state : ", url.toString());
    window.history.pushState({}, window.title, url);
  }
  btns.push(btn);
  stylesheet.push(`.hide-${name} .${categoryClass} {display: none; }`);
}

btns.forEach(btn=>selectContainer.appendChild(btn));
let style = document.createElement("STYLE");
style.textContent = stylesheet.join("\n");
selectContainer.parentNode.insertBefore(style, selectContainer);