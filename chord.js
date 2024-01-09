function displayChordLayout(matrix, targetElementId) {
    const svgContainer = document.getElementById(targetElementId);
    svgContainer.innerHTML = '';
    
    const width = 500; 
    const height = 500; 
    const radius = Math.min(width, height) / 2 - 20; 
    
    const svg = d3.select(svgContainer).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const angleIncrement = (2 * Math.PI) / matrix.length;
    const nodes = matrix.map((_, i) => ({
        x: radius * Math.cos(i * angleIncrement - Math.PI / 2),
        y: radius * Math.sin(i * angleIncrement - Math.PI / 2)
    }));

    // Draw the pathss
    matrix.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell === 1) {
                svg.append("path")
                    .attr("d", d3.line()([[nodes[i].x, nodes[i].y], [nodes[j].x, nodes[j].y]]))
                    .attr("stroke", "black")
                    .attr("fill", "none");
            }
        });
    });

    // Draw the nodes on top 
    svg.selectAll("circle.nodes")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 5)
        .attr("fill", "blue");
}