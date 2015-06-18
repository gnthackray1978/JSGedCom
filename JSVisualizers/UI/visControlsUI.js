function VisControlsUI() {       

}

VisControlsUI.prototype.Save = function (action) {
    var that = this;
    $('#saveNode').click(function (e) {
        action(that.PopulateRecordLink());
        e.preventDefault();
    });               
};

VisControlsUI.prototype.Add = function (action) {
    var that = this;
    $('#updateNode').click(function (e) {
        action(that.PopulateRecordLink());
        e.preventDefault();
    });
};

VisControlsUI.prototype.Delete = function (action) {
    var that = this;
    $('#deleteNode').click(function (e) {            
        action();
        e.preventDefault();
    });        
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

VisControlsUI.prototype.SetMouseDoubleClick = function (action) {
    $('#myCanvas').dblclick(function (e) {
        action(e);
        e.preventDefault();
    });
}; 
    
VisControlsUI.prototype.SetMouseDown = function (action) {
    $('#myCanvas').mousedown(function (e) {
        action(e);
        e.preventDefault();
    });
};

VisControlsUI.prototype.SetMouseUp = function (action) {
    $('#myCanvas').mouseup(function (e) {
        action(e);
        e.preventDefault();
    });
}; 
    
VisControlsUI.prototype.SetMouseMove = function (action) {
    $('#myCanvas').mousemove(function (e) {
        action(e);
        e.preventDefault();
    });
}; 
    
VisControlsUI.prototype.SetButtonDown = function (action) {
    $(".button_box").mousedown(function (e) {
        action(e);
        e.preventDefault();
    });
};
    
VisControlsUI.prototype.SetButtonUp = function (action) {
    $(".button_box").mouseup(function (e) {
        action(e);
        e.preventDefault();
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
    
VisControlsUI.prototype.ResetDraggedMasses = function (action) {

        //$('#myCanvas').dblclick(function (e) {

        //    action(e);

        //    e.preventDefault();
        //});

};    
    