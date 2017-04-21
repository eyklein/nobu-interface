learningEntries=[]
$(document).ready(function() {
	console.log("loaded...")



	$.ajax({
	  dataType: "json",
	  url: "/getLearningIntents",
	  success: processLearningIntents
	});


	$(document).on('click', ".approve-intent", function(){
		// console.log($(this).parent().parent().parent().find(".input-learning-phrase").val())
		phraseText = $(this).parent().parent().parent().find(".input-learning-phrase").val()
		classificationVal = $(this).parent().parent().parent().find("span").html()
		console.log(classificationVal)
		for(var i=0;i<learningEntries.length;i++){
			if(phraseText == learningEntries[i].phrase){
				learningEntries[i].classification = classificationVal
				learningEntries[i].addPhraseToIntent()
				learningEntries.splice(i,1)
			}
		}
	});


	$(document).on('click', ".remove-learning-phrase", function(){
		phraseText = ($(this).parent().parent().find(".input-learning-phrase").val())
		for(var i=0;i<learningEntries.length;i++){
			if(phraseText == learningEntries[i].phrase){
				learningEntries[i].myDiv.remove()
				learningEntries.splice(i,1)
			}
		}
	});

	

});
function processLearningIntents(data){

	console.log(data)
	for(i =0; i<data.length; i++){
		if(data[i].tokens){
			learningEntries.push(new LearningEntry(data[i].phrase, data[i].classification, data[i].tokens))
		}else{
			learningEntries.push(new LearningEntry(data[i].phrase, data[i].classification))
		}

	}
	for(i =0; i<learningEntries.length; i++){
		learningEntries[i].show()
	}
	refreshAllLearningDivDD();
}


function refreshAllLearningDivDD(){
	for(var i=0;i<learningEntries.length;i++){
		learningEntries[i].refreshLearningDivDD()
	}
}


function LearningEntry(phrase_, classification_, tokens_){
	this.tokens=tokens_ || []
	this.phrase=phrase_;
	this.classification=classification_

	this.show=function(){
		$divContainter = $("#learningPhrasesFieldSet")
		this.myDiv = $("#phrase_learning_template").clone().attr('style', 'display: normal;')
		$divContainter.prepend(this.myDiv)
		this.myDiv.removeAttr("id");
		this.myDiv.find(".input-learning-phrase").val(this.phrase)
		this.myDiv.find(".tokens").html("")
		for(var i=0;i<this.tokens.length;i++){
			console.log(this.tokens[i])
			this.myDiv.find(".tokens").append(this.tokens[i]+ " ")
		}

		this.setGuessClassification();

	}
	this.setGuessClassification = function(){
		// console.log(this.classification)
		// console.log(this.myDiv.find(".classification-sellector"))
		// this.myDiv.find(".classification-sellector").val(this.classification)
		this.myDiv.find(".classification-sellector").val(this.classification)
		// console.log(this.myDiv.find(".classification-sellector").val())
	}
	this.refreshLearningDivDD =function(){

		this.myDiv.find('.classification-sellector').html("")
		
		for(key in intentsList.intentsDict){
			this.myDiv.find('.classification-sellector').append('<option value="'+key+'">'+key+'</option>')
		}
		this.setGuessClassification()
		this.myDiv.find(".chzn-select").chosen();
		this.myDiv.find(".chzn-select").trigger("chosen:updated");
		
	}
	this.addPhraseToIntent=function(classification_){
		intentsList.intentsDict[this.classification].addPhrase(this.phrase, this.classification, this.tokens)
		intentsList.intentsDict[this.classification].updateDiv()
		this.myDiv.remove()
		// intentsList.intentsDict[this.classification].showDiv()
	}
}

function deleteLearningData(saveAfter){
	$.ajax({
        url: '/deleteAllLearning',
        type: 'POST',
        data: {
            "jsonArray": null
        },
        success: function(data){
            console.log(data);
            if(saveAfter){
            	// console.log("holly fucking shit !!!!!!!!!!!!!!!!!!!!");
            	saveLearningData()
            }
        }
    });
}

function saveLearningData(){
	for(var i=0; i<learningEntries.length;i++){
		// dataAdd = 
		console.log("1034")
		// console.log(dataAdd)
		console.log("1034************************************")
		$.ajax({
	        url: '/addLearning',
	        type: 'POST',
	        data: {
	            "phrase": learningEntries[i].phrase,
	            "classification":learningEntries[i].classification,
	            // "tokens":["hi", "fuck"],
	            "tokens":learningEntries[i].tokens,
	        },
	        success: function(data){
	            console.log(data);
	        }
	    });
	}
}









