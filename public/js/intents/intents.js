var focusIntentName, focusePhrase, focuseIntent

$(document).ready(function() {
	console.log("loaded...")
	// $(function(){
	//     $(".chzn-select").chosen();
	// });


	$("#newIntent").click(function() {
		// newIntent();
		newIntent = intentsList.getSlashMakeClassification("fuck")
		newIntent.showDiv()
	});	


	//change intent name
	$("#intentFieldSet").on("focus", ".input-intent", function(){
		focusIntentName=$(this).val()
	});
	$("#intentFieldSet").on("change", ".input-intent", function(){
		intentsList.changeClassification(focusIntentName,$(this).val())
	});


	$("#intentFieldSet").on("focus", ".input-phrase", function(){
		intentName= ($(this).parent().parent().parent().parent().find(".input-intent").val())
		focuseIntent = intentsList.intentsDict[intentName]
		for(var i=0; i<focuseIntent.phrases.length;i++){
			if(focuseIntent.phrases[i].text == $(this).val()){
				focusePhrase=focuseIntent.phrases[i]
			}
		}
		
	});
	$("#intentFieldSet").on("change", ".input-phrase", function(){
		focusePhrase.text=$(this).val()
	});








	$("#intentFieldSet").on('click', ".new-phrase-button", function(){

		// newPhrase($(this).parent());
		currentIntent = intentsList.intentsDict[$(this).parent().find(".input-intent").val()]
		currentIntent.addBlankPhrase()
		currentIntent.updateDiv()
		// intent=$(this).parent()
		// addBlankPhrase
	});


	$("#intentFieldSet").on('click', ".remove-phrase", function(){
		var intentName = ($(this).parent().parent().parent().parent().find(".input-intent").val())
		var phraseText = ($(this).parent().parent().find(".input-phrase").val())

		console.log(intentName)
		intentsList.intentsDict[intentName].removePhrase(phraseText)

	});
	$("#intentFieldSet").on('click', ".remove-intent", function(){
		var intentName = ($(this).parent().parent().find(".input-intent").val())
		intentsList.intentsDict[intentName].delete()
	});



});

function initalizeIntentDivs(){
	for(key in intentsList.intentsDict){
		// for(var j=0; j<intentsList.intentsDict[key].phrases.length;j++){
		// 	intentsList.intentsDict[key].phrases[j].showDiv()
		// }
		intentsList.intentsDict[key].showDiv()

		// var classification = data[i].classification
		// $div = $("#"+classification)
		// if($div.length==0){
		// 	$div = newIntent(classification)
		// }
		// newPhrase($div, data[i].phrase)
	}
}

// function processJSON(data){
	
// 	// data=JSON.parse(data.json)
// 	// console.log(data)
// 	data=data.json
// 	// console.log(data)
// 	for(i =0; i<data.length; i++){
// 		// console.log(data[i])
// 		// console.log(data[i].classification)
// 		var classification = data[i].classification
// 		$div = $("#"+classification)
// 		if($div.length==0){
// 			$div = newIntent(classification)
// 		}
// 		newPhrase($div, data[i].phrase)
// 	}
// }


// var intentsList=[]
var cloneCount=0;
// function newIntent(intent){
	
// 	intent = intent || ""
// 	intentsList.push(intent)
// 	intentsList
// 	var $newDiv = $("#intent_template").clone().attr('style', 'display: normal;')
// 	$newDiv.attr("id",intent);
// 	$newDiv.appendTo( "#intentFieldSet" );
// 	$newDiv.find(".input-intent").val(intent);
	
// 	return $newDiv	
// }
// function newPhrase($div, phrase){
// 	phrase=phrase|| "";
// 	$newDiv = $("#phrase_template").clone().attr('style', 'display: normal;')
// 	$div.find(".phrases").prepend($newDiv)
// 	$newDiv.removeAttr("id");
// 	$newDiv.find(".input-phrase").val(phrase)
// }


















function saveData(){
	
	// $("#JSON-output").html($("#content").find(".input-entity").length)
	
	intentPhrases=[]

	// var intentsDivs = $("#intentFieldSet").find(".input-intent")
	// for(var i=0; i < intentsDivs.length ;i++){
		
	// 	var intentInput=$(intentsDivs[i])
	// 	var intent = intentInput.val()

	// 	var phrasingDivs= intentInput.parent().parent().find(".input-phrase");
	// 	// for(var j=phrasingDivs.length-1; j>=0;j--){
	// 	// 	var intentPhrase={
	// 	// 		"classification":intent,
	// 	// 		"phrase":$(phrasingDivs[j]).val(),
	// 	// 		"tokens":
	// 	// 	}
	// 	// 	intentPhrases.push(intentPhrase)
	// 	// }
		
		
	// }
	for(key in intentsList.intentsDict){
		var intent = intentsList.intentsDict[key];
		for(var i=0;i<intent.phrases.length;i++){
			var intentPhrase={
				"classification":intent.phrases[i].classification,
				"phrase":intent.phrases[i].text,
				"tokens":intent.phrases[i].tokens
			}
			// console.log(i)
			intentPhrases.push(intentPhrase)
		}
	}
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




    deleteLearningData(true);
    // saveLearningData()
    // refreshData()
}















