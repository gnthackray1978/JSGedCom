
export function FakeData() {

    this.qd = new Bio();

    this._generations = [];


    this.generations = new Proxy(this._generations, {
      get: function(target, name) {

        return target[name];
      }

    });

}


FakeData.prototype = {

    fill : function() {




            this._generations.push([]);
            this._generations[0] = [];



            var life = ['algae', 'fungus', 'chromista', 'rhizaria', 'plant', 'animal'];
            var plant = ['vascular', 'non vascular'];
            var vascular = ['seeded', 'seedless'];
            var seeded = ['conifers', 'flowering'];
            var animal = ['sponge', 'anidarians', 'flatworms', 'roundworms', 'lophophorates', 'vertebrates', 'arthropods'];
            var vertebrates = ['cartillaginous fish', 'bony fish', 'tetrapods'];
            var tetrapods = ['amphibians', 'amniotes'];
            var arthropods = ['chellcerates', 'crustaceans', 'insects', 'mollusks', 'segmented worms'];
            var amniotes = ['mammals', 'crocodiles and birds', 'snakes and lizards', 'turtles'];


            this._generations[0].push(this.getData(0, 0,life, 'life','',-1,'',0,true,true,true));


            this._generations[1] = [];


            this._generations[1].push(this.getData(1, 0, [], life[0], 'life', 0, '', 0, true, false, false));
            this._generations[1].push(this.getData(1, 1, [], life[1], 'life', 0, '', 0, false, false, false));
            this._generations[1].push(this.getData(1, 2, [], life[2], 'life', 0, '', 0, false, false, false));
            this._generations[1].push(this.getData(1, 3, [], life[3], 'life', 0, '', 0, false, false, true));
            this._generations[1].push(this.getData(1, 4, plant, life[4], 'life', 0, '', 0, false, false, false));
            this._generations[1].push(this.getData(1, 5, animal, life[5], 'life', 0, '', 0, false, true, false));


            // plants
            this._generations[2] = [];
            this._generations[2].push(this.getData(2, 0, vascular, plant[0], 'plant', 4, '', 4, true, false, false));
            this._generations[2].push(this.getData(2, 1, [], plant[1], 'plant', 4, '', 4, false, true, true));



            this._generations[2].push(this.getData(2, 2, [], animal[0], 'animal', 5, '', 5, true, false, false));//'sponge'
            this._generations[2].push(this.getData(2, 3, [], animal[1], 'animal', 5, '', 5, false, false, false));//'anidarians'
            this._generations[2].push(this.getData(2, 4, [], animal[2], 'animal', 5, '', 5, false, false, false));//'flatworms'
            this._generations[2].push(this.getData(2, 5, [], animal[3], 'animal', 5, '', 5, false, false, true));//'roundworms'
            this._generations[2].push(this.getData(2, 6, [], animal[4], 'animal', 5, '', 5, false, false, false));// 'lophophorates'

            this._generations[2].push(this.getData(2, 7, vertebrates, animal[5], 'animal', 5, '', 5, false, false, false));//'vertebrates'
            this._generations[2].push(this.getData(2, 8, arthropods, animal[6], 'animal', 5, '', 5, false, true, false));//'arthropods'





            this._generations[3] = [];

            this._generations[3].push(this.getData(3, 0, seeded, vascular[0], 'vascular', 0, '', 0, true, false, true)); //seeded
            this._generations[3].push(this.getData(3, 1, [], vascular[1], 'vascular', 0, '', 0, false, true, false));//seedless

            this._generations[3].push(this.getData(3, 2, [], vertebrates[0], 'vertebrates', 7, '', 7, true, false, false));
            this._generations[3].push(this.getData(3, 3, [], vertebrates[1], 'vertebrates', 7, '', 7, false, false, true));
            this._generations[3].push(this.getData(3, 4, tetrapods, vertebrates[2], 'vertebrates', 7, '', 7, false, true, false));

            this._generations[3].push(this.getData(3, 5, [], arthropods[0], 'arthropods', 8, '', 8, true, false, false));
            this._generations[3].push(this.getData(3, 6, [], arthropods[1], 'arthropods', 8, '', 8, false, false, false));
            this._generations[3].push(this.getData(3, 7, [], arthropods[2], 'arthropods', 8, '', 8, false, false, true));
            this._generations[3].push(this.getData(3, 8, [], arthropods[3], 'arthropods', 8, '', 8, false, false, false));
            this._generations[3].push(this.getData(3, 9, [], arthropods[4], 'arthropods', 8, '', 8, false, true, false));






            this._generations[4] = [];

            this._generations[4].push(this.getData(4, 0, [], seeded[0], 'seeded', 0, '', 0, true, false, true));
            this._generations[4].push(this.getData(4, 1, [], seeded[1], 'seeded', 0, '', 0, false, true, false));

            this._generations[4].push(this.getData(4, 2, [], tetrapods[0], 'tetrapods', 4, '', 4, true, false, true));//amphibians
            this._generations[4].push(this.getData(4, 3, amniotes, tetrapods[1], 'tetrapods', 4, '', 4, false, true, false));




            this._generations[5] = [];
            this._generations[5].push(this.getData(5, 0, [], amniotes[0], 'amniotes', 3, '', 3, true, false, false));
            this._generations[5].push(this.getData(5, 1, [], amniotes[1], 'amniotes', 3, '',3, false, false, true));
            this._generations[5].push(this.getData(5, 2, [], amniotes[2], 'amniotes', 3, '', 3, false, false, false));
            this._generations[5].push(this.getData(5, 3, [], amniotes[3], 'amniotes',3, '',3, false, true, false));


            // fungus

            // c



        ;
    },

    getData: function (genIdx, idx,children, personId, fatherId, fatherIdx, motherId, motherIdx,fs,fe,pl) {



        var node = {
                            RecordLink: this.qd.fillQuestionData(personId,'test question','test answer','type 1'),
                            ChildCount: children.length,
                            ChildIdx: idx,
                            ChildIdxLst: [],
                            ChildLst: children,
                            DescendentCount: 0,
                            FatherId: '',
                            FatherIdx: fatherIdx,
                            GenerationIdx: genIdx,
                            Index: 0,
                            IsDisplayed: true,
                            IsFamilyEnd: fe,
                            IsFamilyStart: fs,
                            IsHtmlLink: false,
                            IsParentalLink: pl,
                            MotherId: '',
                            MotherIdx: motherIdx,
                            PersonId: personId,
                            RelationType: 0,
                            SpouseIdxLst: [],
                            SpouseIdLst: [],
                            X1: 0,
                            X2: 0,
                            Y1: 0,
                            Y2: 0,
                            zoom: 0
                        };


        return node;
    },

    GetGenerations: function (personId,newGeneration) {

        this.fill();

        var payload = {Generations : this._generations};

        newGeneration(payload);

    },

    processFile: function(file,progressFunction, newloader) {

        newloader([], 'life');
    },

    SetForAncLoader: function () {
        this.loader = new FakeData();

    },

    SetForDescLoader: function () {
        this.loader = new FakeData();
    }

};
