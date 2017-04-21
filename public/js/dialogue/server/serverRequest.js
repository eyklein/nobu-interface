var myID=String(Math.floor(Math.random()*1000))
console.log(myID)

function sendRequest(text, forcedNode=null){
    // $.get("https://eyk287.itp.io:5000/webhook", function(data, status){
    //     alert("Data: " + data + "\nStatus: " + status);
    // });

    var body = {
	    "lang": "en",
	    "sessionId": myID,
	    "timestamp": "2017-03-13T06:12:50.533Z",
	    "result": {
	        "speech": "",
	        "contexts": [],
	        "fulfillment": {
	            "speech": "XXX1",
	            "messages": [
	                {
	                    "speech": "XXX2",
	                    "type": 0
	                }
	            ]
	        },
	        "source": "web",
	        "score": 1.0,
	        "actionIncomplete": false,
	        "resolvedQuery": text,
	        "forcedNode": forcedNode,
	        "metadata": {
	            "intentName": "Default Fallback Intent",
	            "webhookForSlotFillingUsed": "false",
	            "webhookUsed": "true",
	            "intentId": "82b27503-0b93-40c1-881e-dcf92e216664"
	        },
	        "parameters": {},
	        "action": ""
	    },
	    "status": {
	        "errorType": "success",
	        "code": 200
	    },
	    "id": "5d792d43-afb9-483d-a7c8-7915b5ca54e5",
	    "originalRequest": null
	}
	
    var xhr = createCORSRequest('POST', "https://eyk287.itp.io:5000/getAudio", nodeLoadResponce);
    // var xhr = createCORSRequest('POST', "https://eyk287.itp.io:5000/getAudio");
   
    xhr.send(JSON.stringify(body));
    console.log("Sent!")


}

function sendForceNodeRequest(forcedNode){
    // $.get("https://eyk287.itp.io:5000/webhook", function(data, status){
    //     alert("Data: " + data + "\nStatus: " + status);
    // });

    var body = {
	    "lang": "en",
	    "sessionId": myID,
	    "timestamp": "2017-03-13T06:12:50.533Z",
	    "result": {
	        "speech": "",
	        "contexts": [],
	        "fulfillment": {
	            "speech": "XXX1",
	            "messages": [
	                {
	                    "speech": "XXX2",
	                    "type": 0
	                }
	            ]
	        },
	        "source": "web",
	        "score": 1.0,
	        "actionIncomplete": false,
	        "resolvedQuery": "none",
	        "forcedNode": forcedNode,
	        "metadata": {
	            "intentName": "Default Fallback Intent",
	            "webhookForSlotFillingUsed": "false",
	            "webhookUsed": "true",
	            "intentId": "82b27503-0b93-40c1-881e-dcf92e216664"
	        },
	        "parameters": {},
	        "action": ""
	    },
	    "status": {
	        "errorType": "success",
	        "code": 200
	    },
	    "id": "5d792d43-afb9-483d-a7c8-7915b5ca54e5",
	    "originalRequest": null
	}
	
    var xhr = createCORSRequest('POST', "https://eyk287.itp.io:5000/forceSetNode", nodeLoadResponce);
    // var xhr = createCORSRequest('POST', "https://eyk287.itp.io:5000/getAudio");
   

    xhr.send(JSON.stringify(body));



}
function sendTask(task){
    // $.get("https://eyk287.itp.io:5000/webhook", function(data, status){
    //     alert("Data: " + data + "\nStatus: " + status);
    // });

    var body = {
	    "task":task
	}
	
    var xhr = createCORSRequestDoNothing('POST', "https://eyk287.itp.io:5000/task", nodeLoadResponce);
    // var xhr = createCORSRequest('POST', "https://eyk287.itp.io:5000/getAudio");
    xhr.send(JSON.stringify(body));



}




// }
function sendJSONNodes(json_){
    // $.get("https://eyk287.itp.io:5000/webhook", function(data, status){
    //     alert("Data: " + data + "\nStatus: " + status);
    // });

    // var body = {	}
	
    var xhr = createCORSRequestDoNothing('POST', "https://eyk287.itp.io:5000/saveNodes", nodeLoadResponce);
    // var xhr = createCORSRequest('POST', "https://eyk287.itp.io:5000/getAudio");
    console.log(JSON.stringify(json_));

    xhr.send(JSON.stringify(json_));



}

window.onload = init;
var context;    // Audio context
var buf;        // Audio buffer

function init() {
if (!window.AudioContext) {
    if (!window.webkitAudioContext) {
        alert("Your browser does not support any AudioContext and cannot play back this audio.");
        return;
    }
        window.AudioContext = window.webkitAudioContext;
    }

    context = new AudioContext();
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function playByteArray( bytes ) {
	console.log(1)
    var buffer = new Uint8Array( bytes.length );
    console.log(2)
    buffer.set( new Uint8Array(bytes), 0 );


    context.decodeAudioData(str2ab(bytes), play);
}

function play( audioBuffer ) {
    var source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect( context.destination );
    source.start(0);
}



function createCORSRequest(method, url, onLoad=null) {
  	var xhr = new XMLHttpRequest();
  
  	if ("withCredentials" in xhr) {
    	xhr.open(method, url, true);
  	} else if (typeof XDomainRequest != "undefined") {
	    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
	    xhr = new XDomainRequest();
	    xhr.open(method, url);
  	} else {
    	// Otherwise, CORS is not supported by the browser.
    	xhr = null;
  	}
  	if (!xhr) {
	  	throw new Error('CORS not supported');
	}

	xhr.withCredentials = true;
	xhr.onload = function() {
		// onLoad.bind(xhr)
		stopRecogniyion()

		var response = xhr.responseText;
		console.log(response)

		response= JSON.parse(response)
		nodeFocus(response.name)
		// resultArea.html(resultArea.html() + "<br/>" + response.speech)
		console.log("https://eyk287.itp.io:5000/"+ response['saveDir'])
		

		var audio = new Audio("https://eyk287.itp.io:5000/"+ response['saveDir']);
		audio.play()
		audio.onloadedmetadata = function() {
			console.log("TIME " + audio.duration);
		  setTimeout(function(){
				try{

	                startRecognition();
	            }catch(e){
	            	console.log("error!!!!!!!!!!!!!")
	            	console.log(e)
	                // recognition.stop();
	            }
			}, audio.duration*1000);
		};
		
		

		
	}

	xhr.onerror = function() {
	  console.log('There was an error!');
	};
  	return xhr;
}

function createCORSRequestDoNothing(method, url, onLoad=null) {
  	var xhr = new XMLHttpRequest();
  
  	if ("withCredentials" in xhr) {
    	xhr.open(method, url, true);
  	} else if (typeof XDomainRequest != "undefined") {
	    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
	    xhr = new XDomainRequest();
	    xhr.open(method, url);
  	} else {
    	// Otherwise, CORS is not supported by the browser.
    	xhr = null;
  	}
  	if (!xhr) {
	  	throw new Error('CORS not supported');
	}

	xhr.withCredentials = true;
	xhr.onload = function() {
		// onLoad.bind(xhr)
		var response = xhr.responseText;
		console.log(response)

		response= JSON.parse(response)
	}

	xhr.onerror = function() {
	  console.log('There was an error!');
	};
  	return xhr;
}

function nodeLoadResponce(xhr) {
	var response = xhr.responseText;
	console.log(response)

	response= JSON.parse(response)
	nodeFocus(response.name)
	// resultArea.html(resultArea.html() + "<br/>" + response.speech)

	var audio = new Audio("https://eyk287.itp.io:5000/"+ response['saveDir']);
	audio.play();
};
