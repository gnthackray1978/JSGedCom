/** @constructor */
function SelectorWidget(gedPreLoader) {       
    this.gedPreLoader = gedPreLoader;
    this.loader = this.gedPreLoader.gedLoader;

    this.showGed = true;
    this.showMapControls = true;
    this.showDebug = true;
    this.showDataControls = true;
}



    SelectorWidget.prototype.newFileLoaded = function (treedate) {

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

            $.get('/JSGedCom/default.ged', function (contents) {
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
        
    };    
    SelectorWidget.prototype.NodeHovered = function (node) {

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

        $("#minimized_options").removeClass("hidePanel").addClass("displayPanel");
        
        // ok so click on the hide button to hide file options


        // click on the show to bring it back.

     //   var newTop = parseInt($('#ged_options').css('height')) + 30;

      //  $("#map_control").css('top', newTop + "px");
    //    $("#map_message").css('top', newTop + "px");


        $('#show_gedOptions').click(function (e) {

            if (this.showGed) {
                $("#ged_options").removeClass("hidePanel").addClass("displayPanel");
                this.showGed = false;
            } else {
                $("#ged_options").removeClass("displayPanel").addClass("hidePanel");
                this.showGed = true;
            }

       //     var newTop = parseInt($('#ged_options').css('height')) + 30;


      //      $("#map_control").css('top', newTop + "px");
        //    $("#map_message").css('top', newTop + "px");
        });

        $('#show_controls').click(function (e) {

            if (this.showMapControls) {
                $("#map_control").removeClass("hidePanel").addClass("displayPanel");
                this.showMapControls = false;
            } else {
                $("#map_control").removeClass("displayPanel").addClass("hidePanel");
                this.showMapControls = true;
            }
        });



        $('#show_debugbox').click(function (e) {

            if (this.showDebug) {
                $("#map_message").removeClass("hidePanel").addClass("displayPanel");
                this.showDebug = false;
            } else {
                $("#map_message").removeClass("displayPanel").addClass("hidePanel");
                this.showDebug = true;
            }
        });

        $('#show_databox').click(function (e) {

            if (this.showDataControls) {
                $("#edit_tools").removeClass("hidePanel").addClass("displayPanel");
                this.showDataControls = false;
            } else {
                $("#edit_tools").removeClass("displayPanel").addClass("hidePanel");
                this.showDataControls = true;
            }
        });       
    };



    SelectorWidget.prototype.showPersonSelectList = function (data, ancestorFunc) {


        var showPersons = function (data, ancestorFunc) {

            var from = $('#txtFrom').val().yearDate();
            var to = $('#txtTo').val().yearDate();
            var surname = $('#txtName').val();
            var tableBody = '';
            var _idx = 0;

            $.each(data, function (source, sourceInfo) {

                var birthYear = sourceInfo.BirthDate.yearDate() == 0 ? sourceInfo.BaptismDate.yearDate() : sourceInfo.BirthDate.yearDate();

                if ((birthYear >= from && birthYear < to) && ((sourceInfo.name.indexOf(surname) != -1) || surname == '') )
               
                    tableBody += '<tr><td><a class = "anc_class" id= "' + sourceInfo.id + '" href="" ><span>' + birthYear + ' ' + sourceInfo.name + '</span></a></td>';
             
                tableBody += '</tr>';


                _idx++;
            });

            $('#person_lookup_body').html(tableBody);

            $(".anc_class").off("click");
            $('.anc_class').click(function (e) {
                ancestorFunc(event.target.parentNode.id, event.target.outerText);
                e.preventDefault();
            });

        }
     
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


