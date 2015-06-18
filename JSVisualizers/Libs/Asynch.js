function Asynch() {}

Asynch.prototype.acall = function (your_function, callback) {
   setTimeout(function() {
        your_function();
        if (callback) {callback();}
    }, 0);
};
