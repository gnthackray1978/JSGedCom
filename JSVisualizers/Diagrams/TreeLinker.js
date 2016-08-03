/*global TreeLinker*/

var TreeLinker = function (data) {
    this.data = data;

    this.addedPeople = new Array();
    
    this.topYear= this.data.TopYear;
    this.bottomYear =this.data.BottomYear;
    this.currentYear =this.data.BottomYear;
};

TreeLinker.prototype = {
    
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

    populateGraph: function (year, mygraph) {

        var genIdx = 0;

        //mygraph.addedNodes =[];

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
                        
                        var personId = this.data.Generations[genIdx][personIdx].PersonId;
                        var personPresent = false;
                        var that = mygraph;
                        
                        
                        that.addedPeople.forEach(function (entry) {
                            if (entry == personId) {
                                personPresent = true;

                            }
                        });

                        
                        
                        console.log(personPresent);
                        console.log(that.containsNode(personId));
                        
                        
                        if (!personPresent) {

                            if (this.data.Generations[genIdx][personIdx].nodeLink == undefined ||
                                this.data.Generations[genIdx][personIdx].nodeLink == null) {
                                    
                                that.addedPeople.push(personId);
                                
                                this.data.Generations[genIdx][personIdx].nodeLink =
                                    mygraph.newNode({ label: descriptor, 
                                                      RecordLink: this.data.Generations[genIdx][personIdx].RecordLink, 
                                                      RecordId : personId,
                                                      type: 'normal' });

                            }

                            var fatherEdge = this.data.FatherEdge(genIdx,personIdx);
                            
                            if(fatherEdge.IsValid)
                                mygraph.newEdge(fatherEdge.FatherNode, fatherEdge.ChildNode, { type: 'person' });
                            
                           
                        }
                        else {
                            console.log('person present');
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




    }

    // countDescendants: function (data, genidx, personidx) {

    //     //   var genIdx = 0;

    //     var stack = new Array();
    //     var count = 0;
    //     stack.push(data.Generations[genidx][personidx]);


    //     while (stack.length > 0) {

    //         var current = stack.pop();
    //         count++;
    //         var personIdx = 0;

    //         var nextGen = current.GenerationIdx + 1;

    //         if (nextGen < data.Generations.length) {

    //             while (personIdx < data.Generations[nextGen].length) {
    //                 if (data.Generations[nextGen][personIdx].FatherId == current.PersonId &&
    //                         data.Generations[nextGen][personIdx].nodeLink != undefined)
    //                     stack.push(data.Generations[nextGen][personIdx]);

    //                 personIdx++;
    //             }

    //         }
    //         //  genIdx++;
    //     }

    //     return count;
    // }

}