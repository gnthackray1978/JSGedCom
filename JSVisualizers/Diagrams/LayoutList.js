var LayoutList = function(channel, graph, ctx, settings, data){
    this.graph = graph;
    this.ctx = ctx;
    this.settings = settings;
    this.channel = channel;
    this.layouts =[];
    this.data = data;
    
    this.topYear= this.data.TopYear;
    this.bottomYear =this.data.BottomYear;
    this.currentYear =this.data.BottomYear;
};


//init
//add new layout

LayoutList.prototype ={
    Init : function(){
        
        var parentLayout = this.layout = new FDLayout(this.channel, this.graph, 
            new CameraView(this.settings.colourScheme, window.innerWidth, window.innerHeight), 
            this.settings);

        this.layouts.push({ layout: parentLayout, type: 'parent' });
    },
    
    AddLayout : function(parentLayout, entry){
        
        var infoGraph = new Graph(this.channel);

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
    
    UpdateActiveLayouts : function(){
        
        var that = this;
        
        var onScreenList = [];

        if (that.layouts[0].layout._cameraView.zoompercentage > that.settings.sublayoutZoom)
            onScreenList = that.layouts[0].layout._cameraView.onscreenNodes(that.settings.sublayoutNodeThreshold);


        // create a list of the new layouts we need to add
        onScreenList.forEach(function(node, index, ar) {
            var nodePresent = false;
            that.layouts.forEach(function(value, index, ar) {
                if (value.type == 'child' && value.layout.parentNode.id == node.id) nodePresent = true;
            });
            if (!nodePresent)
                that.layouts.push({ layout: that.forceDirect.AddLayout(that.layouts[0].layout, node), type: 'child' });
        });

        //remove the layouts for nodes that are no longer on the screen
        for (var i = that.layouts.length - 1; i >= 0; i--) {

            if (that.layouts[i].type == 'child') {
                var nodePresent = false;
                onScreenList.forEach(function(value, index, ar) {
                    if (that.layouts[i].layout.parentNode.id == value.id) nodePresent = true;
                });

                if (!nodePresent) that.layouts.splice(i, 1);
            }
        };

        that.layouts.forEach(function(layout, index, ar) {
            // if (layout.layout.graph.eventListeners.length == 0)
            //     layout.layout.graph.addGraphListener(that);

            layout.layout._cameraView.adjustPosition();
        });
        
        
        
    },
    
    _createDOB: function(genIdx,personIdx){
        var _dob = 0;

        try
        {
            _dob = this.data.Generations[genIdx][personIdx].RecordLink.DOB;
            
            if(_dob == 0)//try estimate dob if there is a father
            {
                var tpFIDX = this.data.Generations[genIdx][personIdx].FatherIdx;
                
                if(genIdx > 0 && tpFIDX){
                    if(this.data.Generations[genIdx-1][tpFIDX].RecordLink.DOB>0){
                        _dob = this.data.Generations[genIdx-1][tpFIDX].RecordLink.DOB + 18;
                    }
                }
            }
        }
        catch(e)
        {
            console.log(e);
        }
        
        return _dob;
    },

    populateGraph: function (year) {
        
        var mygraph = this.graph;

        var genIdx = 0;

        while (genIdx < this.data.Generations.length) {

            var personIdx = 0;

            while (personIdx < this.data.Generations[genIdx].length) {

                var currentPerson = this.data.Generations[genIdx][personIdx];

                if (!currentPerson.IsHtmlLink) {
                    var descriptor = '.'; // currentPerson.DOB + ' ' + currentPerson.Name;

                    // add the person to the graph if he/she was born in the current time period
                    var _dob = this._createDOB(genIdx,personIdx);

                    //if (_dob == (year - 4) || _dob == (year - 3) || _dob == (year - 2) || _dob == (year - 1) || _dob == year) {
                    
                    if (_dob < year && _dob != 0) {
                        
                        var personId = currentPerson.PersonId;
                        
                        if (!mygraph.containsNode(personId)) {

                            if (currentPerson.nodeLink == undefined ||
                                currentPerson.nodeLink == null) {
                               
                                this.data.Generations[genIdx][personIdx].nodeLink =
                                    mygraph.newNode({ label: descriptor, 
                                                      RecordLink: currentPerson.RecordLink, 
                                                      RecordId : personId,
                                                      type: 'normal' });

                            }

                            var fatherEdge = this.data.FatherEdge(genIdx,personIdx);
                            
                            if(fatherEdge.IsValid)
                                mygraph.newEdge(fatherEdge.FatherNode, fatherEdge.ChildNode, { type: 'person' });
                            
                           
                        }
                        else {
                        //    console.log('person present');
                        }
                    }


                    // count how many desendants this person has in the diagram already.
                    if (this.data.Generations[genIdx][personIdx].nodeLink != undefined)
                        this.data.Generations[genIdx][personIdx].nodeLink.data.RecordLink.currentDescendantCount 
                        = this.data.DescendantCount(genIdx, personIdx);
                }

                personIdx++;
            }

            genIdx++;
        }

    },
    
    TopLayout: function(){
        return this.layouts[0].layout;
    }

  
    
    
};