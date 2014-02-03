

// we need a list of layouts, drawedges, drawnodes
// 1 clear function
//{ layout: layout, edges: drawEdges, nodes: drawNodes  }

var __bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; }; // stolen from coffeescript, thanks jashkenas! ;-)

CombinedRenderer.requestAnimationFrame = __bind(window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function (callback, element) {
	    window.setTimeout(callback, 10);
	}, window);


function CombinedRenderer(clear, layouts, createSubLayout, drawEdges,drawNodes) {
  //  this.interval = interval;
    this.layouts = layouts;
    this.clear = clear;
    this.createSubLayout = createSubLayout;
    this.drawEdges = drawEdges;
    this.drawNodes = drawNodes;
   


}

CombinedRenderer.prototype = {
    start: function() {

        if (this._started) return;
        this._started = true;

        var that = this;

        CombinedRenderer.requestAnimationFrame(function step() {

            var idx = 0;


            var onScreenList = [];

            if (that.layouts[0].layout.mapHandler.zoompercentage > 8500)
                onScreenList = that.layouts[0].layout.mapHandler.onscreenNodes(20);


            //// create a list of the new layouts we need to add
            onScreenList.forEach(function(ovalue, index, ar) {
                var nodePresent = false;
                that.layouts.forEach(function(value, index, ar) {
                    if (value.type == 'child' && value.layout.parentNode.id == ovalue.id) nodePresent = true;
                });
                if (!nodePresent)
                    that.layouts.push({ layout: that.createSubLayout(ovalue), edges: that.drawEdges, nodes: that.drawNodes, type: 'child' });
            });

            ////remove the layouts for nodes that are no longer on the screen

            for (i = that.layouts.length - 1; i >= 0; i--) {

                if (that.layouts[i].type == 'child') {
                    var nodePresent = false;
                    onScreenList.forEach(function(value, index, ar) {
                        if (that.layouts[i].layout.parentNode.id == value.id) nodePresent = true;
                    });

                    if (!nodePresent) that.layouts.splice(i, 1);
                }
            }
            ;


            while (idx < that.layouts.length) {

                //  

                if (that.layouts[idx].layout.graph.eventListeners.length == 0)
                    that.layouts[idx].layout.graph.addGraphListener(that);


                that.layouts[idx].layout.mapHandler.adjustPosition();

                idx++;
            }

            var idx = 0;
            var energyCount = 0;


            that.clear(that.layouts[0].layout.mapHandler);

            $('#nodes').html(that.layouts[0].layout.mapHandler.countOnscreenNodes());


            while (idx < that.layouts.length) {


                that.layouts[idx].layout.applyCoulombsLaw();
                that.layouts[idx].layout.applyHookesLaw();
                that.layouts[idx].layout.attractToCentre();
                that.layouts[idx].layout.updateVelocity(0.03);
                that.layouts[idx].layout.updatePosition(0.03);


                var map = that.layouts[idx].layout.mapHandler;

                // render 
                that.layouts[idx].layout.eachEdge(function(edge, spring) {

                    that.layouts[idx].edges(map, edge, spring.point1.p, spring.point2.p);
                });

                that.layouts[idx].layout.eachNode(function(node, point) {

                    that.layouts[idx].nodes(map, node, point.p);

                });


                if (idx == 0 && that.layouts[0].layout.nearest != null && that.layouts[0].layout.nearest.node != null) {
                    var nearestNodePoint = that.layouts[0].layout.nodePoints[that.layouts[0].layout.nearest.node.id];

                    if (nearestNodePoint != null && nearestNodePoint.p != null)
                        that.layouts[0].nodes(map, that.layouts[0].layout.nearest.node, nearestNodePoint.p);
                }

                energyCount += that.layouts[idx].layout.totalEnergy();

                idx++;
            }

            $('#energy').html(energyCount.toFixed(2));

            // stop simulation when energy of the system goes below a threshold
            if (energyCount < 0.01) {
                that._started = false;
                if (typeof(done) !== 'undefined') {
                    done();
                }
            } else {

                CombinedRenderer.requestAnimationFrame(step);

            }
        });

    },
    done: function() {

    },
    graphChanged: function(e) {
        this.start();
    }
};
