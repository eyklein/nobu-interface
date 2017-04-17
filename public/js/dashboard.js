var dashboard;


$(document).ready(function() {


	dashboard = new Dashboard();



});

$(document).on('click', function(e) {
		// console.log("clicke
		// console.log($(e.target))
	// console.log("hiding1")
	// console.log(e.target)
	// console.log($(e.target).hasClass("svg-connect"))
	if(e.target == this || $(e.target).hasClass("connetion") || $(e.target).hasClass("svg-connect") || $(e.target).hasClass("svg-connect")){
		console.log("hiding2")
		dashboard.hide()
	}	
});


//add remove output
$(document).on('click', ".add.output", function() {
	loadingNode=true;
	newNodeDiv = $(this).parent().clone().insertAfter($(this).parent());
	newNodeDiv.find(".input-span").text("")
	dashboard.currentNode.insertOutValue("", $("li").index(newNodeDiv))
	loadingNode=false;
});
$(document).on('click', ".remove.output", function() {
	dashboard.currentNode.deleteOutValue($("li").index($(this).parent()))
	$(this).parent().remove();
});

// add/ change output on change
$(document).on('DOMSubtreeModified', ".input-span", function() {
	dashboard.currentNode.updateOutput(this)
});

$(document).on("click", '.delete-node', function(){
	
	//remove from dict
	// var nextPointNode
	// if(dashboard.currentNode.parent){
	// 	nextPointNode=dashboard.currentNode.parent
	// }else if(dashboard.currentNode.children.length>0){
	// 	nextPointNode=dashboard.currentNode.children[0]
	// }else{
	// 	try{
	// 		// nextPointNode=nodeObjs.nodesDict['start']
	// 	}
	// 	catch(e){
	// 		console.log("no start node?")
	// 	}
	// }
	nodeObjs.deleteNode(dashboard.currentNode)
	// dashboard.currentNode = nextPointNode
	dashboard.updateDashboard()
})





//******************************* dashboard ************************************
	//update node values from dash
$(document).on('change', "#input-node-name-dash", function() {
	//remove space
	var inputVal = $(this).val().replace(/ /g, "_")
	$(this).val(inputVal);

	//change the name of the key, node object, parent div, and connetion ids
	dashboard.currentNode.changeDivName(inputVal);
	dashboard.currentNode.changeName(inputVal);
});

$(document).on('change', "#conditions-input-dash", function() {

	//change the name of the key, node object, parent div, and connetion ids
	inputVal = $(this).val()
	dashboard.currentNode.changeConditions(inputVal);
});


$(document).on('click', ".force-node", function(e) {
	// console.log(dashboard.currentNode.name)
	sendForceNodeRequest(dashboard.currentNode.name)
});




//remove child
	
$(document).on('click', ".remove.next-node.child", function() {
	//remove parent from child

	var nextNode=nodeObjs.nodesDict[$(this).parent().find('.next-node-name').html()]


	var parentNode = nextNode.parent;
	nextNode.removeParent()
	parentNode.removeChild(nextNode.name)


	parentNode.updateConnectionsSVG();


	dashboard.updateDashboard();
});
//remove goto
$(document).on('click', ".remove.next-node.goto", function() {
	//remove parent from child

	dashboard.currentNode.gotoRedirect.remove();


	dashboard.currentNode.updateConnectionsSVG();


	dashboard.updateDashboard();
});




$(document).on('click', "#dashboard", function(e) {
		// console.log("clicke
		// console.log($(e.target))
	// $('.active').removeClass("active");
	if(dashboard.isVisable==false){
		console.log("start node from dash")
		clickedNode = nodeObjs.nodesDict["start"]
		dashboard.show(clickedNode);
	}
});








function Dashboard(){
	this.$dash=$('#dashboard');

	this.currentNode //= nodeObjs.nodesDict['start'];
	this.isVisable=false

	this.inputConsole

	this.hide = function(){
		this.isVisable=false
		
		this.$dash.removeClass("dashboard-on");
		this.$dash.addClass("dashboard-off");
		this.$dash.addClass("fuckermother");


		$('.active').removeClass("active");
	}

	this.show=function(node_){
		node_=node_ || this.currentNode;
		this.isVisable=true
		this.currentNode = node_
		// $('.active').removeClass("active");

		this.$dash.removeClass("dashboard-off");
		this.$dash.addClass("dashboard-on");


		// node_.$myDiv.addClass("active");
		node_.activateNode();
		node_.activateConnections();



		this.updateDashboard();
	}

	this.updateDashboard = function() {
		console.log("UPDATING DASH")
		loadingNode=true;
		this.$dash = $(".dashboard_template").clone()
		$('#dashboard').replaceWith(this.$dash)
		this.$dash.attr('id', 'dashboard');
		this.$dash.removeClass("dashboard_template")
		this.$dash.show();

		this.$dash.find(".console-input").addClass("active")

		this.inputConsole=this.$dash.find(".console-input.active")



		


		// $("#content").find("#dashboard_template").clone().insertAfter($("#outputs-dash").find(".input-span").parent());


		$("#input-node-name-dash").val(this.currentNode.name);
		$("#conditions-input-dash").val(this.currentNode.conditions);
		for(var i=0; i<this.currentNode.output.values.length; i++){
			// $("#outputs-dash").find(".input-span").text(node_.output.values[i]);
			newOutputDiv = $(".output-dash-template").clone();
			$("#outputs-dash").append(newOutputDiv);
			newOutputDiv.removeClass("output-dash-template");
			newOutputDiv.find(".input-span").text(this.currentNode.output.values[i])
			newOutputDiv.show();

		}




		// $("#passon-dash").html(this.currentNode.type);

		if(this.currentNode.children.length>0){
			$("#next-classification").html("Children")
			for(var i=0; i<this.currentNode.children.length; i++){
				// $("#outputs-dash").find(".input-span").text(this.currentNode.output.values[i]);
				newChildDiv = $(".next-node-template").clone();
				$("#next-dash").append(newChildDiv);
				newChildDiv.removeClass("next-node-template");
				newChildDiv.find(".next-node").addClass("child");
				newChildDiv.find(".next-node-name").html(this.currentNode.children[i].name)
				newChildDiv.show();
			}
		}else if(this.currentNode.gotoRedirect.targetNode){
			$("#next-classification").html("Goto")
			newChildDiv = $(".next-node-template").clone();
			$("#next-dash").append(newChildDiv);
			newChildDiv.removeClass("next-node-template");
			newChildDiv.find(".next-node").addClass("goto");
			newChildDiv.find(".next-node-name").html(this.currentNode.gotoRedirect.targetNode.name)
			newChildDiv.show();

		}else{
			$("#next-classification").html("NO OUTPUT")
		}

		if(this.currentNode.parent != null){
			$("#parent-dash").html(this.currentNode.parent.name);

			

		}
		new Treant(new Chart(this.currentNode).getChart());

		newOutputDiv = $(".output-dash-template").clone();
		$("#outputs-dash").append(newOutputDiv);
		newOutputDiv.removeClass("output-dash-template");
		newOutputDiv.show();

		if(this.currentNode.parent != null){
			for(var i=0; i<this.currentNode.parent.children.length; i++){
				// $("#outputs-dash").find(".input-span").text(this.currentNode.output.values[i]);
				newSiblingDiv = $(".sibling-template").clone();
				$("#siblings-dash").append(newSiblingDiv);
				newSiblingDiv.removeClass("sibling-template");
				if(this.currentNode.parent.children[i].name == this.currentNode.name){
					newSiblingDiv.addClass("highlight-this-sibling")
				}
				newSiblingDiv.find(".sibling-name").html(this.currentNode.parent.children[i].name);
				newSiblingDiv.show();
			}
		}
		loadingNode=false;
	}
}

