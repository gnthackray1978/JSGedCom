


$(document).ready(function () {


    var fileLoaded = function (data) {


        //svar loader = new DataLoader.GedLoader();

        var that = this;
        var selectedId = '';

        var descClick = function (id, name) {

            that.showSelectedPerson(id, name);

            selectedId = id;

        };


        //receive the tree file here 
        that.loader.processFile(data, function (families, persons) {

            selectedId = that.showPersonSelectList(persons, descClick);

            //    var gedPreLoader = new GedPreLoader(loader);

            //   // gedPreLoader.GetGenerations('@I4@');
            // var ancTreeDiag = null;
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

                        // forceDirect = new ForceDirect(new GedPreLoader(that.loader));
                        forceDirect = new ForceDirect(that.gedPreLoader);
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


    var selector = new SelectorWidget();

    selector.InitPanelVisibility();
    
    selector.loader = new DataLoader.GedLoader();
    selector.gedPreLoader = new GedPreLoader(selector.loader);
    selector.newFileLoaded($.proxy(fileLoaded, selector));
  
    //var autoLoader = new AutoLoader();

    //autoLoader.InitPanelVisibility();

    //autoLoader.loader = new FakeData();

    //autoLoader.gedPreLoader = new FakeData();

    //autoLoader.newFileLoaded($.proxy(fileLoaded, autoLoader));

    
});






function tpFile() {
    return $('#myfile').val();

}






function AutoLoader() {}


AutoLoader.prototype.GetDiagramType = function() {
    return 'desc_2';
};


AutoLoader.prototype.RunDiagClicked = function(personId, action) {
    action(personId);         
};

AutoLoader.prototype.showSelectedPerson = function (id, name) {
 
    return id;
};

AutoLoader.prototype.InitPanelVisibility = function() {
    $("#selection_container").removeClass("displayPanel").addClass("hidePanel");
    $("#minimized_options").removeClass("hidePanel").addClass("displayPanel");
};

AutoLoader.prototype.newFileLoaded = function (treedate) {
    treedate();       
};

AutoLoader.prototype.showPersonSelectList = function (data, ancestorFunc) {
    return data;
};