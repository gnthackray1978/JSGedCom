import {SimpleLoaderUI} from "./UI/SimpleLoaderUI.js";
import {ComplexLoaderUI} from "./UI/ComplexLoaderUI.js";
import {VisControlsUI} from "./UI/VisControlsUI.js";
import {FakeData} from "./DataLoader/FakeData.js";
import {DescGraphCreator} from "./DataLoader/DescGraphCreator.js";
import {TreeRunner} from "./Diagrams/Static/TreeRunner.js";
import {AncTree} from "./Diagrams/Static/AncTree.js";
import {DescTree} from "./Diagrams/Static/DescTree.js";

import {LayoutSettings} from "./Diagrams/CommonSettings/LayoutSettings.js";
import {ForceDirect} from "./Diagrams/ForceDirect.js";
import {GedLib} from "./DataLoader/GedLib.js";
import {AncGraphCreator} from "./DataLoader/AncGraphCreator.js";
import {TreeUI} from "./Diagrams/Static/TreeUI.js";

import mitt from 'mitt';

$(document).ready(function () {

    let _graphLoaderUI = null;
    var channel;

    let _forceDirect = null;
    const _applicationGedLoader = new GedLib();

    channel = mitt();
    let _treeRunner = new TreeRunner();

    _graphLoaderUI = new ComplexLoaderUI();//

    _graphLoaderUI.InitPanelVisibility();

    _graphLoaderUI.RunDiagClicked( function (id) {

        if(id ==0) return;


        var selectedId = id;

        const dispose =()=>{
          if(_forceDirect)
              _forceDirect.kill();
        };
        let loader;
        let treeUI = new TreeUI();

        switch (_graphLoaderUI.GetDiagramType()) {
            case 'anc':

                dispose();

                loader = new AncGraphCreator(_applicationGedLoader.families,_applicationGedLoader.persons);

                loader.GetGenerations(selectedId,function(data){
                  treeUI.Init(1, (instance)=>{
                    TreeUI.WireUp(_treeRunner);
                    _treeRunner.run(selectedId,data, new AncTree(),treeUI);
                  });
                });

                break;
            case 'desc_1':

                dispose();

                loader = new DescGraphCreator(_applicationGedLoader.families,_applicationGedLoader.persons);

                loader.GetGenerations(selectedId,function(data){
                 treeUI.Init(0, (instance)=>{
                    TreeUI.WireUp(_treeRunner);
                    _treeRunner.run(selectedId,data, new DescTree(),treeUI);
                  });
                });


                break;

            case 'desc_2':

                dispose();


                var settings = new LayoutSettings();

                var diagUI = new VisControlsUI(channel, settings);

                let gedPreLoader = new DescGraphCreator(_applicationGedLoader.families,_applicationGedLoader.persons);

                _forceDirect = new ForceDirect(channel, settings, gedPreLoader);


                diagUI.InitEvents();



                _forceDirect.init(selectedId, _graphLoaderUI.GetFDParams());


                break;

            default:
                //  code to be executed if n is different from case 1 and 2

                var g = new DescGraphCreator(_applicationGedLoader);

                g.SearchFurthestAncestor('@I931@');// annie harmston


        }


    });

    _graphLoaderUI.PersonClicked(function(id, name){
        _graphLoaderUI.showSelectedPerson(id, name);
    });

    _graphLoaderUI.newFileLoaded(function (data) {

        _applicationGedLoader.processFile(data,_graphLoaderUI.showGedLoading,
          function (families, persons,range) {

            _graphLoaderUI.dataParseComplete(persons,range);
        });
    });


});
