class Gauge {
    constructor(options){
        this.options = options
        this.canvas = this.options.canvas;
        this.canvas.width = this.options.width_height
        this.canvas.height = this.options.width_height
        this.ctx = this.canvas.getContext("2d");
    }
    draw(percentage,text=""){
        let color = "#00ff00"
        if(percentage/100 >= .50 && percentage/100 <= .75){
            color = "#ffff00"
        }
        else if(percentage/100 > .75){
            color = "#ff0000"
        }
        this.ctx.clearRect(0, 0,  this.canvas.width,  this.canvas.height);
        this.drawPieSlice(this.canvas.width/2,this.canvas.height/2,this.canvas.height/2, Math.PI + Math.PI/2,(Math.PI + Math.PI/2)+(Math.PI*2)*(percentage/100), color);
        this.drawArc(this.canvas.width/2,this.canvas.height/2,this.canvas.height/2,0,2*Math.PI)
        this.drawPieSlice(this.canvas.width/2,this.canvas.height/2,this.canvas.height/3, 0,2*Math.PI, "#ffffff");
        this.drawArc(this.canvas.width/2,this.canvas.height/2,this.canvas.height/3, 0,2*Math.PI, "#ffffff")
        this.ctx.font = this.options.font;
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.options.centerText, this.canvas.width/2, this.canvas.height/2);
        if(text){
            this.ctx.fillText(text, this.canvas.width/2, this.canvas.height/2 + this.canvas.height/10);
        }else{
            this.ctx.fillText((percentage/100*100).toFixed(2)+this.options.metricSymbol, this.canvas.width/2, this.canvas.height/2 + this.canvas.height/10);
        }
    }
    healthDraw(util,temp){
        if(util < 25 && temp < 25){
            this.draw(util,"Good")
        }else if(util < util && temp < 50){
            this.draw(util,"OK")
        }else if(util < 25 && temp > 50){
            this.draw(util,"Bad")
        }else if(util < 50 && temp < 50){
            this.draw(util,"OK")
        }else if(util < 50 && temp > 50){
            this.draw(util,"Bad")
        }else if(util < 75 && temp < 50){
            this.draw(util,"Good")
        }else if(util < 75 && temp < 60){
            this.draw(util,"OK")
        }else if(util > 75 && temp > 60){
            this.draw(util,"Bad")
        }

    }
    drawLine(startX, startY, endX, endY){
        this.ctx.beginPath();
        this.ctx.moveTo(startX,startY);
        this.ctx.lineTo(endX,endY);
        this.ctx.stroke();
    }
    drawArc(centerX, centerY, radius, startAngle, endAngle){
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        this.ctx.stroke();
    }
    drawPieSlice(centerX, centerY, radius, startAngle, endAngle, color ){
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX,centerY);
        this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        this.ctx.closePath();
        this.ctx.fill();
    }
    updateWidthHeight(widthHeight){
        this.canvas.width = widthHeight
        this.canvas.height = widthHeight
    }
    updateFont(newFont){
        this.options.font = newFont 
    }
    getText(){
        return this.options.centerText
    }
}