
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

//layouts
//renderer

function CombinedRenderer(channel, layoutList, renderer) {
    this._channel = channel;

    this.layouts = layoutList;
    
    this.renderer = renderer;

    var that = this;
    
    this._channel.subscribe("graphChanged", function(data, envelope) {
        that.start();
    });

}

CombinedRenderer.prototype = {
    start: function() {

        if (this._started) return;
        this._started = true;

        var that = this;

        CombinedRenderer.requestAnimationFrame(function step() {
            // var onScreenList = [];

            // if (that.layouts[0].layout._cameraView.zoompercentage > 8500)
            //     onScreenList = that.layouts[0].layout._cameraView.onscreenNodes(20);


            // // create a list of the new layouts we need to add
            // onScreenList.forEach(function(node, index, ar) {
            //     var nodePresent = false;
            //     that.layouts.forEach(function(value, index, ar) {
            //         if (value.type == 'child' && value.layout.parentNode.id == node.id) nodePresent = true;
            //     });
            //     if (!nodePresent)
            //         that.layouts.push({ layout: that.forceDirect.createSubLayout(that.layouts[0].layout, node), type: 'child' });
            // });

            // //remove the layouts for nodes that are no longer on the screen
            // for (var i = that.layouts.length - 1; i >= 0; i--) {

            //     if (that.layouts[i].type == 'child') {
            //         var nodePresent = false;
            //         onScreenList.forEach(function(value, index, ar) {
            //             if (that.layouts[i].layout.parentNode.id == value.id) nodePresent = true;
            //         });

            //         if (!nodePresent) that.layouts.splice(i, 1);
            //     }
            // };

            // that.layouts.forEach(function(layout, index, ar) {
            //     if (layout.layout.graph.eventListeners.length == 0)
            //         layout.layout.graph.addGraphListener(that);

            //     layout.layout._cameraView.adjustPosition();
            // });
 
            that.layouts.UpdateActiveLayouts();
           
            var energyCount = 0;


            that.renderer.clear(that.layouts.TopLayout()._cameraView);

            that._channel.publish( "nodecount", { value: that.layouts.TopLayout()._cameraView.countOnscreenNodes() } );

            that.layouts.layouts.forEach(function(layout,idx) {

                layout.layout.applyCoulombsLaw();
                layout.layout.applyHookesLaw();
                layout.layout.attractToCentre();
                layout.layout.updateVelocity(0.03);
                layout.layout.updatePosition(0.03);


                var map = layout.layout._cameraView;

                // render 
                layout.layout.eachEdge(function(edge, spring) {
                   $.proxy(that.renderer.drawEdges(map, edge, spring.point1.p, spring.point2.p), that);
                });

                layout.layout.eachNode(function(node, point) {
                    $.proxy(that.renderer.drawNodes(layout.layout, map, node, point.p), that);
                });

                // what was this for? it was fixing something but i cant remember what!
                // if (idx == 0 && that.layouts[0].layout.hasNearestNode()) {
                //     var nearestNodePoint = that.layouts[0].layout.nearestNodePoint();
                    
                //     if (nearestNodePoint != null && nearestNodePoint.p != null)
                //         that.layouts[0].drawNodes(map, that.layouts[0].layout.nearest.node, nearestNodePoint.p);
                // }

                energyCount += layout.layout.totalEnergy();

                idx++;
            });

            that._channel.publish( "energy",  {value: energyCount.toFixed(2) });


            // stop simulation when energy of the system goes below a threshold
            if (energyCount < 0.01) {
                that._started = false;
                if (typeof(done) !== 'undefined') {
                    that.done();
                }
            } else {

                CombinedRenderer.requestAnimationFrame(step);

            }
        });

    },
    done: function() {

    }
    
};
