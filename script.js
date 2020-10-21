

  
  function isGameOver(board) {
    //  var state = getBoardState();
      var matches = ["xxx", "ooo"]; // This are the string we will be looking for to declare the match over
  
      // We are creating a string for each possible winning combination of the cells
      var rows = [
        board[0][0] + board[0][1] + board[0][2], // 1st line
        board[1][0] + board[1][1] + board[1][2], // 2nd line
        board[2][0] + board[2][1] + board[2][2], // 3rd line
        board[0][0] + board[1][0] + board[2][0], // 1st column
        board[0][1] + board[1][1] + board[2][1], // 2nd column
        board[0][2] + board[1][2] + board[2][2], // 3rd column
        board[0][0] + board[1][1] + board[2][2], // Primary diagonal
        board[0][2] + board[1][1] + board[2][0]  // Secondary diagonal
      ];
      console.log(rows);
  
      // Loop through all the rows looking for a match
      for (var i = 0; i < rows.length; i++) {

          if (rows[i] === matches[0] || rows[i] === matches[1]) {
              return true;
          }
      }
  
      return false;
  }


$(document).ready(function () {
    let player = {};
    let other = {};
    var board=[[null,null,null],[null,null,null],[null,null,null]];
    let socket = io('ws://localhost:5000');
    let symbol;
    let fullname;

    //$(".tictactoe").attr("disabled", "disabled").off('click');

    //$('#message').append(`<span>${da}</span>`);




    $(".gamebtn").click(function () {
        // console.log("clicked");
        $(`#${this.id}`).text(symbol);
        // console.log(this.value)
        let arr=this.id.split('');
        // console.log(arr);
        board[arr[1]][arr[3]]=symbol;
        // console.log(board);
        data={
            r:arr[1],
            c:arr[3],
            sym:symbol,
            socketID:socket.id,
        }
        let ans=isGameOver(board);
        if(ans==true){
            $("#message").val(fullname.playerName+"wins");
            let aa={
                socketID:socket.id,
                ans:"lose"
            }
            socket.emit("game_end",aa);
        }else{
                
        socket.emit("move_made",data);

            }
        // console.log("is game over" + ans);
        







    });

    // socket.emit('connection',function(){

    // })


    $("#newgame").click(function () {
        let getName = $("#newgamename").val();
        let roomid=new Date().getTime();
        console.log(roomid);

        if (getName != '') {
            // console.log(getName);
            // console.log(socket.id)
            player = {
                socketId: socket.id,
                playerName: getName,
                symbol: 'o',
                roomName: roomid

            }
            // console.log(player);

            socket.emit('create', player);





            $("#starting").css("display", "none");
            $(".tictactoe").css("display", "block");

            //  $(".tictactoe").addClass("disabledbutton");


        }

    });


    $("#joingame").click(function () {
        let otherPlayer = $("#joingamename").val();
        let roomid = $("#joinroom").val();
        //console.log("roomid" +roomid);
        //check if room exist 


        socket.emit('checkRoomExist', roomid);


        socket.on('existVerified', function (data) {
            // console.log(data);
            if (data === true) {
                player = {
                    socketId: socket.id,
                    playerName: otherPlayer,
                    symbol: 'x',
                    roomName: roomid,
                }



                socket.emit('create', player);
                socket.emit('setopponent', roomid);
                socket.emit("make_move",socket.id);
               
    

            }
            // console.log(player);


            socket.emit('get', roomid);

            socket.on('out', function (data) {
                 console.log(data);
            })
            


            

        })
        $("#starting").css("display", "none");
        $(".tictactoe").css("display", "block");
        //        $(".tictactoe").removeClass("disabledbutton");
        //console.log("into " +socket.id);



        // console.log(player);

    })



    socket.on('player_turn',function(data){
        // console.log(data);
        $('#message').val(data.playerName +"'s Turn");
        symbol=data.symbol;
        fullname=data;
    })

    socket.on("update_state",function(data){
        board[data.r][data.c]=data.symbol;
        let id=`r${data.r}c${data.c}`;
        $(`#${id}`).text(data.symbol);
    })
    
    socket.on("finished",function(data){
        $("#message").val(data.playerName+"lose");
    })

    



});
