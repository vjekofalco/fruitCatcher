$(document).ready(function(){

    var moveCounter = 0; // Initializing head position to 0
    var gameStart = false;
    var pause = false;
    var points = 0;
    var time = 60;
    var dropDuration = 3000; // Starting falling speed.
    var dropingFrequency = 1500

    gameState(); // Calling the "gameState()" function

    function startGame(){ // Activating functions that are running game
        if(gameStart == true){
            dropFruit();
            checkPoints();
            counter();
            dropSpeed();
            setDropZone();
        }
    }

    function gameState(){ // Function determinating game state and providing proper display
        if(gameStart == false){
            $('.enter-box').html("<p clas='enter-box-text'>Press enter to <br> start game</p>");
        }
    }

    $(document).keydown(function(e){ // Listening keyboard
        switch (e.keyCode){
            case 39: // Right arrow pressed
                if(moveCounter < 82) { // Checking if we are came to the right end of the playground
                    moveCounter += 2; // Updating moveCounter
                    $(".hungry-eyes").css('left', (moveCounter).toString() + '%') // Moving head to the right
                }
                break;
            case 37: // Left arrow pressed
                if(moveCounter > 0) { // Checking if we are came to the left end of the playground
                    moveCounter -= 2; // Updating moveCounter
                    $(".hungry-eyes").css('left', (moveCounter).toString() + '%') // Moving head to the left
                }
                break;
            case 13: // Enter key pressed
                if(gameStart == false){ // Checking if user want's to start the game
                    gameStart = true;
                    $('.enter-box').hide();
                    $('.hungry-eyes').show();
                    startGame() // Starting the game
                }
        }
    })

    function setDropZone(){ // Function is randomly setting the fruit drop zone on the playground
       zone = setInterval(function(){
            var fruit = Math.floor((Math.random() * 8) + 1); // Randomly choosing what fruit we want to drop
            var fruitDrop = Math.floor((Math.random() * 82) + 1); // Randomly choosing position to drop
            $(".action-holder").append("<img id='" + fruit + "' class='fruit' src='img/fruits/" + fruit + ".png' style='left: " + fruitDrop + "%'/>"); // Putting fruit to the playground
        }, dropingFrequency) // Drop zone interval is set on the way that we have more than one falling fruits
    }

    function dropFruit(){ // Function for fruit falling
        drop = setInterval(function(){
            $(".fruit").each(function(){
                $(this).animate({top: 470}, dropDuration, function(){ // Animating fruit falling
                $(this).remove(); // Removing fruit when it hits the ground
                    // If fruit is not collected by the end of the animation we are updating the time
                    if(time > 3) { // We want to bee sure that time isn't be lover then 0
                        time -= 3;
                    }
                    else{
                        time == 0;
                    }
            })
        }, 100)})
    }

    function checkPoints(){ // Function is checking if head is collect the fruit and updating the score
        setInterval(function(){
            $('.fruit').each(function(){
                /*
                | First we are checking if fruit is above the head
                | Then we are checking if fruit is fall down enough sou head can catch it
                | If the terms are matching the criteria we are providing the point
                 */
                if($(this).position().left >= $('.hungry-eyes').position().left - $('.hungry-eyes').width() / 2 && $(this).position().left <= $('.hungry-eyes').position().left + $('.hungry-eyes').width()  && $(this).position().top > 340){
                    if(parseInt($(this).attr('id')) % 2 == 0 && parseInt($(this).attr('id')) % 3 == 0) {
                        points += 2; // Giving 2 points if fruit id is even and dividable with 3
                    }
                    else if(parseInt($(this).attr('id')) % 2 == 0) {
                        points += 1; //  Giving a point if fruit id is even
                    }
                    else{
                        points += 3; // Giving 3 points if fruit id is odd
                    }
                    time+=1; // Giving extra seccond
                    $(this).stop(); // Stopping the animation of collected element
                    $('.points').text(points); // Updating the score
                    $(this).remove(); // Removing collected fruit from playground
                }
            })
        }, 100)
    }

    function counter(){ // Function is counting the time backwards and updating the time every seccond
        count = setInterval(function(){
            time -= 1; // Updating time
            if(time >= 0){
                $(".time").text(time.toString() + "sec"); // Updating time display
            }
            else{ // If we reach the end we are providing the end game display
                $('.enter-box').html("<p class='enter-box-text'>SCORE:" + points + "</p><div class='options'><h3 class='close'>CLOSE</h3><h3 class='again'>PLAY AGAIN</h3></div>"); // Settings point for display
                $('.enter-box').show(); // Displaying the points
                clearInterval(drop); // Stop droping
                clearInterval(zone); // Stop displaying the fruits
                $('.hungry-eyes').hide(); // Hide the head
            }
        }, 1000)
    }

    function dropSpeed(){ // Function for "LEVEL UP". Every 10 sec. increasing dropDuration and dropingFrequency
        speed = setInterval(function(){
            if(dropDuration > 500){
                dropDuration -= 600;
                dropingFrequency -= 300;
            }
        }, 10000)
    }

    $(document).on('click', '.close', function(){ // Closing the game
        window.open('','_self').close()
    })

    $(document).on('click','.again', function(){ // Reseting the game
       location.reload();
    })

    $(document).on('click', '.pause', function(){ //Pause function
        if(gameStart == true && pause == false) {
            pause = true;
            clearInterval(count);
            clearInterval(drop);
            clearInterval(zone);
            clearInterval(speed);
            $('.fruit').stop(true);
            $('.hungry-eyes').hide();
            $('.enter-box').html("<p class='enter-box-text'>PAUSE</p>");
            $('.enter-box').show();
        }
        else if(gameStart == true && pause == true){
            pause = false;
            setDropZone();
            dropFruit();
            counter();
            dropSpeed();
            $('.hungry-eyes').show();
            $('.enter-box').hide();
        }
    })

})