

/** @constructor */
function GedPreLoader(loader) {
    // Constructor
    //this.monkey = 'm';
    if (loader == undefined) loader = new DataLoader.GedLoader();
    
    this.ancUtils = new AncUtils();

    this.searchDepth = 0;



    this.generations = [];

//JSON.parse(JSON.stringify(loader.families));//
    this.families = JSON.parse(JSON.stringify(loader.families));//loader.families;
    this.persons = JSON.parse(JSON.stringify(loader.persons));//loader.person;

    this.gedLoader = loader;

    this.RecordLinkLoader = new Bio();
    
    //debug
    this.firstCount =0;
}

(function () {
 
    GedPreLoader.prototype.SearchFurthestAncestor = function (startperson) {        
        
        var that = this;
 

          
        // get start person ,
        // look for them in the families list 


        var nextGeneration = startperson;
        var isSearching = true;
        

        while (isSearching) {
            
            // is start person amongst families children
            var familyi = $.grep(this.families, function (e) {
                var innerresult = $.grep(e.children, function (a) {
                    return a.id == nextGeneration;
                });
                
                return innerresult.length > 0 ? true : false;
            });

            if (familyi.length > 0) {               
                if (familyi[0].husbId != '0') {
                    nextGeneration = familyi[0].husbId;
                } else {                
                    if (familyi[0].wifeId != '0') {
                        nextGeneration = familyi[0].wifeId;
                    } else {
                        nextGeneration = '0';
                    }

                }   
            } else {
                isSearching = false;

            }
            
        }

        var p = this.gedLoader.findPerson(nextGeneration);
        
        console.log(p.name);

        return nextGeneration;
    },

    GedPreLoader.prototype.GetGenerations = function (personId,newGeneration) {
  
        var initPerson = personId;
        
        personId = this.SearchFurthestAncestor(personId);

        console.log('GetGenerations: ' + initPerson + ' ' + personId + ' init sd ' +  this.searchDepth);
        
        this.firstCount =0;
        
        var idx = 0;
   
        while (idx < this.families.length) {

            if (this.families[idx].husband != undefined) this.families[idx].husband.generation = -1;
            if (this.families[idx].wife != undefined) this.families[idx].wife.generation = -1;
            
            idx++;
        }

        this.searchFams(this.gedLoader.findPerson(personId));



        var payload = {Generations : this.generations};
         
        newGeneration(payload);

         


    };

    GedPreLoader.prototype.searchFams = function (startperson) {


        this.searchDepth++;

        if (this.generations.length < this.searchDepth) this.generations.push([]);

        var idx = 0;
        var famidx = 0;

        var familyFound = $.grep(this.families, function (e) {
            if(startperson == null) return false;
            if(e.husband == null && e.wife == null) return false;
            
            return  e.husband.id == startperson.id || e.wife.id == startperson.id;

        }).length > 0 ? true : false;

        // a child with no spouse
        if (!familyFound && startperson.generation == -1) {
            startperson.generation = this.searchDepth;
            this.addPerson(startperson);
        }

        var addPersonIf = function(state, person, spouse) {

            try {
                var addChild = false;

                if (person != undefined &&
                    person.id == startperson.id) {

                    if (state.families[idx].children.length > 0) state.families[idx].children[0].isFirst = true;

                    if (person.generation == -1) {
                        person.generation = state.searchDepth;
                        state.addPerson(person, spouse);
                    }

                    addChild = true;
                }


                // spouse of one of the children or the first person.
                if (spouse != undefined &&
                    spouse.generation == -1 &&
                    person != undefined &&
                    person.id == startperson.id) {
                    spouse.generation = state.searchDepth;
                    state.addPerson(spouse, person, false);
                }


                if (addChild) {
                    famidx = 0;
                    while (famidx < state.families[idx].children.length) {
                        state.searchFams(state.families[idx].children[famidx]);
                        state.searchDepth--;
                        famidx++;
                    }
                }
            } catch(e) {
                console.log(e);
            } 

          


        };

        while (idx < this.families.length && familyFound) {

            addPersonIf( this, this.families[idx].husband, this.families[idx].wife);

            addPersonIf(this, this.families[idx].wife, this.families[idx].husband);

            idx++;
        }

        this.generations[0][0].IsHtmlLink = false;

    };

    GedPreLoader.prototype.addPerson = function (person, spouse, isChild) {
        isChild = (isChild == undefined) ? true : isChild;


       // console.log(this.searchDepth + ' ' + person.name + ' ' + person.isFirst);

        //var RecordLink = {
        //    DOB: person.BirthDate.yearDate() != 0 ? person.BirthDate.yearDate() : person.BaptismDate.yearDate(),
        //    DOD: "",
        //    DeathLocation: "",
        //    FatherDOB: null,
        //    Name: person.name,
        //    Occupation: "",
        //    BirthLocation: person.BaptismPlace == '' ? person.BaptismPlace : person.BirthPlace
        //};
        if(person.isFirst)
        {
            
            console.log('person.isFirst '+ person.id + ' ' + this.firstCount);
            this.firstCount++;
        }



        var newPerson = {
            RecordLink: this.RecordLinkLoader.fill(person),
            ChildCount: 1,
            ChildIdx: 0,
            ChildIdxLst: [],
            ChildLst: [],
            DescendentCount: 0,
            FatherId: '',
            FatherIdx: -1,
            GenerationIdx: person.generation,
            Index: 0,
            IsDisplayed: true,
            IsFamilyEnd: true,
            IsFamilyStart: person.isFirst,
            IsHtmlLink: false,
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

        var idx = 0;

        if (person.children == undefined) person.children = [];

        while (idx < person.children.length) {

            newPerson.ChildLst.push(person.children[idx].id);
            idx++;
        }

        newPerson.ChildCount = person.children.length;


        var lastPersonAdded = this.generations[this.searchDepth - 1].length - 1;


        //default every person to family end = true
        //then if the new person we are adding isnt a isfirst reset that to false.
        if (this.generations[this.searchDepth - 1].length > 0
            && !person.isFirst) {

            this.generations[this.searchDepth - 1][lastPersonAdded].IsFamilyEnd = false;
        }





        this.generations[this.searchDepth - 1].push(newPerson);



        lastPersonAdded = this.generations[this.searchDepth - 1].length - 1;
        // are we the start of a new family
        // make this the parent link
        // if not
        // 

        if (person.isFirst) {

            this.generations[this.searchDepth - 1][lastPersonAdded].IsParentalLink = true;
        }
        else {
            //lastPersonAdded = generations[searchDepth - 1].length - 1;


            idx = lastPersonAdded;

            // rewite this
            // so fill array with people who have parental indexs 
            // then use middle of array as parental link person!

            var tpFamily = [];

            while (idx >= 0) {
                this.generations[this.searchDepth - 1][idx].IsParentalLink = false;

                if (this.generations[this.searchDepth - 1][idx].FatherId != '' ||
                    this.generations[this.searchDepth - 1][idx].MotherId != '')
                {
                    tpFamily.push(this.generations[this.searchDepth - 1][idx]);
                }

                if (this.generations[this.searchDepth - 1][idx].IsFamilyStart) {
                    break;
                }
            
                

                idx--;
            }

            if (tpFamily.length > 0) {
                lastPersonAdded = Math.floor(tpFamily.length / 2);

                tpFamily[lastPersonAdded].IsParentalLink = true;
            }
            else {
                console.log('zero length family: ' + person.id);
            }
           

        }



        if (spouse != undefined) {
            var currentPersonIdx = this.generations[this.searchDepth - 1].length - 1;
            var spouseIdx = currentPersonIdx;
            
            // fill out spouses location in the current generation
            while (spouseIdx >= 0) {
                if (this.generations[this.searchDepth - 1][spouseIdx].PersonId == spouse.id) {

                    this.generations[this.searchDepth - 1][currentPersonIdx].SpouseIdxLst.push(spouseIdx);
                    this.generations[this.searchDepth - 1][currentPersonIdx].SpouseLst.push(spouse.id);

                    this.generations[this.searchDepth - 1][spouseIdx].SpouseIdxLst.push(currentPersonIdx);
                    this.generations[this.searchDepth - 1][spouseIdx].SpouseLst.push(newPerson.PersonId);
                    break;
                }
                spouseIdx--;
            }
        }




        // there should always be a parent unless we are dealing with the first person OR a spouse!!
        // the parent should be the last person in the generation above us.

        if (isChild) {
            var previousGeneration = this.searchDepth > 1 ? this.searchDepth - 2 : 1;

            if (this.generations.length > previousGeneration) {
                var secondParentIdx = this.generations[previousGeneration].length - 1; // last person in the list
                // handle single parents
                if (this.generations[previousGeneration][secondParentIdx].SpouseIdxLst.length > 0) {

                    var firstParentIdx = this.generations[previousGeneration][secondParentIdx].SpouseIdxLst[0];

                    newPerson.FatherIdx = firstParentIdx;
                    newPerson.FatherId = this.generations[previousGeneration][firstParentIdx].PersonId;

                    newPerson.MotherId = this.generations[previousGeneration][secondParentIdx].PersonId;
                    newPerson.MotherIdx = secondParentIdx;
                } else {

                    newPerson.FatherIdx = secondParentIdx;
                    newPerson.FatherId = this.generations[previousGeneration][secondParentIdx].PersonId;
                }

            }
        }


        if (newPerson.FatherIdx == -1 && newPerson.MotherIdx == -1) newPerson.IsHtmlLink = true;

        if (newPerson.FatherIdx == -1) newPerson.FatherIdx = 0;
        if (newPerson.MotherIdx == -1) newPerson.MotherIdx = 0;



    };



})();