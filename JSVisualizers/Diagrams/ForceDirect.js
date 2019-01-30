
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

import {LayoutList} from "./LayoutList.js";
import {Graph} from "./Graph.js";
import {FDRenderer} from "./FDRenderer.js";
import {RenderingHandler} from "./RenderingHandler.js";

export function ForceDirect(channel,settings, gedPreLoader) {

    this.channel = channel;

    this.settings = settings;

    this.renderingHandler = null;

    this.gedPreLoader = gedPreLoader;

    this.yearTimer=null;

    var that =this;

    this.channel.on("mouseDown", function(data, envelope) {
        if(that.renderingHandler) // hack until i can be bothered add bus in for the events
            that.renderingHandler.start();
    });

    this.channel.on("mouseMove", function(data, envelope) {
        if(that.renderingHandler) // hack until i can be bothered add bus in for the events
            that.renderingHandler.start();
    });



}

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
        this.renderingHandler = null;
        this.layout = null;


        if(this.yearTimer)
            clearInterval(this.yearTimer);
    },

    run: function(data) {

        var canvas = document.getElementById("myCanvas");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var ctx = canvas.getContext("2d");


        var that = this;

        var graph = new Graph(that.channel);

        var layoutList = new LayoutList(that.channel, graph, ctx, that.settings, data);

        layoutList.Init();



        this.yearTimer = setInterval(myTimer, that.settings.speed);


        function myTimer() {

            that.channel.emit( "mapyear",  {value: that.settings.year});

            layoutList.populateGraph(that.settings.year);

            that.settings.year += that.settings.increment;

            if (Number(that.settings.year) > layoutList.topYear) clearInterval(that.yearTimer);
        }

        that.renderingHandler = new RenderingHandler(that.channel, layoutList, new FDRenderer(graph, ctx));

        that.renderingHandler.start();

        return this;
    }



};
