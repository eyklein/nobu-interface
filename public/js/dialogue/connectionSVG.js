function ConnectionSVG(fromNode_, toNode_, connectionType_){
	this.fromNode=fromNode_;
	this.toNode=toNode_;
	this.type=connectionType_
	this.$div;


	this.init=function(){
		this.$fromDiv=this.fromNode.$myDiv.find(".connect-out")
		this.fromType=fromNode_.type;
		// if(this.type=="hierarchy" || this.type=="goto" || this.type=="redirect"){
		// 	this.$fromDiv=this.fromNode.$myDiv.find(".connect-out")
		// 	this.fromType=fromNode_.type;
		// }
		// else if(this.type=="sibling"){
		// 	this.$fromDiv=this.fromNode.$myDiv.find(".connect-in")

		// 	//?????? why do i need this?
		// 	if(fromNode_.parent)
		// 		this.fromType=fromNode_.parent.type;
		// }
		if(this.toNode){
			this.$toDiv=this.toNode.$myDiv.find(".connect-in")
		}

		if(this.type=="goto"){
			// console.log(this.toNode.name)
		}

		this.$div = $("<div>", {"class": "svg-div"});
		this.$div.addClass(this.type)
		this.$div.html(this.getSVGCode())
		// console.log(this.$div)
		$("#svg-connections").append(this.$div)
	}



	this.getSVGCode = function(){


		fromOffset = this.fromNode.getOutputPossition()
		toOffset=this.toNode.getInputPossition()

		

		hight= toOffset.top - fromOffset.top
		width= toOffset.left - fromOffset.left



		var svgString = '<svg class="svg-connect">'


		if(this.type=="hierarchy" || this.type=="heterarchy"){
			var curveSize=15
		}else{
			var curveSize=35
		}



		svgString += this.connectingLineSVG(fromOffset.left, fromOffset.top, hight, width, curveSize)




		svgString += '</svg>'
		
		return svgString;
	}



	this.connectingLineSVG = function(x,y,height, width, radius){

		// midBarHight_1=this.fromNode.$SVGInput.val()
		midBarHight_1=this.fromNode.SVGMidBarHight

		midBarHight_2=(height)-this.fromNode.SVGMidBarHight

		if(height>0){
			if(width>radius){
				stringOut = '<path d="M' 
				+ x + ' ' + y
				+ 'v ' + (midBarHight_1 - radius)
				+ this.getRound(0, 1,1,1,radius)
				+ 'h '+ (width - radius*2)
				+ this.getRound(1, 0,1,1,radius)
				+ 'v '+ (midBarHight_2 - radius)
				+ this.getArrow("down")
				+ '" />'
			}else if(width<-1*radius){
				stringOut = '<path d="M' 
				+ x + ' ' + y
				+ 'v ' + (midBarHight_1 - radius)
				+ this.getRound(0,1,-1,1,radius)
				+ 'h '+ (width + radius*2)
				+ this.getRound(-1,0,-1,1,radius)
				+ 'v '+ (midBarHight_2 - radius)
				+ this.getArrow("down")
				+ '" />'
			}else{

				stringOut = '<path d="M' 
				+ x + ' ' + y
				+ 'v ' + (height)
				+ this.getArrow("down")
				+ '" />'
			}
		}else{
			if(width>radius){
				stringOut = '<path d="M' 
				+ x + ' ' + y
				+ 'h ' + (width/2 - radius)
				+ this.getRound(1, 0,1,-1,radius)
				+ 'v '+ (height + radius*2)
				+ this.getRound(0, -1,1,-1,radius)
				+ 'h '+ (width/2 - radius)
				+ this.getArrow("right")
				+ '" />'
			}else if(width<-1*radius){
				stringOut = '<path d="M' 
				+ x + ' ' + y
				+ 'h ' + (width/2 + radius)
				+ this.getRound(-1,0,-1,-1,radius)
				+ 'v '+ (height + radius*2)
				+ this.getRound(0,-1,-1,-1,radius)
				+ 'h '+ (width/2 + radius) 
				+ this.getArrow("left")
				+ '" />'
			}else{

				stringOut = '<path d="M' 
				+ x + ' ' + y
				+ 'h ' + -radius
				+ this.getRound(-1,0,-1,-1,radius)
				+ 'v ' + (height+2*radius)
				+ this.getRound(0,-1,1,-1,radius)
				+ 'h ' + radius
				+ this.getArrow("right")
				+ '" />'
			}
		}

		return stringOut
	}

	this.getRound = function(xCorner, yCorner,xEnd,yEnd, radius){
		return 'q ' + xCorner*radius + ' ' + yCorner*radius + ' ' + xEnd*radius + ' ' + yEnd*radius;
	}

	this.getArrow = function(direction){
		if(direction == "down"){
			return 'l '+ -5 + ', ' + (-1)*10
			+ 'h ' +10
			+ 'l '+ -5 + ', ' + 10
		}if(direction == "left"){
			return 'l '+ 10 + ', ' + -5
			+ 'v ' + 10
			+ 'l '+ -10 + ', ' + - 5
		}if(direction == "right"){
			return 'l ' + -10 + ', ' + -5
			+ 'v ' + 10
			+ 'l '+ 10 + ', ' + - 5
		}if(direction == "up"){
			return 'l '+ -5 + ', ' + 10
			+ 'h ' +10
			+ 'l '+ -5 + ', ' + -10
		}
	}
 




	this.changeType = function(newType_){


		this.$div.removeClass("hierarchy")
		this.$div.removeClass("heterarchy")
		this.$div.removeClass("goto")
		this.$div.removeClass("redirect")
		// console.log("newType_          :" + newType_)
		this.$div.addClass(newType_)

		// this.$div.addClass("fuck")


		if(newType_ == "goto" || newType_ == "redirect" ){
			this.fromNode.removeChildren()
			this.$div.remove()
			this.fromNode.removeGotoRedeirect()
			// this.removeParent();

		}else{
			this.fromNode.removeGotoRedeirect()
			// this.fromNode.refreshConnectionToChildren()
		}
	}

	this.removeDiv=function(){
		this.$div.remove();
	}

	this.init();
	
}




function ConnectionSVGMouse(fromNode_){
	this.fromNode=fromNode_;
	this.type=fromNode_.type
	this.$div;


	this.init=function(){
		this.$fromDiv=this.fromNode.$myDiv.find(".connect-out")
		this.fromType=fromNode_.type;

		this.$div = $("<div>", {"class": "svg-div"});
		this.$div.addClass(this.type)
		this.$div.html(this.getSVGCode())
		// console.log(this.$div)
		$("#svg-connections").append(
			this.$div)
	}

	this.update=function(){
		this.$div.remove()
		this.$div = $("<div>", {"class": "svg-div"});
		this.$div.addClass(this.type)
		this.$div.html(this.getSVGCode())
		// console.log(this.$div)
		$("#svg-connections").append(this.$div)
	}



	this.getSVGCode = function(){


		fromOffset = this.fromNode.getOutputPossition()

		hight= mouseY - fromOffset.top -80
		width= mouseX - fromOffset.left -10



		var svgString = '<svg class="svg-connect">'


		if(this.type=="hierarchy" || this.type=="heterarchy"){
			var curveSize=15
		}else{
			var curveSize=35
		}



		svgString += this.connectingLineSVG(fromOffset.left, fromOffset.top, hight, width, curveSize)




		svgString += '</svg>'
		
		return svgString;
	}



	this.connectingLineSVG = function(x,y,height, width, radius){

		// midBarHight_1=this.fromNode.$SVGInput.val()
		midBarHight_1=this.fromNode.SVGMidBarHight

		midBarHight_2=(height)-this.fromNode.SVGMidBarHight

		if(height>0){
			if(width>radius){
				stringOut = '<path d="M' 
				+ x + ' ' + y
				+ 'v ' + (midBarHight_1 - radius)
				+ this.getRound(0, 1,1,1,radius)
				+ 'h '+ (width - radius*2)
				+ this.getRound(1, 0,1,1,radius)
				+ 'v '+ (midBarHight_2 - radius)
				+ this.getArrow("down")
				+ '" />'
			}else if(width<-1*radius){
				stringOut = '<path d="M' 
				+ x + ' ' + y
				+ 'v ' + (midBarHight_1 - radius)
				+ this.getRound(0,1,-1,1,radius)
				+ 'h '+ (width + radius*2)
				+ this.getRound(-1,0,-1,1,radius)
				+ 'v '+ (midBarHight_2 - radius)
				+ this.getArrow("down")
				+ '" />'
			}else{

				stringOut = '<path d="M' 
				+ x + ' ' + y
				+ 'v ' + (height)
				+ this.getArrow("down")
				+ '" />'
			}
		}else{
			if(width>radius){
				stringOut = '<path d="M' 
				+ x + ' ' + y
				+ 'h ' + (width/2 - radius)
				+ this.getRound(1, 0,1,-1,radius)
				+ 'v '+ (height + radius*2)
				+ this.getRound(0, -1,1,-1,radius)
				+ 'h '+ (width/2 - radius)
				+ this.getArrow("right")
				+ '" />'
			}else if(width<-1*radius){
				stringOut = '<path d="M' 
				+ x + ' ' + y
				+ 'h ' + (width/2 + radius)
				+ this.getRound(-1,0,-1,-1,radius)
				+ 'v '+ (height + radius*2)
				+ this.getRound(0,-1,-1,-1,radius)
				+ 'h '+ (width/2 + radius) 
				+ this.getArrow("left")
				+ '" />'
			}else{

				stringOut = '<path d="M' 
				+ x + ' ' + y
				+ 'h ' + -radius
				+ this.getRound(-1,0,-1,-1,radius)
				+ 'v ' + (height+2*radius)
				+ this.getRound(0,-1,1,-1,radius)
				+ 'h ' + radius
				+ this.getArrow("right")
				+ '" />'
			}
		}

		return stringOut
	}

	this.getRound = function(xCorner, yCorner,xEnd,yEnd, radius){
		return 'q ' + xCorner*radius + ' ' + yCorner*radius + ' ' + xEnd*radius + ' ' + yEnd*radius;
	}

	this.getArrow = function(direction){
		if(direction == "down"){
			return 'l '+ -5 + ', ' + (-1)*10
			+ 'h ' +10
			+ 'l '+ -5 + ', ' + 10
		}if(direction == "left"){
			return 'l '+ 10 + ', ' + -5
			+ 'v ' + 10
			+ 'l '+ -10 + ', ' + - 5
		}if(direction == "right"){
			return 'l ' + -10 + ', ' + -5
			+ 'v ' + 10
			+ 'l '+ 10 + ', ' + - 5
		}if(direction == "up"){
			return 'l '+ -5 + ', ' + 10
			+ 'h ' +10
			+ 'l '+ -5 + ', ' + -10
		}
	}
 

	this.removeDiv=function(){
		this.$div.remove();
	}

	this.init();
	
}
