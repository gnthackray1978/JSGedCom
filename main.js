


$(document).ready(function () {






    var selector = new SelectorWidget();

    selector.InitPanelVisibility();

    selector.newFileLoaded($.proxy(function (data) {

        var loader = new DataLoader.GedLoader();

        var that = this;
        var selectedId = '';

        var descClick = function(id,name) {
            
            that.showSelectedPerson(id, name);

            selectedId = id;

        };
 
        loader.processFile(data, function (families, persons) {

            var selectedPersonId = that.showPersonSelectList(persons, descClick);

        //    var gedPreLoader = new GedPreLoader(loader);

        //   // gedPreLoader.GetGenerations('@I4@');
           // var ancTreeDiag = null;
            var treeRunner = null;
            var forceDirect = null;               
           
            that.RunDiagClicked(selectedPersonId, function (id) {
                            
                


                switch(that.GetDiagramType())
                {
                    case 'anc':
                        if (treeRunner != null)
                            treeRunner.CleanUp();
                        treeRunner = new TreeRunner();
                        treeRunner.run(selectedId,loader,new AncTree());

                        break;
                    case 'desc_1':

                        if (treeRunner != null)
                            treeRunner.CleanUp();
                        treeRunner = new TreeRunner();
                        treeRunner.run(selectedId, loader, new DescTree());
                        break;

                    case 'desc_2':
                        forceDirect = new ForceDirect(loader);
                        forceDirect.init(selectedId);
                        break;

                    default:
                        //  code to be executed if n is different from case 1 and 2

                        var g = new GedPreLoader(loader);

                        g.SearchFurthestAncestor('@I931@');// annie harmston
                        

                }
               

            });

            
        });




      
      //  loader.processFile(data, function (families, persons) {

          //  var selectedPersonId = that.showPersonSelectList(persons, descClick);

     //       var gedPreLoader = new GedAncPreLoader(loader);

            //gedPreLoader.GetGenerations('@I1@');


        //    var ancTreeDiag = new AncTreeDiag(new GedAncPreLoader(loader));
        //    ancTreeDiag.run('@I1@');

             // that.RunDiagClicked(selectedPersonId, function (id) {
            //
              //    var ancTreeDiag = new AncTreeDiag(new GedAncPreLoader(loader));
             //     ancTreeDiag.run('@I1@');
              //  });

      //  });





    }, selector));

   

    

 
    
    //loader.processFile(tpFile());



});






function tpFile() {
    return $('#myfile').val();

}

