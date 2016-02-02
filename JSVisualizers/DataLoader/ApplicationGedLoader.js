function ApplicationGedLoader() {
    
    
    this.cacheFamilies = [];
    this.cachePersons = [];
    
    this.families = [];
    this.persons = [];

    this.loader = null;
  
};

ApplicationGedLoader.prototype = {
    constructor: function() {
    },    

    parseLine: function(line) {

        var gRow = {};

        var split = $.trim(line).split(' ');

        gRow.split = split;

        gRow.level = Number(split.shift());

        gRow.id = '';
        gRow.value = '';

        var tmp = split.shift();

        if (tmp != undefined) {
            if (gRow.level == 0) {
                if (tmp.charAt(0) == '@') {
                    gRow.id = tmp;
                    gRow.tag = split.shift() || '';

                } else {
                    gRow.tag = tmp;
                    gRow.id = split.shift() || '';
                }
            } else {


                gRow.tag = tmp;

                tmp = split.shift();

                while (tmp != undefined) {
                    gRow.value += ' ' + tmp;
                    tmp = split.shift();
                }

                gRow.value = $.trim(gRow.value);
            }
        }


        return gRow;
    },

    processFile: function(file,progressFunction, newloader) {
        
        console.log('processFile');
        
        var asynch = new Asynch();
        
        var results = file.match(/[^\n]+(?:\r?\n|$)/g);

        if(results == null || results.length ==0){
            newloader();
            return;
        }

        var that = this;

        var makeLists = function(){
            var idx =0;
            var currentId = {};
            
            while (idx < results.length) {
                var gLine = that.parseLine(results[idx]);
                try {
                    if (gLine.id != '') {
                        currentId = {};
                        currentId.type = gLine.tag;
                        currentId.id = gLine.id;
                        currentId.children = [];
                        currentId.generation = -1;
                        currentId.date = 0;
                        currentId.BaptismPlace = '';
                        currentId.BirthPlace = '';
                        currentId.BirthDate = '';
                        currentId.BaptismDate = '';
                        currentId.husbId = '0';
                        currentId.wifeId = '0';
                        currentId.isFirst = false;
                        currentId.OccupationDate= '';
                        currentId.OccupationPlace= '';
                        currentId.Occupation = '';
                        currentId.DeathLocation = '';
                        currentId.name = '';

                        if (currentId.type == 'FAM') that.families.push(currentId);

                        if (currentId.type == 'INDI') that.persons.push(currentId);
                    } else {

                        if (currentId.type == 'FAM') {


                            if (gLine.tag == 'HUSB') currentId.husbId = gLine.value;
                            if (gLine.tag == 'WIFE') currentId.wifeId = gLine.value;

                            if (gLine.tag == 'CHIL') currentId.children.push(gLine.value);

                        }


                        if (currentId.type == 'INDI') {


                            if (gLine.tag == 'NAME') currentId.name = gLine.value;
                            if (gLine.tag == 'FAMS') currentId.famId = gLine.value;                    
                    
                   
                        }


                        if (idx <= results.length) {
                            var nextLine = that.parseLine(results[idx + 1]);

                            while (idx <= results.length && nextLine.level > 1) {

                                if (gLine.tag == 'BAPL' || gLine.tag == 'BAPM' || gLine.tag == 'CHR') {
                                    if (nextLine.tag == 'DATE') currentId.date = nextLine.value.yearDate();
                                    if (nextLine.tag == 'DATE') currentId.BaptismDate = nextLine.value;
                                    if (nextLine.tag == 'PLAC') currentId.BaptismPlace = nextLine.value;
                                }

                                if (gLine.tag == 'BIRT') {
                                    if (nextLine.tag == 'DATE') currentId.date = nextLine.value.yearDate();
                                    if (nextLine.tag == 'DATE') currentId.BirthDate = nextLine.value;
                                    if (nextLine.tag == 'PLAC') currentId.BirthPlace = nextLine.value;
                                }

                                if (gLine.tag == 'MARR') {
                                    if (nextLine.tag == 'DATE') currentId.date = nextLine.value.yearDate();
                                    if (nextLine.tag == 'DATE') currentId.MarDate = nextLine.value;
                                    if (nextLine.tag == 'PLAC') currentId.MarPlace = nextLine.value;
                                }

                                if (gLine.tag == 'OCCU') {

                                    currentId.Occupation = gLine.value;

                                    if (nextLine.tag == 'DATE') currentId.OccupationDate = nextLine.value;
                                    if (nextLine.tag == 'PLAC') currentId.OccupationPlace = nextLine.value;
                                }

                                if (gLine.tag == 'DEAT') {

                                    if (nextLine.tag == 'DATE') currentId.DeathDate = nextLine.value;
                                    if (nextLine.tag == 'PLAC') currentId.DeathPlace = nextLine.value;
                                }

                                results.splice(idx + 1, 1);
                                nextLine = that.parseLine(results[idx + 1]);

                                //because we have take a row out of the array dont need to increment anything
                            }
                        }
                    }             
                } catch(err) {
                }
                idx++;
            }
            
            
        };

        var parseSpouses = function(){
            // we need to have the families ordered by the birth of their children
            var famChildIdx = 0;
            var famidx = 0;
            
            var idx = 0;
            while (idx < that.persons.length) {
                
                famidx = 0;

                while (famidx < that.families.length) {

                    if (that.families[famidx].husbId == that.persons[idx].id) that.families[famidx].husband = that.persons[idx];

                    if (that.families[famidx].wifeId == that.persons[idx].id) that.families[famidx].wife = that.persons[idx];

                    famChildIdx = 0;
                    while (famChildIdx < that.families[famidx].children.length) {
                        if (that.families[famidx].children[famChildIdx] == that.persons[idx].id) {
                            that.families[famidx].children[famChildIdx] = that.persons[idx];

                            if (that.families[famidx].date != undefined)
                                that.families[famidx].date = that.persons[idx].BirthDate.yearDate();

                            break;
                        }
                        famChildIdx++;
                    }            


                    famidx++;
                }

                idx++;
            }
        };
        
        var parseChildren = function(){
            // sort family children 
            var famidx = 0;
            while (famidx < that.families.length) {

                that.families[famidx].children.sort(function(a, b) {
                    return a.date - b.date;
                });
        
                if (that.families[famidx].husbId != '0')
                    that.families[famidx].husband.children = that.families[famidx].children;

                if (that.families[famidx].wifeId != '0')
                    that.families[famidx].wife.children = that.families[famidx].children;

                if (that.families[famidx].husband == undefined) that.families[famidx].husband = { id: 0 };
                if (that.families[famidx].wife == undefined) that.families[famidx].wife = { id: 0 };

                famidx++;
            }
            // sort families
            that.families.sort(function(a, b) {
                return a.date - b.date;
            });
        };

        progressFunction('parsing ged file',true);
        
        
        asynch.acall(makeLists, function(){
            progressFunction('parsing persons',true);
            asynch.acall(parseSpouses, function(){
                progressFunction('parsing families',true);
                asynch.acall(parseChildren, function(){
                    
                    var rng = that.findDateRange();
                    
                    that.cacheFamilies = JSON.parse(JSON.stringify(that.families));
                    that.cachePersons = JSON.parse(JSON.stringify(that.persons));
                    
                    newloader(that.families, that.persons, rng);
                });
            });
        });
        
        
        
        
        
       
       
       
        //searchFams(findPerson('@I4@'));


        //idx = 0;

        //var genidx = 0;
        //while (idx < generations.length) {

        //    genidx = 0;
        //    while (genidx < generations[idx].length) {

        //        var p = generations[idx][genidx];


        //        console.log(idx + ' ' + p.PersonId + ' ' + p.Name + '  ' + p.DOB + ' FatherId ' + p.FatherId
        //            + ' FatherIdx  ' + p.FatherIdx + ' MotherId ' + p.MotherId + ' MotherIdx ' + p.MotherIdx
        //            + ' FS ' + p.IsFamilyStart + ' FE ' + p.IsFamilyEnd + ' IsParentalLink ' + p.IsParentalLink) ;// + ' IsHtmlLink ' + p.IsHtmlLink ;' IsDisplayed ' + p.IsDisplayed + 
        //        genidx++;
        //    }

        //    idx++;
        //}

        // we need to end up with a list of people {spouses, children} with their spouses following them , ordered by generation
        // we have the persons with generation id do we need a family position tag?


    },

    findPerson: function(person) {
        var idx = 0;
        while (idx < this.persons.length) {

            if (this.persons[idx].id == person) {
                return this.persons[idx];
            }
            idx++;
        }

        return null;
    },
    
    findMakeFirst: function(person) {


        var idx = 0;
        while (idx < this.persons.length) {

            if (this.persons[idx].id == person) {
                this.persons[idx].isFirst = true;
                return this.persons[idx];
            }
            idx++;
        }

        return null;
    },
    
    
    findDateRange: function() {

        var startDate =2000;
        var endDate =0;
        
        var idx = 0;
        while (idx < this.persons.length) {
            var date = this.persons[idx].date;
            
            if (date && date < startDate && date !=0) {
                startDate = date;
            }
            
            if (date && date > endDate && date !=0) {
                endDate = date;
            }
            
            idx++;
        }

        return {s:startDate, e:endDate};
    },
    
    SetForAncLoader: function() {
        this.loader = new GedAncPreLoader(this);
        
    },
    
    SetForDescLoader: function () {
        this.loader = new GedPreLoader(this);
    },

    GetGenerations: function (personId, callback) {
        
        console.log('dataloader GetGenerations');
        
        if (this.loader == null) {

            console.log('no loader set');
        }

        this.loader.GetGenerations(personId, callback);
        
    },
    
    RefreshData: function () {

        //JSON.parse(JSON.stringify(loader.families));
        this.families = JSON.parse(JSON.stringify(this.cacheFamilies));
        this.persons =  JSON.parse(JSON.stringify(this.cachePersons));
        
    }
};
