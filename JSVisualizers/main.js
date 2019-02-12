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

import mitt from 'mitt';

$(document).ready(function () {

    let _graphLoaderUI = null;
    var channel;
    let _treeRunner =null ;
    let _forceDirect = null;
    const _applicationGedLoader = new GedLib();
  //var test = new ForceDirect();

    channel = mitt();


  //  if (window.location.hash == '#test') {
    //    _graphLoaderUI = new SimpleLoaderUI(new FakeData());
  //  } else {
        _graphLoaderUI = new ComplexLoaderUI();//
  //  }


    _graphLoaderUI.InitPanelVisibility();

    _graphLoaderUI.RunDiagClicked( function (id) {

        if(id ==0) return;


        var selectedId = id;

        const dispose =()=>{
          if(_forceDirect)
              _forceDirect.kill();

          if (_treeRunner!= null)
              _treeRunner.CleanUp();
        };
        let loader;

        switch (_graphLoaderUI.GetDiagramType()) {
            case 'anc':

                dispose();

                loader = new AncGraphCreator(_applicationGedLoader.families,_applicationGedLoader.persons);

                loader.GetGenerations(selectedId,function(data){
                  _treeRunner = new TreeRunner();
                  _treeRunner.run(selectedId,data, new AncTree());
                });

                break;
            case 'desc_1':

                dispose();

                loader = new DescGraphCreator(_applicationGedLoader.families,_applicationGedLoader.persons);

                loader.GetGenerations(selectedId,function(data){
                  _treeRunner = new TreeRunner();
                  _treeRunner.run(selectedId,data, new DescTree());
                });


                break;

            case 'desc_2':

                dispose();


                var settings = new LayoutSettings();

                var diagUI = new VisControlsUI(channel, settings);

                let gedPreLoader = new DescGraphCreator(_applicationGedLoader);

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
