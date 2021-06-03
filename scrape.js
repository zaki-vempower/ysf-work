const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');
const json2csv = require('json2csv').parse
const util = require('util');


const scriptUrl = async (util) => {
    const data = []
    const data1 = []
    const dat = []
    let dataa = []
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
            await page.click('.z-paginator-container > button.ziffitbtn:nth-child(8)')
            const rowPage = []
            const services = await page.evaluate(() =>{

    const data = document.querySelector('.z-paginator-container > button:nth-child(6)').textContent
    return data
            }
)
let pages1 = []

console.log('pages clicking',parseInt(services))
await page.click('.z-paginator-container > button.ziffitbtn:nth-child(1)')
for(let s=0;s<= (parseInt(services) - 4);s++){
    await page.waitForTimeout(1000)
    await page.click('.z-paginator-container > button.ziffitbtn:nth-child(7)')
    await page.waitForTimeout(1000)
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

    console.log('dat,dat',pages1.length)

}
dataa = [...dataa,...pages1]
dataa = dataa.filter((i,e,a)=> i !== null)

let rwoList = []
console.log('dataa',dataa.length,utill.isArray(dataa))
for(let item of dataa){
    fs.appendFileSync('data.txt', JSON.stringify(item));
                    await page.waitForTimeout(2000);

                    await page.goto(`${item.link}`);
                    await page.waitForTimeout(2000)

                    let rowsOfth = await page.$$eval('table.ziffittable tbody tr',(list) =>{
                        const Alist = []
                        list.forEach(row=>{
                            const wap = row.querySelector('th[data-label="Title"]')?.innerText
                            Alist.push(wap)
                        })

                        return Alist
                    })
                    rowsOfth = rowsOfth.filter((i,e,a)=> i !== null)
                    var counts = {};

                    rowsOfth?.forEach(function(x) {
                        counts[x] = (counts[x] || 0) + 1;
                    });


                    


                    for(let i =0; i < rowsOfth.length; i++){ 
                        const rows = {}
                            let isbn  = await page.$$eval(`table.ziffittable tbody tr:nth-child(${parseInt(i) + 1})  > th[data-label=Barcode]`,(list) =>{
                           const Barcode = list[0]?.innerText
                       
                           return Barcode
                          })
                         let title22  = await page.$$eval(`table.ziffittable > tbody > tr:nth-child(${parseInt(i) + 1}) > th[data-label=Title]`,(list) =>{
                           const Barcode = list[0]?.innerText
                           return Barcode
                          })

                          if(Object.keys(counts).includes(title22)){
                              rows['account'] = dat['email']
                              rows['trade numnber(if it exists)'] = item['tdNum']
                              rows['status'] = item['status']
                              rows['date'] = item['date']
                              rows['value'] = item['value']
                            rows['ISBN'] = isbn
                              rows['title'] = title22
                              rows['pagenum'] = item['page']




                            if(typeof counts[`${title22}`] === 'number'){
                                rows['quantity'] = counts[`${title22}`]
                                counts[`${title22}`] = rows
                            }




                          }

                       
                        

                       }
                       console.log('title',Object.values(counts))
                       rwoList = [...rwoList,...Object.values(counts)]

await page.waitForTimeout(2000);
                }
                await page.waitForTimeout(2000);
                console.log('number1', rwoList.length)
                rows = json2csv(rwoList, {
                    header: true
                });
    
    
                fs.writeFileSync('basketmanage.csv', rows);

            await page.click('button[data-target="#navbar"]')
        await page.click('#mobile-authentication-buttons-component > ul > li:nth-child(2)')
        await page.waitForNavigation()
        }


        await browser.close();
        })

    }

    scriptUrl(util)