function topologicalSort(graph) {
    let visited = new Set();
    let stack = [];

    function visit(node) {
        if (visited.has(node)) return;
        visited.add(node);

        if (graph[node]) {
            graph[node].forEach(visit);
        }

        stack.unshift(node);
    }

    Object.keys(graph).forEach(visit);
    return stack;
}

function assignLayers(graph, sortedNodes) {
    let layers = {};
    sortedNodes.forEach(node => {
        if (!graph[node] || graph[node].length === 0) {
            layers[node] = 0;
        } else {
            let maxDepth = Math.max(...graph[node].map(child => layers[child] || 0));
            layers[node] = maxDepth + 1;
        }
    });
    return layers;
}

function positionNodes(layers) {
    let positions = {};
    let layerCounts = {};
    
    Object.keys(layers).forEach(node => {
        let layer = layers[node];
        layerCounts[layer] = (layerCounts[layer] || 0) + 1;
        let xPos = layer * 150; //spacing here 
        let yPos = (layerCounts[layer] - 1) * 50 + 50; 
        positions[node] = { x: xPos, y: yPos };
    });
    
    return positions;
}

function renderGraph(positions, graph) {
    let svg = d3.select("#graphContainer").select("svg");
    
    if (svg.empty()) {
        svg = d3.select("#graphContainer").append("svg")
            .attr("width", 960) // Set appropriate width
            .attr("height", 500); // Set appropriate height
    }

    const edges = [];

    Object.keys(graph).forEach(node => {
        if (graph[node]) {
            graph[node].forEach(child => {
                edges.push({ source: node, target: child });
            });
        }
    });

    // Add edges
    svg.selectAll(".edge")
        .data(edges)
        .enter().append("line")
        .attr("class", "edge")
        .attr("x1", d => positions[d.source].x)
        .attr("y1", d => positions[d.source].y)
        .attr("x2", d => positions[d.target].x)
        .attr("y2", d => positions[d.target].y)
        .attr("stroke", "black");

    // Add nodes
    svg.selectAll(".node")
        .data(Object.keys(positions))
        .enter().append("circle")
        .attr("class", "node")
        .attr("cx", d => positions[d].x)
        .attr("cy", d => positions[d].y)
        .attr("r", 5);
}
