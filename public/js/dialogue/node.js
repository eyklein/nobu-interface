function Node(name_, $div_) {
	this.name = null;
	this.output = new Output(this);
	this.parent = null;
	// this.previous_sibling = null;
	this.next_sibling = null;
	this.numberChild=0;
	this.children=[]
	// this.conditions = "";
	this.gotoRedirect = new GotoRedirect();
	this.context = null;
	this.created = "2017-03-10T22:42:40.528Z";
	this.updated = "2017-03-10T22:45:26.650Z";
	this.metadata = null;
	this.description = null;
	this.type = "hierarchy"

	this.cPosition={"x":0,"y":0}
	this.pPosition={"x":0,"y":0}

	// this.connectionsChildren=[];
	// this.connectionsChildrenDict={};
	// this.connectionsChildrenArray=[];
	// this.connectionSibling;

	this.connectionsSVGChildrenDict={};
	this.SVGMidBarHight= 30;
	this.SVGMidBarWidth= 30;





	this.$myDiv = $div_;
	this.$myDiv.show();

	this.$SVGInput=this.$myDiv.find(".horazontal-shift-bar")
	this.$SVGInput.val(30)
	// this.$parrentConnectionDiv = null;
	this.$nameDiv = this.$myDiv.find('.node-name')

	// set name at bottom V
	this.getJSON = function(){
		var jsonOut={}
		jsonOut["output"]= this.output.getJSON();
		jsonOut["dialog_node"] = this.name
		if(this.parent){
			jsonOut["parent"] = this.parent.name
		}else{
			jsonOut["parent"]=null
		}
		// if(this.previous_sibling){
		// 	jsonOut["previous_sibling"] = this.previous_sibling.name
		// }else{
		// 	jsonOut["previous_sibling"]=null
		// }
		jsonOut["conditions"] = this.conditions

		if(this.gotoRedirect.isSet){
			jsonOut["go_to"] = this.gotoRedirect.getJSON();
		}else{
			jsonOut["go_to"]=null
		}
		jsonOut["context"] = this.context;
		jsonOut["type"] = this.type;

		jsonOut["children"]=[]
		for(var i=0;i<this.children.length;i++){
			jsonOut["children"].push(this.children[i].name)
		}

		// console.log($(this.$myDiv).position());
		jsonOut["position"] = this.$myDiv.position();
		return jsonOut;
	}


	this.processJSON = function(data){
		this.changeConditions(data.conditions);
		this.setType(data.type)

		this.position=data.position;

		
		//if parent 
		
		if(data.parent){
			this.addParent(nodeObjs.nodesDict[data.parent])

			// if(data.previous_sibling == null){
			// 	// this.addParentConnection(nodeObjs.nodesDict[data.parent])
			// 	nodeObjs.nodesDict[data.parent].addConnectionTo(this, "parentChild")

			// }
			// else{
			// 	nodeObjs.nodesDict[data.parent].addConnectionTo(this, "sibling")
			// 	// this.addSiblingConnection(nodeObjs.nodesDict[data.previous_sibling])
			// }
		}

		this.gotoRedirect.setValuesJSON(data.go_to)
		//if goto
		// if(this.type == "goto"){
		// 	this.gotoRedirect.setValues(data.go_to)

		// 	this.addConnectionTo(this.gotoRedirect.targetNode, "goto")
		// 	// this.addGotoConnection(this.gotoRedirect.targetNode);
		// }
		// else if(this.type == "redirect"){
		// 	this.gotoRedirect.setValues(data.go_to)
		// 	this.addConnectionTo(this.gotoRedirect.targetNode, "redirect")
		// 	// this.addGotoConnection(this.gotoRedirect.targetNode);
		// }

		if(data.output && data.output.text && data.output.text.values){
			for(var i=0; i< data.output.text.values.length;i++){
				this.output.insertValue(data.output.text.values[i])
			}
		}
		this.setHasOutput()
	}

	this.placePosition = function(){
		this.$myDiv.css(this.position);
		// this.updatePreviousPosition();
	}

	this.activateConnections=function(){
		for(key in this.connectionsSVGChildrenDict){
			// console.log("this.activate("+key+")")
			// this.connectionsSVGChildrenDict[key].$div.find('path').addClass("active")
			this.connectionsSVGChildrenDict[key].$div.addClass("active")
		}
	}
	this.deactivateConnections=function(){
		for(key in this.connectionsSVGChildrenDict){
			this.connectionsSVGChildrenDict[key].$div.removeClass("active")
		}
	}




	this.updateNodeMove = function(updateSiblingsAfter=false){
		this.updatePreviousPosition();

		movement={"x": this.cPosition.left - this.pPosition.left, "y": this.cPosition.top - this.pPosition.top}

		this.moveChildren(movement.x , movement.y, false)

		if(updateSiblingsAfter){
			if(this.parent){
				var siblingsAfter = this.getSiblingsAfter();
				console.log(siblingsAfter);
				for(var i=0; i< siblingsAfter.length;i++){
					// console.log("move sibling after !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! : "+ siblingsAfter[i].name)

					siblingsAfter[i].updatePreviousPosition();
					siblingsAfter[i].moveChildren(movement.x , movement.y, true)
				}

			}
		}
		if(this.parent){
			this.parent.updateConnectionsSVG()
		}else{
			this.updateConnectionsSVG()
		}
	}


	this.clearSVGConnections = function(){
		// for(var i=0; i<this.connectionsChildren.length; i++){
		// console.log("clearSVGConnections       : " + this.name);

		for(key in this.connectionsSVGChildrenDict){
			// console.log(key)
			this.connectionsSVGChildrenDict[key].removeDiv();
		}
		this.connectionsSVGChildrenDict={}
	}
	this.addSVGConnection=function(connectionTo_, connectionType_){

		this.connectionsSVGChildrenDict[connectionTo_.name]=(new ConnectionSVG(this, connectionTo_, connectionType_))

	}
	this.updateConnectionsSVG = function(){
		//remove preexsisting div for connection and children
		// this.clearConnections();

		this.clearSVGConnections();
		

		for(var i=0;i<this.children.length;i++){
			// if(i==0){//first child
			// 	this.addConnectionTo(this.children[i], "parentChild")
			// }else{
			// 	this.children[i-1].addConnectionTo(this.children[i], "sibling")
			// }
			this.children[i].updateConnectionsSVG()

			this.addSVGConnection(this.children[i], this.type)
		}

		if(this.type == "goto" && this.gotoRedirect.targetNode){
			this.addSVGConnection(this.gotoRedirect.targetNode, "goto")
		}
		if(this.type == "redirect"){
			// this.gotoRedirect.setValuesJSON(data.go_to)
			// console.log("FUCKERSHIT")
			// console.log(this.gotoRedirect.targetNode)
			this.addSVGConnection(this.gotoRedirect.targetNode, "redirect")
		}

	}



	this.setPosition = function(x_, y_){

		this.$myDiv.css({top: y_, left: x_, position:'absolute'});
		this.updatePreviousPosition()

	}
	this.getPosition = function(){
		return this.$myDiv.position();
	}
	this.updatePreviousPosition = function(){
		this.pPosition=this.cPosition
		this.cPosition=this.getPosition()
	}

	this.getSize = function(){
		var size = {
			"x":xSpacing,
			"y":ySpacing
		}
		for(var i=0; i< this.children.length ; i++){
			childSize = this.children[i].getSize();

			size.x += childSize.x;
			// size.y += childSize.y;
		}
		size.y += ySpacing;
		return size;
	}

	this.changeName = function(name_) {
		//change key first so we dont override the old key
		nodeObjs.changeKey(this.name, name_)
			//change connections id's
		// if ($('.connection.' + this.name).length) {
		// 	$('.connection.' + this.name).addClass(name_)
		// 	$('.connection.' + this.name).removeClass(this.name);
			
		// }

		this.name = name_;
		$div_.attr('id', name_);

	}
	this.changeDivName = function(name_) {
		this.$nameDiv.html(name_);
	}
	this.removeDiv = function(){
		this.$myDiv.remove();
	}

	this.delete = function(){
		if(this.parent){
			var parentNode = this.parent
			parentNode.removeChild(this.name)
			this.removeParent()
			parentNode.updateConnectionsSVG();
		}
		this.removeChildren();
		this.removeGotoRedeirect();
		this.removeDiv();
		dashboard.updateDashboard();
	}

	this.changeConditions = function(conditions_){
		this.conditions=conditions_
	}

	this.updateOutput = function(spanDiv){
		var index = $("li").index( $(spanDiv).parent().parent())
		outputVal = $(spanDiv).text()
		if(outputVal != this.output.values[index] && !loadingNode){
			this.output.changeValue(outputVal, index);
		}
		this.setHasOutput()
		
	}
	this.setHasOutput=function(){
		if(this.output.hasOutput()){
			this.$myDiv.removeClass('no-output')
			this.$myDiv.addClass('has-output')
		}else{
			this.$myDiv.removeClass('hase-output')
			this.$myDiv.addClass('no-output')
		}

	}
	this.insertOutValue = function(output_, index_){
		this.output.insertValue(output_, index_)
	}
	this.deleteOutValue = function(index_){
		this.output.deleteValue(index_)
	}


	this.setType = function(type_){

		this.$myDiv.find('.connect-out').removeClass("hierarchy-out")
		this.$myDiv.find('.connect-out').removeClass("heterarchy-out")
		this.$myDiv.find('.connect-out').removeClass("goto-out")
		this.$myDiv.find('.connect-out').removeClass("redirect-out")
		this.$myDiv.find('.connect-out').addClass(type_ + "-out")


		if(this.connection){
			this.connection.changeType(type_)
			// this.changeConnection(type_);
		}



		this.type=type_;

		// this.refreshConnectionToChildren()


		if(type_ == "goto" || type_ == "redirect" ){
			this.removeChildren()
			this.removeGotoRedeirect()
			// this.removeParent();

		}else{

			this.removeGotoRedeirect()
			// this.updateConnections()
			// this.refreshConnectionToChildren()
		}

		
	}


	this.addParent = function(parentNode_) {
		if(parentNode_){
			this.parent = parentNode_;
			parentNode_.addChild(this);
		}
	}
	// this.addSiblingBefore = function(siblingObj_){
	// 	this.previous_sibling=siblingObj_;

	// 	//next sibling
	// 	siblingObj_.next_sibling=this;


	// }

	this.sortChildren = function(){
		this.children = this.children.sort(function(a, b) {
			if(a.$myDiv.position().left != b.$myDiv.position().left){
				return a.$myDiv.position().left>b.$myDiv.position().left
			}else{
				return a.$myDiv.position().top>b.$myDiv.position().top
			}
		})	
		return(this.children)
	}

	

	// this.refreshConnection = function(){
	// 	this.removeConnection()

	// 	if(this.parent && this.parent.$myDiv && this.previous_sibling==null){
	// 		this.parent.addConnectionTo(this, "parentChild")
	// 		// this.addParentConnection(this.parent)
	// 	}else if(this.previous_sibling){
	// 		this.previous_sibling.addConnectionTo(this, "sibling")
	// 	}
	// }
	// this.refreshConnectionToChildren = function(){
	// 	for(var i=0; i< this.children.length; i++){
	// 		this.children[i].updateConnectionType(this.type)
	// 	}
	// }

	// this.updateConnectionType = function(type_){
	// 	$("#connection_" + this.name).removeClass("heterarchy");
	// 	$("#connection_" + this.name).removeClass("hierarchy");


	// 	$("#gotoRedirect_" + this.name).removeClass("goto");
	// 	$("#gotoRedirect_" + this.name).removeClass("redirect");


	// 	if(type_ == "heterarchy" || type_ == "hierarchy"){
	// 		$("#connection_" + this.name).addClass(type_);
	// 	}else if(type_ == "goto" || type_ == "redirect"){
	// 		$("#gotoRedirect_" + this.name).addClass(type_);
	// 	}
	// }


	// this.addConnectionTo = function(toNode_, connectionType_){
	// 	// if(connectionType_ == "parentChild" || connectionType_ == "goto" || connectionType_ == "redirect"){
	// 	// 	this.connectionsChildren.push(new Connection(this, toNode_, connectionType_))
	// 	// }else{
	// 	// 	this.connectionSibling = new Connection(this, toNode_, connectionType_)
	// 	// }
	// 	// this.connectionsChildren.push(new Connection(this, toNode_, connectionType_))
	// 	var newConnection = new Connection(this, toNode_, connectionType_);
	// 	this.connectionsChildrenDict[toNode_.name] = newConnection
	// 	// this.connectionsChildrenArray.push(newConnection)

	// 	// this.$myDiv.find("#svg-connections").html(newConnection.getSVGCode())


	// }
	









	this.snapToGrid = function(gridSide = 50) {
		this.$myDiv.css({
			top: Math.round(this.getPosition().top / gridSide) * gridSide,
			left: Math.round(this.getPosition().left / gridSide) * gridSide
		});
	}



	// this.getParent = function(){
	// 	if(this.previous_sibling == null){
	// 		this.numberChild=0;
	// 		return this.parent;
	// 	}else{
	// 		this.parent=this.previous_sibling.getParent()
	// 		this.numberChild=this.previous_sibling.numberChild+1;
	// 		if(this.parent != null){
	// 			// this.parent.addChild(this);
	// 			this.parent.children[this.numberChild]=this;
	// 		}

	// 		return  this.parent
	// 	}
	// }

	this.getBottomSibling = function(){
		if(this.next_sibling == null){
			return this;
		}else{
			return  this.next_sibling.getBottomSibling()
		}
	}



	// this.updateChildren = function(){
		
	// }

	this.removeParent = function(){
		this.parent = null;
	}

	this.addChild = function(childObj_){
		this.children.push(childObj_)
	}
	this.prependChild = function(childObj_){
		this.children.unshift(childObj_)
	}

	this.removeChild = function(childName_){

		console.log(childName_)
		this.children.splice(this.getIndexChild(childName_), 1);
		// this.children.splice(index, 9e9);
	}
	this.removeChildren = function(){

		for(var i = this.children.length-1; i>=0;i--){
			this.children[i].removeParent();
			this.removeChild(this.children[i].name)
		}
	}
	this.moveChildren = function(xMove, yMove, moveThis=true) {

		// console.log("moving children")

		if(this.parent){
			this.parent.sortChildren();
		}
		
		if(moveThis){
			// this.updatePosition();
			
			this.setPosition((this.cPosition.left+xMove), (this.cPosition.top+yMove))

		}	
		for(var i = 0; i<this.children.length; i++){
			this.children[i].moveChildren(xMove, yMove, true)
		}
	}
	this.getSiblingsAfter =function(){
		var siblings = []
		if(this.parent){
			for(var i=this.getThisIndex()+1; i< this.parent.children.length;i++){
				siblings.push(this.parent.children[i]);
			}
			return siblings; 
			
		}else{
			return []
		}
	}

	this.getIndexChild = function(childName_){
		var index = this.children.findIndex(child => child.name === childName_);
		return index;
	}
	this.getThisIndex = function(){
		if(this.parent){
			return this.parent.getIndexChild(this.name)
		}
		else{
			return null
		}
	}


	this.removeGotoRedeirect = function(){
		this.clearSVGConnections()
		this.gotoRedirect.remove()
	}

	this.getInputPossition = function(){
		inputPos = this.$myDiv.offset();
		inputPos.left +=5;
		inputPos.top -=110;

		
		return inputPos;
	}
	this.getOutputPossition = function(){
		outputPos = this.$myDiv.offset();
		outputPos.top += this.$myDiv.height();

		outputPos.left += 5;
		outputPos.top -= 80;

		return outputPos;
	}

	this.getConnection =function(){
		return this.connection
	}

	this.update = function(){
		updateDashboard(this)
	}
	this.getDistance=function(node_){
		return Math.dist(this.position.left,this.position.top,node_.position.left,node_.position.left)*Math.sign(node_.position.left-this.position.left)
	}
	this.getHorizontalDistance=function(node_){
		return  node_.position.left - this.position.left
	}


	this.isEligableChild = function(node_){
		var disendents = node_.getDisendents();
		for(var i=0;i<disendents.length;i++){
			if(this == disendents[i]){
				console.log(this.name + " : " + disendents[i].name)
				return false;
			}
		}
		return true;

	}
	this.getDisendents = function(){
		var disendents=[]
		// var grandchidren=[]
		// var disendents.push(this;		
		for(var i=0;i<this.children.length;i++){
			console.log(this.children[i].name)

			disendents=disendents.concat(this.children[i].getDisendents())


		}
		disendents.push(this);
		return disendents;

	}


	this.shiftX=function(shiftX){
		var curPos = this.getPosition()
		this.setPosition(curPos.left+shiftX, curPos.top);
	}




	this.name = name_;
	this.changeDivName(name_);
	this.changeName(name_);


}

function Nodes(name_) {
	this.nodesDict = []

	this.addNode = function($div_, name_ = "id_" + Math.floor(Math.random() * 1000)) {
		this.nodesDict[name_] = new Node(name_, $div_)
		return this.nodesDict[name_];
	}

	this.changeKey = function(oldKey, newKey) {
		this.nodesDict[newKey] = this.nodesDict[oldKey];
		delete this.nodesDict[oldKey]
	}


	this.getRootNodes=function(){
		roots=[]
		for(var key in nodeObjs.nodesDict){
			if(nodeObjs.nodesDict[key].parent==null){
				roots.push(nodeObjs.nodesDict[key]);
			}
		}
		return roots;
	}
	this.deleteNode = function(node_){
		this.nodesDict[node_.name].delete();
		delete this.nodesDict[node_.name]
	}
}

function Output(node_) {
	this.node=node_
	this.values = []
	this.selection = "sequential";

	this.changeValue = function(output_, index_){
		this.values[index_]=output_;
		// if(this.hasOutput()){
		// 	this.node.$
		// }
	}

	this.hasOutput = function(){
		if(this.values.length>0 && this.values[0].length>1){
			return true;
		}else{
			return false;
		}
	}
	this.insertValue = function(output_, insertIndex_){
		this.values.splice(insertIndex_, 0, output_);
	}
	this.deleteValue = function(index_){
		this.values.splice(index_,1)
	}

	this.getJSON = function(){
		var returnJSON = {}
		returnJSON["text"]={}
		returnJSON["text"]['values']=[]

		for(var i=0; i< this.values.length;i++){
			returnJSON["text"]['values'].push(this.values[i]);
		}

		return returnJSON;
	}

}

function GotoRedirect(){
	this.isSet=false;
	this.setValuesJSON=function(data_){
		if(data_){
			this.isSet=true;
			this.return=data_.return;
			this.type=data_.type;
			this.targetNode=nodeObjs.nodesDict[data_.dialog_node]
		}
	}
	this.setValues = function(tagetNode_, type_){
		this.isSet=true;
		this.return="null";
		this.type=type_;
		this.targetNode=tagetNode_;
	}

	this.remove = function(){
		this.isSet=false;
		this.return=null
		this.type=null
		this.targetNode=null
	}

	this.getJSON=function(){

		if(this.isSet){
			var returnJSON={}

			returnJSON["type"]="goto"
			
			returnJSON["dialog_node"]=this.targetNode.name;
			return returnJSON;
		}

		return null;

	}
}

// function setPosition(node_, x_, y_){
// 	node_.setPosition(x_, y_);

// 	x_offset =x_;
// 	// console.log(node_.name + x_ +" : " + y_)
// 	for(var i = 0; i<node_.children.length; i++){
// 		// node_.children[i].position(i*100, y+100);
// 		if(i>0){
// 			x_offset += node_.children[i].getSize().x
// 		}
		
// 		setPosition(node_.children[i], x_offset, y_ + ySpacing)
// 	}
// }

// function tighten(){
// 	var rootNodes = nodeObjs.getRootNodes();
// 	for(key in nodeObjs.nodesDict){
// 		var leftShift = nodeObjs.nodesDict[key].getLeftShift(200)
// 		if(leftShift){
// 			console.log("shifting       " + leftShift +" : " + nodeObjs.nodesDict[key].name)
// 			nodeObjs.nodesDict[key].shiftX(leftShift);
// 		}
// 	}
// 	// for(var j =0;j<rootNodes.length;j++){
// 	// 	setPosition(rootNodes[j],xSet,400*j+ySet);
// 	// }

// }

Math.dist=function(x1,y1,x2,y2){ 
  if(!x2) x2=0; 
  if(!y2) y2=0;
  return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)); 
}

// function organize(){
// 	var xSet=xSpacing;
// 	var ySet=ySpacing;
// 	rootNodes = nodeObjs.getRootNodes();
// 	for(var j =0;j<rootNodes.length;j++){
// 		setPosition(rootNodes[j],xSet,400*j+ySet);
// 	}
// }











