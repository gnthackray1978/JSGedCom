
import {AncTree} from "./AncTree.js";
import {DescTree} from "./DescTree.js";
import {TreeUI} from "./TreeUI.js";

export function TreeRunner() {
    this._tree = null;

    this.treeUI = null;
    this._moustQueue = [];
    this._mouseDown = false;

    this.kill  = false;
}

TreeRunner.prototype = {
    run: function (id, data,tree) {

            var type = $("input[name='type_sel']:checked").val();

            this.treeUI = new TreeUI(type == 'anc' ? 1:0, $.proxy(function (treeUI) {

            var int;

            var that = this;
            this._tree = tree;

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

                    if (that._tree.bt_refreshData) {
                        getData(that._tree.selectedPersonId, that._tree.selectedPersonX, that._tree.selectedPersonY);
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


            this.processData(id,data,treeUI);
        }, this));


    },
    processData: function (id,data, UI) {

        var _zoomLevel = 100;

        this._tree.selectedPersonId = id;
        this._tree.selectedPersonX = 0;
        this._tree.selectedPersonY = 0;

        this._tree.SetInitialValues(Number(_zoomLevel), 30.0, 170.0, 70.0, 70.0, 100.0, 20.0, 40.0, 20.0, screen.width, screen.height);

        //    var _personId = '913501a6-1216-4764-be8c-ae11fd3a0a8b';
        //    var _zoomLevel = 100;
        //    var _xpos = 750.0;
        //    var _ypos = 100.0;
        this._tree.treeUI = UI;

        this._tree.generations = data.Generations;

        this._tree.UpdateGenerationState();

        this._tree.RelocateToSelectedPerson();

        this._tree.bt_refreshData = false;
    },

    CleanUp: function () {

        $("#myCanvas").unbind();
        $(".button_box").unbind();
        this._tree = undefined;
        this.kill = true;
    },

    GameLoop: function () {

        while (this._moustQueue.length > 0) {
            var _point = this._moustQueue.shift();


            this._tree.SetCentrePoint(_point[0], _point[1]);
            this._tree.DrawTree();
        }

        if(!this.kill)
            setTimeout($.proxy(this.GameLoop, this));
    }

};
