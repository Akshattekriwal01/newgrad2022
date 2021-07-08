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
  }
  
  // when all the questions have been answered
  function done() {
    
    // remove the box if there is no next question
    register.className = 'close'
    
    // add the h1 at the end with the welcome text
    var h1 = document.createElement('h1')
    h1.appendChild(document.createTextNode('Welcome ' + questions[0].value + '!'))
    setTimeout(function() {
      register.parentElement.appendChild(h1)     
      setTimeout(function() {h1.style.opacity = 1}, 50)
    }, eTime)
    
  }

  // when submitting the current question
  function validate() {
    console.log(position);
    // set the value of the field into the array
    questions[position].value = inputField.value

    // check if the pattern matches
    if (!inputField.value.match(questions[position].pattern || /.+/)) wrong()
    else ok(function() {
      

      // current question position in question array
      if(position == 1){
          try{
          registerUser(questions[0].value, questions[1].value);
          }catch(e){
              throw "error";
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
  function registerUser(name, number){
  number = number.replace(/\D+/g, "");
  number = number.replace(/\s+/g, "");
  number = "+1"+number;
  console.log(number);
  let req1 = {
    method :"POST",
    url: "https://localhost:3009/user/register",
    body :{
        name ,
        number
    }
  }
  axios(req1).then(async (response)=>{
  console.log(response);
  })
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