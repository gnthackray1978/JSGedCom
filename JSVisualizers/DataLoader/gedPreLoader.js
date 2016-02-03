

/** @constructor */
function GedPreLoader(applicationGedLoader) {
    // Constructor
    console.log('GED PRE LOADER created');
    
    if (applicationGedLoader == undefined) applicationGedLoader = new ApplicationGedLoader();
    
    this.ancUtils = new AncUtils();

    this.searchDepth = 0;

    this.generations = [];

    this.WorkingFamilies = applicationGedLoader.families;
    
    //this.WorkingFamilies = JSON.parse(JSON.stringify(loader.families));//loader.families;
    
    this.persons;
   
    this.applicationGedLoader = applicationGedLoader;

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
            var familyi = $.grep(this.WorkingFamilies, function (e) {
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

        // var p = this.applicationGedLoader.findPerson(nextGeneration);
        
        // console.log(p.name);

        return nextGeneration;
    },

    GedPreLoader.prototype.GetGenerations = function (personId,callback) {
  
        var initPerson = personId;
        
        personId = this.SearchFurthestAncestor(personId);

        console.log('GED PRE LOADER: GetGenerations: ' + initPerson + ' ' + personId + ' init sd ' +  this.searchDepth);
        
        this.firstCount =0;
        
        var idx = 0;
   
        while (idx < this.WorkingFamilies.length) {
            if (this.WorkingFamilies[idx].husband != undefined) this.WorkingFamilies[idx].husband.generation = -1;
            if (this.WorkingFamilies[idx].wife != undefined) this.WorkingFamilies[idx].wife.generation = -1;
            idx++;
        }

        this.searchFams(this.applicationGedLoader.findPerson(personId));

        var payload = {Generations : this.generations};
         
        callback(payload);
    };

    GedPreLoader.prototype.searchFams = function (startperson) {

        if(startperson.id == '@P39@'){
            console.log('searchFams:' + startperson.id + ' ' +startperson.generation);
        }
            
        this.searchDepth++;

        if (this.generations.length < this.searchDepth) this.generations.push([]);

        var idx = 0;
        var famidx = 0;

        var familyFound = $.grep(this.WorkingFamilies, function (e) {
            if(startperson == null) return false;
            if(e.husband == null && e.wife == null) return false;
            
            return  e.husband.id == startperson.id || e.wife.id == startperson.id;

        }).length > 0 ? true : false;

        // a child with no spouse
        if (!familyFound && startperson.generation == -1) {
            startperson.generation = this.searchDepth;
            this.addPerson(startperson);
        }
        
        var that = this;
        
        //added idx for debug purpose can delete
        var addPersonIf = function(person, spouse, idx) {
            
           
            
            try {
                var addChild = false;
                
                // if(person.id == '@P1924@'){
                //     console.log(person.id);
                // }

                if (person != undefined &&
                    person.id == startperson.id) {

                    if (that.WorkingFamilies[idx].children.length > 0) that.WorkingFamilies[idx].children[0].isFirst = true;
                    
                    var tpDebugGen = person.generation;

                    if (person.generation == -1) {
                        person.generation = that.searchDepth;
                        if(person.id == '@P1924@'){
                            console.log(person.id + '-1 : idx ' + idx + ' gen ' + tpDebugGen + ' sp: ' +startperson.id);
                        }
                        that.addPerson(person, spouse);
                    }

                    addChild = true;
                }


                // spouse of one of the children or the first person.
                if (spouse != undefined &&
                    spouse.generation == -1 &&
                    person != undefined &&
                    person.id == startperson.id) {
                    spouse.generation = that.searchDepth;
                    
                    if(person.id == '@P1924@'){
                        console.log(person.id + '-2');
                    }
                    that.addPerson(spouse, person, false);
                }


                if (addChild) {
                    famidx = 0;
                    while (famidx < that.WorkingFamilies[idx].children.length) {
                        that.searchFams(that.WorkingFamilies[idx].children[famidx]);
                        that.searchDepth--;
                        famidx++;
                    }
                }
            } catch(e) {
                console.log(e);
            } 

          


        };

        while (idx < that.WorkingFamilies.length && familyFound) {


            if(idx == 585 && startperson.id == '@P39@'){
                console.log('585');
            }
            
         
            
            
            addPersonIf(that.WorkingFamilies[idx].husband, that.WorkingFamilies[idx].wife,idx);

            addPersonIf(that.WorkingFamilies[idx].wife, that.WorkingFamilies[idx].husband,idx);

            idx++;
        }

        that.generations[0][0].IsHtmlLink = false;

    };

    GedPreLoader.prototype._break = function(person){
        
        var id = person.id;
        
        if(id == '@P1924@')
        {
            console.log(id + ' found' );
            
            try
            {
                var _tpMid = this.generations[this.searchDepth - 1][0].MotherId;
                var _tpFid = this.generations[this.searchDepth - 1][0].FatherId;
                
                console.log(id + ' parents: ' + _tpMid + ' ' + _tpFid);
            }
            catch(err){
                console.log(err);
            }
            
            
        }
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
        // if(person.isFirst)
        // {
            
        //     console.log('person.isFirst '+ person.id + ' ' + this.firstCount);
        //     this.firstCount++;
        // }

        //this._break(person);

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