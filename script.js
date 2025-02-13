// Data for Projects and Blogs
const projects = [
    { name: "Pathfinder", description: "Interactive pathfinding visualization", link: "project/pathfinder/index.html" },
    { name: "Project B", description: "Description of project B", link: "project/project-b/index.html" },
    { name: "Project C", description: "Description of project C", link: "project/project-c/index.html" }
  ];
  
  const blogs = [
    { title: "Blog Post 1", summary: "Summary of blog post 1", link: "blog/blog-post-1.html" },
    { title: "Blog Post 2", summary: "Summary of blog post 2 ", link: "blog/blog-post-2.html" }
  ];
  
  /**
   * Generates an ASCII-style table as a DOM element.
   *
   * @param {string[]} headers - Array of header strings.
   * @param {string[][]} rows - Array of rows (each an array of cell strings).
   * @param {Array.<Object>} clickableMap - An array where each element is an object mapping
   *        a column index to a URL for clickable cells. (Pass null or omit clickableMap
   *        for non-clickable cells.)
   * @returns {HTMLElement} The container element with the ASCII table.
   */
  function generateAsciiTable(headers, rows, clickableMap) {
    // Calculate column widths based on header and cell text lengths.
    let colWidths = headers.map((header, i) =>
      Math.max(header.length, ...rows.map(row => row[i].length))
    );
  
    // Helper to create a line (a div with fixed text)
    function createLine(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div;
    }
    
    // Helper to create a table row line.
    function createRow(row, rowIndex) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("ascii-row");
      rowDiv.appendChild(document.createTextNode("║ "));
      row.forEach((cell, i) => {
        // Pad the cell text to fill the column width.
        let padded = cell.padEnd(colWidths[i], " ");
        // If this cell should be clickable, wrap it in an anchor.
        if (clickableMap && clickableMap[rowIndex] && clickableMap[rowIndex][i]) {
          let a = document.createElement("a");
          a.href = clickableMap[rowIndex][i];
          a.textContent = padded;
          rowDiv.appendChild(a);
        } else {
          rowDiv.appendChild(document.createTextNode(padded));
        }
        // Add cell separator except after the last cell.
        if (i < row.length - 1) {
          rowDiv.appendChild(document.createTextNode(" ║ "));
        }
      });
      rowDiv.appendChild(document.createTextNode(" ║"));
      return rowDiv;
    }
  
    // Build the container. We use white-space: pre so spacing is preserved.
    let container = document.createElement("div");
    container.style.whiteSpace = "pre";
  
    // Top border
    let topBorder = "╔" + colWidths.map(w => "═".repeat(w + 2)).join("╦") + "╗";
    container.appendChild(createLine(topBorder));
    
    // Header row (we pass rowIndex -1 so no clickable links are applied)
    container.appendChild(createRow(headers, -1));
    
    // Middle border
    let midBorder = "╠" + colWidths.map(w => "═".repeat(w + 2)).join("╬") + "╣";
    container.appendChild(createLine(midBorder));
    
    // Data rows (row indices 0, 1, 2, …)
    rows.forEach((row, index) => {
      container.appendChild(createRow(row, index));
    });
    
    // Bottom border
    let bottomBorder = "╚" + colWidths.map(w => "═".repeat(w + 2)).join("╩") + "╝";
    container.appendChild(createLine(bottomBorder));
    
    return container;
  }
  
  // --- Generate the Projects ASCII table ---
  // For projects, only the first column (project name) should be clickable.
  const projectHeaders = ["Project Name", "Description"];
  const projectRows = projects.map(p => [p.name, p.description]);
  // Create a clickable map: each row object maps column index 0 to its URL.
  const projectClickable = projects.map(p => ({ 0: p.link }));
  const projectTable = generateAsciiTable(projectHeaders, projectRows, projectClickable);
  document.getElementById("projects-table").appendChild(projectTable);
  
  // --- Generate the Blogs ASCII table ---
  // For blogs, make the title clickable.
  const blogHeaders = ["Title", "Summary"];
  const blogRows = blogs.map(b => [b.title, b.summary]);
  const blogClickable = blogs.map(b => ({ 0: b.link }));
  const blogTable = generateAsciiTable(blogHeaders, blogRows, blogClickable);
  document.getElementById("blog-table").appendChild(blogTable);
  