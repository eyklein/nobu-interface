var resultArea;
var textArea;

(function($) {

    $(document).ready(function() {
        
        try {
            var recognition = new webkitSpeechRecognition();
        } catch(e) {
            var recognition = Object;
        }
        recognition.continuous = true;
        recognition.interimResults = true;

        var interimResult = '';
        // textArea = $('#dashboard.console.console-input');
        // var textAreaID = 'console-input';

        // resultArea = $('#dashboard.console.console-response');

        // textArea.keypress(){
        //     console.log("what this 20")
        // }
        // textArea.on( "keypress", submitRequest);
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
            // startRecognition();
            $(".speech-mic").addClass("speech-mic-works")
            $(".speech-mic").removeClass("speech-mic")
            
            try{
                startRecognition();
            }catch(e){
                recognition.stop();
            }
        });


        $(document).on('click', ".speech-mic-works", function() {
            $(".speech-mic-works").addClass("speech-mic")
            $(".speech-mic-works").removeClass("speech-mic-works")
            recognition.stop();
        });

        var startRecognition = function() {
            console.log("start recognition 0")
            $('.speech-content-mic').removeClass('speech-mic').addClass('speech-mic-works');
            console.log("start recognition 1")
            dashboard.inputConsole.focus();
            console.log("start recognition 2")
            recognition.start();
            console.log("start recognition 3")
        };

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