
$(document).ready(function() {
	console.log("loaded...")

	$("#saveJSON").click(function() {

		createJSON()

	});





	$("#newIntent").click(function() {
		newIntent();
	});	


	








	$("#intentFieldSet").on('click', ".new-phrase-button", function(){
		console.log("yes fuc");
		newPhrase($(this).parent());
	    
	});


	$("#intentFieldSet").on('click', ".remove-phrase", function(){
		$(this).parent().remove()
	});
	$("#intentFieldSet").on('click', ".remove-intent", function(){
		$(this).parent().parent().remove()
	});



	$.ajax({
	  dataType: "json",
	  url: "/getLatestIntents",
	  success: processJSON
	});





});


function processJSON(data){
	
	// data=JSON.parse(data.json)
	// console.log(data)
	data=data.json
	console.log(data)
	for(i =0; i<data.length; i++){
		console.log(data[i])
		// console.log(data[i].classification)
		var classification = data[i].classification
		$div = $("#"+classification)
		if($div.length==0){
			$div = newIntent(classification)
			
		}
		newPhrase($div, data[i].phrase)
	}
}



var cloneCount=0;
function newIntent(intent){
	intent = intent || ""
	console.log("what  " + intent)
	var $newDiv = $("#intent_template").clone().attr('style', 'display: normal;')
	$newDiv.attr("id",intent);
	$newDiv.appendTo( "#intentFieldSet" );
	$newDiv.find(".input-intent").val(intent);
	
	return $newDiv	
}
function newPhrase($div, phrase){
	phrase=phrase|| "";
	$newDiv = $("#phrase_template").clone().attr('style', 'display: normal;')
	$div.find(".phrases").prepend($newDiv)
	$newDiv.removeAttr("id");
	$newDiv.find(".input-phrase").val(phrase)
	// newDiv = $("#phrase_template").clone().attr('style', 'display: normal;').appendTo( $div);
   	// return newDiv
}


















function createJSON(){
	
	// $("#JSON-output").html($("#content").find(".input-entity").length)
	
	intentPhrases=[]

	var intentsDivs = $("#intentFieldSet").find(".input-intent")
	for(var i=0; i < intentsDivs.length ;i++){
		
		var intentInput=$(intentsDivs[i])
		// console.log(301 + entityInput.val())
		// console.log(entityInput.parent().parent().parent().find(".input-catagory").val())
		var intent = intentInput.val()
		// var intentPhrase={
		// 	"intent":intentInput.val(),
		// 	"phrases":[],
		// 	"open_list": false,
		// 	"description": null
		// }
		var phrasingDivs= intentInput.parent().parent().find(".input-phrase");
		for(var j=phrasingDivs.length-1; j>=0;j--){
			// console.log(j)
			// intent.phrases.push($(phrasingDivs[j]).val())
			var intentPhrase={
				"classification":intent,
				"phrase":$(phrasingDivs[j]).val(),
			}
			intentPhrases.push(intentPhrase)
		}
		
	}

	// console.log(JSON.stringify(intentPhrases))


	// entitySend = {"json":entities}
	console.log(typeof(intentPhrases))
	intintsSend = intentPhrases


	$.ajax({
        url: '/addIntents',
        type: 'POST',
        data: {
            "jsonArray": JSON.stringify(intentPhrases)
        },
        success: function(data){
            console.log(data);
        }
    });
}















