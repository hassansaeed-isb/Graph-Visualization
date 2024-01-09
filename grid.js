function displayGridLayout(matrix, targetElementId) {
    const svgContainer = document.getElementById(targetElementId);
    svgContainer.innerHTML = '';
    
    const width = 500; 
    const height = 500; 
    const nodeRadius = 10; 
    const numNodes = matrix.length;
    const gridWidth = Math.ceil(Math.sqrt(numNodes)); 
    const spacing = width / gridWidth; 
    
    const svg = d3.select(svgContainer).append("svg")
        .attr("width", width)
        .attr("height", height);

    const nodes = matrix.map((_, i) => ({
        x: (i % gridWidth) * spacing + spacing / 2,
        y: Math.floor(i / gridWidth) * spacing + spacing / 2
    }));

    
    matrix.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell === 1) {
                svg.append("line")
                    .attr("x1", nodes[i].x)
                    .attr("y1", nodes[i].y)
                    .attr("x2", nodes[j].x)
                    .attr("y2", nodes[j].y)
                    .attr("stroke", "black");
            }
        });
    });

  
    svg.selectAll("circle.nodes")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", nodeRadius)
        .attr("fill", "red");
}