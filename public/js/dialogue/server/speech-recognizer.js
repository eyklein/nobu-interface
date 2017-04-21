var resultArea;
var textArea;
var recognition;

(function($) {

    $(document).ready(function() {
        
        try {
            recognition = new webkitSpeechRecognition();
        } catch(e) {
            recognition = Object;
        }
        recognition.continuous = true;
        recognition.interimResults = true;

        var interimResult = '';

        $(document).on('keypress', ".console-input.active",submitRequest);
        $(document).on('keyup', ".console-input.active",removeLine);
        

        function submitRequest(e){
            // $('#dashboard').find(".console-input").val()
            if(e.keyCode == 13){
                
                sendRequest($(e.target).val())
                $(e.target).val("")
            }
        }
        function removeLine(e){
            if(e.keyCode == 13){
                $(e.target).val("")
            }
        }




        
        $(document).on('click', ".speech-mic", function() {
            try{
                startRecognition();
            }catch(e){
                // recognition.stop();
            }
        });


        $(document).on('click', ".speech-mic-works", function() {
            stopRecogniyion()
        });

        

        recognition.onresult = function (event) {
            // console.log(event)

            
            // var pos = textArea.getCursorPosition() - interimResult.length;
            // textArea.val(textArea.val().replace(interimResult, ''));
            interimResult = '';
            // textArea.setCursorPosition(pos);
            console.log("result: " + event.resultIndex);
            console.log(event.results)
            // insertAtCaret(textArea.attr("id"), event.results[0][0].transcript + '\u200B');
            dashboard.inputConsole.val("")
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    // insertAtCaret(textAreaID, event.results[i][0].transcript.bold());

                    // resultArea.html(resultArea.html() + "<br/>" +"<br/>" + event.results[i][0].transcript.bold())

                    sendRequest(event.results[i][0].transcript)
                    // getResponce(event.results[i][0].transcript)
                    // console.log(resultArea.html())

                } else {
                    isFinished = false;
                    // textArea.html(event.results[i][0].transcript)
                    // textArea.val("")
                    // insertAtCaret(textArea.attr("id"), event.results[i][0].transcript + '\u200B');

                    interimResult += event.results[i][0].transcript + '\u200B';
                    dashboard.inputConsole.val(interimResult)

                    
                    // textArea.val("interimResult" + interimResult)
                    // console.log(interimResult)
                    // console.log("FUCK!!!@")
                }
            }
        };

        recognition.onend = function() {
            $('.speech-content-mic').removeClass('speech-mic-works').addClass('speech-mic');
        };
    });
})(jQuery);

var startRecognition = function() {
    if(typeof(speak)=="function"){
        speak()
    }
    $('.speech-mic').removeClass('speech-mic').addClass('speech-mic-works');
    dashboard.inputConsole.focus();
    recognition.start();
};
var stopRecogniyion = function(){
    if(typeof(stopSpeak)=="function"){
        stopSpeak()
    }
    $(".speech-mic-works").addClass("speech-mic")
    $(".speech-mic-works").removeClass("speech-mic-works")
    recognition.stop();
}