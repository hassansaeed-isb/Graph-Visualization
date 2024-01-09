function displayReingoldTilfordTree(data, containerId) {
    // Clear previous SVG if it exists
    d3.select("#" + containerId + " svg").remove();

    const margin = {top: 20, right: 120, bottom: 20, left: 120},
          width = 960 - margin.right - margin.left,
          height = 800 - margin.top - margin.bottom;

    const tree = d3.tree().size([height, width]);
    const root = d3.hierarchy(data, d => d.children);
    tree(root);

    const svg = d3.select("#" + containerId).append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the links between nodes
    svg.selectAll(".link")
        .data(root.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    // Add each node
    const node = svg.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("circle")
        .attr("r", 4.5);

    node.append("text")
        .attr("dy", ".35em")
        .attr("x", d => d.children ? -13 : 13)
        .style("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name);
}
