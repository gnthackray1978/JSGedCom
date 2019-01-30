import {SimpleLoaderUI} from "./UI/SimpleLoaderUI.js";
import {ComplexLoaderUI} from "./UI/ComplexLoaderUI.js";
import {VisControlsUI} from "./UI/VisControlsUI.js";
import {FakeData} from "./DataLoader/FakeData.js";
import {GedPreLoader} from "./DataLoader/GedPreLoader.js";
import {TreeRunner} from "./Diagrams/Static/TreeRunner.js";
import {AncTree} from "./Diagrams/Static/AncTree.js";
import {DescTree} from "./Diagrams/Static/DescTree.js";

import {LayoutSettings} from "./Diagrams/CommonSettings/LayoutSettings.js";
import {ForceDirect} from "./Diagrams/ForceDirect.js";

import mitt from 'mitt';

$(document).ready(function () {

    let _graphLoaderUI = null;
    var channel;

  //var test = new ForceDirect();

    channel = mitt();


    if (window.location.hash == '#test') {
        _graphLoaderUI = new SimpleLoaderUI(new FakeData());
    } else {
        _graphLoaderUI = new ComplexLoaderUI(new GedPreLoader());//
    }


    _graphLoaderUI.InitPanelVisibility();

    _graphLoaderUI.RunDiagClicked( function (id) {


        var selectedId = id;

        switch (_graphLoaderUI.GetDiagramType()) {
            case 'anc':

                if(_graphLoaderUI.forceDirect)
                    _graphLoaderUI.forceDirect.kill();

                if (_graphLoaderUI.treeRunner != null)
                    _graphLoaderUI.treeRunner.CleanUp();

                _graphLoaderUI.treeRunner = new TreeRunner();
                _graphLoaderUI.treeRunner.run(selectedId, _graphLoaderUI.applicationGedLoader, new AncTree());

                break;
            case 'desc_1':

                if(_graphLoaderUI.forceDirect)
                    _graphLoaderUI.forceDirect.kill();


                if (_graphLoaderUI.treeRunner != null){
                    _graphLoaderUI.treeRunner.CleanUp();
                }

                _graphLoaderUI.treeRunner = new TreeRunner();

                _graphLoaderUI.treeRunner.run(selectedId, _graphLoaderUI.applicationGedLoader, new DescTree());
                break;

            case 'desc_2':

                if (_graphLoaderUI.treeRunner != null)
                    _graphLoaderUI.treeRunner.CleanUp();

                if(_graphLoaderUI.forceDirect)
                    _graphLoaderUI.forceDirect.kill();


                var settings = new LayoutSettings();

                var diagUI = new VisControlsUI(channel, settings);

                _graphLoaderUI.forceDirect = new ForceDirect(channel, settings, _graphLoaderUI.gedPreLoader);


                diagUI.InitEvents();



                _graphLoaderUI.forceDirect.init(selectedId, _graphLoaderUI.GetFDParams());


                break;

            default:
                //  code to be executed if n is different from case 1 and 2

                var g = new GedPreLoader(_graphLoaderUI.applicationGedLoader);

                g.SearchFurthestAncestor('@I931@');// annie harmston


        }


    });

    _graphLoaderUI.PersonClicked(function(id, name){
        _graphLoaderUI.showSelectedPerson(id, name);
    });

    _graphLoaderUI.newFileLoaded($.proxy(function (data) {
        var that = this; // this is selectorwidget context
        //receive the tree file here
        that.applicationGedLoader.processFile(data,that.showGedLoading, function (families, persons,range) {
            if(persons == undefined || persons == null || persons.length ==0){
                that.showGedError("Could not obtain list of persons");
                return;
            }
            that.showGedContent();
            that.showPersonSelectList(persons);
            that.setFDDefaults(Number(range.s)+50,5,3000);
        });
    }, _graphLoaderUI));


});
