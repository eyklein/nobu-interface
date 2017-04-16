function Connection(fromNode_, toNode_, connectionType_){
	this.fromNode=fromNode_;
	this.toNode=toNode_;
	this.type=connectionType_
	this.$div;

	// this.$divFrom;
	// this.$divTo;

	this.svgConnection;




	if(this.type=="parentChild" || this.type=="goto" || this.type=="redirect"){
		this.$fromDiv=this.fromNode.$myDiv.find(".connect-out")
		this.fromType=fromNode_.type;
	}else if(this.type=="sibling"){
		this.$fromDiv=this.fromNode.$myDiv.find(".connect-in")

		//?????? why do i need this?
		if(fromNode_.parent)
			this.fromType=fromNode_.parent.type;
	}
	if(this.toNode){
		this.$toDiv=this.toNode.$myDiv.find(".connect-in")
	}


	// console.log(this.fromNode.name +"  +>   " + this.fromType)

	var ID=Math.floor(Math.random()*10000)

	this.$fromDiv.connections({
		to: this.$toDiv,
		'class': 'connection live parent ' +  this.fromType,
		'id': ID
	});

	// this.$div.addClass("fuckershit")
	this.$div = $("#" + ID)

	c = $('.live')
	// connections.push($('.live'));
	setInterval(function() {
		c.connections('update')
	}, 100);





	this.getSVGCode=function(){
		fromOffset = this.$fromDiv.offset();
		toOffset=this.$toDiv.offset()


		console.log(this.fromNode.name + " :  top " + fromOffset.top)

		// x2 = this.$toDiv.offset().left;
		// y2 = this.$toDiv.offset().top;

		// dX=x2-x1;
		// dY=y2-y1;
		// console.log(dX + " : " +-1*dY)
		// return '<svg class="svg-connect" height="10000" width="10000"><polyline points="200,200,1000,' + -1*dY + '"style="fill:none;stroke:black;stroke-width:3"/></svg>'
		return '<svg class="svg-connect" height="10000" width="10000"><polyline points="'+fromOffset.left+','+fromOffset.top+','+toOffset.left+','+ toOffset.top + '"style="fill:none;stroke:black;stroke-width:3"/></svg>'
		// return '<svg height="1000" width="1000"><polyline points="5,5'+dX+','+dY + '"style="fill:none;stroke:black;stroke-width:3"/></svg>'
	}





	this.changeType = function(newType_){

		//change the output symbler on node
		// this.fromNode.$myDiv.find(".connect-out").removeClass("hierarchy-out")
		// this.fromNode.$myDiv.find(".connect-out").removeClass("heterarchy-out")
		// this.fromNode.$myDiv.find(".connect-out").removeClass("goto-out")
		// this.fromNode.$myDiv.find(".connect-out").removeClass("redirect-out")

		// this.fromNode.$myDiv.find(".connect-out").addClass(newType_ + "-out")


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
	this.changeFrom=function(fromNode_){
		this.fromNode=fromNode_;
	}
	this.changeTo=function(toNode_){
		this.toNode=toNode_
	}
}
