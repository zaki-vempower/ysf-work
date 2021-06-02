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
                             value:trList[3]
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
    await page.waitForTimeout(2000)
    await page.click('.z-paginator-container > button.ziffitbtn:nth-child(7)')
    await page.waitForTimeout(2000)
    const recordList1 = await page.$$eval('table.ziffittable tbody tr ',(trows)=>{
        let rowList = [] 

        trows.forEach(row => {
            const trList  = Array.from(row.querySelectorAll('th'), column => column.innerText);
                const tdList = Array.from(row.querySelectorAll('th a.btn'), column => column.href); // getting textvalue of each column of a row and adding them to a list.   
                 const book = {
                     link:tdList[0],
                     tdNum:trList[0],
                     date:trList[1],
                     status:trList[2],
                     value:trList[3]
                 }
                 rowList.push(book)

            });

            // const rowL = rowList.filter((element, index, array) => element.length != 0 )
        return rowList;
    })
    pages1 = [...pages1,...recordList1]
    await page.waitForTimeout(2000)

    console.log('dat,dat',pages1.length)

}
dataa = [...dataa,...pages1]

const rwoList = []
console.log('dataa',dataa.length,utill.isArray(dataa))
for(let item of dataa){
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

                    console.log('data',rowsOfth)

                    let counts = {}
rowsOfth = rowsOfth.filter((i)=> i !== null)
for(let i =0; i < rowsOfth.length; i++){ 
 if (counts[rowsOfth[i]]){
   counts['ISBN']  = page.$$eval(`table.ziffittable tbody tr:nth-child(${parseInt(i) + 1})  > th[data-label=Barcode]`,(list) =>{
    const Barcode = list[0]?.innerText

    return Barcode
   })
   counts['Title'] = page.$$eval(`table.ziffittable > tbody > tr:nth-child(${parseInt(i) + 1}) > th[data-label=Title]`,(list) =>{
    const Barcode = list[0]?.innerText
    return Barcode
   })
   counts['tdNum'] = item['tdNum']
   counts['date'] = item['date']
   counts['status'] = item['status']
 counts[rowsOfth[i]] += 1

 } else {
    counts['ISBN']  = page.$$eval(`table.ziffittable tbody tr:nth-child(${parseInt(i) + 1})  > th[data-label=Barcode]`,(list) =>{
        const Barcode = list[0]?.innerText
    
        return Barcode
       })
       counts['Title'] = page.$$eval(`table.ziffittable > tbody > tr:nth-child(${parseInt(i) + 1}) > th[data-label=Title]`,(list) =>{
        const Barcode = list[0]?.innerText
        return Barcode
       })
       counts['tdNum'] = item['tdNum']
       counts['date'] = item['date']
       counts['status'] = item['status']
     counts[rowsOfth[i]] += 1
 counts[rowsOfth[i]] = 1
 }
 rwoList.push(counts)
}

await page.waitForTimeout(2000);
                }
                await page.waitForTimeout(2000);
                console.log('number1', rwoList.length)
                rows = json2csv(rwoList, {
                    header: true
                });
    
    
                fs.writeFileSync('isbns1.csv', rows);
                console.log('number', num)

        await page.click('#mobile-authentication-buttons-component > ul > li:nth-child(2) > a')
        }


        await browser.close();
        })

    }

    scriptUrl(util)