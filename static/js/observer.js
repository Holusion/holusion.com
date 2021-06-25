
window.addEventListener("load", function(){
  'use strict';
  function observeSection(section){
    const contents = Array.prototype.slice.call(section.querySelectorAll(".slide.content > div"));
    const slides = section.querySelectorAll([
      "img",
      "video",
      "picture>img",
      "div",
    ].map(s=> ".sticky-content .slides > "+s).join(", "));

    if(!contents.length) console.log("No slide-content on this page. Consider not including observer.js");
    if(!slides.length) console.log("No slides on this page. Consider not including observer.js");
  
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
    let thresholdValue = window.matchMedia("(max-width: 1200px)").matches ? 0.1 : 0.5;
  
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
  }

  const fixed_background_sections = document.querySelectorAll(".section .fixed-background");
  for(let {parentNode: section} of fixed_background_sections){
    observeSection(section);
  }
  
});
