/** @constructor */
function SelectorWidget(gedPreLoader) {       
    this.gedPreLoader = gedPreLoader;
    this.loader = this.gedPreLoader.gedLoader;
    this.defaultGed = '/basicvis/samples/default.txt';

    this.showGed = true;
    this.showMapControls = true;
    this.showDebug = true;
    this.showDataControls = true;
    this.dataLoader = true;
}


    SelectorWidget.prototype.showGedContent = function () {
        
        $("#ged-error").removeClass("displayPanel").addClass("hidePanel");
        $("#ged-loading").removeClass("displayPanel").addClass("hidePanel");
        $("#ged-content").removeClass("hidePanel").addClass("displayPanel");
        
        
    };
    SelectorWidget.prototype.showGedError = function (message) {
        
        $("#ged-content").removeClass("displayPanel").addClass("hidePanel");
        $("#ged-loading").removeClass("displayPanel").addClass("hidePanel");
        $("#ged-error").removeClass("hidePanel").addClass("displayPanel");
        
        
        $("#errormessage").html(message);
    };
    SelectorWidget.prototype.showGedLoading = function (message, show) {
        
      
        if(!show)
            $("#ged-loading").removeClass("displayPanel").addClass("hidePanel");
        else
            $("#ged-loading").removeClass("hidePanel").addClass("displayPanel");
            
        $("#loadingmessage").html(message);
   
        
    };
    
    SelectorWidget.prototype.newFileLoaded = function (treedate) {
        
        var that =this;
        
        var handleFileSelect = function(evt) {
            var files = evt.target.files; // FileList object
            // Loop through the FileList and render image files as thumbnails.
            for (var i = 0, f; f = files[i]; i++) {
                var reader = new FileReader();
                // Closure to capture the file information.
                reader.onload = (function(theFile) {
                    return function(e) {
                        // loader.processFile(e.target.result);

                        treedate(e.target.result);
                    };
                })(f);
                // Read in the image file as a data URL.
                reader.readAsText(f);
            }
        };
        
        $('#defaultFile').click(function (e) {

            $.get(that.defaultGed, function (contents) {
                treedate(contents);
            }, 'text');

            e.preventDefault();
        });


        document.getElementById('fileinput').addEventListener('change', handleFileSelect, false);
    };
    SelectorWidget.prototype.showSelectedPerson = function(id, name) {

        var selectedPerson = 'Selected Person: ' + id + ' ' + name;

        $('#selected_person').html(selectedPerson);

        return id;
    };    
    SelectorWidget.prototype.NodeSelected = function (node) {
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
    SelectorWidget.prototype.NodeHovered = function (node) {

    };
    SelectorWidget.prototype.ResetDraggedMasses = function (action) {

        //$('#myCanvas').dblclick(function (e) {

        //    action(e);

        //    e.preventDefault();
        //});

    };    
    SelectorWidget.prototype.SetMouseDoubleClick = function (action) {

        $('#myCanvas').dblclick(function (e) {

            action(e);

            e.preventDefault();
        });

    };   
    SelectorWidget.prototype.SetMouseDown = function (action) {

        $('#myCanvas').mousedown(function (e) {

            action(e);

            e.preventDefault();
        });
        
    };   
    SelectorWidget.prototype.SetMouseUp = function (action) {

        $('#myCanvas').mouseup(function (e) {

            action(e);

            e.preventDefault();
        });

    };    
    SelectorWidget.prototype.SetMouseMove = function (action) {

        $('#myCanvas').mousemove(function (e) {

            action(e);

            e.preventDefault();
        });

    };    
    SelectorWidget.prototype.SetButtonDown = function (action) {

        $(".button_box").mousedown(function (e) {

            action(e);

            e.preventDefault();
        });

    };
    SelectorWidget.prototype.SetButtonUp = function (action) {

        $(".button_box").mouseup(function (e) {

            action(e);

            e.preventDefault();
        });

    };    
    SelectorWidget.prototype.RunDiagClicked = function(personId, action) {
        $('#btnRunDiag').click(function(e) {

            action(personId);

            e.preventDefault();
        });
    };
    SelectorWidget.prototype.GetDiagramType = function() {
        return $("input[name='type_sel']:checked").val();
    };
    SelectorWidget.prototype.InitPanelVisibility = function() {


        var that = this;
        
        var panels = new Panels();
        

        $('body').on("click", "#chooseFileLnk", $.proxy(function () { panels.masterShowTab('1'); return false; }, panels));

        $('body').on("click", "#selectPersonLnk", $.proxy(function () { panels.masterShowTab('2'); return false; }, panels));
        

        $("#minimized_options").removeClass("hidePanel").addClass("displayPanel");
      
        $('#show_controls').click(function (e) {

            if (that.showMapControls) {
              //  $("#map_control").removeClass("hidePanel").addClass("displayPanel");
                
                $("#map_control").dialog();
                
          //   $(".ui-widget-header").css("border", "none" );
                //   $(".ui-widget-header").css("background", "none");
             
                 $(".ui-widget-header").css("height", "7px");
                
                 $(".ui-dialog-title").css("position", "absolute");
                 $(".ui-dialog-title").css("top", "0px");
                 $(".ui-dialog-title").css("left", "0px");
                
                 $('*[aria-describedby="map_control"]').css("width", "120px");
                 $('*[aria-describedby="map_control"]').css("height", "100px");
                
                that.showMapControls = false;
            } else {
             //   $("#map_control").removeClass("displayPanel").addClass("hidePanel");
                $("#map_control").dialog("close");
                that.showMapControls = true;
            }
        });

        $('#show_dataLoader').click(function (e) {



            if (that.dataLoader) {

                $("#dataLoader").dialog();

                that.dataLoader = false;

                $(".ui-widget-header").css("height", "7px");

                $(".ui-dialog-title").css("position", "absolute");
                $(".ui-dialog-title").css("top", "0px");
                $(".ui-dialog-title").css("left", "0px");
                
                $('*[aria-describedby="dataLoader"]').css("top", "90px");
                $('*[aria-describedby="dataLoader"]').css("left", "70px");
                $('*[aria-describedby="dataLoader"]').css("width", "350px");
              //  $('*[aria-describedby="dataLoader"]').css("height", "600px");
                
                $("#dataLoader").css("padding", "0px");

            } else {


                $("#dataLoader").dialog("close");
                that.dataLoader = true;
            }
        });

        $('#show_debugbox').click(function (e) {

         

             if (that.showDebug) {
            
                 $("#map_message").dialog();
                 
                 that.showDebug = false;
                 
                 $(".ui-widget-header").css("height", "7px");

                 $(".ui-dialog-title").css("position", "absolute");
                 $(".ui-dialog-title").css("top", "0px");
                 $(".ui-dialog-title").css("left", "0px");

                 $('*[aria-describedby="map_message"]').css("width", "120px");
                 $('*[aria-describedby="map_message"]').css("height", "140px");

            } else {
               

                 $("#map_message").dialog("close");
              that.showDebug = true;
            }
        });

        $('#show_databox').click(function (e) {

            if (that.showDataControls) {
                $("#dataInfo").dialog();

                $(".ui-widget-header").css("height", "7px");

                $(".ui-dialog-title").css("position", "absolute");
                $(".ui-dialog-title").css("top", "0px");
                $(".ui-dialog-title").css("left", "0px");

                $('*[aria-describedby="dataInfo"]').css("width", "250px");
             //   $('*[aria-describedby="dataInfo"]').css("height", "600px");

                $("#dataInfo").css("padding", "0px");
                
                //font-size: 1.1em; */
                that.showDataControls = false;
            } else {
              
                that.showDataControls = true;
            }
        });       
    };
    SelectorWidget.prototype.showPersonSelectList = function (data, ancestorFunc) {


        var showPersons = function(data, ancestorFunc) {

            var from = $('#txtFrom').val().yearDate();
            var to = $('#txtTo').val().yearDate();
            var surname = $('#txtName').val();
            var tableBody = '';
            var _idx = 0;

            $.each(data, function(source, sourceInfo) {

                var birthYear = sourceInfo.BirthDate.yearDate() == 0 ? sourceInfo.BaptismDate.yearDate() : sourceInfo.BirthDate.yearDate();

                if ((birthYear >= from && birthYear < to) && ((sourceInfo.name.indexOf(surname) != -1) || surname == ''))
                    tableBody += '<tr><td><a class = "anc_class" id= "' + sourceInfo.id + '" href="" ><span>' + birthYear + ' ' + sourceInfo.name + '</span></a></td>';

                tableBody += '</tr>';


                _idx++;
            });

            $('#person_lookup_body').html(tableBody);

            $(".anc_class").off("click");
            $('.anc_class').click(function(e) {
                ancestorFunc(event.target.parentNode.id, event.target.outerText);
                e.preventDefault();
                return false;
            });

        };
     
        $('#btnFilter').click(function (e) {
            
            showPersons(data, ancestorFunc);

            e.preventDefault();
        });
      

        showPersons(data, ancestorFunc);

        return 0;
        //$('.dec_class').click(function (e) {
        //    decendantFunc(e.target.parentNode.id);
        //    e.preventDefault();
        //});

        //$('.decfd_class').click(function (e) {
        //    decendantFunc2(e.target.parentNode.id);
        //    e.preventDefault();
        //});
    };

    SelectorWidget.prototype.Save = function (action) {

        var that = this;
        $('#saveNode').click(function (e) {

            
       
            action(that.PopulateRecordLink());
         
            e.preventDefault();
        });               
    };
    
    SelectorWidget.prototype.Add = function (action) {
        var that = this;
        $('#updateNode').click(function (e) {

      
            action(that.PopulateRecordLink());

            e.preventDefault();
        });
    };

    SelectorWidget.prototype.Delete = function (action) {
        var that = this;
        $('#deleteNode').click(function (e) {            
            action();
            e.preventDefault();
        });        
    };

    SelectorWidget.prototype.PopulateRecordLink = function () {


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

