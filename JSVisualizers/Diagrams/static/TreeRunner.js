
var JSMaster, AncTree, Tree;




var TreeRunner = function () {
    this._tree = null;
    this.ancUtils = new AncUtils();
    this.treeUI = null;
    this._moustQueue = [];
    this._mouseDown = false;
    

};

TreeRunner.prototype = {
    run: function (id,applicationGedLoader, tree) {
     
            var type = $("input[name='type_sel']:checked").val();
        
            this.treeUI = new TreeUI(type == 'anc' ? 1:0, $.proxy(function (treeUI) {

            
            
            var int;
       
            var that = this;
            this._tree = tree;
            
            this.applicationGedLoader = applicationGedLoader;
        
            this._tree.selectedPersonId = id;
            this._tree.selectedPersonX = 0;
            this._tree.selectedPersonY = 0;


            var getData = function (context,personId,x,y) {
                


                if (type == 'anc') {
                    context._tree = new AncTree();
                    context._tree.treeUI = treeUI;
                    context.applicationGedLoader.SetForAncLoader();
                } else {
                    context._tree = new DescTree();
                    context._tree.treeUI = treeUI;
                    context.applicationGedLoader.SetForDescLoader();
                }

                context._tree.selectedPersonY = y;
                context._tree.selectedPersonX = x;
                context._tree.selectedPersonId = personId;

                context.applicationGedLoader.GetGenerations(personId, $.proxy(context.processData, context));

            };


            $(".button_box").mousedown(function (evt) {
                var _dir = '';

                if (evt.target.id == "up") _dir = 'UP';
                if (evt.target.id == "dn") _dir = 'DOWN';
                if (evt.target.id == "we") _dir = 'WEST';
                if (evt.target.id == "no") _dir = 'NORTH';
                if (evt.target.id == "es") _dir = 'EAST';
                if (evt.target.id == "so") _dir = 'SOUTH';
                if (evt.target.id == "de") _dir = 'DEBUG';

                if (that._tree !== null) {
                    int = setInterval(function () { that._tree.MoveTree(_dir); }, 100);
                }

            }).mouseup(function () {
                clearInterval(int);
            });


            setTimeout($.proxy(this.GameLoop, this), 1000 / 50);

            $("#myCanvas").mousedown(function (evt) {
                evt.preventDefault();
                if (that._tree !== null) {
                    evt.originalEvent.preventDefault();
                    that._mouseDown = true;
                }
            });

            $("#myCanvas").mouseup(function (evt) {
                evt.preventDefault();
                if (that._tree !== null) {
                    that._mouseDown = false;

                    var _point = new Array(1000000, 1000000);
                    that._moustQueue[that._moustQueue.length] = _point;

                }
            });

            $("#myCanvas").click(function (evt) {
                if (that._tree !== null) {
                
                    var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();
 
                    that._tree.PerformClick(evt.clientX - boundingrec.left, evt.clientY - boundingrec.top);
                
                    that._tree.UpdateGenerationState();

                    if (that._tree.refreshData) {                    
                        getData(that, that._tree.selectedPersonId, that._tree.selectedPersonX, that._tree.selectedPersonY);                    
                    }
            

                    that._moustQueue[that._moustQueue.length] = new Array(1000000, 1000000);
                }
            });
            
            $("#myCanvas").mousemove(function (evt) {
                if (that._tree !== null) {
                
                    var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();

                    var _point = new Array(evt.clientX - boundingrec.left, evt.clientY - boundingrec.top);
                
                    that._tree.SetMouse(_point[0], _point[1]);
                    if (that._mouseDown) {
                        that._moustQueue.push(_point);
                    }
                }
            });

            $("#ml .message").html('<span>Downloading Descendant Tree</span>');

            getData(this, this._tree.selectedPersonId, 0, 0);
        
        }, this));


    },
    processData: function (data) {


       
        var _zoomLevel = 100; 



        this._tree.SetInitialValues(Number(_zoomLevel), 30.0, 170.0, 70.0, 70.0, 100.0, 20.0, 40.0, 20.0, screen.width, screen.height);

        //    var _personId = '913501a6-1216-4764-be8c-ae11fd3a0a8b';
        //    var _zoomLevel = 100;
        //    var _xpos = 750.0;
        //    var _ypos = 100.0;

        this._tree.generations = data.Generations;

        
        
        this._tree.UpdateGenerationState();

        this._tree.RelocateToSelectedPerson();
         
        this._tree.refreshData = false;
    },

    CleanUp: function () {

        $("#myCanvas").unbind();
        $(".button_box").unbind();

        this._tree.generations = null;
        this.applicationGedLoader.RefreshData();
        this._tree.familySpanLines = null;
        this._tree.childlessMarriages = null;
    },

    GameLoop: function () {

        while (this._moustQueue.length > 0) {
            var _point = this._moustQueue.shift();


            this._tree.SetCentrePoint(_point[0], _point[1]);
            this._tree.DrawTree();
        }

        setTimeout($.proxy(this.GameLoop, this));
    }

};












