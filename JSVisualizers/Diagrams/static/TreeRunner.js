
import {AncTree} from "./AncTree.js";
import {DescTree} from "./DescTree.js";
import {TreeUI} from "./TreeUI.js";

export class TreeRunner {

    constructor(){
      this._tree = null;
      this._UILoaded =true;// not currently used by intended to be set when ui had finished loading

      this.treeUI = null;
      this._moustQueue = [];
      this._mouseDown = false;

      this.kill  = false;
      this._moveTimer=0;
      this._gameLoopTimer =0;
    }

    get validtree() {
       if(this._tree == null || this._tree == undefined) return false;
       if(!this._UILoaded) return false;

       return true;
    }

    movebuttondown(_dir){

      if(!this.validtree) return;

      this._moveTimer = setInterval( () =>{ this._tree.MoveTree(_dir); }, 100);
    }
    movebuttonup(){
      if(!this.validtree) return;

      clearInterval(this._moveTimer);
    }

    canvasmousedown(){
      if(!this.validtree) return;

      this._mouseDown = true;
    }

    canvasmouseup(){
      if(!this.validtree) return;

      this._mouseDown = false;

      var _point = new Array(1000000, 1000000);
      this._moustQueue[this._moustQueue.length] = _point;
    }

    canvasclick(clientX , boundingrecleft, clientY , boundingrectop){

         if(!this.validtree) return;

          this._tree.PerformClick(clientX- boundingrecleft, clientY - boundingrectop);

          this._tree.UpdateGenerationState();

          if (this._tree.bt_refreshData) {
              getData(this._tree.selectedPersonId, this._tree.selectedPersonX, this._tree.selectedPersonY);
          }

          this._moustQueue[this._moustQueue.length] = new Array(1000000, 1000000);

    }

    canvasmove(clientX , boundingrecleft, clientY , boundingrectop){

         if(!this.validtree) return;

          var _point = new Array(clientX - boundingrecleft, clientY- boundingrectop);

          this._tree.SetMouse(_point[0], _point[1]);
          if (this._mouseDown) {
              this._moustQueue.push(_point);
          }

    }


    run(id, data,tree, ui){

      this.treeUI =ui; //= new TreeUI(type == 'anc' ? 1:0, $.proxy(function (treeUI) {
      this._tree = tree;
      clearTimeout(this._gameLoopTimer);
      this._gameLoopTimer = setTimeout($.proxy(this.GameLoop, this), 1000 / 50);
      this.processData(id,data,ui);
    }

    processData (id,data, UI) {

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
    }

    CleanUp () {

        $("#myCanvas").unbind();
        $(".button_box").unbind();
        this._tree = undefined;
        this.kill = true;
    }

    GameLoop () {

        while (this._moustQueue.length > 0) {
            var _point = this._moustQueue.shift();


            this._tree.SetCentrePoint(_point[0], _point[1]);
            this._tree.DrawTree();
        }

        if(!this.kill)
            setTimeout($.proxy(this.GameLoop, this));
    }

}
