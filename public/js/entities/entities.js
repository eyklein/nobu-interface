

$(document).ready(function() {
	console.log("loaded...")

	$("#saveJSON").click(function() {

		createJSONText("data/save.json")

	});





	$("#newEntityCatagory").click(function() {
		newEntityCatagory();
	});	


	// create a new catagory name change event 
	$("#entityFieldSet").on('change', ".input-catagory", function(){
			// check if catagory already exsists
	    var $myDiv = $('#' + $(this).val());
	    if ($myDiv.length){
	        console.log("this div alread exsists")
	        $(this).val($(this).parent().attr('id'))
	    }
	 	else{
			$(this).parent().attr('id',$(this).val())
		}
	});

	// create a new entity when last one is full and uneque
	// $("#entityFieldSet").on('change', ".input-entity", function(){
	// 		// check if catagory already exsists
	//     // var simialarDiv = $('#' + $(this).val());
	    
	//     if ($(this).val()==""){
	//         // console.log("this div alread exsists")
	//         $(this).val("")
	//     }
	//  	else{
	//  		console.log("new")
	// 		entDiv = newEntity($(this).parent().parent().parent());
	// 		// newValue($(this).parent())
	// 	}
	// });


	// $("#entityFieldSet").on('change', ".input-value", function(){
	// 		// check if catagory already exsists
	//     // var simialarDiv = $('#' + $(this).val());
	    
	//     if ($(this).val()==""){

	//     }
	//  	else{
	//  		console.log("new")
	// 		newValue($(this).parent().parent());
	// 	}
	// });




	$("#entityFieldSet").on('click', ".new-entity-button", function(){
		console.log($(this).parent());
		newEntity($(this).parent());
	    
	});

	$("#entityFieldSet").on('click', ".new-value-button", function(){
		newValue($(this).parent())
	    
	});

	$("#entityFieldSet").on('click', ".remove-value", function(){
		console.log("got here")
		$(this).parent().remove()
	    
	});
	$("#entityFieldSet").on('click', ".remove-entity", function(){
		console.log("got here")
		$(this).parent().parent().remove()
	    
	});
	

	// $("#entityFieldSet").on('click', ".value", function(){
		
	// 	$(this).draggable()
	    
	// });









	// $.ajax({
	//   dataType: "json",
	//   url: "data/entities.json",
	//   success: processJSON
	// });

	$.ajax({
	  dataType: "json",
	  url: "/getLatestEntities",
	  success: processJSON
	});





});

function processJSON(data){
	
	data=JSON.parse(data.json)
	for(i =0; i<data.length; i++){
		console.log(data[i].entity)
		if(data[i].type in catagoriesDict){
			catagoriesDict[data[i].type].addEntity(data[i])
		}else{
			catagoriesDict[data[i].type]=new Catagory(data[i].type)
			console.log(typeof(catagoriesDict[data[i].type]))
			catagoriesDict[data[i].type].addEntity(data[i])
		}
	}
	// newEntityCatagory
	for(var key in catagoriesDict){
		catDiv = newEntityCatagory(catagoriesDict[key].name);
		entities=catagoriesDict[key].entities
		for(keyEnt in entities){
			entDiv = newEntity(catDiv, entities[keyEnt].entity)
			var values = entities[keyEnt].values
			for(var i = 0; i < values.length ; i++){
				newValue(entDiv, values[i].value)
			}
		}
	}
}


var catagoriesDict = {};
function Catagory(name_){
	this.name=name_;
	this.entities={}

	this.addEntity=function(entityJSON){
		this.entities[entityJSON.entity]=entityJSON
	}
}




//create new entity catagory
var cloneCount=0;
function newEntityCatagory(id){
	id = id || 'id'+ cloneCount++
	newDiv = $("#entityCatagory_template").clone().attr('id', id).attr('style', 'display: normal;').appendTo( "#entityFieldSet" );
	newDiv.find(".input-catagory").val(newDiv.attr('id'));
   	return newDiv
}

var entityNumber=0
function newEntity($parent, entName){
	entName=entName||""
	console.log("enr name : " + entName)
	// newEntity = $(this_).before( $("#entity_template").clone().attr('style', 'normal'));
	
	// newEnt = $("#entity_template").clone().attr('style', 'display: normal;').appendTo( $parent);

	newEnt = $("#entity_template").clone().attr('style', 'display: normal;').insertBefore( $parent.find(".new-entity-button"));
	// newEnt.attr('id', newEnt.parent().attr('id')+ "_" + entityNumber++)
	console.log(newEnt)
	newEnt.removeAttr("id");
	// newEnt.insertBefore($parent.find(".new-entity-button"))
	newEnt.find(".input-entity").val(entName);
	return newEnt
   	// newDiv.find(".input-catagory").val(newDiv.attr('id'));

}

function newValue($parent, valueIn){
	valueIn= valueIn || ""
	newVal = $("#value_template").clone().attr('style', 'normal').appendTo( $parent);
	newVal.removeAttr("id");
	newVal.insertBefore($parent.find(".new-value-button"))
	newVal.find(".input-value").val(valueIn);
}

function createJSONText(data){
	
	// $("#JSON-output").html($("#content").find(".input-entity").length)
	console.log($("#entityFieldSet").find(".input-entity"))
	
	entities=[]

	var entityDivs = $("#entityFieldSet").find(".input-entity")
	for(var i=0; i < entityDivs.length ;i++){
		
		var entityInput=$(entityDivs[i])
		// console.log(301 + entityInput.val())
		// console.log(entityInput.parent().parent().parent().find(".input-catagory").val())
		var entity={
			"entity":entityInput.val(),
			"type": entityInput.parent().parent().parent().find(".input-catagory").val(),
			"values":[],
			"open_list": false,
			"description": null
		}
		var valueDivs= entityInput.parent().parent().find(".input-value");
		for(var j=0; j<valueDivs.length;j++){
			entity.values.push({
				"value":$(valueDivs[j]).val(),
				"synonyms":[]
			})
		}
		entities.push(entity)
		
	}
	console.log(JSON.stringify(entities))


	// entitySend = {"json":entities}
	entitySend = {"json":JSON.stringify(entities)}

	post('/addEntities',entitySend)


	

}

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
    	console.log("my key : " + key)
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
}













