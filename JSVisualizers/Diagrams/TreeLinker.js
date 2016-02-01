/*global TreeLinker*/

var TreeLinker = function (data) {
    this.data = data;

    this.addedPeople = new Array();
    this.topYear=0;
    this.bottomYear =0;
    this.currentYear =0;
};

TreeLinker.prototype = {


    populateGraph: function (year, mygraph) {

        var genIdx = 0;



        while (genIdx < this.data.Generations.length) {

            var personIdx = 0;
            var genArray = new Array();


            while (personIdx < this.data.Generations[genIdx].length) {

                var currentPerson = this.data.Generations[genIdx][personIdx];

                if (!currentPerson.IsHtmlLink) {
                    var descriptor = '.'; // currentPerson.DOB + ' ' + currentPerson.Name;


                    // add the person to the graph if he/she was born in the current time period
                    var _dob = 0;

                    try
                    {
                        _dob = this.data.Generations[genIdx][personIdx].RecordLink.DOB;
                    }
                    catch(e)
                    {
                        console.log(e);
                    }

                    if (_dob == (year - 4) || _dob == (year - 3) || _dob == (year - 2) || _dob == (year - 1) || _dob == year) {

                        var personPresent = false;
                        var that = this;
                        this.addedPeople.forEach(function (entry) {
                            if (entry == that.data.Generations[genIdx][personIdx].PersonId) {
                                personPresent = true;

                            }
                        });

                        if (!personPresent) {

                            if (this.data.Generations[genIdx][personIdx].nodeLink == undefined ||
                                this.data.Generations[genIdx][personIdx].nodeLink == null) {
                                this.addedPeople.push(this.data.Generations[genIdx][personIdx].PersonId);
                                this.data.Generations[genIdx][personIdx].nodeLink =
                                    mygraph.newNode({ label: descriptor, RecordLink: this.data.Generations[genIdx][personIdx].RecordLink, type: 'normal' });

                            }

                            if (genIdx > 0) {
                                var fatherNode = this.data.Generations[genIdx - 1][currentPerson.FatherIdx].nodeLink;
                                mygraph.newEdge(fatherNode, currentPerson.nodeLink, { type: 'person' });
                            }

                        }
                        else {
                            console.log('person present');
                        }
                    }


                    // count how many desendants this person has in the diagram already.
                    if (this.data.Generations[genIdx][personIdx].nodeLink != undefined)
                        this.data.Generations[genIdx][personIdx].nodeLink.data.RecordLink.currentDescendantCount = this.countDescendants(this.data, genIdx, personIdx);
                }

                personIdx++;
            }

            genIdx++;
        }




    },

    countDescendants: function (data, genidx, personidx) {

        //   var genIdx = 0;

        var stack = new Array();
        var count = 0;
        stack.push(data.Generations[genidx][personidx]);


        while (stack.length > 0) {

            var current = stack.pop();
            count++;
            var personIdx = 0;

            var nextGen = current.GenerationIdx + 1;

            if (nextGen < data.Generations.length) {

                while (personIdx < data.Generations[nextGen].length) {
                    if (data.Generations[nextGen][personIdx].FatherId == current.PersonId &&
                            data.Generations[nextGen][personIdx].nodeLink != undefined)
                        stack.push(data.Generations[nextGen][personIdx]);

                    personIdx++;
                }

            }
            //  genIdx++;
        }

        return count;
    },

    calculateTreeRange: function(){
        var gidx = 0;
        var botYear = 0;
        var topYear = 0;

        var years = [];

        while (gidx < this.data.Generations.length) {
            var pidx = 0;

            while (pidx < this.data.Generations[gidx].length) {

                if (Number(this.data.Generations[gidx][pidx].RecordLink.DOB) != 0)
                    years.push(Number(this.data.Generations[gidx][pidx].RecordLink.DOB));

                pidx++;
            }

            gidx++;
        }

        years = years.sort(function(a, b) { return a - b; });

        if (years.length > 0) {
            botYear = years[0];
            topYear = years[years.length - 1];
        }

        if (botYear == 0) {
            botYear = 1695;
            topYear = 1695;
        }
    
        this.topYear=topYear;
        this.bottomYear =botYear;
        this.currentYear = botYear;
    }
}