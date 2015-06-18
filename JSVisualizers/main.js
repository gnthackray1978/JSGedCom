
$(document).ready(function () {

    var diagMode = null;

    if (window.location.hash == '#test') {
        diagMode = new SimpleLoaderUI(new FakeData());
    } else {
        diagMode = new SelectorWidget(new GedPreLoader());
    }


    diagMode.InitPanelVisibility();

    diagMode.RunDiagClicked(0, function (id) {

        var treeRunner = null;
        var forceDirect = null;
        var selectedId = diagUI.diagUI;

        switch (diagMode.GetDiagramType()) {
            case 'anc':
                if (treeRunner != null)
                    treeRunner.CleanUp();
                treeRunner = new TreeRunner();
                treeRunner.run(selectedId, diagMode.loader, new AncTree());

                break;
            case 'desc_1':

                if (treeRunner != null)
                    treeRunner.CleanUp();
                treeRunner = new TreeRunner();
                treeRunner.run(selectedId, diagMode.loader, new DescTree());
                break;

            case 'desc_2':

                if (treeRunner != null)
                    treeRunner.CleanUp();

         
                forceDirect = new ForceDirect(colourScheme, diagMode.gedPreLoader);
                
                 
                var diagUI = new VisControlsUI();
                
                //when mouse up happens this gets executed
                diagUI.SetMouseDown(function(e) {                            
                    $.proxy(forceDirect.mouseDown(e), forceDirect);                            
                });
                
                diagUI.SetMouseUp(function (e) {
                    $.proxy(forceDirect.mouseUp(e), forceDirect);
                });

                diagUI.SetMouseMove(function (e) {
                    $.proxy(forceDirect.mouseMove(e), forceDirect);
                });

                diagUI.SetMouseDoubleClick(function (e) {
                    $.proxy(forceDirect.mouseDoubleClick(e), forceDirect);
                });
                                                                  
                diagUI.SetButtonDown(function (e) {
                    $.proxy(forceDirect.buttonDown(e), forceDirect);
                });

                diagUI.SetButtonUp(function (e) {
                    $.proxy(forceDirect.buttonUp(e), forceDirect);
                });

                forceDirect.HighLightedChanged(function(e) {
                    console.log('highlighted changed' + e);
                                            
                });
                
                forceDirect.SelectedChanged(function (e) {
                    console.log('selected changed' + e);
                    diagUI.NodeSelected(e);
                });
                
                diagUI.Save(function (recordLink) {
                    $.proxy(forceDirect.Save(recordLink), forceDirect);
                });

                diagUI.Add(function (recordLink) {
                    $.proxy(forceDirect.Add(recordLink), forceDirect);
                });

                diagUI.Delete(function () {
                    $.proxy(forceDirect.Delete(), forceDirect);
                });
                
                forceDirect.init(selectedId);
                

                break;

            default:
                //  code to be executed if n is different from case 1 and 2

                var g = new GedPreLoader(diagMode.loader);

                g.SearchFurthestAncestor('@I931@');// annie harmston


        }


    });

    diagMode.PersonClicked(function(id, name){
        diagMode.showSelectedPerson(id, name);
    });
    
    diagMode.newFileLoaded($.proxy(function (data) {
        var that = this; // this is selectorwidget context
        //receive the tree file here 
        that.loader.processFile(data,that.showGedLoading, function (families, persons) {
            if(persons == undefined || persons == null || persons.length ==0){
                that.showGedError("Could not obtain list of persons");
                return;
            }
            that.showGedContent();
            that.showPersonSelectList(persons);
        });
    }, diagMode));

 
});


 