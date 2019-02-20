
import {Bio} from "../Diagrams/Data/Bio.mjs";
import {GNGraph} from "./GNGraph.js";
import {GedLib} from "./GedLib.js";

export class DescGraphCreator {

    constructor(families,persons){
      this.persons = persons;

      this.searchDepth = 0;

      this._generations = [];

      this._workingFamilies = families;


      this.RecordLinkLoader = new Bio();

      //debug
      this.firstCount =0;

      this.generations = new Proxy(this._generations, {
        get: function(target, name) {

          return target[name];
        }

      });
    }

    GetGenerations(personId, callback) {

        this.firstCount =0;

        var initPerson = personId;

        GedLib.SetRawDataGenerationProp(this._workingFamilies,-1);

        personId = GedLib.FindFurthestAncestor(this._workingFamilies,personId);

        let firstNode = GedLib.FindPerson(this.persons, personId);


        this.addDescendantsToGraph(firstNode);

        this.addNodeChildLinks(this._generations);

        callback(new GNGraph(this._generations));
    }

    addNodeChildLinks(graph){
      console.log('addNodeChildLinks');
      let genIdx =0;

      const addChild= (person, childId, currentGeneration)=>{
          let childGeneration = currentGeneration +1;

          if(childGeneration < graph.length){
            let idx =0;

            while(idx < graph[childGeneration].length){
              if(graph[childGeneration][idx].PersonId == childId){
                person.Children.push(graph[childGeneration][idx]);
                break;
              }
              idx++;
            }
          }

      };

      while(genIdx < graph.length){
        let personIdx =0;

        while(personIdx < graph[genIdx].length){
          let person  = graph[genIdx][personIdx];

//newPerson.ChildLst.push(person.children[idx].id);

          person.ChildLst.forEach((item)=>{
            addChild(person, item,genIdx);
          });

          personIdx ++;
        }
        genIdx++;
      }




    }

    addDescendantsToGraph(startperson) {



        this.searchDepth++;

        if (this._generations.length < this.searchDepth) this._generations.push([]);

        var idx = 0;
        var famidx = 0;

        var familyFound = $.grep(this._workingFamilies, function (e) {
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

        var addPersonIf = function(person, spouse) {

            try {
                var addChild = false;

                if (person != undefined &&
                    person.id == startperson.id) {

                    if (that._workingFamilies[idx].children.length > 0) that._workingFamilies[idx].children[0].isFirst = true;

                    var tpDebugGen = person.generation;

                    if (person.generation == -1) {
                        person.generation = that.searchDepth;

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

                    that.addPerson(spouse, person, false);
                }


                if (addChild) {
                    famidx = 0;
                    while (famidx < that._workingFamilies[idx].children.length) {
                        that.addDescendantsToGraph(that._workingFamilies[idx].children[famidx]);
                        that.searchDepth--;
                        famidx++;
                    }
                }
            } catch(e) {
                console.log(e);
            }
        };

        while (idx < that._workingFamilies.length && familyFound) {

            addPersonIf(that._workingFamilies[idx].husband, that._workingFamilies[idx].wife);

            addPersonIf(that._workingFamilies[idx].wife, that._workingFamilies[idx].husband);

            idx++;
        }

        that._generations[0][0].IsHtmlLink = false;

    }

    addPerson(rawPerson, rawSpouse, isChild) {
            isChild = (isChild == undefined) ? true : isChild;

            var newPerson = {
                RecordLink: this.RecordLinkLoader.fill(rawPerson),
                ChildCount: 1,
                ChildIdx: 0,
                ChildIdxLst: [],
                ChildLst: [],
                Children:[],
                DescendentCount: 0,
                Father:undefined,
                FatherId: '',
                FatherIdx: -1,
                GenerationIdx: rawPerson.generation,
                Index: 0,
                IsDisplayed: true,
                IsFamilyEnd: true,
                IsFamilyStart: rawPerson.isFirst,
                IsHtmlLink: false,
                IsParentalLink: false,
                Mother:undefined,
                MotherId: '',
                MotherIdx: -1,
                PersonId: rawPerson.id,
                RelationType: 0,
                SpouseIdxLst: [],
                SpouseIdLst: [],
                Spouses: [],
                X1: 0,
                X2: 0,
                Y1: 0,
                Y2: 0,
                zoom: 0
            };

            var idx = 0;

            if (rawPerson.children == undefined) rawPerson.children = [];

            while (idx < rawPerson.children.length) {

                newPerson.ChildLst.push(rawPerson.children[idx].id);

                idx++;
            }

            newPerson.ChildCount = rawPerson.children.length;


            var lastPersonAdded = this._generations[this.searchDepth - 1].length - 1;


            //default every person to family end = true
            //then if the new person we are adding isnt a isfirst reset that to false.
            if (this._generations[this.searchDepth - 1].length > 0 && !rawPerson.isFirst) {

                this._generations[this.searchDepth - 1][lastPersonAdded].IsFamilyEnd = false;
            }





            this._generations[this.searchDepth - 1].push(newPerson);



            lastPersonAdded = this._generations[this.searchDepth - 1].length - 1;
            // are we the start of a new family
            // make this the parent link
            // if not
            //

            if (rawPerson.isFirst) {

                this._generations[this.searchDepth - 1][lastPersonAdded].IsParentalLink = true;
            }
            else {
                //lastPersonAdded = generations[searchDepth - 1].length - 1;


                idx = lastPersonAdded;

                // rewite this
                // so fill array with people who have parental indexs
                // then use middle of array as parental link person!

                //also remember we are looking back through
                //the previously added generation
                var tpFamily = [];

                while (idx >= 0) {
                    this._generations[this.searchDepth - 1][idx].IsParentalLink = false;

                    if (this._generations[this.searchDepth - 1][idx].FatherId != '' ||
                        this._generations[this.searchDepth - 1][idx].MotherId != '')
                    {
                        tpFamily.push(this._generations[this.searchDepth - 1][idx]);
                    }

                    if (this._generations[this.searchDepth - 1][idx].IsFamilyStart) {
                        break;
                    }



                    idx--;
                }

                if (tpFamily.length > 0) {
                    lastPersonAdded = Math.floor(tpFamily.length / 2);

                    tpFamily[lastPersonAdded].IsParentalLink = true;
                }
                else {
                    console.log('zero length family: ' + rawPerson.id);
                }


            }



            if (rawSpouse != undefined) {
                var currentPersonIdx = this._generations[this.searchDepth - 1].length - 1;
                var spouseIdx = currentPersonIdx;

                // fill out spouses location in the current generation
                while (spouseIdx >= 0) {
                    if (this._generations[this.searchDepth - 1][spouseIdx].PersonId == rawSpouse.id) {
                        this._generations[this.searchDepth - 1][currentPersonIdx].Spouses.push(this._generations[this.searchDepth - 1][spouseIdx]);
                        this._generations[this.searchDepth - 1][currentPersonIdx].SpouseIdxLst.push(spouseIdx);
                        this._generations[this.searchDepth - 1][currentPersonIdx].SpouseIdLst.push(rawSpouse.id);

                        this._generations[this.searchDepth - 1][spouseIdx].SpouseIdxLst.push(currentPersonIdx);
                        this._generations[this.searchDepth - 1][spouseIdx].SpouseIdLst.push(newPerson.PersonId);
                        this._generations[this.searchDepth - 1][spouseIdx].Spouses.push(this._generations[this.searchDepth - 1][currentPersonIdx]);

                        break;
                    }
                    spouseIdx--;
                }
            }




            // there should always be a parent unless we are dealing with the first person OR a spouse!!
            // the parent should be the last person in the generation above us.

            if (isChild) {
                var previousGeneration = this.searchDepth > 1 ? this.searchDepth - 2 : 1;

                if (this._generations.length > previousGeneration) {
                    var secondParentIdx = this._generations[previousGeneration].length - 1; // last person in the list
                    // handle single parents
                    if (this._generations[previousGeneration][secondParentIdx].SpouseIdxLst.length > 0) {

                        var firstParentIdx = this._generations[previousGeneration][secondParentIdx].SpouseIdxLst[0];

                        newPerson.FatherIdx = firstParentIdx;
                        newPerson.FatherId = this._generations[previousGeneration][firstParentIdx].PersonId;
                        newPerson.Father =this._generations[previousGeneration][firstParentIdx];
                        newPerson.MotherId = this._generations[previousGeneration][secondParentIdx].PersonId;
                        newPerson.MotherIdx = secondParentIdx;
                        newPerson.Mother  = this._generations[previousGeneration][secondParentIdx];

                    } else {

                        newPerson.FatherIdx = secondParentIdx;
                        newPerson.Father =this._generations[previousGeneration][secondParentIdx];
                        newPerson.FatherId = this._generations[previousGeneration][secondParentIdx].PersonId;
                    }

                }
            }


            if (newPerson.FatherIdx == -1 && newPerson.MotherIdx == -1) newPerson.IsHtmlLink = true;

            if (newPerson.FatherIdx == -1) newPerson.FatherIdx = 0;
            if (newPerson.MotherIdx == -1) newPerson.MotherIdx = 0;



        }

}
