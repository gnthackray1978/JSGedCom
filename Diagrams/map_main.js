﻿
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



//$(document).ready(function () {
//    // var jsMaster = new JSMaster();


//    // jsMaster.connectfacebook(function () {

//    var forceDirect = new ForceDirect();

//    forceDirect.init();




//    //  });

//});



//var AncTreeDiag function (gedAncPreLoader) {
 var ForceDirect = function(gedPreLoader) {

    this.graph = new Graph();

    this.stiffness = 400.0;
    this.repulsion = 500.0;
    this.damping = 0.5;

    this.colourScheme = colourScheme;

    this.canvas = document.getElementById("myCanvas");

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;


    this.ctx = this.canvas.getContext("2d");

    this.tree = null;

    this.year = 1670;

    this.gedPreLoader = gedPreLoader;
}

ForceDirect.prototype = {

    init: function (id) {

      //  var ancUtils = new AncUtils();
      //  var params = {};
   //     params[0] = 'c41dfad2-f3d4-4682-9c52-610851c36dc6';
        var that = this;

        this.gedPreLoader.GetGenerations(id, $.proxy(this.run, this));

        //ancUtils.twaGetJSON('/Trees/GetTreeDiag', params, function (data) {
        //    if (data.Generations.length > 0)
        //        that.run(data);
        //});

    },

    run: function (data) {
        var f = JSON.stringify(data);
        
        this.tree = new Tree(data);

        var that = this;

        var clearFunction = function (map) {
            // var map = this.map;
            that.ctx.clearRect(0, 0, map.graph_width, map.graph_height);
        };

        var drawEdges = function (map, edge, p1, p2) {

            //  var map = this.map;
            var _utils = new Utils(map.currentBB, map.graph_width, map.graph_height);

            var x1 = map.mapOffset(_utils.toScreen(p1)).x;
            var y1 = map.mapOffset(_utils.toScreen(p1)).y;

            var x2 = map.mapOffset(_utils.toScreen(p2)).x;
            var y2 = map.mapOffset(_utils.toScreen(p2)).y;


            if (!map.validToDraw(x1, y1) && !map.validToDraw(x2, y2)) return;

            if (edge.data.type == 'data' && map.colourScheme.infoLineColour == map.colourScheme.mapbackgroundColour) {
                return;
            }


            var direction = new Vector(x2 - x1, y2 - y1);

            // negate y
            var normal = direction.normal().normalise();

            var from = that.graph.getEdges(edge.source, edge.target);
            var to = that.graph.getEdges(edge.target, edge.source);

            var total = from.length + to.length;

            // Figure out edge's position in relation to other edges between the same nodes
            var n = 0;
            for (var i = 0; i < from.length; i++) {
                if (from[i].id === edge.id) {
                    n = i;
                }
            }

            var spacing = 6.0;

            // Figure out how far off center the line should be drawn
            var offset = normal.multiply(-((total - 1) * spacing) / 2.0 + (n * spacing));



            var s1 = map.mapOffset(_utils.toScreen(p1).add(offset));
            var s2 = map.mapOffset(_utils.toScreen(p2).add(offset));


            var boxWidth = edge.target.getWidth(that.ctx);
            var boxHeight = edge.target.getHeight(that.ctx);

            var intersection = _utils.intersect_line_box(s1, s2, { x: x2 - boxWidth / 2.0, y: y2 - boxHeight / 2.0 }, boxWidth, boxHeight);

            if (!intersection) {
                intersection = s2;
            }

            var arrowWidth;
            var arrowLength;

            var weight = typeof (edge.data.weight) !== 'undefined' ? edge.data.weight : 1.0;

            that.ctx.lineWidth = Math.max(weight * 2, 0.1);
            arrowWidth = 10 + that.ctx.lineWidth;
            arrowLength = 10;


            var stroke = '';
            if (edge.data.type == 'data') {
                stroke = map.colourScheme.infoLineColour;
            }
            else {
                var averagedesc = (edge.source.data.person.currentDescendantCount + edge.target.data.person.currentDescendantCount) / 2;
                stroke = _utils.getLevel(300, averagedesc, map.colourScheme.normalLineGradient);
            }

            that.ctx.strokeStyle = stroke;
            that.ctx.beginPath();
            that.ctx.moveTo(s1.x, s1.y);
            that.ctx.lineTo(s2.x, s2.y);
            that.ctx.stroke();

            // arrow
            var distance = s1.distance(s2);
            var directional = typeof (edge.data.directional) !== 'undefined' ? edge.data.directional : true;
            if (directional && distance > 75) {
                that.ctx.save();
                that.ctx.fillStyle = stroke;

                that.ctx.translate((intersection.x + s1.x) / 2, (intersection.y + s1.y) / 2);

                that.ctx.rotate(Math.atan2(y2 - y1, x2 - x1));
                that.ctx.beginPath();
                that.ctx.moveTo(-arrowLength, arrowWidth);
                that.ctx.lineTo(0, 0);
                that.ctx.lineTo(-arrowLength, -arrowWidth);
                that.ctx.lineTo(-arrowLength * 0.8, -0);
                that.ctx.closePath();
                that.ctx.fill();
                that.ctx.restore();
            }



        };

        var drawNodes = function (map, node, p) {

            // get parent node location if there is a parent node



            //       if (node.data.type != undefined && node.data.type == 'infonode') return;

            //  var map = this.map;
            var _utils = new Utils(map.currentBB, map.graph_width, map.graph_height);

            var x1 = map.mapOffset(_utils.toScreen(p)).x;
            var y1 = map.mapOffset(_utils.toScreen(p)).y;

            if (!map.validToDraw(x1, y1)) return;

            var s = map.mapOffset(_utils.toScreen(p));

            var distance = 0;

            if (map.layout.parentNode != undefined && map.layout.parentLayout != undefined) {
                // get parent location
                var _tp = new Utils(map.layout.parentLayout.mapHandler.currentBB, map.layout.parentLayout.mapHandler.graph_width, map.layout.parentLayout.mapHandler.graph_height);
                var pV = map.layout.parentLayout.nodePoints[map.layout.parentNode.id];
                pV = map.layout.parentLayout.mapHandler.mapOffset(_tp.toScreen(pV.p));

                //  s.distance(pV)
                distance = s.distance(pV);
            }


            that.ctx.save();
            //2 = nearest
            var selectionId = that.layout.getSelection(node);


            if (node.data.type != undefined && node.data.type == 'infonode') {
                if (node.data.label != '' && distance < 150) {
                    _utils.drawText(map, that.ctx, s.x, s.y + 20, node.data.label, node.data.type, selectionId);
                    _utils.star(map, that.ctx, s.x, s.y, 5, 5, 0.4, false, node.data.type, selectionId);
                }

            }
            else {
                _utils.star(map, that.ctx, s.x, s.y, 12, 5, 0.4, false, node.data.type, selectionId);

                if (node.data.person != undefined) {
                    if (node.data.person.DescendentCount > 10 && _utils.validDisplayPeriod(node.data.person.bio.DOB, that.year, 20)) {
                        _utils.drawText(map, that.ctx, s.x, s.y, node.data.person.bio.Name + ' ' + node.data.person.currentDescendantCount, node.data.type, selectionId);
                    }

                    if (selectionId == 2) {
                        _utils.drawText(map, that.ctx, s.x, s.y, node.data.person.bio.Name, node.data.type, selectionId);

                        var bstring = node.data.person.bio.DOB + ' ' + node.data.person.bio.BirthLocation;

                        if (bstring == '')
                            bstring = 'Birth Unknown';
                        else
                            bstring = 'Born: ' + bstring;

                        _utils.drawText(map, that.ctx, s.x, s.y + 20, bstring, node.data.type, selectionId);


                        var dstring = node.data.person.bio.DOD + ' ' + node.data.person.bio.DeathLocation;

                        if (dstring == ' ')
                            dstring = 'Death Unknown';
                        else
                            dstring = 'Death: ' + dstring;

                        _utils.drawText(map, that.ctx, s.x, s.y + 40, dstring, node.data.type, selectionId);
                        
                        //Occupation
                        if (node.data.person.bio.Occupation != '')
                            _utils.drawText(map, that.ctx, s.x, s.y + 40, node.data.person.bio.Occupation, node.data.type, selectionId);

                    }
                }

            }

            that.ctx.restore();
        };





        var myVar = setInterval(function () { myTimer() }, 3000);

        var layoutList = [];


        var gidx = 0;
        //var topYear = 0;
        var botYear = 0;
        var topYear = 0;

        var years = [];
        
        while (gidx < data.Generations.length) {
            var pidx = 0;
            
            while (pidx < data.Generations[gidx].length) {

                if (Number(data.Generations[gidx][pidx].bio.DOB)!=0)
                    years.push(Number(data.Generations[gidx][pidx].bio.DOB));
 
                pidx++;
            }
             
            gidx++;
        }

        years = years.sort(function (a, b) { return a - b; });

        if (years.length > 0) {
            botYear = years[0];
            topYear = years[years.length - 1];
        }

        if (botYear == 0) {
            botYear = 1695;
            topYear = 1695;
        }
            
        

        console.log(botYear);


        function myTimer() {

            $('#map_year').html(botYear);


            that.tree.populateGraph(botYear, that.graph);

            botYear += 5;
            if (Number(botYear) > topYear) clearInterval(myVar);
        }




        $('body').css("background-color", this.colourScheme.mapbackgroundColour);



        var parentLayout = this.layout = new Layout.ForceDirected(this.graph, new mapHandler(this.colourScheme, window.innerWidth, window.innerHeight), this.stiffness, this.repulsion, this.damping);

        //layoutList.push(layout);

        layoutList.push({ layout: parentLayout, edges: drawEdges, nodes: drawNodes, type: 'parent' });

        var createSubLayout = function (entry) {

            var infoGraph = new Graph();

            var centreNode = infoGraph.newNode({
                label: '',
                parentId: entry.data.person.PersonId,
                type: 'infonode'
            });

            if (entry.data.person.bio.Name != '') {
                var nameNode = infoGraph.newNode({
                    label: entry.data.person.bio.Name,
                    parentId: entry.data.person.PersonId,
                    type: 'infonode'
                });

                infoGraph.newEdge(centreNode, nameNode, { type: 'data', directional: false });
            }

            if (entry.data.person.bio.DOB != '') {
                var dobNode = infoGraph.newNode({
                    label: 'DOB:' + entry.data.person.bio.DOB,
                    parentId: entry.data.person.PersonId,
                    type: 'infonode'
                });

                infoGraph.newEdge(centreNode, dobNode, { type: 'data', directional: false });
            }

            if (entry.data.person.bio.DOD != '') {
                var dodNode = infoGraph.newNode({
                    label: 'DOD:' + entry.data.person.bio.DOD,
                    parentId: entry.data.person.PersonId,
                    type: 'infonode'
                });

                infoGraph.newEdge(centreNode, dodNode, { type: 'data', directional: false });
            }

            if (entry.data.person.bio.BirthLocation != '') {
                var blocNode = infoGraph.newNode({
                    label: 'Born: ' + entry.data.person.bio.BirthLocation,
                    parentId: entry.data.person.PersonId,
                    type: 'infonode'
                });

                infoGraph.newEdge(centreNode, blocNode, { type: 'data', directional: false });
            }

            if (entry.data.person.bio.DeathLocation != '') {
                var dlocNode = infoGraph.newNode({
                    label: 'Died:' + entry.data.person.bio.DeathLocation,
                    parentId: entry.data.person.PersonId,
                    type: 'infonode'
                });

                infoGraph.newEdge(centreNode, dlocNode, { type: 'data', directional: false });
            }

            return new Layout.ForceDirected(infoGraph, new mapHandler(that.colourScheme, 200, 200), that.stiffness, that.repulsion, that.damping, entry, parentLayout, centreNode);


        };

        jQuery(this.canvas).mousedown(function (e) {

            layoutList.forEach(function (value, index, ar) {
                $.proxy(value.layout.mouseDown(e), value);
            });


            combinedRenderer.start();
        }).mouseup(function (e) {

            layoutList.forEach(function (value, index, ar) {
                value.layout.mouseUp(e);
            });
        });

        $(".button_box").mousedown(function (evt) {
            console.log('button mouse down');

            //mouseup = false;
            layoutList.forEach(function (value, index, ar) {
                $.proxy(value.layout.mouseDown(evt), value);
            });
 
         //   combinedRenderer.start();
         //   if (evt.target.id == "up") _dir = 'UP';
         //   if (evt.target.id == "dn") _dir = 'DOWN';
         //   if (evt.target.id == "we") _dir = 'WEST';
         //   if (evt.target.id == "no") _dir = 'NORTH';
         //   if (evt.target.id == "es") _dir = 'EAST';
         //   if (evt.target.id == "so") _dir = 'SOUTH';
         //   if (evt.target.id == "de") _dir = 'DEBUG';

        }).mouseup(function (evt) {
            //mouseup = true;
            layoutList.forEach(function (value, index, ar) {
                $.proxy(value.layout.mouseUp(evt), value);
            });
        });


        jQuery(this.canvas).mousemove(function (e) {

            layoutList.forEach(function (value, index, ar) {
                $.proxy(value.layout.mouseMove(e), value);
            });
            combinedRenderer.start();
        });



        var combinedRenderer = new CombinedRenderer(clearFunction, layoutList, createSubLayout,drawEdges, drawNodes);

        combinedRenderer.start();

        return this;
    }

}


