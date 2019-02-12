
export function GNGraph(generationsArray) {

    this.TopYear=0;

    this.BottomYear =0;

    this.Generations = generationsArray;

    this.TreeRange();


}

GNGraph.prototype = {

    DescendantCount: function (genidx, personidx) {

        var stack = [];
        var count = 0;
        stack.push(this.Generations[genidx][personidx]);

        while (stack.length > 0) {

            var current = stack.pop();
            count++;
            var personIdx = 0;

            var nextGen = current.GenerationIdx + 1;

            if (nextGen < this.Generations.length) {

                while (personIdx < this.Generations[nextGen].length) {
                    if (this.Generations[nextGen][personIdx].FatherId == current.PersonId &&
                            this.Generations[nextGen][personIdx].nodeLink != undefined)
                        stack.push(this.Generations[nextGen][personIdx]);

                    personIdx++;
                }

            }
            //  genIdx++;
        }

        return count;
    },

    TreeRange: function(){
        var gidx = 0;
        var botYear = 0;
        var topYear = 0;

        var years = [];

        while (gidx < this.Generations.length) {
            var pidx = 0;

            while (pidx < this.Generations[gidx].length) {

                if (Number(this.Generations[gidx][pidx].RecordLink.DOB) != 0)
                    years.push(Number(this.Generations[gidx][pidx].RecordLink.DOB));

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

        this.TopYear=topYear;
        this.BottomYear =botYear;
    },

    FatherEdge: function(genIdx, personIdx){

        var currentPerson = this.Generations[genIdx][personIdx];
        var fatherNodeLink;


        if(genIdx > 0 && currentPerson) {
            fatherNodeLink = this.Generations[genIdx - 1][currentPerson.FatherIdx].nodeLink;
        }

        if(!fatherNodeLink)
            console.log('father node link not found');

        if(!currentPerson.nodeLink)
            console.log(currentPerson.PersonId + 'current node missing nodelink');

        if(genIdx <= 0)
            console.log('no father for generation: ' + genIdx);


        if(fatherNodeLink && currentPerson.nodeLink && genIdx > 0){
            return {IsValid: true, FatherNode : fatherNodeLink, ChildNode : currentPerson.nodeLink};
        }
        else
        {
            return {IsValid: false};
        }


    }
};
