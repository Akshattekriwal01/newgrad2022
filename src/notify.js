const config = require("config");
const msgClient = require('twilio')(config.twilio.id, config.twilio.key);



module.exports.notify = async function (users,msg){
    // check for the max body length ;
    let body = `New Grad 2022 Opening.\nName: ${msg.name.toUpperCase()}\nLink: ${msg.link}\nDetails: ${msg.detail}`;
    
    for(let i = 0 ; i < users.length ; i++){
       
        msgClient.messages.create({
        body: body,
        from: '+12243081269',
        to: users[i].number
    })
    .then(message => {
       // console.log(message.sid)
    });
    }

  }

  module.exports.sendOtp = async function (number,otp){
    // check for the max body length ;
  
   
    let body = `New Grad 2022 Opening SMS Notifier.\nOTP: ${otp} `;
        msgClient.messages.create({
        body: body,
        from: '+12243081269',
        to: number
    })
    .then(message => {
      //  console.log(message.sid)
    });
    

  }
