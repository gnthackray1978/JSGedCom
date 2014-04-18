

String.prototype.yearDate = function () {

    // var str = "abt 1978 between 1943";
    var pattern = /[1][5-9][0-9][0-9]+/g;

    if (this.match == undefined)
        this.match = function (pat) {
            return true;
        };
    
    var matches = this.match(pattern);

    if (matches != null && matches.length > 0) {
        return Number(matches[0]);
    } else {
        return 0;
    }
};





Array.prototype.ContainsRec = function(_rec) {

    for (var i = 0; i < this.length; i++) {

        if (this[i].latx == _rec.latx &&
            this[i].laty == _rec.laty &&
            this[i].boxlen == _rec.boxlen) {
            return true;
        }
    }
    return false;

};



$.fn.pasteEvents = function (delay) {
    if (delay == undefined) delay = 20;
    return $(this).each(function () {
        var $el = $(this);
        $el.on("paste", function () {
            $el.trigger("prepaste");
            setTimeout(function () { $el.trigger("postpaste"); }, delay);
        });
    });
};






//remove invalid selections from an array
Array.prototype.RemoveInvalid = function(selection) {
    var filteredArray = new Array();
    for (var si = 0; si < selection.length; si++) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == selection[si]) {
                filteredArray.push(this[i]);
                break;
            }
        }
    }
    return filteredArray;
};

Array.prototype.LinkContainingPoint = function (mx,my) {

    for (var i = 0; i < this.length; i++) {

        if ((this[i].x1 <= mx && this[i].x2 >= mx) 
        && (this[i].y1 <= my && this[i].y2 >= my))                      
        {
            return this[i];
        }
    }



    return null;

};

Array.prototype.ContainsPerson = function (value) {

    for (var i = 0; i < this.length; i++) {

        if (this[i].PersonId == value.PersonId) {
            return true;
        }
    }



    return false;

};

Array.prototype.SortByGenIdx = function()
{
    for(var i=0;i<this.length;i++)
	{
		for(var j=i+1;j<this.length;j++)
		{
			if(Number(this[i].GenerationIdx) < Number(this[j].GenerationIdx))
			{
				var tempValue = this[j];
				this[j] = this[i];
				this[i] = tempValue;
			}
		}
	}
};

Array.prototype.RemoveDupes = function () {
   
    var uniqueNames = [];
    $.each(this, function (i, el) {
        if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
    });

    return uniqueNames;
};