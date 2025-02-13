// main.js: Update the ASCII borders for any element with the given ID.
function updateAsciiBorders(elementId, charWidth) {
    const element = document.getElementById(elementId);
    if (!element) return;
    // Adjust this value to match your average character width in pixels
    const cw = charWidth || 8;
    const contentWidth = element.clientWidth;
    // Subtract a few pixels to account for the corner characters.
    const count = Math.max(0, Math.floor((contentWidth - 4) / cw));
    const borderLine = "═".repeat(count);
    element.setAttribute('data-border', borderLine);
  }
  
  function updateAllBorders() {
    // Update borders for all elements that need it. For example, our blog post container:
    updateAsciiBorders('blog-post', 8);
  }
  
  
  window.addEventListener('load', updateAllBorders);
  window.addEventListener('resize', updateAllBorders);
  