
var DataLoader = {};

(function () {
    /** @constructor */
    DataLoader.GedLoader = function () {
        this.families = [];
        this.persons = [];

        this.loader = null;
      
    };

    DataLoader.GedLoader.prototype = {
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


            //  $('#result').html(file);

            var results = file.match(/[^\n]+(?:\r?\n|$)/g);

            var idx = 0;

            var currentId = {};

            if(results == null || results.length ==0){
                newloader();
            }


            progressFunction('parsing persons',true);
            
            while (idx < results.length) {

                // are we an id.
                progressFunction('parsing persons: ' + idx + " of " + results.length,true);

                var gLine = this.parseLine(results[idx]);

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

                        if (currentId.type == 'FAM') this.families.push(currentId);

                        if (currentId.type == 'INDI') this.persons.push(currentId);
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
                            var nextLine = this.parseLine(results[idx + 1]);

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
                                nextLine = this.parseLine(results[idx + 1]);

                                //because we have take a row out of the array dont need to increment anything
                            }
                        }
                    }             


                } catch(err) {
                }


                idx++;

            }

            // we need to have the families ordered by the birth of their children

            var famChildIdx = 0;
            var famidx = 0;
            
            progressFunction('parsing families',true);
            
            try {
                idx = 0;
                while (idx < this.persons.length) {
                    
                    progressFunction('parsing families: ' + idx + ' of ' + this.persons.length ,true);
                    
                    famidx = 0;

                    while (famidx < this.families.length) {

                        if (this.families[famidx].husbId == this.persons[idx].id) this.families[famidx].husband = this.persons[idx];

                        if (this.families[famidx].wifeId == this.persons[idx].id) this.families[famidx].wife = this.persons[idx];

                        famChildIdx = 0;
                        while (famChildIdx < this.families[famidx].children.length) {
                            if (this.families[famidx].children[famChildIdx] == this.persons[idx].id) {
                                this.families[famidx].children[famChildIdx] = this.persons[idx];

                                if (this.families[famidx].date != undefined)
                                    this.families[famidx].date = this.persons[idx].BirthDate.yearDate();

                                break;
                            }
                            famChildIdx++;
                        }            


                        famidx++;
                    }


                    idx++;
                }

            } catch(err) {
                console.log(err);
            }


            // sort family children 
            famidx = 0;
            while (famidx < this.families.length) {

                this.families[famidx].children.sort(function(a, b) {
                    return a.date - b.date;
                });
        

                if (this.families[famidx].husbId != '0')
                    this.families[famidx].husband.children = this.families[famidx].children;

                if (this.families[famidx].wifeId != '0')
                    this.families[famidx].wife.children = this.families[famidx].children;

                if (this.families[famidx].husband == undefined) this.families[famidx].husband = { id: 0 };
                if (this.families[famidx].wife == undefined) this.families[famidx].wife = { id: 0 };

                famidx++;
            }

            // sort families
            this.families.sort(function(a, b) {
                return a.date - b.date;
            });

            progressFunction('finished',false);
            
            newloader(this.families, this.persons);
           
           
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
                    this.persons[idx].isFirst = true;
                    return this.persons[idx];
                }
                idx++;
            }

            return null;
        },
        
        SetForAncLoader: function() {
            this.loader = new GedAncPreLoader(this);
            
        },
        SetForDescLoader: function () {
            this.loader = new GedPreLoader(this);
        },

        GetGenerations: function (personId, newGeneration) {

            if (this.loader == null) {

                console.log('no loader set');
            }

            this.loader.GetGenerations(personId, newGeneration);
            
        }
    };
})();