


function AutoLoader(loader) {
    
    this.loader = loader;
    this.gedPreLoader = loader;
    
}


AutoLoader.prototype.GetDiagramType = function () {
    return 'desc_2';
};


AutoLoader.prototype.RunDiagClicked = function (personId, action) {
    action(personId);
};

AutoLoader.prototype.showSelectedPerson = function (id, name) {

    return id;
};

AutoLoader.prototype.InitPanelVisibility = function () {
    $("#ged_options").removeClass("displayPanel").addClass("hidePanel");
    $("#edit_tools").addClass("displayPanel").removeClass("hidePanel");
    $("#minimized_options").removeClass("displayPanel").addClass("hidePanel");
    
};

AutoLoader.prototype.newFileLoaded = function (treedate) {
    treedate();
};

AutoLoader.prototype.showPersonSelectList = function (data, ancestorFunc) {
    return data;
};