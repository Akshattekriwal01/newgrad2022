let button  = document.getElementById("wrapper");

var questions = [
  {question:"What's your full name?",pattern: /^([a-zA-Z\s.]{3,60})$/},
  {question:"What's your 10 digit US Phone Number?",pattern: /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/ },
  {question:"Enter the Recieved OTP", pattern: /^([0-9]{4})$/},
]

/**********
  Credits for the design go to XavierCoulombeM
  https://dribbble.com/shots/2510592-Simple-register-form
 **********/

;(function(){

  var tTime = 100  // transition transform time from #register in ms
  var wTime = 200  // transition width time from #register in ms
  var eTime = 1000 // transition width time from inputLabel in ms

  // init
  // --------------
  var position = 0

  putQuestion()

  progressButton.addEventListener('click', validate)
  inputField.addEventListener('keyup', function(e){
    transform(0, 0) // ie hack to redraw
    if(e.keyCode == 13) validate()
  })

  // functions
  // --------------

  // load the next question
  function putQuestion() {
    inputLabel.innerHTML = questions[position].question
    inputField.value = ''
    inputField.type = questions[position].type || 'text'  
    inputField.focus()
    showCurrent()
    if (position==2){
      countDown()
    }
  }
  
  // when all the questions have been answered
  function done() {
    
    // remove the box if there is no next question
    register.className = 'close'
    
    // add the h1 at the end with the welcome text
    var h1 = document.createElement('h1')
    h1.appendChild(document.createTextNode(questions[0].value + ', We will notify you of upcoming New Grad jobs for 2022!'))
    setTimeout(function() {
      register.parentElement.appendChild(h1)     
      setTimeout(function() {h1.style.opacity = 1}, 50)
    }, eTime)
    
  }

  // when submitting the current question
  async function validate() {
    console.log(position);
    // set the value of the field into the array
    questions[position].value = inputField.value

    // check if the pattern matches
    if (!inputField.value.match(questions[position].pattern || /.+/)) wrong()
    else ok(async function() {
      

      // current question position in question array
      if(position == 1){
          try{
           await registerUser(questions[0].value, questions[1].value);
          }catch(error){
              showError(error);
              console.log(error);
              wrong();
              return;
          }
      }else if(position == 2){
          try{
            console.log("here");
            await verifyOTP(questions[1].value,questions[2].value);
            console.log("here 1");
          }catch(error){
            showError(error);
            console.log(error);
            wrong();
            return;
          }
      }
      // increase position
      ++position 
      progress.style.width = position * 100 / questions.length + 'vw'
      
      // if there is a new question, hide current and load next
      if (questions[position]) hideCurrent(putQuestion)
      else hideCurrent(done)
          
    })

  }
  async function resendOTP(){
    let res = new Promise(async (resolve,reject)=>{
        countDown();
        number = questions[1].value;
        number = number.replace(/\D+/g, "");
        number = "+1"+number;
        let req1 = {
            method :"POST",
            url: 'http://localhost:3009/user/resendOTP',
            data :{
                number
            }
        }
        console.log("resend otp");
        try{
            let response = await axios(req1)
            if(!response || response.status >= 400){
                throw "error";
            }
               resolve("success");
            }catch(error){
                
                reject ("Some Error occured");
            }
    });
    return res;
  }
  button.addEventListener("click", resendOTP);

  async function verifyOTP(number,otp){ 
    let res = new Promise(async (resolve,reject)=>{
        number = number.replace(/\D+/g, "");
        number = "+1"+number;
        let req1 = {
            method :"POST",
            url: 'http://localhost:3009/user/verifyotp',
            data :{
                number,
                otp
            }
        }
        try{
            let response = await axios(req1)
            if(!response || response.status >= 400){
                throw "error";
            }
               resolve("success");
            }catch(error){
                reject ("Invalid OTP");
            }
    });
    return res;
  }
  async function registerUser(name, number){
      let res = new Promise(async (resolve,reject)=>{
        number = number.replace(/\D+/g, "");
        number = number.replace(/\s+/g, "");
        number = "+1"+number;
        console.log(number);
        
        let req1 = {
          method :"POST",
          url: 'http://localhost:3009/user/register',
          data :{
              name ,
              number
          }
        }
        try{
        let response = await axios(req1)
        if(!response || response.status >= 400){
            throw "error";
        }
           resolve("success");
        }catch(error){
            reject ("Please try again with a valid and unregistered number");
        }
      })
      return res; 

        // handle user already exists scenerio.
        //handle the wrong number scenerio like 1234567891
        // action, try again with valid and unregestered number.
        // dont proceed and show error
  }



  // helper
  // --------------

  function hideCurrent(callback) {
    inputContainer.style.opacity = 0
    inputProgress.style.transition = 'none'
    inputProgress.style.width = 0
    setTimeout(callback, wTime)
  }

  function showCurrent(callback) {
    inputContainer.style.opacity = 1
    inputProgress.style.transition = ''
    inputProgress.style.width = '100%'
    setTimeout(callback, wTime)
  }

  function transform(x, y) {
    register.style.transform = 'translate(' + x + 'px ,  ' + y + 'px)'
  }

  function ok(callback) {
    register.className = ''
    setTimeout(transform, tTime * 0, 0, 10)
    setTimeout(transform, tTime * 1, 0, 0)
    setTimeout(callback,  tTime * 2)
  }

  function wrong(callback) {
    register.className = 'wrong'
    for(var i = 0; i < 6; i++) // shaking motion
      setTimeout(transform, tTime * i, (i%2*2-1)*20, 0)
    setTimeout(transform, tTime * 6, 0, 0)
    setTimeout(callback,  tTime * 7)
  }

}())


var myTimer = document.getElementById('myTimer');
var myBtn = document.getElementById('myBtn');

var interval;
var seconds = 60;
const secondsCopy = seconds;

function countDown() {
  clearInterval(interval);
  document.getElementById("timetext").style.display = null ;
  myBtn.disabled = true; 
  $("#myBtn").removeClass().addClass("btnDisable");
  document.getElementById("wrapper").style.display = "block";

  interval = setInterval( function() {
      myTimer.innerHTML = seconds;
      seconds -= 1;
      if (seconds == 0){
        document.getElementById("timetext").style.display = "none";
        myBtn.removeAttribute("disabled");
        $("#myBtn").removeClass().addClass("btnEnable");
        myBtn.innerHTML = "Resend OTP";
        clearInterval(interval);
        seconds = secondsCopy;
      } 

  }, 1000);
}

/**
 * 
 * .m-fadeOut {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s linear 300ms, opacity 300ms;
}
.m-fadeIn {
  visibility: visible;
  opacity: 1;
  transition: visibility 0s linear 0s, opacity 300ms;
}} error 

//code to remove class
if (el.classList.contains("red")) {
    el.classList.remove("red");
  }
 */

function showError(error){
  document.getElementById("errorbox").innerHTML = error ;
  document.getElementById("errorbox").style.display = "block" ;
  setTimeout(hideError(),1000);

}
function hideError(){
    document.getElementById("errorbox").innerHTML = "" ;
    document.getElementById("errorbox").style.display = null ;

}

