
function SimpleLoaderUI(loader) {
    
    this.loader = loader;
    this.gedPreLoader = loader;
    this.treeRunner = null;
}


SimpleLoaderUI.prototype.GetDiagramType = function () {
    return 'desc_2';
};


SimpleLoaderUI.prototype.RunDiagClicked = function (action) {
    action(0,this);
};

SimpleLoaderUI.prototype.showSelectedPerson = function (id, name) {

    return id;
};

SimpleLoaderUI.prototype.InitPanelVisibility = function () {
    $("#ged_options").removeClass("displayPanel").addClass("hidePanel");
    $("#edit_tools").addClass("displayPanel").removeClass("hidePanel");
    $("#minimized_options").removeClass("displayPanel").addClass("hidePanel");
    
};

SimpleLoaderUI.prototype.newFileLoaded = function (treedate) {
    treedate();
};

SimpleLoaderUI.prototype.showPersonSelectList = function (data, ancestorFunc) {
    return data;
};