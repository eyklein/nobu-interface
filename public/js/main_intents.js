var intentsList; //=new Nodes();

$(document).ready(function() {
	console.log("start loading... global intentnts")
	intentsList = new IntentsList();

	$.ajax({
	  dataType: "json",
	  url: "/getLatestIntents",
	  success: processJSONIntents
	});

});



function processJSONIntents(data){
	
	// data=JSON.parse(data.json)
	// console.log(data)
	data=data.json
	console.log(data)
	// console.log(data)
	for(i =0; i<data.length; i++){
		// if(!intentsList.intentsDict[data[i].classification]){
		// 	intentsList.intentsDict[data[i].classification] = new Intent
		// }
		intnent = intentsList.getSlashMakeClassification(data[i].classification)
		if(data[i].tokens){
			intnent.addPhrase(data[i].phrase, data[i].classification, data[i].tokens)
		}else{
			intnent.addPhrase(data[i].phrase, data[i].classification)
		}
	}
	// console.log("YESS!!!!")
	if(location.pathname == "/intents"){
		initalizeIntentDivs()
	}
	if(intentsList && typeof(refreshAllLearningDivDD) === "function"){
		refreshAllLearningDivDD()
	}
	

}


function IntentsList(){
	this.intentsDict={}
	

	this.changeClassification=function(oldClassification, newClassification){
		console.log(oldClassification)
		this.intentsDict[newClassification] = this.intentsDict[oldClassification]
		delete this.intentsDict[oldClassification]
	}
	this.getSlashMakeClassification=function(classification_){
		if(!this.intentsDict[classification_]){
			this.intentsDict[classification_] = new Intent(classification_)
		}
		return this.intentsDict[classification_]
	}
	this.getDiv = function(){
		for(key in this.intentsDict){
			this.intentsDict[key].getDiv()
		}
	}

}
function Intent(classification){
	this.phrases=[]
	this.classification=classification
	this.addPhrase = function(phrase_, classification_, tokens_){
		tokens_=tokens_||[]
		this.phrases.push(new Phrase(phrase_, classification_, tokens_))
	}
	this.addBlankPhrase = function(){
		
		this.phrases.push(new Phrase("", this.classification))
	}
	this.containsPhrase=function(phrase_){
		for(var i=0;i<this.phrases.length;i++){
			if(this.phrases[i]==phrase_){
				return true
			}
		}
		return false;
	}
	this.removePhrase=function(text_){
		for(var i=0;i<this.phrases.length;i++){
			if(this.phrases[i].text==text_){
				this.phrases[i].myDiv.remove()
				this.phrases.splice(i, 1);
				return
			}
		}
	}
	this.delete=function(){
		this.myDiv.remove()
		delete intentsList.intentsDict[this.classification]
	}
	this.showDiv=function(){
		newIntentDiv=this.getDiv();
		for(var i=0;i<this.phrases.length;i++){
			newIntentDiv.find(".phrases").prepend(this.phrases[i].getDiv())
		}
		$("#intentFieldSet").prepend(newIntentDiv)
		// newIntentDiv.appendTo( "#intentFieldSet" );
		// newIntentDiv.appendTo( "#intentFieldSet" );
	}
	this.updateDiv=function(){
		this.myDiv.remove();
		this.showDiv()
	}
	this.getDiv=function(){

		var $newDiv = $("#intent_template").clone().attr('style', 'display: normal;')
		$newDiv.attr("id",this.classification);
		// $newDiv.appendTo( "#intentFieldSet" );
		$newDiv.find(".input-intent").val(this.classification);
		this.myDiv=$newDiv
		return $newDiv	
	}
}
function Phrase(text_, classification_, tokens_){
	this.tokens=tokens_||[]
	this.text=text_;
	this.classification=classification_
	this.getDiv=function(){
		$newDiv = $("#phrase_template").clone().attr('style', 'display: normal;')
		$newDiv.removeAttr("id");
		$newDiv.find(".input-phrase").val(this.text)
		$newDiv.find(".tokens").html("")
		// console.log(this.classification)
		// console.log(this.text)
		// console.log(this.tokens)
		if(this.tokens.length==0){
			$newDiv.find(".tokens").append("<div style='opacity:.5'> - not availble untill run on server - </div>")
		}
		for(var i=0;i<this.tokens.length;i++){
			$newDiv.find(".tokens").append(this.tokens[i]+" ")
		}
		this.myDiv=$newDiv
		return $newDiv
	}
}




// function newPhrase($div, phrase){
// 	phrase=phrase|| "";
// 	$newDiv = $("#phrase_template").clone().attr('style', 'display: normal;')
// 	$div.find(".phrases").prepend($newDiv)
// 	$newDiv.removeAttr("id");
// 	$newDiv.find(".input-phrase").val(phrase)
// }