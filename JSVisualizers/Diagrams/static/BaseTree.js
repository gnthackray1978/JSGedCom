


var TreeBase = function () {

    this.qryString = '';
    this.refreshData =false;
    this.screenHeight = 0.0;
    this.screenWidth = 0.0;

    this.buttonLinks = [];
    this.links = [];

    this.inLink = false;

    this.generations = [];
  //  this.familiesPerGeneration = [];
    this.familySpanLines = [];
    this.childlessMarriages = [];

    this.centrePoint = 750.0;
    this.centreVerticalPoint = 0.0;
    this.zoomLevel = 0.0;
    this.centrePointXOffset = 0.0;
    this.centrePointYOffset = 0.0;

    this.original_distanceBetweenBoxs = 0.0;
    this.original_distanceBetweenGens = 0.0;
    this.original_boxWidth = 0.0;
    this.original_boxHeight = 0.0;
    this.original_distancesbetfam = 0.0;
    this.original_lowerStalkHeight = 0.0;

    this.original_middleSpan = 40.0;
    this.original_topSpan = 20.0;



    this.zoomPercentage = 0.0;
    this.distanceBetweenBoxs = 0.0;
    this.distanceBetweenGens = 0.0;
    this.halfBox = 0.0;
    this.halfBoxHeight = 0.0;


    this.mouse_x = 0; //int
    this.mouse_y = 0; //int

//    this.initial_mouse_x = 0; //int
//    this.initial_mouse_y = 0; //int


  //  this.xFromCentre = 0.0;
  //  this.yFromCentre = 0.0;

    this.drawingX1 = 0.0;
    this.drawingX2 = 0.0;
    this.drawingY1 = 0.0;
    this.drawingY2 = 0.0;

    this.drawingCentre = 0.0;
    this.drawingWidth = 0.0;
    this.drawingHeight = 0.0;

    this.mouseXPercLocat = 0.0;
    this.mouseYPercLocat = 0.0;

    this.zoomAmount = 8; //int

    this.boxWidth = 0.0;
    this.boxHeight = 0.0;
    this.sourceId = null;


    this.selectedPersonId = '';
    this.selectedPersonX = 0;
    this.selectedPersonY = 0;
    this.treeUI;

};

TreeBase.prototype = {

    SetInitialValues: function (zoomPerc,
                                    dist_bet_box,
                                    dist_bet_gen,
                                    box_wid,
                                    box_hig,
                                    dist_bet_fam,
                                    low_stalk_hi,
                                    mid_span,
                                    top_span,
                                    screen_width,
                                    screen_height
                                    ) {

        this.centrePoint = 750.0;
        this.centreVerticalPoint = 0.0;
        this.zoomLevel = 0.0;
        this.centrePointXOffset = 0.0;
        this.centrePointYOffset = 0.0;
        this.mouse_x = 0; //int
        this.mouse_y = 0; //int
        this.mouseXPercLocat = 0.0;
        this.mouseYPercLocat = 0.0;




        this.screenHeight = screen_height;
        this.screenWidth = screen_width;

        this.zoomPercentage = zoomPerc;
        this.original_distanceBetweenBoxs = dist_bet_box;
        this.original_distanceBetweenGens = dist_bet_gen;
        this.original_boxWidth = box_wid;
        this.original_boxHeight = box_hig;
        this.original_distancesbetfam = dist_bet_fam;
        this.original_lowerStalkHeight = low_stalk_hi;
        this.original_middleSpan = mid_span;
        this.original_topSpan = top_span;


        this.distanceBetweenBoxs = this.original_distanceBetweenBoxs;
        this.distanceBetweenGens = this.original_distanceBetweenGens;
        this.boxWidth = this.original_boxWidth;
        this.boxHeight = this.original_boxHeight;
        this.distancesbetfam = this.original_distancesbetfam;
        this.halfBox = this.boxWidth / 2;
        this.halfBoxHeight = this.boxHeight / 2;

        this.lowerSpan = this.original_lowerStalkHeight;

        this.middleSpan = this.original_middleSpan;

        this.topSpan = this.original_topSpan;
        



    },
    GetTreePerson: function (personId) {

        var _genidx = 0;
        var _personIdx = 0;

        while (_genidx < this.generations.length) {
            _personIdx = 0;

            while (_personIdx < this.generations[_genidx].length) {

                if (this.generations[_genidx][_personIdx].PersonId == personId) {
                    return this.generations[_genidx][_personIdx];
                }
                _personIdx++;
            }
            _genidx++;
        }

        return null;
    },
    SetVisibility: function (parent, isDisplay) {

        var personStack = [];
        var _genidx = 0;


        if (this.generations.length > parent.GenerationIdx) {
            _genidx = 0;
            while (_genidx < this.generations[parent.GenerationIdx].length) {
                // find all the children of the parent

              
                if (this.generations[parent.GenerationIdx][_genidx].FatherId == parent.PersonId ||
                        this.generations[parent.GenerationIdx][_genidx].MotherId == parent.PersonId) {

                    personStack.push(this.generations[parent.GenerationIdx][_genidx]);
                }

                _genidx++;
            }
        }

        var currentTP = parent;
        while (personStack.length > 0) {
            currentTP = personStack.pop();
            currentTP.IsDisplayed = isDisplay;

            var spouseIdx = 0;
            while (spouseIdx < currentTP.SpouseIdxLst.length) {
                var spIdx = currentTP.SpouseIdxLst[spouseIdx];

                this.generations[currentTP.GenerationIdx-1][spIdx].IsDisplayed = isDisplay;
                spouseIdx++;
            }

            if (this.generations.length > currentTP.GenerationIdx + 1) {
                _genidx = 0;
                while (_genidx < this.generations[currentTP.GenerationIdx].length) {
                    // find all the children of the currently selected generation

                    if (this.generations[currentTP.GenerationIdx][_genidx].FatherId == currentTP.PersonId || this.generations[currentTP.GenerationIdx][_genidx].MotherId == currentTP.PersonId) {
                        personStack.push(this.generations[currentTP.GenerationIdx][_genidx]);
                    }

                    _genidx++;
                }
            }
        }


    },
    MoveTree: function (direction) {
        // console.log('move tree' + direction);

        if (direction == 'SOUTH') this.centreVerticalPoint -= 1;
        if (direction == 'NORTH') this.centreVerticalPoint += 1;
        if (direction == 'EAST') this.centrePoint += 1;
        if (direction == 'WEST') this.centrePoint -= 1;


        if (direction == 'UP' || direction == 'DOWN') {

            var x = this.screenWidth / 2;
            var y = this.screenHeight / 2;

            this.SetMouse(x, y);


            this.SetZoomStart();

            this.SetCentrePoint(1000000, 1000000);


            if (direction == 'UP') {
                this.ZoomIn();
            }
            else {
                this.ZoomOut();
            }


        }
        else {
            this.DrawTree();
        }

    },
    SetZoom: function (percentage) {


        if (percentage !== 0.0) {
            var _workingtp = 0.0;
            var _percLocal_x = 0.0;
            var _percLocal_y = 0.0;

            //zoom drawing components 
            this.zoomPercentage += percentage;
            this.zoomLevel += percentage;
            _workingtp = this.original_distanceBetweenBoxs / 100;
            this.distanceBetweenBoxs = _workingtp * this.zoomPercentage;
            _workingtp = this.original_boxWidth / 100;
            this.boxWidth = _workingtp * this.zoomPercentage;
            this.halfBox = this.boxWidth / 2;
            _workingtp = this.original_distancesbetfam / 100;
            _workingtp = this.original_distanceBetweenGens / 100;
            this.distanceBetweenGens = _workingtp * this.zoomPercentage;
            _workingtp = this.original_boxHeight / 100;
            this.boxHeight = _workingtp * this.zoomPercentage;

            this.halfBoxHeight = this.boxHeight / 2;

            this.ComputeLocations();

            this.GetPercDistances();
            _percLocal_x = this.percX1;
            _percLocal_y = this.percY1;


            this.centreVerticalPoint += (this.drawingHeight / 100) * (_percLocal_y - this.mouseYPercLocat);

            this.centrePoint += (this.drawingWidth / 100) * (_percLocal_x - this.mouseXPercLocat);

            this.ComputeLocations();
        } //end percentage ==0.0)



        this.DrawTree();

    },
    SetZoomStart: function () {
        this.GetPercDistances();
        this.mouseXPercLocat = this.percX1;
        this.mouseYPercLocat = this.percY1;
    },
    GetPercDistances: function () {


        var _distanceFromX1 = 0.0;
        var _distanceFromY1 = 0.0;
        var _onePercentDistance = 0.0;

        this.percX1 = 0.0;
        this.percY1 = 0.0;


        this.drawingWidth = this.drawingX2 - this.drawingX1;
        this.drawingHeight = this.drawingY2 - this.drawingY1;

        if (this.drawingWidth !== 0 && this.drawingHeight !== 0) {
            if (this.drawingX1 > 0) {
                _distanceFromX1 = this.mouse_x - this.drawingX1; //;
            }
            else {
                _distanceFromX1 = Math.abs(this.drawingX1) + this.mouse_x;
            }

            _onePercentDistance = this.drawingWidth / 100;
            this.percX1 = _distanceFromX1 / _onePercentDistance;

            if (this.drawingY1 > 0) {
                _distanceFromY1 = this.mouse_y - this.drawingY1; // ;                
            }
            else {
                _distanceFromY1 = Math.abs(this.drawingY1) + this.mouse_y;
            }

            _onePercentDistance = this.drawingHeight / 100;
            this.percY1 = _distanceFromY1 / _onePercentDistance;

        }

    },
   
    SetMouse: function (x, y, mousestate) {
        this.mouse_x = x;
        this.mouse_y = y;
        if (mousestate == undefined) mousestate = false;

//        if (this.initial_mouse_x === 0) {
//            this.initial_mouse_x = this.mouse_x;
//        }

//        if (this.initial_mouse_y === 0) {
//            this.initial_mouse_y = this.mouse_y;
//        }


//        if (this.mouse_x < this.centrePoint) {
//            this.xFromCentre = this.centrePoint - this.mouse_x;
//        }
//        else {
//            if (this.centrePoint < 0) {
//                this.xFromCentre = this.mouse_x + Math.abs(this.centrePoint);
//            }
//            else {
//                this.xFromCentre = this.mouse_x - this.centrePoint;
//            }

//            this.xFromCentre = this.xFromCentre - (this.xFromCentre * 2);
//        }

        var mouseLink = this.links.LinkContainingPoint(this.mouse_x, this.mouse_y);

        var buttonLink = this.buttonLinks.LinkContainingPoint(this.mouse_x, this.mouse_y);


        if (mouseLink !== null || buttonLink !== null) {
            document.body.style.cursor = 'pointer';
         //   console.log(mouseLink.action);
        }
        else {
            if (mousestate == false)
                document.body.style.cursor = 'default';
            else
                document.body.style.cursor = 'move';
        }

    },
    GetChildDisplayStatus: function (person) {

        var isDisplayed = true;

        if (this.generations.length > person.GenerationIdx) {
            var _genidx = 0;
            while (_genidx < this.generations[person.GenerationIdx].length) {

                if (this.generations[person.GenerationIdx][_genidx].PersonId == person.ChildLst[0]) {
                    var _person = this.generations[person.GenerationIdx][_genidx];
                    isDisplayed = _person.IsDisplayed;
                    break;
                }

                _genidx++;
            }
        }

        return isDisplayed;
    },

    // move this up to the derived classes

    PerformClick: function (x, y) {

        var mouseLink = this.links.LinkContainingPoint(x, y);

        if (mouseLink !== null) {

            var selectedPerson = this.GetTreePerson(mouseLink.action);

       //     var zoomReq = this.zoomPercentage; //-100
         //   var xpos = selectedPerson.X1;
         //   var ypos = selectedPerson.Y1;


            this.selectedPersonId = selectedPerson.PersonId;
            this.selectedPersonX = selectedPerson.X1;
            this.selectedPersonY = selectedPerson.Y1;

            //var queryStr = '?sid=' + '00000000-0000-0000-0000-000000000000' + '&id=' + selectedPerson.PersonId;
            //queryStr += '&xpos=' + xpos + '&ypos=' + ypos + '&zoom=' + zoomReq;
            //this.qryString = queryStr;
            this.refreshData = true;
        }
        else {

            var buttonLink = this.buttonLinks.LinkContainingPoint(x, y);


            if (buttonLink !== null) {

                var parts = buttonLink.action.split(',');

                var clickedPerson = this.GetTreePerson(parts[0]);

                var isVis = true;

                if (parts[1] == 'false') {
                    isVis = true;
                }
                else {
                    isVis = false;
                }

                this.SetVisibility(clickedPerson, isVis);

                
            }

        }



    },
   
    SetCentrePoint: function (param_x, param_y) {

        if (param_x == 1000000 && param_y == 1000000) {
            this.centrePointXOffset = 0;
            this.centrePointYOffset = 0;
        }
        else {

            if (this.centrePointXOffset === 0) {

                this.centrePointXOffset = this.centrePoint - param_x;
            }
            else {

                this.centrePoint = param_x + this.centrePointXOffset;
            }


            if (this.centrePointYOffset === 0) {
                this.centrePointYOffset = this.centreVerticalPoint - param_y;
            }
            else {

                this.centreVerticalPoint = param_y + this.centrePointYOffset;
            }

        }

        // console.log('setcentrepoint: '+ this.centrePointXOffset + ' ' + this.centrePoint);
    }, //end set centre point
    ResetOffset: function () {

        this.centrePointXOffset = 0;
        this.centrePointYOffset = 0;
    },
    ZoomIn: function () {
        this.zoomAmount++;
        this.SetZoom(this.zoomAmount);
    },
    ZoomOut: function () {
        if (this.zoomAmount > 7)
            this.zoomAmount--;

        this.SetZoom(this.zoomAmount - (this.zoomAmount * 2));
        //  SetZoom(zoomAmount - (zoomAmount * 2));
    },
    CalcZoomLevel: function (zoomPercentage) {
        var _retVal = 0;

        if (zoomPercentage > 0 && zoomPercentage < 40) {
            _retVal = 1;
        }
        else if (zoomPercentage >= 40 && zoomPercentage < 60) {
            _retVal = 2;
        }
        else if (zoomPercentage >= 60 && zoomPercentage <= 150) {
            _retVal = 3;
        }
        else if (zoomPercentage > 150 && zoomPercentage <= 200) {
            _retVal = 4;
        }
        else if (zoomPercentage > 200 && zoomPercentage <= 250) {
            _retVal = 5;
        }
        else if (zoomPercentage > 250 && zoomPercentage <= 300) {
            _retVal = 6;
        }
        else if (zoomPercentage > 300) {
            _retVal = 7;
        }

        return _retVal;
    },
    CalcAreaLevel: function (area) {
        var _returnVal = 0;

        if (area > 0 && area < 1000) {
            _returnVal = 1;
        }
        else if (area >= 1000 && area < 2500) {
            _returnVal = 2;
        }
        else if (area >= 2500 && area <= 5000) {
            _returnVal = 3;
        }
        else if (area > 5000 && area <= 10000) {
            _returnVal = 4;
        }
        else if (area > 10000 && area <= 15000) {
            _returnVal = 5;
        }
        else if (area > 15000 && area <= 20000) {
            _returnVal = 6;
        }
        else if (area > 20000) {
            _returnVal = 7;
        }

        return _returnVal;
    },
    CalcTPZoom: function (genidx, personIdx) {
        var _tp = this.generations[genidx][personIdx];

        var _boxarea = (_tp.X2 - _tp.X1) * (_tp.Y2 - _tp.Y1);

        _tp.zoom = this.CalcAreaLevel(_boxarea);
    },
    RelocateToSelectedPerson: function () {


        var personId = this.selectedPersonId;
        var _xpos = this.selectedPersonX;
        var _ypos = this.selectedPersonY;

        this.ComputeLocations();


        var distanceToMove = 0.0;
        var currentPersonLocation = 0;
        var _temp = this.GetTreePerson(personId);

        var x = 0.0;
        var y = 0.0;

        if (_temp !== null) {
            if (_xpos === 0.0) {
                currentPersonLocation = (this.generations[0][0].X1 + this.generations[0][0].X2) / 2;
                var requiredLocation = this.screenWidth / 2;
                distanceToMove = requiredLocation - currentPersonLocation;

                this.centrePoint += distanceToMove;
            }
            else {
                currentPersonLocation = _temp.X1;

                if (currentPersonLocation < 0.0) {
                    distanceToMove = _xpos - currentPersonLocation;
                }

                if (currentPersonLocation > this.screenWidth) {
                    distanceToMove = 0.0 - ((this.screenWidth - _xpos) + (_xpos - this.screenWidth));
                }

                if (currentPersonLocation >= 0 && currentPersonLocation <= this.screenWidth) {   //100 - 750
                    distanceToMove = _xpos - currentPersonLocation;
                    // 800 - 100
                }

                this.centrePoint += distanceToMove;
            }

            if (_ypos === 0.0) {
                var _currentPersonLocation = (this.generations[0][0].Y1 + this.generations[0][0].Y2) / 2;
                var _requiredLocation = this.boxHeight;
                var _distanceToMove = _requiredLocation - _currentPersonLocation;
                this.centreVerticalPoint -= _distanceToMove;
            }
            else {

                if (_temp === null) {
                    currentPersonLocation = 0.0;
                }
                else {
                    currentPersonLocation = _temp.Y1;

                    if (currentPersonLocation > this.screenHeight) {
                        distanceToMove = currentPersonLocation - _ypos;
                    }
                    if (currentPersonLocation >= 0 && currentPersonLocation <= this.screenHeight) {
                        distanceToMove = currentPersonLocation - _ypos;
                    }
                    if (currentPersonLocation < 0) {
                        distanceToMove = _ypos - currentPersonLocation;
                    }
                }

                this.centreVerticalPoint -= distanceToMove;
            }

            this.ComputeLocations();

            if (_ypos === 0) {
                y = 0 - this.screenHeight / 2;
            }
            else {
                y = (_temp.Y2 + _temp.Y1) / 2;
            }

            if (_xpos === 0) {
                x = this.screenWidth / 2;
            }
            else {
                x = (_temp.X2 + _temp.X1) / 2;
            }

            this.SetMouse(x, y);
            this.SetZoomStart();
            this.SetCentrePoint(1000000, 1000000);


            this.DrawTree();
        }
    },
    Debug: function () {
        console.log('debugging');

        var idx = 0;
        var u = new AncUtils();

        while (this.generations.length > idx) {



            var cid = 0;
            var cife = 0;
            var cipl = 0;
            var cifs = 0;
            var cihl = 0;

            var personidx = 0;

            while (this.generations[idx].length > personidx) {

                if (this.generations[idx][personidx].RecordLink.Name == "Jane Thackray") {
                    console.log("Jane Thackray X1 Y2");
                    console.log(this.generations[idx][personidx].X1);
                    console.log(this.generations[idx][personidx].Y1);

                }

                if (this.generations[idx][personidx].RecordLink.Name == "William Talbot") {
                    console.log("William Talbot X1 Y2");
                    console.log(this.generations[idx][personidx].X1);
                    console.log(this.generations[idx][personidx].Y1);
                }



                personidx++;
            }



            idx++;
        }



        //var _fslOuter = 0;
        //while (_fslOuter < this.childlessMarriages.length) {
        //    var _fslInner = 0;
            
        //    console.log(" marriage: " + _fslOuter);

           
        //        console.log(" x " + this.childlessMarriages[_fslOuter][0] + " y " + this.childlessMarriages[_fslOuter][1]);

             
        //    _fslOuter++;
        //}

        //        idx = 0;


        //        while (this.familySpanLines.length > idx) {
        //            var spanidx = 0;
        //           
        //            while (this.familySpanLines[idx].length > spanidx) {


        //                spanidx++;
        //            }

        //            console.log(idx + " spans :" + u.pad(this.familySpanLines[idx].length, 3));



        //            idx++;
        //        }







        //        console.log(idx + " 7 - 12 :" + u.pad(this.familySpanLines[7][12].length, 3));
        //        console.log(idx + " 7 - 13 :" + u.pad(this.familySpanLines[7][13].length, 3));
        //        console.log(idx + " 7 - 14 :" + u.pad(this.familySpanLines[7][14].length, 3));
        //console.log(idx + " 7 - 15 :" + u.pad(this.familySpanLines[7][15].length, 3));
        //        console.log(idx + " 7 - 16 :" + u.pad(this.familySpanLines[7][16].length, 3));
        //        console.log(idx + " 7 - 17 :" + u.pad(this.familySpanLines[7][17].length, 3));
        //        console.log(idx + " 7 - 18 :" + u.pad(this.familySpanLines[7][18].length, 3));
        //        console.log(idx + " 7 - 19 :" + u.pad(this.familySpanLines[7][19].length, 3));
        //        console.log(idx + " 7 - 20 :" + u.pad(this.familySpanLines[7][20].length, 3));

        //  console.log(idx + " 6 - 21 :" + u.pad(this.familySpanLines[6][21].length, 3));8
        //  console.log(idx + " 6 - 22 :" + u.pad(this.familySpanLines[6][22].length, 3));


        //idx = 0;

        //while (this.familySpanLines[7][15].length > idx) {
        //    console.log(idx + " val :" + this.familySpanLines[7][15][idx]);
        //    idx++;
        //}
    }



};
