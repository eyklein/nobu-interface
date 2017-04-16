function Chart(node_){
	this.node=node_;

	if(node_.parent){
		this.parent=node_.parent
	}
	


	this.getChartNode = function(node_, children=false, isGoto = false){
		var childrenObjects=[]
		if(children==true){
			for(var i=0; i<node_.children.length; i++){

				childrenObjects.push(this.getChartNode(node_.children[i], this.node==node_.children[i]))
			}
		}	
		var addedClass=""
		if(this.node==node_){
			addedClass = "active"
			if(node_.gotoRedirect.targetNode){
				childrenObjects.push(this.getChartNode(node_.gotoRedirect.targetNode, false, true));
			}
		}else{
			// addedClass="k"
		}
		if(isGoto){
			addedClass = "goto"
		}
		

		returnObj = {
			"HTMLclass": addedClass,
			"text": { "name": node_.name },
			"children": childrenObjects,
			"collapsable": false,
			"collapsed": false,
		}

		return returnObj;
	}



	this.getChart=function(){
		returnChart = {
			chart: {
				container: "#OrganiseChart-simple",
				hideRootNode: false,
				connectors: {
					type: 'step',
					style: {
						"arrow-end": "classic-wide-long",
						"stroke-width": .1,
						"stroke": "#665B57"
					}
				},
				node: {
					collapsable: false
				},
				animation: {
					nodeAnimation: "easeOutBounce",
					nodeSpeed: 700,
					connectorsAnimation: "bounce",
					connectorsSpeed: 700
				}
			},
			"nodeStructure":{}
		}

		

		if(this.parent){
			var structure = this.getChartNode(this.parent, true)
		}else{
			var structure = this.getChartNode(this.node,true)
		}


		returnChart.nodeStructure = structure;

		return returnChart;
	}
	

	
}


var simple_chart_config = {
	chart: {
		container: "#OrganiseChart-simple",
		hideRootNode: false,
		connectors: {
			type: 'step',
			style: {
				"arrow-end": "classic-wide-long",
				"stroke-width": 1,
				"stroke": "#665B57"
			}
		},
		node: {
			collapsable: false
		},
		animation: {
			nodeAnimation: "easeOutBounce",
			nodeSpeed: 700,
			connectorsAnimation: "bounce",
			connectorsSpeed: 700
		}
	},
	nodeStructure: {
		text: { name: "Garnd Parent" },
		children: [
			{	
				HTMLclass: "node",
				text: { name: "parent" },
				children: [
					{
						// text: { name: "Event 2" }
						HTMLclass: "",
						text: { name: "Sibling" },
						collapsed: false,
							children: [
								{
									text: { name: "Event 1" },
								},
								{
									text: { name: "Event 2" }
									
								}
							]


					},{
						HTMLclass: "",
						text: { name: "This" },
						collapsed: false,
							children: [
								{
									text: { name: "child 1" },
								},
								{
									text: { name: "child 2" }
									
								}
							]


					}
				]
			}
		]
	}
};


// var simple_chart_config = {
// 	chart: {
// 		container: "#OrganiseChart-simple",
// 		hideRootNode: false,
// 		connectors: {
// 			type: 'step',
// 			style: {
// 				"arrow-end": "classic-wide-long",
// 				"stroke-width": 1,
// 				"stroke": "#665B57"
// 			}
// 		},
// 		node: {
// 			collapsable: false
// 		},
// 		animation: {
// 			nodeAnimation: "easeOutBounce",
// 			nodeSpeed: 700,
// 			connectorsAnimation: "bounce",
// 			connectorsSpeed: 700
// 		}
// 	},
	
// 	nodeStructure: {
// 		text: { name: "Parent node" },
// 		children: [
// 			{	
// 				HTMLclass: "main-date",
// 				text: { desc: "", name: "01.01.2014" },
// 				children: [
// 					{
// 						text: { name: "Event 1" },
// 					},
// 					{
// 						// text: { name: "Event 2" }
// 						HTMLclass: "",
// 						text: { name: "12.02.2014" },
// 						collapsed: false,
// 							children: [
// 								{
// 									text: { name: "Event 1" },
// 								},
// 								{
// 									text: { name: "Event 2" }
									
// 								}
// 							]


// 					}
// 				]
// 			},
// 			{	
// 				HTMLclass: "main-date",
// 				text: { name: "sib 1" },
// 				collapsed: false,



// 				children: [
// 					{
// 						text: { name: "Event 1" }
// 					},
// 					{
// 						text: { name: "Event 2" }
// 					}
// 				]
// 			},
// 			{
// 				HTMLclass: "main-date",
// 				text: { name: "23.02.2014" },
// 				children: [
// 					{
// 						text: { name: "Event 1" }
// 					},
// 					{
// 						text: { name: "Event 2" }
// 					}
// 				]
// 			},
// 			{
// 				HTMLclass: "main-date",
// 				text: { name: "03.06.2014" }
// 			}
// 		]
// 	}
// };

