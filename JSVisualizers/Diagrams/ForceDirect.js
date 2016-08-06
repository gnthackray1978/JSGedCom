
/**
Copyright (c) 2010 Dennis Hotson

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

/*global TreeLinker*/
/*global FDLayout*/ 
/*global CameraView*/
/*global LayoutSettings*/
 
var ForceDirect = function (channel, colourScheme,gedPreLoader) {

    this.channel = channel;
    
    this.settings = new LayoutSettings();
    
    // this.stiffness = 400.0;
    // this.repulsion = 500.0;
    // this.damping = 0.5;

    // this.colourScheme = colourScheme;

    this.canvas = document.getElementById("myCanvas");

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;


    this.ctx = this.canvas.getContext("2d");

    this.treeLinker = null;
    this.combinedRenderer = null;
    
    this.layoutList = [];
    this.gedPreLoader = gedPreLoader;

    this.highLighted = null;
    this.selected = null;
    this.graph = null;
    this.yearTimer;
    
    // this.speed =3000;
    // this.increment =5;
    // this.year = 1670;
    
    var that =this;
    
    this.channel.subscribe("mouseDown", function(data, envelope) {
        if(that.combinedRenderer) // hack until i can be bothered add bus in for the events
            that.combinedRenderer.start();
    });
    
    this.channel.subscribe("mouseMove", function(data, envelope) {
        if(that.combinedRenderer) // hack until i can be bothered add bus in for the events
            that.combinedRenderer.start();
    });
    
    this.channel.subscribe("requestAdd", function(data, envelope) {
        that.Add(data.value);
    });
    this.channel.subscribe("requestSave", function(data, envelope) {
        that.Save(data.value);
    });
    this.channel.subscribe("requestDelete", function(data, envelope) {
        that.Delete();
    });
    
};

ForceDirect.prototype = {
    init: function(id, params) {
        
        var that = this;
        
        this.settings.speed =params.sp;
        this.settings.increment =params.im;
        this.settings.year = params.sy;
        
        this.gedPreLoader.GetGenerations(id, function(data){
            that.run(data);
        });
    },
    
    kill: function() {
        this.layoutList = [];
        if(this.gedPreLoader){
            this.gedPreLoader.generations =[];
            this.gedPreLoader.searchDepth = 0;
        }
            
        this.gedPreLoader = undefined;
        this.highLighted = null;
        this.selected = null;
        this.graph = null;
        this.treeLinker = null;
        this.combinedRenderer = null;
        this.layout = null;
        
        
        if(this.yearTimer)
            clearInterval(this.yearTimer)
    },
    
    run: function(data) {
        //var f = JSON.stringify(data);

        this.treeLinker = new TreeLinker(data);

        var that = this;

        that.graph = new Graph();


        this.yearTimer = setInterval(function() { myTimer() }, that.speed);

        this.layoutList = [];
        
        function myTimer() {

            $('#map_year').html(that.year);

            that.treeLinker.populateGraph(that.year, that.graph);

            that.year += that.increment;
            
            if (Number(that.year) > that.treeLinker.topYear) clearInterval(that.yearTimer);
        }


        $('body').css("background-color", this.settings.colourScheme.mapbackgroundColour);


        var parentLayout = this.layout = new FDLayout(that.channel, that.graph, 
            new CameraView(this.settings.colourScheme, window.innerWidth, window.innerHeight), 
            this.settings);

        this.layoutList.push({ layout: parentLayout, type: 'parent' });

        that.combinedRenderer = new CombinedRenderer(that.channel, that, new FDRenderer(that.graph,that.ctx));

        that.combinedRenderer.start();

        return this;
    },


    createSubLayout : function(parentLayout, entry) {

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
            new CameraView(this.settings.colourScheme, 200, 200), this.settings, entry, parentLayout, centreNode);
    },

    Save: function(recordLink) {
        console.log('Saved ' + recordLink.PersonId);
        
        //this.layout.selected.

        if (this.layout.selected.node.data.RecordLink.PersonId == recordLink.PersonId) {
            this.layout.selected.node.data.RecordLink.BaptismDate = recordLink.BaptismDate;
            this.layout.selected.node.data.RecordLink.BirthDate = recordLink.BirthDate;
            this.layout.selected.node.data.RecordLink.BirthLocation = recordLink.BirthLocation;
            this.layout.selected.node.data.RecordLink.DOB = recordLink.DOB;
            this.layout.selected.node.data.RecordLink.DOD = recordLink.DOD;
            this.layout.selected.node.data.RecordLink.DeathLocation = recordLink.DeathLocation;
            this.layout.selected.node.data.RecordLink.FirstName = recordLink.FirstName;
            this.layout.selected.node.data.RecordLink.Name = recordLink.FirstName + ' ' + recordLink.Surname;
            this.layout.selected.node.data.RecordLink.Occupation = recordLink.Occupation;
            this.layout.selected.node.data.RecordLink.OccupationDate = recordLink.OccupationDate;
            this.layout.selected.node.data.RecordLink.OccupationPlace = recordLink.OccupationPlace;
            this.layout.selected.node.data.RecordLink.PersonId = recordLink.PersonId;
            this.layout.selected.node.data.RecordLink.Surname = recordLink.Surname;
        }
        

    },
    
    Add: function (recordLink) {

        recordLink.PersonId = 1234;
        
        console.log('Add ' + recordLink.PersonId);
        

        var nodeLink = this.graph.newNode({ label: 'new one', RecordLink: recordLink, type: 'normal' });
        
        this.graph.newEdge(this.layout.selected.node, nodeLink, { type: 'person' });
    },
    
    Delete: function() {
        console.log('Delete ' );
    }

};


