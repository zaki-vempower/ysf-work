const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');
const json2csv = require('json2csv').parse
const util = require('util');
const _ = require('lodash')


const scriptUrl = async (util) => {
    const data = []
    const data1 = []
    const dat = []
    let dataa = []
    const vaal = {}
    let book;
    let num = 0;
    let range = 200
    let loop = 0
    let utill = util

    fs.createReadStream('accounts.csv')
        .pipe(csv())
        .on('data', async (row) => {
            const keys = Object.keys(row)
            const rows = {
                'email': row[`${keys[0]}`],
                'password': row[`${keys[1]}`]
            }
            data.push(rows)


        })
        .on('end', async () => {

            const browser = await puppeteer.launch({
                headless: true
            });
            const page = await browser.newPage();
            for (let dat of data) {

            await page.goto('https://www.ziffit.com/en-gb/log-in');
            await page.type('#email', dat['email']);
            await page.type('#password', dat['password']);
            await page.keyboard.press('Enter');
            await page.waitForNavigation( {
                timeout: 100000
            });
            await page.waitForTimeout(10000);
            await page.screenshot({
                path: 'baeforefill.png'
            });


            await page.waitForSelector('.ziffittable');
            const recordList = await page.$$eval('table.ziffittable tbody tr ',(trows)=>{
                let rowList = [] 

                trows.forEach(row => {
                    const trList  = Array.from(row.querySelectorAll('th'), column => column.innerText);
                        const tdList = Array.from(row.querySelectorAll('th a.btn'), column => column.href); // getting textvalue of each column of a row and adding them to a list.   
                        
                        const book = {
                             link:tdList[0],
                             tdNum:trList[0],
                             date:trList[1],
                             status:trList[2],
                             value:trList[3],
                             page: 1
                         }
                            rowList.push(book)

                    });
                    


                return rowList;
            })
dataa = [...dataa,...recordList]
            await page.click('.z-paginator-container > button.ziffitbtn:last-child')
            const rowPage = []
            
            const services = await page.evaluate(() =>{
                document.querySelector('.z-paginator-container > button:last-child').click()
    const data = document.querySelector('.z-paginator-container > button:nth-last-child(3)').innerText
    return data
            }
)
let pages1 = []

console.log('pages clicking',parseInt(services))
await page.click('.z-paginator-container > button.ziffitbtn:nth-child(1)')
for(let s=0;s<= (parseInt(services));s++){

    let recordList1 = await page.$$eval('table.ziffittable tbody tr ',(trows)=>{
        let rowList = [] 

        trows.forEach(row => {
            const trList  = Array.from(row.querySelectorAll('th'), column => column.innerText);
                const tdList = Array.from(row.querySelectorAll('th a.btn'), column => column.href); // getting textvalue of each column of a row and adding them to a list.   
                 const book = {
                     link:tdList[0],
                     tdNum:trList[0],
                     date:trList[1],
                     status:trList[2],
                     value:trList[3],
                 }
                 rowList.push(book)

            });

            // const rowL = rowList.filter((element, index, array) => element.length != 0 )
        return rowList;
    })
    recordList1 = recordList.map(function(el) {
        var o = Object.assign({}, el);
        o.page = s + 1;
        return o;
      })


    pages1 = [...pages1,...recordList1]

    await page.waitForTimeout(1000)
    await page.click('.z-paginator-container > button.ziffitbtn:nth-last-child(2)')
    await page.waitForTimeout(1000)
    console.log('dat,dat',pages1.length)

}
dataa = [...dataa,...pages1]
await page.waitForTimeout(1000)

dataa = dataa.filter((i,e,a)=> i !== null)

let rwoList = []
for(let item of dataa){

                    await page.waitForTimeout(2000);

                    await page.goto(`${item.link}`);
                    await page.waitForTimeout(2000)

                    let rowsOfth = await page.$$eval('table.ziffittable tbody tr',(list) =>{
                        const Alist = []
                        list.forEach(row=>{
                            const wap = Array.from(row.querySelectorAll('th'), column => column.innerText);
                
                            Alist.push(wap[1])
                        })
                
                        return Alist
                    })
                    let rowsOfth1 = await page.$$eval('table.ziffittable tbody tr',(list) =>{
                        const Alist = []
                        list.forEach(row=>{
                            const wap = Array.from(row.querySelectorAll('th'), column => column.innerText);
                            const rows = {
                                'title': wap[0],
                                'isbns': wap[1],
                                'type': wap[2],
                                'value': wap[3],
                                'status': wap[4]
                            }
                            Alist.push(rows)
                        })
                
                        return Alist
                    })
                    const arr = []
                    rowsOfth.forEach((item,i)=>{
                        arr.push(item['isbns'])
                    })
                    const set = _.uniq(arr)
                    rowsOfth = rowsOfth.filter((i,e,a)=> i !== null)
                    var counts = {};
                    rowsOfth = rowsOfth.filter((i,e,a)=> i['title'] !== null)
                
                    rowsOfth?.forEach(function(x,i) {
                        counts[x] = (counts[x] || 0) + 1;
                    });

                    const val = Object.keys(counts)
                    rowsOfth1?.forEach(function(itemsss,l) {
                
                            if(val.includes(itemsss['isbns'] && Object.values(item).length >= 1) ){
                                vaal[`${itemsss['isbns']}`] = {}
                                vaal[`${itemsss['isbns']}`]['account'] = dat['email']
                                vaal[`${itemsss['isbns']}`]['trade numnber(if it exists)'] = item['tdNum']
                                vaal[`${itemsss['isbns']}`]['status'] = item['status']
                                vaal[`${itemsss['isbns']}`]['date'] = item['date']
                                vaal[`${itemsss['isbns']}`]['value'] = item['value']
                                vaal[`${itemsss['isbns']}`]['title'] = itemsss['title']  
                                vaal[`${itemsss['isbns']}`]['isbns'] = itemsss['isbns']
                                vaal[`${itemsss['isbns']}`]['type'] = itemsss['type']
                                vaal[`${itemsss['isbns']}`]['status'] = itemsss['status']
                                vaal[`${itemsss['isbns']}`]['quantity'] = counts[`${itemsss['isbns']}`]
                                console.log('title',vaal[`${itemsss['isbns']}`])
                            }
                        
                    });


                       rowsh = json2csv(Object.values(vaal), {
                           header: true
                       });
           
           
                       fs.appendFileSync('basketmanage12.csv', rowsh);
                       console.log('proccessed', Object.values(vaal).length)
                       rwoList = [...rwoList,...Object.values(vaal)]

await page.waitForTimeout(2000);
                }

                await page.waitForTimeout(2000);
                console.log('number1', rwoList.length)
                rows = json2csv(rwoList, {
                    header: true
                });
    
    
                fs.appendFileSync('basketmanage.csv', rows);

            await page.click('button[data-target="#navbar"]')
        await page.click('#mobile-authentication-buttons-component > ul > li:nth-child(2)')
        await page.waitForNavigation()
        }


        await browser.close();
        })

    }

    scriptUrl(util)