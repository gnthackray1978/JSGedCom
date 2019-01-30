export function CanvasTools() {
   this.ctx = document.getElementById('myCanvas').getContext('2d');
   this.canvas = document.getElementById("myCanvas");
}

CanvasTools.prototype = {



    GetCanvasPointColour : function (canvasName,x,y){

        var rgbToHex = function(R,G,B){
            // http://www.javascripter.net/faq/rgbtohex.htm
            function toHex(n) {
                n = parseInt(n,10);
                if (isNaN(n)) return "00";
                n = Math.max(0,Math.min(n,255));
                return "0123456789ABCDEF".charAt((n-n%16)/16)  + "0123456789ABCDEF".charAt(n%16);
            }
            return toHex(R)+toHex(G)+toHex(B);
        };

        var canvas = document.getElementById(canvasName).getContext('2d');

        var img_data = canvas.getImageData(x, y, 1, 1).data;

        var R = img_data[0];
        var G = img_data[1];
        var B = img_data[2];

        var rgb = R + ',' + G + ',' + B;

        // convert RGB to HEX
        var hex = rgbToHex(R,G,B);

        return {
            rgb : rgb ,
            hex : hex
        };
    },

    DrawImage: function (node,  imgUrl, func) {

    //    console.log('attempting to draw :' + imgUrl);

        var x = node.X;
        var y = node.Y;

        var width = node.Width;
        var height = node.Height;

        var img = new Image;

        img.src = imgUrl;
        var that = this;
        img.onload = function () {


            that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);

            that.ctx.drawImage(img, x, y,width,height);


            func();
        }

    },
    DrawCroppedImage: function (node,  imgUrl,cropnode,initnode,func) {

        // if(cropnode && initnode){
        //     console.log('attempting to draw :' + cropnode.X + ',' + cropnode.Y+ ',' +cropnode.Width+ ',' +cropnode.Height);
        //     console.log('attempting to draw :' + initnode.X + ',' + initnode.Y+ ',' +initnode.Width+ ',' +initnode.Height);
        // }

        var x = node.X;
        var y = node.Y;

        var width = node.Width;
        var height = node.Height;

        var img = new Image;

        img.src = imgUrl;
        var that = this;
        img.onload = function () {


            that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
         //   console.log('DrawCroppedImage: ' +  cropnode.Width + ' ' +cropnode.Height);
            if((cropnode.Width ==0 && cropnode.Height ==0) || cropnode.LayerId == -4)
                that.ctx.drawImage(img, x, y,width,height);
            else
                that.ctx.drawImage(img, initnode.X, initnode.Y,initnode.Width,initnode.Height,
                cropnode.X, cropnode.Y, cropnode.Width,cropnode.Height
               );


            func();
        }

    },
    ClearCanvas: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    GetFontSize : function(text,width,height, options){

        var idx = 5;
        while (idx < 150) {

            this.ctx.font = idx+"pt "+options.DefaultFont;

            var mo = this.ctx.measureText(text);

            if (mo.width > width || mo.height > height) {
                idx--;
                break;
            }

            idx++;
        }

        return idx;
    },

    DrawTextBackgroundBox : function(d,x,y,width,height, options){

        this.ctx.rect(x, y, Math.abs(width), Math.abs(height));
        this.ctx.fillStyle = options.DefaultNoteColour;
        this.ctx.fill();

        // if(options.DefaultNoteColour != options.DefaultNoteColour){
        //     this.ctx.lineWidth = 1;
        //     this.ctx.strokeStyle = options.DefaultNoteColour;
        //     this.ctx.stroke();
        // }
    },


    DrawHighlightBox : function(d,x,y,width,height, options){


        this.ctx.rect(x, y, Math.abs(width), Math.abs(height));
        this.ctx.fillStyle = options.DefaultNoteColour;
        this.ctx.fill();

        this.ctx.lineWidth = options.Selection.BorderWidth;
        this.ctx.strokeStyle = options.Selection.Colour;
        this.ctx.stroke();

    },

    CreateStringComponentList: function(text, subTexts){

        var idx=0;
        var partsList = [];
        var tpText = text;

        while(idx < subTexts.length){
            var tpIdx =tpText.indexOf(subTexts[idx]);

            if(tpIdx ==0){
                partsList.push({text: subTexts[idx], options: 1 });
            }
            else
            {
                partsList.push({text: tpText.substring(0, tpIdx).trim(), options: 0 });
                partsList.push({text: subTexts[idx], options: 1 });
            }

            tpText = tpText.substring(tpIdx+subTexts[idx].length).trim();

            // we added all the substrings so add in the remainder
            if((idx == subTexts.length -1) && tpText != ''){
               partsList.push({text: tpText, options: 0 });
            }

            idx++;
        }
        if(subTexts.length==0){
            partsList.push({text: text, options: 0 })
        }

        return partsList;
    },

    UpdateStringComponentListMeasurements: function(partsList, text,x,y,width,height, options){

        var twidth = this.ctx.measureText(text);
        var charWidth= this.ctx.measureText(' ').width;
        var loffset = (width - twidth.width)/2;

        var idx=0;

        while(idx < partsList.length){

            if(idx==0){
                partsList[idx].textWidth = loffset;
            }
            else
            {
                partsList[idx].textWidth = charWidth + this.ctx.measureText(partsList[idx-1].text).width;
            }

            idx++;
        }


        return partsList;
    },

    DrawComplexLabel:function(x,y,width,height,d,selected, text,subTexts, options, cache){

        if(subTexts== undefined)
            subTexts = [];
        else
        {
            if(cache== undefined){
                var zzz=1;
            }
        }



        if(cache == undefined){
            cache = {};
        }

        var rotationAmt = d *(Math.PI/180);

        this.ctx.save();



        this.ctx.translate(x, y);
        this.ctx.rotate(rotationAmt);
        this.ctx.translate(0-x, 0-y);

        this.ctx.beginPath();



        if(selected)
            this.DrawHighlightBox(d,x,y,width,height,options);
        else
            this.DrawTextBackgroundBox(d,x,y,width,height,options);

        if(cache.fontSize)
            cache.fontSize = cache.fontSize;
        else
            cache.fontSize = this.GetFontSize(text,width,height,options);


        var partsList;

        if(cache.partsList)
            partsList = cache.partsList;
        else
            partsList = this.CreateStringComponentList(text,subTexts);


        //this.ctx.beginPath();

        this.ctx.fillStyle = options.DefaultNoteFontColour;
        this.ctx.font = cache.fontSize +"pt "+options.DefaultFont;

        if(!cache.partsList)
            this.UpdateStringComponentListMeasurements(partsList,text,x,y,width,height,options);


        cache.partsList = partsList;

        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";

        var idx=0;
        var tpx=0;
        while(idx < cache.partsList.length){

            if(cache.partsList[idx].options == 0)
                this.ctx.fillStyle = options.DefaultNoteFontColour;
            else
                this.ctx.fillStyle = 'red';

            if(idx==0)
                tpx = cache.partsList[idx].textWidth + x;
            else
                tpx = tpx + cache.partsList[idx].textWidth;

            this.ctx.fillText(cache.partsList[idx].text, tpx, y + (height / 2));

            idx++;
        }

    //    this.ctx.closePath();
        this.ctx.restore();

        return cache;
    },

    DrawLabel:function(x,y,width,height,d,text,options){



        var rotationAmt = d *(Math.PI/180);


        this.ctx.save();

        this.ctx.translate(x, y);

        this.ctx.rotate(rotationAmt);

        this.ctx.translate(0-x, 0-y);


        this.ctx.beginPath();
        this.ctx.rect(x, y, Math.abs(width), Math.abs(height));

        this.ctx.fillStyle = options.DefaultNoteColour;
        this.ctx.fill();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = options.DefaultNoteColour;
        this.ctx.stroke();



        var idx = 5;

        while (idx < 150) {

            this.ctx.font = idx+"pt "+options.DefaultFont;

            var mo = this.ctx.measureText(text);

            if (mo.width > width || mo.height > height) {
                idx--;
                break;
            }

            idx++;
        }


        this.ctx.fillStyle = options.DefaultNoteFontColour;
        this.ctx.font = idx +"pt "+options.DefaultFont;


        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(text, x+ (width/2), y+ (height / 2));


        this.ctx.closePath();
        this.ctx.restore();

        return idx;
    },

    DrawCropBox :function(x,y,width,height,options){


        this.ctx.save();

        this.ctx.lineWidth= options.Selector.BorderWidth;
        this.ctx.strokeStyle = options.Selector.Colour;
        this.ctx.strokeRect(x, y, Math.abs(width), Math.abs(height));

        this.ctx.restore();

    }
};
