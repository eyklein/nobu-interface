

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



var draggingNode = false
var shiftPressed=false
var mousePressed=false
var connectionMouse
var intervalMouse 



//------------------------------------------ on load -------------------------------------------------
$(document).ready(function() {
	console.log("loaded...")

	// nodeObjs = new Nodes();


	
	// $.ajax({
	//   dataType: "json",
	//   url: "/getLatestNodes",
	//   success: processJSON
	// });
	
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

		}




	
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





	$("#input-span").focus(function() {
		$("#input-container").css("border-color", "#3399FF");
	});




	



	






	













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







function exportJSON(){
	jsonOut=[]
	for(var key in nodeObjs.nodesDict){
		//console.log(nodeObjs.nodesDict[key].getJSON())
		jsonOut.push(nodeObjs.nodesDict[key].getJSON());
	}
	// sendJSONNodes(jsonOut)
	// post('/addNodes',{"json":JSON.stringify(jsonOut)})
	// return JSON.stringify(jsonOut);
	$.ajax({
        url: '/addNodes',
        type: 'POST',
        data: {
            "jsonArray": JSON.stringify(jsonOut)
        },
        success: function(data){
            console.log(data);
        }
    });
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






















