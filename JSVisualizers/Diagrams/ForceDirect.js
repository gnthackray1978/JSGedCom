
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
/*global LayoutList*/ 
 
 
var ForceDirect = function (channel, colourScheme,gedPreLoader) {

    this.channel = channel;
    
    this.settings = new LayoutSettings();

    this.canvas = document.getElementById("myCanvas");

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.ctx = this.canvas.getContext("2d");


    this.combinedRenderer = null;
    
 
    this.gedPreLoader = gedPreLoader;

  
    this.yearTimer;

    var that =this;
    
    this.channel.subscribe("mouseDown", function(data, envelope) {
        if(that.combinedRenderer) // hack until i can be bothered add bus in for the events
            that.combinedRenderer.start();
    });
    
    this.channel.subscribe("mouseMove", function(data, envelope) {
        if(that.combinedRenderer) // hack until i can be bothered add bus in for the events
            that.combinedRenderer.start();
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
   
        if(this.gedPreLoader){
            this.gedPreLoader.generations =[];
            this.gedPreLoader.searchDepth = 0;
        }
            
        this.gedPreLoader = undefined;
      
        this.graph = null;
        this.treeLinker = null;
        this.combinedRenderer = null;
        this.layout = null;
        
        
        if(this.yearTimer)
            clearInterval(this.yearTimer)
    },
    
    run: function(data) {
        //var f = JSON.stringify(data);

        //this.treeLinker = new TreeLinker(data);

        var that = this;

        var graph = new Graph();
        
        var layoutList = new LayoutList(that.channel, graph, that.ctx, that.settings, data);

        layoutList.Init();
        
        

        this.yearTimer = setInterval(function() { myTimer() }, that.settings.speed);

      
        function myTimer() {

            $('#map_year').html(that.settings.year);

            layoutList.populateGraph(that.settings.year);

            that.settings.year += that.settings.increment;
            
            if (Number(that.settings.year) > layoutList.topYear) clearInterval(that.yearTimer);
        }


        $('body').css("background-color", this.settings.colourScheme.mapbackgroundColour);


        // var parentLayout = this.layout = new FDLayout(that.channel, that.graph, 
        //     new CameraView(this.settings.colourScheme, window.innerWidth, window.innerHeight), 
        //     this.settings);

        // this.layoutList.push({ layout: parentLayout, type: 'parent' });

        that.combinedRenderer = new CombinedRenderer(that.channel, layoutList, new FDRenderer(that.graph, that.ctx));

        that.combinedRenderer.start();

        return this;
    }



};


