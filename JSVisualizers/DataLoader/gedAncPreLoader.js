/*global ApplicationGedLoader*/
/*global AncUtils*/



/** @constructor */
function GedAncPreLoader(applicationGedLoader) {

    if (applicationGedLoader == undefined) applicationGedLoader = new ApplicationGedLoader();


    this.ancUtils = new AncUtils();


    this.searchDepth = 0;



    this.generations = [];

    
    this.families = applicationGedLoader.families;
    this.persons = applicationGedLoader.person;

    this.applicationGedLoader = applicationGedLoader;

    this.RecordLinkLoader = new Bio();

}

(function () {


    GedAncPreLoader.prototype.GetGenerations = function (personId, newGeneration) {
        //'@I4@'


        this.searchFams(this.applicationGedLoader.findMakeFirst(personId));

        var payload = {
            Generations: this.generations
        };

        newGeneration(payload);

    };




    GedAncPreLoader.prototype.searchFams = function (startperson) {

        var family = $.grep(this.families, function (e) {


            var innerresult = $.grep(e.children, function (a) {
                return a.id == startperson.id;
            });

            
            return innerresult.length > 0 ? true : false;

        });

        var currentGen = 0;

        this.generations = [];

        this.generations[currentGen] = [];
        this.generations[currentGen].push(this.addPerson(currentGen,0,startperson));


        while (this.generations[currentGen] != undefined &&
            this.generations[currentGen].length > 0)
        {

            

            if (currentGen == 0) {

                currentGen++;
                this.generations[currentGen] = [];
            //    this.FamilySpanLines[currentGen] = [];
                if (family.length > 0) {
                    if (family[0].husband.id != 0) {

                        this.generations[currentGen].push(this.addPerson(currentGen,0,family[0].husband, family[0].wife));
                     //   this.FamilySpanLines[currentGen].push([]);

                        this.generations[currentGen - 1][0].FatherIdx = this.generations[currentGen].length - 1;

                        if (family[0].wife.id != 0) {
                            var lastAdded = this.generations[currentGen].length - 1;
                            this.generations[currentGen][lastAdded].SpouseIdxLst = [];
                            this.generations[currentGen][lastAdded].SpouseIdxLst.push(lastAdded + 1);
                            this.generations[currentGen][lastAdded].Index = lastAdded;
                        }
                    }

                    if (family[0].wife.id != 0) {
                        this.generations[currentGen].push(this.addPerson(currentGen,0,family[0].wife, family[0].husband));
                      //  this.FamilySpanLines[currentGen].push([]);

                        this.generations[currentGen - 1][0].MotherIdx = this.generations[currentGen].length - 1;

                        if (family[0].husband.id != 0) {
                            var lastAdded = this.generations[currentGen].length - 1;
                            this.generations[currentGen][lastAdded].SpouseIdxLst = [];
                            this.generations[currentGen][lastAdded].SpouseIdxLst.push(lastAdded - 1);
                            this.generations[currentGen][lastAdded].Index = lastAdded;
                        }
                    }
                }
            }


            // so at this point we need to move up
         //   currentGen++;

            

            var idx = 0;
            //cycle through the people in the generation and add there parents to the next gen
            while (idx < this.generations[currentGen].length) {

               
                var currentChildId = this.generations[currentGen][idx].PersonId;


                // find this childs family
                var familyi = $.grep(this.families, function (e) {


                    var innerresult = $.grep(e.children, function (a) {

                        return a.id == currentChildId;

                    });


                    return innerresult.length > 0 ? true : false;
                });

                // it will return 1 family object containing a mother and father




                if (familyi.length > 0) {


                    if(this.generations[currentGen + 1] == undefined)
                        this.generations[currentGen + 1] = [];

                   // if (this.FamilySpanLines[currentGen + 1] == undefined)
                   //     this.FamilySpanLines[currentGen + 1] = [];


                    if (familyi[0].husband.id != 0) {
                        this.generations[currentGen + 1].push(this.addPerson(currentGen + 1, idx, familyi[0].husband, familyi[0].wife));
                        var lastAdded = this.generations[currentGen + 1].length - 1;
                        this.generations[currentGen + 1][lastAdded].Index = lastAdded;

                        this.generations[currentGen][idx].FatherIdx = this.generations[currentGen + 1].length - 1;
                     
                      //  this.FamilySpanLines[currentGen + 1].push([]);

                        if (familyi[0].wife.id != 0) {
                           
                            this.generations[currentGen + 1][lastAdded].SpouseIdxLst = [];
                            this.generations[currentGen + 1][lastAdded].SpouseIdxLst.push(lastAdded + 1);
                           
                        }

                    }


                    if (familyi[0].wife.id != 0) {
                        this.generations[currentGen + 1].push(this.addPerson(currentGen + 1,idx, familyi[0].wife, familyi[0].husband));
                        var lastAdded = this.generations[currentGen + 1].length - 1;

                        this.generations[currentGen + 1][lastAdded].Index = lastAdded;
                        this.generations[currentGen][idx].MotherIdx = this.generations[currentGen + 1].length - 1;
                        
                 //       this.FamilySpanLines[currentGen + 1].push([]);

                        if (familyi[0].husband.id != 0) {
                            
                            this.generations[currentGen + 1][lastAdded].SpouseIdxLst = [];
                            this.generations[currentGen + 1][lastAdded].SpouseIdxLst.push(lastAdded - 1);
                            
                        }
                    }



                }


                idx++;
            }


            currentGen++;
            
        }




    };

    GedAncPreLoader.prototype.addPerson = function (genIdx ,idx,person, spouse) {
      

      //  console.log(this.searchDepth + ' ' + person.name + ' ' + person.isFirst);

        //var RecordLink = {
        //    DOB: person.BirthDate != '' ? person.BirthDate : person.BaptismDate,
        //    DOD: "",
        //    DeathLocation: "",
        //    FatherDOB: null,
        //    Name: person.name,
        //    Occupation: "",
        //    BirthLocation: person.BaptismPlace == '' ? person.BaptismPlace : person.BirthPlace
        //};

        var newPerson = {
            RecordLink: this.RecordLinkLoader.fill(person),
            ChildCount: 1,
            ChildIdx: idx,
            ChildIdxLst: [],
            ChildLst: [],
            DescendentCount: 0,
            FatherId: '',
            FatherIdx: -1,
            GenerationIdx: genIdx,
            Index: 0,
            IsDisplayed: true,
            IsFamilyEnd: false,
            IsFamilyStart: false,
            IsHtmlLink: true,
            IsParentalLink: false,
            MotherId: '',
            MotherIdx: -1,
            PersonId: person.id,
            RelationType: 0,
            SpouseIdxLst: [],
            SpouseLst: [],
            X1: 0,
            X2: 0,
            Y1: 0,
            Y2: 0,
            zoom: 0
        };



        return newPerson;

    };



})();