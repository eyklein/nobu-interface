var nodeObjs; //=new Nodes();

$(document).ready(function() {
	console.log("loaded... global nodes")
	nodeObjs = new Nodes();

	$.ajax({
	  dataType: "json",
	  url: "/getLatestNodes",
	  success: processJSONNodes
	});

});


function processJSONNodes(data) {
	// console.log("***************************************")
	
	data = data.json
	

	// console.log(data)
	//create all nodes
	for (i = 0; i < data.length; i++) {
		// nodeObjs.addNode(newNodeConsole($("#content")), data[i].dialog_node)
		nodeObjs.addNode(data[i].dialog_node)


		// console.log("-------------------------------------------")
		// console.log(data[i])
		// console.log(data[i].dialog_node)
	}

	//add data from json 
	for (i = 0; i < data.length; i++) {
		nodeObjs.nodesDict[data[i].dialog_node].processJSON(data[i])
	}

	// for (i = 0; i < data.length; i++) {
	// 	nodeObjs.nodesDict[data[i].dialog_node].updateConnections();
	// }

	// for (i = 0; i < data.length; i++) {
	// 	nodeObjs.nodesDict[data[i].dialog_node].placePosition();
	// }

	// for (i = 0; i < data.length; i++) {
	// 	nodeObjs.nodesDict[data[i].dialog_node].updateConnectionsSVG();
	// }
	if(location.pathname == "/dialogue"){
		initalizeDivs()
	}
	if(dashboard){
		dashboard.currentNode=nodeObjs.nodesDict['start']
	}
}