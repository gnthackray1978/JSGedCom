
/*global TreeRunner*/
/*global SimpleLoaderUI*/
/*global FakeData*/
/*global ComplexLoaderUI*/
/*global GedPreLoader*/
/*global VisControlsUI*/

/*global postal*/

$(document).ready(function () {

    var diagMode = null;
    var channel;
    
    if(postal)
        channel = postal.channel(); 
     
    var _view = new View(channel);
    
    if (window.location.hash == '#test') {
        diagMode = new SimpleLoaderUI(new FakeData());
    } else {
        diagMode = new ComplexLoaderUI(new GedPreLoader());//
    }


    diagMode.InitPanelVisibility();

    diagMode.RunDiagClicked( function (id) {
        
        var that = diagMode;

        var selectedId = id;

        switch (that.GetDiagramType()) {
            case 'anc':
                
                if(that.forceDirect)
                    that.forceDirect.kill();
                
                if (that.treeRunner != null)
                    that.treeRunner.CleanUp();
                    
                that.treeRunner = new TreeRunner();
                that.treeRunner.run(selectedId, that.applicationGedLoader, new AncTree());

                break;
            case 'desc_1':
                
                if(that.forceDirect)
                    that.forceDirect.kill();
                
               
                if (that.treeRunner != null){
                    that.treeRunner.CleanUp();
                }
   
                that.treeRunner = new TreeRunner();
                
                that.treeRunner.run(selectedId, that.applicationGedLoader, new DescTree());
                break;

            case 'desc_2':

                if (that.treeRunner != null)
                    that.treeRunner.CleanUp();

                if(that.forceDirect)
                    that.forceDirect.kill();
                
                
                var diagUI = new VisControlsUI(channel);
                
                
                that.forceDirect = new ForceDirect(channel, colourScheme, that.gedPreLoader);
                
                 
                diagUI.InitEvents();
                
                
                // diagUI.Save(function (recordLink) {
                //     $.proxy(that.forceDirect.Save(recordLink), that.forceDirect);
                // });

                // diagUI.Add(function (recordLink) {
                //     $.proxy(that.forceDirect.Add(recordLink), that.forceDirect);
                // });

                // diagUI.Delete(function () {
                //     $.proxy(that.forceDirect.Delete(), that.forceDirect);
                // });
                
                
                
                that.forceDirect.HighLightedChanged(function(e) {
                    console.log('highlighted changed' + e);
                                            
                });
                
                that.forceDirect.SelectedChanged(function (e) {
                    console.log('selected changed' + e);
                    diagUI.NodeSelected(e);
                });
                
                
                
                that.forceDirect.init(selectedId, diagMode.GetFDParams());
                

                break;

            default:
                //  code to be executed if n is different from case 1 and 2

                var g = new GedPreLoader(diagMode.applicationGedLoader);

                g.SearchFurthestAncestor('@I931@');// annie harmston


        }


    });

    diagMode.PersonClicked(function(id, name){
        diagMode.showSelectedPerson(id, name);
    });
    
    diagMode.newFileLoaded($.proxy(function (data) {
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
    }, diagMode));

 
});


 