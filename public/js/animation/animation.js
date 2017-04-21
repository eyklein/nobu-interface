
$(document).ready(function() {
	console.log("loaded...")


});

function cockRight(div_){
	div_.removeClass()
	div_.addClass('cockRight')
	refreshDiv(div_)
	bobHeadLight()
}
function cockLeft(div_){
	div_.removeClass()
	div_.addClass('cockLeft')
	refreshDiv(div_)
	bobHeadLight()
}
function bobHeadLight(){
	div = $("svg").find("#headBobber")
	div.addClass('bobLight')
	refreshDiv(div)
}



function speak(){
	div = $("svg").find("#beak_bottom")
	div.addClass('bottom-mouth-move')
	refreshDiv(div)
}
function stopSpeak(){
	div = $("svg").find("#beak_bottom")
	div.removeClass('bottom-mouth-move')
	refreshDiv(div)
}

function closeEyes(){
	closeRightEye();
	closeLeftEye()
}
function closeRightEye(){
	div = $("svg").find("#pupil_white_R")
	div.removeClass()
	div.addClass('st2')
	div.addClass('closeEye')
	refreshDiv(div)
}
function closeLeftEye(){
	div = $("svg").find("#pupil_white_L")
	div.removeClass()
	div.addClass('st2')
	div.addClass('closeEye')
	refreshDiv(div)
}
function openEyes(){
	openRightEye()
	openLeftEye()
}
function openRightEye(){
	div = $("svg").find("#pupil_white_R")
	div.removeClass()
	div.addClass('st2')
	div.addClass('openEye')
	refreshDiv(div)
}
function openLeftEye(){
	div = $("svg").find("#pupil_white_L")
	div.removeClass()
	div.addClass('st2')
	div.addClass('openEye')
	refreshDiv(div)
}
function openRightEyeSlightly(){
	div = $("svg").find("#pupil_white_R")
	div.removeClass()
	div.addClass('st2')
	div.addClass('openEyeSlightly')
	refreshDiv(div)
}
function openLeftEyeSlightly(){
	div = $("svg").find("#pupil_white_L")
	div.removeClass()
	div.addClass('st2')
	div.addClass('openEyeSlightly')
	refreshDiv(div)
}


function curleEars(){
	curleRightEar()
	curleLeftEar()
}
function curleRightEar(){

	div = $("svg").find("#ear_R")
	if(!div.hasClass("currle_R_ear")){
		div.removeClass()
		div.addClass('st1')
		div.addClass('currle_R_ear')
		refreshDiv(div)
	}
}
function curleLeftEar(){

	div = $("svg").find("#ear_L")
	if(!div.hasClass("currle_L_ear")){
		div.removeClass()
		div.addClass('st1')
		div.addClass('currle_L_ear')
		refreshDiv(div)
	}
}

function uncurleEars(){
	uncurleRightEar()
	uncurleLeftEar()
}
function uncurleRightEar(){
	div = $("svg").find("#ear_R")
	if(!div.hasClass("uncurrle_R_ear") && !div.hasClass("swayRightEarDown")){
		div.removeClass()
		div.addClass('st1')
		div.addClass('uncurrle_R_ear')
		refreshDiv(div)
	}
	setTimeout(swayRightEarDown, 3000);
}
function uncurleLeftEar(){
	div = $("svg").find("#ear_L")
	if(!div.hasClass("uncurrle_L_ear") && !div.hasClass("swayLeftEarDown")){
		div.removeClass()
		div.addClass('st1')
		div.addClass('uncurrle_L_ear')
		refreshDiv(div)
	}
	setTimeout(swayLeftEarDown, 3000);
}
function swayRightEarDown(){
	div = $("svg").find("#ear_R")
	if(!div.hasClass("currle_R_ear")){
		div.removeClass()
		div.addClass('st1')
		div.addClass('sway_R_ear_down')
		refreshDiv(div)
	}
}
function swayLeftEarDown(){
	div = $("svg").find("#ear_L")
	if(!div.hasClass("currle_L_ear")){
		div.removeClass()
		div.addClass('st1')
		div.addClass('sway_L_ear_down')
		refreshDiv(div)
	}
}


// function swayLeftEarDown(){
// 	div = $("svg").find("#ear_L")
// 	if(!div.hasClass("uncurrle_L_ear") && !div.hasClass("swayLeftEarDown")){
// 		div.removeClass()
// 		div.addClass('st1')
// 		div.addClass('uncurrle_L_ear')
// 		refreshDiv(div)
// 	}
// }








function refreshDiv(div_){
	newDiv = div_.clone(true);          
	div_.before(newDiv);       
	div_.remove();
}













