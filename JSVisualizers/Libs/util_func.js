
var AncUtils = function () {    
 
};

AncUtils.prototype = {
    getNameParts: function (name) {

        var nameObj = { firstName: '', surname: '' };


        var n = person.name.split("/");

        if (n.length == 3) {
            nameObj.FirstName = n[0];
            nameObj.Surname = n[1];
        }
       

        return nameObj;
    },

    pad: function (number, length) {

        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }

        return str;

    }
};



