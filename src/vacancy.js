'use strict';
const collector = require('../src/getAllJobs');
const notifier = require('../src/notify');
const userM = require('../models/user');
const vacancyM = require('../models/vacancy');

// all the unique vacancies will persist in database ; 
// every time the script runs, pull all vacancies from database to memeory ; 
// pull all vacancies from git ; 
// find complement set ; 
// add the unadded ones to the database; 
// for each unadded ones, send sperate message to the user ; 

module.exports.run = async function (){
   return new Promise(async (resolve,reject)=>{
    try{

    let db = await vacancyM.find({});
    let vacancies = await collector.getData();
    // let vacancies = [{
    //     name: 'Akuna Capdsago',
    //     link: 'https://akunacapital.com/careers?experience=junior&department=development#careers',
    //     detail: 'Chicago, Various Junior Developer Positions'
    //   },
    //   {
    //     name: 'Akuna Capisfdssdf',
    //     link: 'https://akunacapital.com/careers?experience=junior&department=development#careers',
    //     detail: 'Chicago, Various Junior Developer Positions'
    //   }]
    // find the new Vacancies
    let newVacancies = [] ;
    for(let i = 0 ; i< vacancies.length ; i++){
        let found = false;
        for(let j = 0 ; j<db.length ; j++){
            if(vacancies[i].name === db[j].name && vacancies[i].link === db[j].link  ){
                    found = true; 
                    break ;
            }
        }
        if(!found){
            newVacancies.push(vacancies[i]);
        }
    }
    
    // add these new vacancies to the database ; 
    newVacancies.map(async (item) =>{
        await vacancyM.create(item);
    })

    let users = await userM.find({verified:true},"number").exec();
    if(!users){throw "Some Error Occured"};
     newVacancies.map(item =>{
       notifier.notify(users,item);
     })
    resolve(newVacancies);
    }catch(e){
        console.log(e);
        reject(e);
    }
})


}

  


  