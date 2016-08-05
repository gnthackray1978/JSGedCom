function VisControlsUI(channel) {       
    this._channel = channel;
}




VisControlsUI.prototype.InitEvents = function () {
    var that = this;
    
    $('#saveNode').click(function (e) {
        //action(that.PopulateRecordLink());
        
        that._channel.publish( "requestSave", { value: undefined } );
        
        e.preventDefault();
    });  
    
    $('#deleteNode').click(function (e) {            
        that._channel.publish( "requestDelete", { value: undefined } );
        e.preventDefault();
    });  
    
    
    $('#updateNode').click(function (e) {
        //action(that.PopulateRecordLink());
        
        that._channel.publish( "requestAdd", { value: that.PopulateRecordLink() } );
        
        e.preventDefault();
    });
    
    $('#myCanvas').dblclick(function (e) {
        that._channel.publish( "mouseDoubleClick", { value: e } );
        e.preventDefault();
    });
    
    $('#myCanvas').mousedown(function (e) {
        that._channel.publish( "mouseDown", { value: e } );
        e.preventDefault();
    });
    
    $('#myCanvas').mouseup(function (e) {
        that._channel.publish( "mouseUp", { value: e } );
        e.preventDefault();
    });
    
    $('#myCanvas').mousemove(function (e) {
        that._channel.publish( "mouseMove", { value: e } );
        e.preventDefault();
    });
    
    $(".button_box").mousedown(function (e) {
        that._channel.publish( "buttondown", { value: e } );
        e.preventDefault();
    });
    
    $(".button_box").mouseup(function (e) {
        that._channel.publish( "buttonup", { value: e } );
        e.preventDefault();
    });
    
    
    this.channel.subscribe("nodeSelected", function(data, envelope) {
        console.log('ui node selected caught');
        that.NodeSelected(data.value);
    });
    
    this.channel.subscribe("nodeHighlighted", function(data, envelope) {
        console.log('ui node highlighted event caught');
    });
};





VisControlsUI.prototype.NodeSelected = function (node) {
    //hidPersonId
    $('#hidPersonId').val(node.PersonId);
    $('#txtCName').val(node.FirstName);
    $('#txtSurname').val(node.Surname);
    $('#txtBirYear').val(node.BirthDate);
    $('#txtBapDate').val(node.BaptismDate);
    $('#txtBLocation').val(node.BirthLocation);
    $('#txtDYear').val(node.DOD);
    $('#txtDLocation').val(node.DeathLocation);
    $('#txtOccupationDate').val(node.OccupationDate);
    $('#txtOccupationPlace').val(node.OccupationPlace);
    $('#txtOccupationDesc').val(node.Occupation);
        

        //
        //Object {DOB: 1670, BirthDate: "BEF 1670", BaptismDate: "", DOD: "", DeathLocation: ""…}

        //BaptismDate: ""
        //BirthDate: "BEF 1670"

        //BirthLocation: ""                            
        //DOB: 1670

        //DOD: ""
        //DeathLocation: ""
        //FirstName: "William "              
        //Occupation: ""
        //OccupationDate: ""
        //OccupationPlace: ""
        //Surname: "Thackray"


        //Name: "William Thackray"
        //__proto__: Object
    };    
    
VisControlsUI.prototype.NodeHovered = function (node) {

};
    
VisControlsUI.prototype.PopulateRecordLink = function () {
    var node = new Bio();
    node.PersonId = $('#hidPersonId').val();        
    node.FirstName= $('#txtCName').val();
    node.Surname= $('#txtSurname').val();
    node.BirthDate= $('#txtBirYear').val();
    node.BaptismDate= $('#txtBapDate').val();
    node.BirthLocation= $('#txtBLocation').val();
    node.DOD= $('#txtDYear').val();
    node.DeathLocation= $('#txtDLocation').val();
    node.OccupationDate= $('#txtOccupationDate').val();
    node.OccupationPlace= $('#txtOccupationPlace').val();
    node.Occupation= $('#txtOccupationDesc').val();
    return node;
};