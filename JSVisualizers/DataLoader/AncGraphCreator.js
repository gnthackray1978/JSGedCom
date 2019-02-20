
import {Bio} from "../Diagrams/Data/Bio.mjs";
import {GedLib} from "./GedLib.js";
import {GNGraph} from "./GNGraph.js";

export class AncGraphCreator {

    constructor(families,persons){
      this.searchDepth = 0;

      this._generations = [];

      this.families = families;
      this.persons = persons;

      this.RecordLinkLoader = new Bio();


      this.generations = new Proxy(this._generations, {
        get: function(target, name) {

          return target[name];
        }

      });
    }

    GetGenerations(personId, callback) {
        //'@I4@'

        let findMakeFirst =  GedLib.MakeFirst(this.persons,personId);

        this.addAncestorsToGraph(findMakeFirst);

        callback(new GNGraph(this._generations));

    }

    addAncestorsToGraph(startperson) {

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
                let startNode = this._generations[0][0];
                currentGen++;
                this._generations[currentGen] = [];

                if (family.length > 0) {

                    let husbandIdx = -1;
                    let wifeIdx = -1;

                    if (family[0].husband.id != 0) {

                        // add father
                        this._generations[currentGen].push(
                          this.addPerson(currentGen,0,family[0].husband, startNode));
                        // move back down to the first node
                        // set the father idx
                        husbandIdx = this._generations[currentGen].length - 1;

                        this._generations[currentGen - 1][0].FatherIdx = husbandIdx;
                        this._generations[currentGen - 1][0].Father = this._generations[currentGen][husbandIdx];
                        this._generations[currentGen][husbandIdx].Index = husbandIdx;
                    }

                    if (family[0].wife.id != 0) {
                        this._generations[currentGen].push(
                          this.addPerson(currentGen,0,family[0].wife, startNode));

                        wifeIdx = this._generations[currentGen].length - 1;

                        this._generations[currentGen - 1][0].MotherIdx = wifeIdx;
                        this._generations[currentGen - 1][0].Mother = this._generations[currentGen][wifeIdx];
                        this._generations[currentGen][wifeIdx].Index = wifeIdx;
                    }

                    if (husbandIdx > 0 && wifeIdx > 0) {

                        this._generations[currentGen][wifeIdx].SpouseIdxLst = [];
                        this._generations[currentGen][wifeIdx].SpouseIdxLst.push(wifeIdx - 1);
                        this._generations[currentGen][wifeIdx].Spouses.push(this._generations[currentGen][husbandIdx]);

                        this._generations[currentGen][husbandIdx].SpouseIdxLst = [];
                        this._generations[currentGen][husbandIdx].SpouseIdxLst.push(husbandIdx + 1);
                        this._generations[currentGen][husbandIdx].Spouses.push(this._generations[currentGen][wifeIdx]);
                    }
                }
            }

            var idx = 0;
            //cycle through the people in the generation and add there parents to the next gen
            while (idx < this._generations[currentGen].length) {


                var currentChildId = this._generations[currentGen][idx].PersonId;
                let currentChild = this._generations[currentGen][idx];


                // find this childs family
                var familyi = $.grep(this.families,  (e) => {

                    var innerresult = $.grep(e.children,  (a) => {
                        return a.id == currentChildId;
                    });

                    return innerresult.length > 0 ? true : false;
                });

                if (familyi.length > 0) {


                    if(this._generations[currentGen + 1] == undefined)
                        this._generations[currentGen + 1] = [];

                    let husbandIdx = -1;
                    let wifeIdx = -1;

                    if (familyi[0].husband.id != 0) {
                        this._generations[currentGen + 1].push(
                          this.addPerson(currentGen + 1, idx, familyi[0].husband, currentChild));

                        husbandIdx= this._generations[currentGen + 1].length - 1;
                        this._generations[currentGen + 1][husbandIdx].Index = husbandIdx;
                        this._generations[currentGen][idx].FatherIdx = husbandIdx;
                        this._generations[currentGen][idx].Father= this._generations[currentGen + 1][husbandIdx];
                    }


                    if (familyi[0].wife.id != 0) {
                        this._generations[currentGen + 1].push(
                          this.addPerson(currentGen + 1,idx, familyi[0].wife, currentChild));

                        wifeIdx = this._generations[currentGen + 1].length - 1;
                        this._generations[currentGen + 1][wifeIdx].Index = wifeIdx;
                        this._generations[currentGen][idx].MotherIdx = wifeIdx;
                        this._generations[currentGen][idx].Mother =this._generations[currentGen + 1][wifeIdx];
                    }

                    if (husbandIdx > 0 && wifeIdx > 0) {

                      this._generations[currentGen + 1][wifeIdx].SpouseIdxLst = [];
                      this._generations[currentGen + 1][wifeIdx].SpouseIdxLst.push(wifeIdx - 1);
                      this._generations[currentGen + 1][wifeIdx].Spouses.
                        push(this._generations[currentGen + 1][husbandIdx]);

                      this._generations[currentGen + 1][husbandIdx].SpouseIdxLst = [];
                      this._generations[currentGen + 1][husbandIdx].SpouseIdxLst.push(husbandIdx + 1);
                      this._generations[currentGen + 1][husbandIdx].Spouses.
                        push(this._generations[currentGen + 1][wifeIdx]);

                    }

                }

                idx++;
            }


            currentGen++;

        }

    }

    addPerson(genIdx ,idx, person, child) {


          var newPerson = {
              RecordLink: this.RecordLinkLoader.fill(person),
              ChildCount: 1,
              ChildIdx: idx,
              ChildIdxLst: [],
              ChildLst: [],
              Children: [child],
              DescendentCount: 0,
              Father:undefined,
              FatherId: '',
              FatherIdx: -1,
              GenerationIdx: genIdx,
              Index: 0,
              IsDisplayed: true,
              IsFamilyEnd: false,
              IsFamilyStart: false,
              IsHtmlLink: true,
              IsParentalLink: false,
              Mother:undefined,
              MotherId: '',
              MotherIdx: -1,
              PersonId: person.id,
              RelationType: 0,
              SpouseIdxLst: [],
              SpouseIdLst: [],
              Spouses :[],
              X1: 0,
              X2: 0,
              Y1: 0,
              Y2: 0,
              zoom: 0
          };



          return newPerson;

      }
}
