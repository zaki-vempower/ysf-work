
const cheerio = require('cheerio');
const axios = require('axios');
const fetch = require('fetch').fetchUrl
const sleep = require('system-sleep');
const cliProgress = require('cli-progress');
const fs = require('fs');
const { countReset } = require('console');
 
const data = fs.readFileSync("./montada1.txt").toString('utf-8').split(",")

const myArgs = process.argv.slice(2)
 const b1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const num = data.length
b1.start(num, 0, {
     speed: "N/A"
 });
function run(counter,item){

    if(counter <= item.length){

    fetch(`http://www.montada.com/${item[counter]}`, function(error, meta, body) {
            const $ = cheerio.load(body, {
                decodeEntities: false
            });
            global.text = ''
    

            const nav = []
            $('.breadcrumb .floatcontainer .navbit').each((i,elem)=>{
                nav.push($(elem).text())
            })

        const fev = $('.noinlinemod .pagination_bottom .pagination  .popupctrl').text()
             const way = retnum(fev)
             const semp = way[way.length - 1];
            const wap = parseInt(semp)



             if(nav[2]){
                if (!isNaN(wap)) {
                    start(counter,item,wap,0,nav[2]);                
                     } else {
                        // b1.increment(counter);
                        $('.postbit').each((i, elem) => {
                            const itt = $(".username_container .username ", elem).text()
                            const its = $('.postbody .posttitle  ', elem).text()
                            const itts = $('.postbody .content .postcontent', elem).text()
                            global.text += `${its}\n`
                            global.text += `${itt}\n${itts}`
                        })
                         fs.writeFile(`${nav[2]}/${counter}.txt`, global.text, err => {
                             if (err) {
                                 console.log('Error writing file', err)
                             } else {
                                //   console.log('Successfully wrote files ',counter)
                             }
                         })
                    }
             }

    
     
        })
        sleep(2000)
        counter++;
        run(counter,item);
        b1.increment();
        b1.update(counter);
        


    }

}





function retnum(str) {
        var num = str.replace(/[^0-9]/g, ' ');
        return num.split(" ");
    }

function start(counter,item,wap,i,nav){
        if(i <= wap){
        //   setTimeout(function(){
            sleep(2000);
            fetch(`http://www.montada.com/${item[counter]}&page=${i}`, function(error, meta, body) {
                const $ = cheerio.load(body, {
                    decodeEntities: false
                });
                global.text = ''
                if(i <= 1) {

                    $('.postbit').each((i, elem) => {
                        if(i === 0){
                            const its = $('.postbody .posttitle  ', elem).text() 
                            global.text += `${its}\n` 
                           
                        }
       
                })
                }

                    $('.postbit').each((i, elem) => {
                    const itt = $(".username_container .username ", elem).text()

                    const itts = $('.postbody .content .postcontent', elem).text()
                    global.text += `${itt}\n${itts}` 
                })
            

                   fs.appendFile(`${nav}/${counter}.txt`, global.text, err => {
                       if (err) {
                           console.log('Error writing file', err)
                       } else {
                            // console.log('Successfully wrote files and its replies page number',i,counter)
                       }
                   })
               })

            i++;
            //  console.log('counter',counter,i);
            start(counter,item,wap,i,nav);
        //   },30000);

        }
        b1.increment();
        b1.update(counter);
      }

      run(parseInt(myArgs[0]),data)
 

    b1.stop();