
window.addEventListener("load", function(){
  'use strict';
  const contents = Array.prototype.slice.call(document.querySelectorAll(".section .slide.content > div"));
  const slides = document.querySelectorAll(".section .sticky-content .slides img");
  const allSlides = contents.map((_, i)=>i);
  //Read DOMNodes only once to optimize repaints
  const slidesIndices = Array.prototype.map.call(slides, (img)=>{
    if(img.dataset.slides === "all") return allSlides;
    else if(typeof img.dataset.slides !== "undefined"){
      let indices = [], m, re=/(?:(\d+)(?:-(\d+))?)/g;
      while(m = re.exec(img.dataset.slides)){
        for(let i=m[1]; i <= (m[2] || m[1]); i++){
          indices.push(parseInt(i));
        }
      }
      return indices;
    }else{
      return [Array.prototype.indexOf.call(img.parentNode.children, img)];
    }
  });
  //const backgrounds = document.querySelectorAll(".section .slides-back > img, .section .slides-front > picture");
  const stickyContent = document.querySelectorAll(".section .sticky-content > img, .section .sticky-content > picture");
  let thresholdValue = window.matchMedia("(max-width: 1200px)").matches ? 0.1 : 0.5;

  if(!contents.length) console.log("No slide-content on this page. Consider not including observer.js");
  if(!slides.length) console.log("No slides on this page. Consider not including observer.js");

  let o = new IntersectionObserver((entries)=>{
    for (let entry of entries){
      if(!entry.isIntersecting) continue;
      const slideIndex = contents.indexOf(entry.target);
      for (let idx = 0; idx < slides.length; idx++){
        const img = slides[idx];
        if(slidesIndices[idx].indexOf(slideIndex) !== -1){
          img.style.opacity = 1;
        }else{
          img.style.opacity = 0;
        }
      }
    }
  }, {
    threshold:[thresholdValue]
  });

  for(let c of contents){
    o.observe(c);
  }
});
