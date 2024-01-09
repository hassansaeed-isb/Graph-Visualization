function parseCSV(text) {
    return d3.csvParseRows(text, function(row) {
        return row.map(Number);
    });
}

function convertMatrixToAdjList(matrix) {
    let graph = {};
    matrix.forEach((row, i) => {
        graph[i] = [];
        row.forEach((cell, j) => {
            if (cell === 1) {
                graph[i].push(j);
            }
        });
    });
    return graph;
}

function isTree(matrix) {
    const numVertices = matrix.length;
    let numEdges = 0;

    // Count the number of edges
    matrix.forEach(row => {
        row.forEach(cell => {
            if (cell === 1) numEdges++;
        });
    });
    numEdges /= 2; // Since each edge is counted twice

    // Check if number of edges is one less than number of vertices
    if (numEdges !== numVertices - 1) return false;

    // Convert matrix to adjacency list
    let graph = convertMatrixToAdjList(matrix);
   

    // Check for cycles and connectedness
    return isGraphTree(graph, numVertices);
}

function convertMatrixToAdjList(matrix) {
    let graph = {};
    matrix.forEach((row, i) => {
        graph[i] = [];
        row.forEach((cell, j) => {
            if (cell === 1) {
                graph[i].push(j);
            }
        });
    });
    return graph;
}

function isGraphTree(graph, numVertices) {
    let visited = new Array(numVertices).fill(false);

    // DFS to check for cycle in the graph
    if (isCyclic(graph, 0, visited, -1)) return false;

    // Check if all vertices are visited (Connected Graph)
    for (let i = 0; i < numVertices; i++) {
        if (!visited[i]) return false;
    }

    return true;
}

function isCyclic(graph, v, visited, parent) {
    visited[v] = true;

    for (let i of graph[v]) {
        // If an adjacent vertex is not visited, then recur for that adjacent
        if (!visited[i]) {
            if (isCyclic(graph, i, visited, v)) return true;
        }
        // If an adjacent vertex is visited and not parent of current vertex, then there is a cycle
        else if (i !== parent) return true;
    }
    return false;
}




function isDAG(graph) {
    let visited = new Set();
    let recStack = new Set();
    
    function dfs(vertex) {
        if (recStack.has(vertex)) {
            return true; // Found a cycle
        }
    
        if (visited.has(vertex)) {
            return false; // Already visited, no cycle found on this path
        }
    
        visited.add(vertex);
        recStack.add(vertex);
    
        if (graph[vertex]) {
            for (let neighbor of graph[vertex]) {
                if (dfs(neighbor)) {
                    return true; // Found a cycle
                }
            }
        }
    
        recStack.delete(vertex); // Remove from recursion stack before returning
        return false;
    }
    
    for (let vertex in graph) {
        if (dfs(vertex)) {
            return false; // Cycle found, not a DAG
        }
    }
    return true; // No cycles found, it's a DAG
    }
    

// Function to handle file selection and read the CSV
function handleFileSelect(event) {
    const file = event.target.files[0];
    Papa.parse(file, {
        complete: function(results) {
            const matrix = results.data.map(row => 
                row.map(cell => parseInt(cell.trim()))
            );
            testGraph(matrix);
        }
    });
}

function convertMatrixToTreeData(matrix) {
    let tree = {};
    matrix.forEach((row, rowIndex) => {
        let nodeName = row[0];
        tree[nodeName] = { name: nodeName, children: [] };
        row.slice(1).forEach((cell, colIndex) => {
            if (cell === 1) {
                let childName = matrix[0][colIndex + 1];
                tree[nodeName].children.push({ name: childName });
            }
        });
    });
    return tree[matrix[0][1]]; // Assuming the first non-header entry is the root
}

function displayIcicleLayout(treeData, containerId) {
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Clear existing content
    d3.select("#" + containerId).html("");

    const svg = d3.select("#" + containerId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const root = d3.hierarchy(treeData);
    const icicleLayout = d3.partition()
        .size([width, height])
        .padding(1)(root.sum(d => d.children ? 0 : 1)); // Assigning size to leaf nodes

    svg.selectAll("rect")
        .data(icicleLayout.descendants())
        .enter().append("rect")
        .attr("x", d => d.y0)
        .attr("y", d => d.x0)
        .attr("width", d => d.y1 - d.y0)
        .attr("height", d => d.x1 - d.x0)
        .attr("fill", d => d.children ? "#6baed6" : "#fd8d3c"); // Different color for leaves

    svg.selectAll("text")
        .data(icicleLayout.descendants())
        .enter().append("text")
        .attr("x", d => d.y0 + 5)
        .attr("y", d => (d.x0 + d.x1) / 2)
        .text(d => d.data.name)
        .attr("font-size", "10px")
        .attr("fill", "black");
}

function testGraph(matrix) {
    const isTreeResult = isTree(matrix);
    const adjList = convertMatrixToAdjList(matrix);
    const isDAGResult = isDAG(adjList);

    console.log("Is the graph a tree? " + isTreeResult);
    console.log("Is the graph a DAG? " + isDAGResult);

    return { isTreeResult, isDAGResult };
}
function handleFileSelect(event) {
    const file = event.target.files[0];
    Papa.parse(file, {
        complete: function(parseResults) {  
            const matrix = parseResults.data.map(row => 
                row.map(cell => parseInt(cell.trim()))
            );

        
            const testResults = testGraph(matrix);  // todo R
            if (testResults.isTreeResult) {
                const treeHierarchy = convertMatrixToTreeData(matrix);
                displayIcicleLayout(treeHierarchy, 'graph1');
            }
        }
    });
}


