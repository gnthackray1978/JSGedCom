var LayoutList = function(graph, ctx){
    this.graph = graph;
    this.ctx = ctx;
    
};


//init
//add new layout

LayoutList.prototype ={
    Init : function(){
        
    },
    
    AddLayout : function(parentLayout, entry){
        
        var infoGraph = new Graph();

        var centreNode = infoGraph.newNode({
            label: '',
            parentId: entry.data.RecordLink.PersonId,
            type: 'infonode'
        });

        if (entry.data.RecordLink.Name != '') {
            var nameNode = infoGraph.newNode({
                label: entry.data.RecordLink.Name,
                parentId: entry.data.RecordLink.PersonId,
                type: 'infonode'
            });

            infoGraph.newEdge(centreNode, nameNode, { type: 'data', directional: false });
        }

        if (entry.data.RecordLink.DOB != '') {
            var dobNode = infoGraph.newNode({
                label: 'DOB:' + entry.data.RecordLink.DOB,
                parentId: entry.data.RecordLink.PersonId,
                type: 'infonode'
            });

            infoGraph.newEdge(centreNode, dobNode, { type: 'data', directional: false });
        }

        if (entry.data.RecordLink.DOD != '') {
            var dodNode = infoGraph.newNode({
                label: 'DOD:' + entry.data.RecordLink.DOD,
                parentId: entry.data.RecordLink.PersonId,
                type: 'infonode'
            });

            infoGraph.newEdge(centreNode, dodNode, { type: 'data', directional: false });
        }

        if (entry.data.RecordLink.BirthLocation != '') {
            var blocNode = infoGraph.newNode({
                label: 'Born: ' + entry.data.RecordLink.BirthLocation,
                parentId: entry.data.RecordLink.PersonId,
                type: 'infonode'
            });

            infoGraph.newEdge(centreNode, blocNode, { type: 'data', directional: false });
        }

        if (entry.data.RecordLink.DeathLocation != '') {
            var dlocNode = infoGraph.newNode({
                label: 'Died:' + entry.data.RecordLink.DeathLocation,
                parentId: entry.data.RecordLink.PersonId,
                type: 'infonode'
            });

            infoGraph.newEdge(centreNode, dlocNode, { type: 'data', directional: false });
        }

        return new FDLayout(this.channel,infoGraph, 
            new CameraView(this.colourScheme, 200, 200), this.stiffness, 
            this.repulsion, this.damping, entry, parentLayout, centreNode);
        
    }
    
};