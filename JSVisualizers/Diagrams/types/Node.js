
export function Node(id, data) {
    this.id = id;
    this.data = typeof (data) !== 'undefined' ? data : {};
    this._widthCache = [];
}



Node.prototype.getWidth = function (ctx) {
    var text = typeof (this.data.label) !== 'undefined' ? this.data.label : this.id;
    if (this._widthCache && this._widthCache[text])
        return this._widthCache[text];

    ctx.save();
    ctx.font = "16px Verdana, sans-serif";
    var width = ctx.measureText(text).width + 10;
    ctx.restore();

  //  this._width || (this._width = {});

    this._widthCache[text] = width;

    return width;
};

Node.prototype.getHeight = function (ctx) {
    return 20;
};

Node.prototype.match = function (id) {
    if(!this.data.RecordId) return false;

    return this.data.RecordId == id;
};
