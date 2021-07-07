const axios = require('axios');
const marked = require("marked");
const cheerio = require('cheerio');
module.exports.getData = async function (){
    let result =  new Promise(async (resolve,reject)=>{
        try{
            const request = {
              method : 'get',
             url : 'https://api.github.com/repos/coderQuad/New-Grad-Positions-2022/contents/README.md',
             headers: { 'Accept': 'application/vnd.github.v3.raw' },
            }
            let raw = await axios(request);
            let jobObj = buildObject(raw.data);
            resolve(jobObj);
            }catch(e){
              reject(e)
            }
    })
    return result;
  };
/**
 * 
 * @param {string} data - markdown containing job
 * @returns {object[{name,detail,link}]} Array contains job objects . 
 */
function buildObject(data){
    const html = marked(data);
    let $ = cheerio.load(html);
    let result =[];
    $("tbody > tr").each((index, element) => {
        let row = $(element).find("td")
        let name = $(row[0]).text();
        let link = $(row[0]).find("a").attr("href");
        let detail = `${$(row[1]).text()}, ${$(row[2]).text()}` ;
        result.push({name,link,detail});
    });    
    return result ;

}

  