
$(document).ready(function () {


    var fileLoaded = function (data) {


        //selectorwidget must have loader

        var that = this; // this is selectorwidget context
        
        var selectedId = '';

        var descClick = function (id, name) {

            that.showSelectedPerson(id, name);

            selectedId = id;

        };


        //receive the tree file here 
        that.loader.processFile(data,that.showGedLoading, function (families, persons) {

            
            if(persons == undefined || persons == null || persons.length ==0){
                
                that.showGedError("Could not obtain list of persons");
                return;
            }

            that.showGedContent();

            selectedId = that.showPersonSelectList(persons, descClick);
 
            var treeRunner = null;
            var forceDirect = null;

            that.RunDiagClicked(0, function (id) {




                switch (that.GetDiagramType()) {
                    case 'anc':
                        if (treeRunner != null)
                            treeRunner.CleanUp();
                        treeRunner = new TreeRunner();
                        treeRunner.run(selectedId, that.loader, new AncTree());

                        break;
                    case 'desc_1':

                        if (treeRunner != null)
                            treeRunner.CleanUp();
                        treeRunner = new TreeRunner();
                        treeRunner.run(selectedId, that.loader, new DescTree());
                        break;

                    case 'desc_2':

                        if (treeRunner != null)
                            treeRunner.CleanUp();

                 
                        forceDirect = new ForceDirect(colourScheme, that.gedPreLoader);
                        
                        // the selection widget is trying to be independant of the diags


                        //when mouse up happens this gets executed
                        that.SetMouseDown(function(e) {                            
                            $.proxy(forceDirect.mouseDown(e), forceDirect);                            
                        });
                        
                        that.SetMouseUp(function (e) {
                            $.proxy(forceDirect.mouseUp(e), forceDirect);
                        });

                        that.SetMouseMove(function (e) {
                            $.proxy(forceDirect.mouseMove(e), forceDirect);
                        });

                        that.SetMouseDoubleClick(function (e) {
                            $.proxy(forceDirect.mouseDoubleClick(e), forceDirect);
                        });
                                                                          
                        that.SetButtonDown(function (e) {
                            $.proxy(forceDirect.buttonDown(e), forceDirect);
                        });

                        that.SetButtonUp(function (e) {
                            $.proxy(forceDirect.buttonUp(e), forceDirect);
                        });
 
                        forceDirect.HighLightedChanged(function(e) {
                            console.log('highlighted changed' + e);
                                                    
                        });
                        
                        forceDirect.SelectedChanged(function (e) {
                            console.log('selected changed' + e);
                            that.NodeSelected(e);
                        });
                        
                        that.Save(function (recordLink) {
                            $.proxy(forceDirect.Save(recordLink), forceDirect);
                        });

                        that.Add(function (recordLink) {
                            $.proxy(forceDirect.Add(recordLink), forceDirect);
                        });

                        that.Delete(function () {
                            $.proxy(forceDirect.Delete(), forceDirect);
                        });
                        
                        forceDirect.init(selectedId);
                        

                        break;

                    default:
                        //  code to be executed if n is different from case 1 and 2

                        var g = new GedPreLoader(that.loader);

                        g.SearchFurthestAncestor('@I931@');// annie harmston


                }


            });


        });

    };


    var diagMode = null;

    if (window.location.hash == '#test') {
        diagMode = new AutoLoader(new FakeData());
    } else {
        diagMode = new SelectorWidget(new GedPreLoader());
    }


    diagMode.InitPanelVisibility();

    diagMode.newFileLoaded($.proxy(fileLoaded, diagMode));

 
});


 