//GET http://127.0.0.1:1337/JSVisualizers/DataLoader/DataLoader/ApplicationGedLoader net::ERR_ABORTED 404 (Not Found)
//GedAncPreLoader.js:3 GET http://127.0.0.1:1337/JSVisualizers/DataLoader/Diagrams/Data net::ERR_ABORTED 404 (Not Found)
//GedAncPreLoader.js:5 GET http://127.0.0.1:1337/JSVisualizers/DataLoader/DataLoader/GedData net::ERR_ABORTED 404 (Not Found)

import {ApplicationGedLoader} from "./ApplicationGedLoader.js";
import {Bio} from "../Diagrams/Data/Bio.mjs";

import {GedData} from "./GedData.js";

export function GedAncPreLoader(applicationGedLoader) {

    if (applicationGedLoader == undefined) applicationGedLoader = new ApplicationGedLoader();


    this.searchDepth = 0;

    this._generations = [];

    this.families = applicationGedLoader.families;
    this.persons = applicationGedLoader.person;

    this.applicationGedLoader = applicationGedLoader;

    this.RecordLinkLoader = new Bio();


    this.generations = new Proxy(this._generations, {
      get: function(target, name) {

        return target[name];
      }

    });
}

GedAncPreLoader.prototype.GetGenerations = function (personId, callback) {
    //'@I4@'


    this.searchFams(this.applicationGedLoader.findMakeFirst(personId));

    // var payload = {
    //     Generations: this._generations
    // };


    callback(new GedData(this._generations));

};

GedAncPreLoader.prototype.searchFams = function (startperson) {

    var family = $.grep(this.families, function (e) {


        var innerresult = $.grep(e.children, function (a) {
            return a.id == startperson.id;
        });


        return innerresult.length > 0 ? true : false;

    });

    var currentGen = 0;

    this._generations = [];

    this._generations[currentGen] = [];
    this._generations[currentGen].push(this.addPerson(currentGen,0,startperson));


    while (this._generations[currentGen] != undefined &&
        this._generations[currentGen].length > 0)
    {



        if (currentGen == 0) {

            currentGen++;
            this._generations[currentGen] = [];
        //    this.FamilySpanLines[currentGen] = [];
            if (family.length > 0) {
                if (family[0].husband.id != 0) {

                    this._generations[currentGen].push(this.addPerson(currentGen,0,family[0].husband, family[0].wife));
                 //   this.FamilySpanLines[currentGen].push([]);

                    this._generations[currentGen - 1][0].FatherIdx = this._generations[currentGen].length - 1;

                    if (family[0].wife.id != 0) {
                        var lastAdded = this._generations[currentGen].length - 1;
                        this._generations[currentGen][lastAdded].SpouseIdxLst = [];
                        this._generations[currentGen][lastAdded].SpouseIdxLst.push(lastAdded + 1);
                        this._generations[currentGen][lastAdded].Index = lastAdded;
                    }
                }

                if (family[0].wife.id != 0) {
                    this._generations[currentGen].push(this.addPerson(currentGen,0,family[0].wife, family[0].husband));
                  //  this.FamilySpanLines[currentGen].push([]);

                    this._generations[currentGen - 1][0].MotherIdx = this._generations[currentGen].length - 1;

                    if (family[0].husband.id != 0) {
                        let lastAdded = this._generations[currentGen].length - 1;
                        this._generations[currentGen][lastAdded].SpouseIdxLst = [];
                        this._generations[currentGen][lastAdded].SpouseIdxLst.push(lastAdded - 1);
                        this._generations[currentGen][lastAdded].Index = lastAdded;
                    }
                }
            }
        }


        // so at this point we need to move up
     //   currentGen++;



        var idx = 0;
        //cycle through the people in the generation and add there parents to the next gen
        while (idx < this._generations[currentGen].length) {


            var currentChildId = this._generations[currentGen][idx].PersonId;


            // find this childs family
            var familyi = $.grep(this.families,  (e) => {

                var innerresult = $.grep(e.children,  (a) => {
                    return a.id == currentChildId;
                });

                return innerresult.length > 0 ? true : false;
            });

            // it will return 1 family object containing a mother and father




            if (familyi.length > 0) {


                if(this._generations[currentGen + 1] == undefined)
                    this._generations[currentGen + 1] = [];

               // if (this.FamilySpanLines[currentGen + 1] == undefined)
               //     this.FamilySpanLines[currentGen + 1] = [];


                if (familyi[0].husband.id != 0) {
                    this._generations[currentGen + 1].push(this.addPerson(currentGen + 1, idx, familyi[0].husband, familyi[0].wife));
                    let lastAdded = this._generations[currentGen + 1].length - 1;
                    this._generations[currentGen + 1][lastAdded].Index = lastAdded;

                    this._generations[currentGen][idx].FatherIdx = this._generations[currentGen + 1].length - 1;

                  //  this.FamilySpanLines[currentGen + 1].push([]);

                    if (familyi[0].wife.id != 0) {

                        this._generations[currentGen + 1][lastAdded].SpouseIdxLst = [];
                        this._generations[currentGen + 1][lastAdded].SpouseIdxLst.push(lastAdded + 1);

                    }

                }


                if (familyi[0].wife.id != 0) {
                    this._generations[currentGen + 1].push(this.addPerson(currentGen + 1,idx, familyi[0].wife, familyi[0].husband));
                    let lastAdded = this._generations[currentGen + 1].length - 1;

                    this._generations[currentGen + 1][lastAdded].Index = lastAdded;
                    this._generations[currentGen][idx].MotherIdx = this._generations[currentGen + 1].length - 1;

             //       this.FamilySpanLines[currentGen + 1].push([]);

                    if (familyi[0].husband.id != 0) {

                        this._generations[currentGen + 1][lastAdded].SpouseIdxLst = [];
                        this._generations[currentGen + 1][lastAdded].SpouseIdxLst.push(lastAdded - 1);

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
