var nodeObjs; //=new Nodes();

var $fromConnection;
var fromSiblingConnection;
var fromGoToConnection;
var fromRedirectConnection;

// var connections = new Connections();

var mouseX
var mouseY

var $mouseConnection

// var currentNode;
var loadingNode=false;

var xSpacing = 150
var ySpacing = 150;

var dashboard;

var draggingNode = false
var shiftPressed=false
var mousePressed=false
var connectionMouse
var intervalMouse 



//------------------------------------------ on load -------------------------------------------------
$(document).ready(function() {
	console.log("loaded...")

	nodeObjs = new Nodes();

	dashboard = new Dashboard();

	$.ajax({
	  dataType: "json",
	  url: "https://eyk287.itp.io:5000/static/new_node.json",
	  success: processJSON
	});
	
	// url: "https://eyk287.itp.io:5000/static/new_nodes.json",
	window.onbeforeunload = function(e) {
	    return 'Ask user a page leaving question here';
	}; 


	//create new node
	newNodeConsole($("#content"));


	//track mouse possition
	$(document).mousemove(function(e) {
		mouseX = e.pageX;
		mouseY = e.pageY;
		$("#mouse-div").offset({
			top: mouseY,
			left: mouseX
		});

		if(draggingNode){

			draggingNode.updateNodeMove(shiftPressed);
			

		}
	});

	// $("#goto-entities").click(function(){
	// 	console.log("fuck")
	// 	location.href='../entities/index.html'
	// })

	// on mouse release of dranging the new node into the sketch
	$(document).on('mouseup', "#console-node", function() {
		newNode = nodeObjs.addNode($(this))

		placeNode(newNode)
		// add new node to console
		newNodeConsole($("#content"));
	});

	$(document).on('mouseup', ".mainNode", function(e) {
		if(!$(e.target).hasClass("connect-in")){
			node = nodeObjs.nodesDict[$(this).find('.node-name').html()]
			node.snapToGrid();
			node.updateNodeMove(shiftPressed);
		}

	});



	$(document).keydown(function (e) {
	    if (e.keyCode == 16) {
	        shiftPressed = true
	    }
	});
	$(document).keyup(function () {
	    shiftPressed = false
	});



	//------------------------------------------------ mouse connection -----------------------------------------------
	$(document).on('mousedown', function(e) {
		var $target = $(e.target)
		mousePressed=true;
		if($target.hasClass("connect-out")){
			$fromConnection = $target;

			connectionMouse = new ConnectionSVGMouse(nodeObjs.nodesDict[$fromConnection.parent().find(".node-name").html()])

			intervalMouse = setInterval(function() {


				if (connectionMouse) {
					connectionMouse.update();
					console.log(mouseX +" - "+ $(document).scrollLeft() +"???   " + (mouseX - $('html').offset().left))


					if(mouseX - $(document).scrollLeft()<30){
						console.log("scrole left       :  " + mouseX)
						$(document).scrollLeft($(document).scrollLeft()-10)
					}
					else if(mouseX - $(document).scrollLeft()<60){
						console.log("scrole left       :  " + mouseX)
						$(document).scrollLeft($(document).scrollLeft()-5)
					}
				}
			}, 20);


			// $target.connections({
			// 	to: $('#mouse-div'),
			// 	'class': 'mouse-connect connection child-mouse'
			// });

			// //create the moving connection near the mouse
			// $mouseConnection = $('.mouse-connect');
			// setInterval(function() {
			// 	if ($mouseConnection) {
			// 		$mouseConnection.connections('update');
			// 	}
			// }, 20);
		}
		// else if($target.hasClass("connect-in")){
		// 	fromSiblingConnection = $target;

		// 	$target.connections({
		// 		to: $('#mouse-div'),
		// 		'class': 'mouse-connect connection sibling-mouse'
		// 	});

		// 	//create the moving connection near the mouse
		// 	$mouseConnection = $('.mouse-connect');
		// 	setInterval(function() {
		// 		if ($mouseConnection) {
		// 			$mouseConnection.connections('update');
		// 		}
		// 	}, 20);
		// }
		//active updates when dragging
		else if($target.hasClass("mainNode") || $target.hasClass("node-name")){

			if($target.hasClass("mainNode")){

				draggingNode = nodeObjs.nodesDict[$target.find(".node-name").html()]
			}else{
				draggingNode = nodeObjs.nodesDict[$target.html()]
			}

		}

		
	});


	//remove connection near mouse
	$(document).mouseup(function() {
		if (connectionMouse) {
			connectionMouse.$div.remove();


			clearInterval(intervalMouse);
		}

		connectionMouse=null;


		draggingNode=false
		mousePressed=false
	})
	//------------------------------------------------ mouse connection end -----------------------------------------------








	$(document).on('mouseup', function(e) {

		if($(e.target).hasClass("connect-in")){
			if($fromConnection){
				// if(node)

				
				nodeNameTo = $(e.target).parent().attr('id');
				nodeTo = nodeObjs.nodesDict[nodeNameTo]

				nodeNameFrom=$fromConnection.parent().attr('id');
				nodeFrom = nodeObjs.nodesDict[nodeNameFrom]

				// console.log(nodeFrom.name)


				if(nodeFrom.type=="goto" || nodeFrom.type=="redirect"){
					nodeFrom.gotoRedirect.setValues(nodeTo, nodeFrom.type);
					nodeFrom.updateConnectionsSVG();
				}else if(nodeFrom.type=="hierarchy" || nodeFrom.type=="heterarchy"){
					if(nodeFrom.isEligableChild(nodeTo)){
						//two nodes cant be parents to the same child
						if(nodeTo.parent){
							var parent= nodeTo.parent
							parent.removeChildren()
							parent.updateConnectionsSVG();
						}

						nodeTo.addParent(nodeFrom);

						nodeFrom.updateConnectionsSVG();
					}else{
						alert("can't have recursive parent")
						console.log("can't have recursive parent")
					}
				}
				
			}
			if(dashboard.isVisable){
				dashboard.updateDashboard()
			}
			// if(fromSiblingConnection){
			// 	nodeNameTo = $(e.target).parent().attr('id');
			// 	nodeTo = nodeObjs.nodesDict[nodeNameTo]

			// 	nodeNameFrom=$(fromSiblingConnection).parent().attr('id');
			// 	nodeFrom = nodeObjs.nodesDict[nodeNameFrom]
			// 	nodeFrom.addConnectionTo(nodeTo, "sibling")
			// }
		}


		// $(document).on('mousedown', function(e) {
		// 	console.log("this")
		// 	console.log(this)
		// 	console.log("e.taget")
		// 	console.log(e.target)
		// 	// console.log(e.srcElement.tagName)
			
		// });




	
		$fromConnection=null;
		fromSiblingConnection=null;


	});







	// ___________________________________________ show console __________________________________________
	$(document).on('click', "#show-console", function() {
		$( "#console" ).toggle();
	});



	//dropdown
	$(document).on('click', ".responceStructure", function() {
		// nodeObjs.nodesDict[$(this).parent().parent().parent().parent().find(".node-name").html()].changeType($(this).html());
		nodeObjs.nodesDict[$(this).parent().parent().parent().parent().find(".node-name").html()].setType($(this).html());
	});



	$(document).on('click', ".mainNode", function() {
		
		nodeFocus($(this).find(".node-name").html())
	});

	

	//hid dashboard
	$("#content").on('click', function(e) {
		// console.log("clicke
		// console.log($(e.target))
		console.log("hiding1")
		console.log(e.target)
		console.log($(e.target).hasClass("svg-connect"))
		if(e.target == this || $(e.target).hasClass("connetion") || $(e.target).hasClass("svg-connect") || $(e.target).hasClass("svg-connect")){
			console.log("hiding2")
			dashboard.hide()
		}	
	});
	//or click a connection



	$("#input-span").focus(function() {
		$("#input-container").css("border-color", "#3399FF");
	});




	//******************************* dashboard ************************************
	//update node values from dash
	$("#content").on('change', "#input-node-name-dash", function() {
		//remove space
		var inputVal = $(this).val().replace(/ /g, "_")
		$(this).val(inputVal);

		//change the name of the key, node object, parent div, and connetion ids
		dashboard.currentNode.changeDivName(inputVal);
		dashboard.currentNode.changeName(inputVal);
	});

	$("#content").on('change', "#conditions-input-dash", function() {

		//change the name of the key, node object, parent div, and connetion ids
		inputVal = $(this).val()
		dashboard.currentNode.changeConditions(inputVal);
	});


	$(document).on('click', ".force-node", function(e) {
		// console.log(dashboard.currentNode.name)
		sendForceNodeRequest(dashboard.currentNode.name)
	});



	






	//remove child
	
	$("#content").on('click', ".remove.next-node.child", function() {
		//remove parent from child

		var nextNode=nodeObjs.nodesDict[$(this).parent().find('.next-node-name').html()]


		var parentNode = nextNode.parent;
		nextNode.removeParent()
		parentNode.removeChild(nextNode.name)


		parentNode.updateConnectionsSVG();

	
		dashboard.updateDashboard();
	});
	//remove goto
	$("#content").on('click', ".remove.next-node.goto", function() {
		//remove parent from child

		dashboard.currentNode.gotoRedirect.remove();


		dashboard.currentNode.updateConnectionsSVG();

	
		dashboard.updateDashboard();
	});








	//add remove output
	$("#content").on('click', ".add.output", function() {
		loadingNode=true;
		newNodeDiv = $(this).parent().clone().insertAfter($(this).parent());
		newNodeDiv.find(".input-span").text("")
		dashboard.currentNode.insertOutValue("", $("li").index(newNodeDiv))
		loadingNode=false;
	});
	$("#content").on('click', ".remove.output", function() {
		dashboard.currentNode.deleteOutValue($("li").index($(this).parent()))
		$(this).parent().remove();
	});

	// add/ change output on change
	$("#content").on('DOMSubtreeModified', ".input-span", function() {
		dashboard.currentNode.updateOutput(this)
	});

	$("#content").on("click", '.delete-node', function(){
		
		//remove from dict
		nodeObjs.deleteNode(dashboard.currentNode)
	})






	$(window).scroll(function() {
		// console.log($(this).scrollTop())
	    $('#console-node').css('top', $(this).scrollTop() + "px");
	    $('#console-node').css('left', $(this).scrollLeft() + "px");
	});



});

cloneCount = 0;

function newNodeConsole(parent) {
	console.log(parent)
	newNodeDiv = $("#node_template").clone().attr('id', "console-node").attr('style', 'curved').appendTo(parent);
	console.log(newNodeDiv)
	//?????????????????????***
	newNodeDiv.draggable()
	newNodeDiv.offset({
		top: 20,
		left: 20
	});

	newNodeDiv.find("toggle-horazontal-shit-bar").draggable()
	return newNodeDiv
}

























function nodeFocus(nodeName_){
	$('.active').removeClass("active");
	clickedNode = nodeObjs.nodesDict[nodeName_]
	dashboard.show(clickedNode);
}





function processJSON(data) {
	

	//create all nodes
	for (i = 0; i < data.length; i++) {
		nodeObjs.addNode(newNodeConsole($("#content")), data[i].dialog_node)
	}

	//add data from json 
	for (i = 0; i < data.length; i++) {
		nodeObjs.nodesDict[data[i].dialog_node].processJSON(data[i])
	}

	// for (i = 0; i < data.length; i++) {
	// 	nodeObjs.nodesDict[data[i].dialog_node].updateConnections();
	// }

	for (i = 0; i < data.length; i++) {
		nodeObjs.nodesDict[data[i].dialog_node].placePosition();
	}

	for (i = 0; i < data.length; i++) {
		nodeObjs.nodesDict[data[i].dialog_node].updateConnectionsSVG();
	}



	

	//color connections
	// for (i = 0; i < data.length; i++) {
	// 	nodeObjs.nodesDict[data[i].dialog_node].refreshConnectionToChildren();
	// }
	// organize();

}

function exportJSON(){
	jsonOut=[]
	for(var key in nodeObjs.nodesDict){
		//console.log(nodeObjs.nodesDict[key].getJSON())
		jsonOut.push(nodeObjs.nodesDict[key].getJSON());
	}
	sendJSONNodes(jsonOut)
	// return JSON.stringify(jsonOut);
}


function placeNode(node_){
	if (node_.getPosition().top > -1000) {
		node_.snapToGrid();
	} else {
		//delete this node
		

		node.removeDiv();
		nodeObjs.removeNode(node);
		
	}
}

function Dashboard(){
	this.$dash=$('#dashboard');

	this.currentNode;
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
		this.isVisable=true
		this.currentNode = node_
		// $('.active').removeClass("active");

		this.$dash.removeClass("dashboard-off");
		this.$dash.addClass("dashboard-on");

		node_.$myDiv.addClass("active");
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






















