
var Graph = function () {
    this.nodeSet = {};
    this.nodes = [];
    this.edges = [];
    this.adjacency = {};

    this.nextNodeId = 0;
    this.nextEdgeId = 0;
    this.eventListeners = [];



};


Graph.prototype = {

    addNode: function (node) {
        if (typeof (this.nodeSet[node.id]) === 'undefined') {
            this.nodes.push(node);
        }

        this.nodeSet[node.id] = node;

        this.notify();
        return node;
    },
    addEdge: function (edge) {
        var exists = false;
        this.edges.forEach(function (e) {
            if (edge.id === e.id) { exists = true; }
        });

        if (!exists) {
            this.edges.push(edge);
        }

        if (typeof (this.adjacency[edge.source.id]) === 'undefined') {
            this.adjacency[edge.source.id] = {};
        }
        if (typeof (this.adjacency[edge.source.id][edge.target.id]) === 'undefined') {
            this.adjacency[edge.source.id][edge.target.id] = [];
        }

        exists = false;
        this.adjacency[edge.source.id][edge.target.id].forEach(function (e) {
            if (edge.id === e.id) { exists = true; }
        });

        if (!exists) {
            this.adjacency[edge.source.id][edge.target.id].push(edge);
        }

        this.notify();
        return edge;
    },
    newNode: function (data) {
        var node = new Node(this.nextNodeId++, data);



        this.addNode(node);
        return node;
    },
    newEdge: function (source, target, data) {
        var edge = new Edge(this.nextEdgeId++, source, target, data);
        this.addEdge(edge);
        return edge;
    },
    // find the edges from node1 to node2
    getEdges: function (node1, node2) {
        if (typeof (this.adjacency[node1.id]) !== 'undefined'
            && typeof (this.adjacency[node1.id][node2.id]) !== 'undefined') {
            return this.adjacency[node1.id][node2.id];
        }
        return [];
    },
    // remove a node and it's associated edges from the graph
    removeNode: function (node) {
        if (typeof (this.nodeSet[node.id]) !== 'undefined') {
            delete this.nodeSet[node.id];
        }

        for (var i = this.nodes.length - 1; i >= 0; i--) {
            if (this.nodes[i].id === node.id) {
                this.nodes.splice(i, 1);
            }
        }
        this.detachNode(node);
    },
    // removes edges associated with a given node
    detachNode: function (node) {
        var tmpEdges = this.edges.slice();
        tmpEdges.forEach(function (e) {
            if (e.source.id === node.id || e.target.id === node.id) {
                this.removeEdge(e);
            }
        }, this);

        this.notify();
    },
    // remove a node and it's associated edges from the graph
    removeEdge: function (edge) {
        for (var i = this.edges.length - 1; i >= 0; i--) {
            if (this.edges[i].id === edge.id) {
                this.edges.splice(i, 1);
            }
        }

        for (var x in this.adjacency) {
            for (var y in this.adjacency[x]) {
                var edges = this.adjacency[x][y];

                for (var j = edges.length - 1; j >= 0; j--) {
                    if (this.adjacency[x][y][j].id === edge.id) {
                        this.adjacency[x][y].splice(j, 1);
                    }
                }
            }
        }

        this.notify();
    },
 
    containsNode: function (recordId) {
        this.nodes.forEach(function (entry) {
            if (entry.match(recordId)) {
                return true;
            }
        });
        
        return false;
    },
 
    addGraphListener: function (obj) {
        this.eventListeners.push(obj);
    },
    notify: function () {
        this.eventListeners.forEach(function (obj) {
            obj.graphChanged();
        });
    }

};
 




