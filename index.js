const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');
const json2csv = require('json2csv').parse


const  args = process.argv;

console.log('arg',typeof parseInt(args[args.length - 1]))
// fs.createReadStream('isbns.csv')
//   .pipe(csv())
//   .on('data', (row) => {
//     console.log(row);
//   })
//   .on('end', () => {
//     console.log('CSV file successfully processed');
//   });


const scriptUrl = async () => {
    const data = []
    const data1 = []
    const dat = []
    let book;
    let num = 0;
    let range = 200
    let loop = 0

    fs.createReadStream('isbns.csv')
        .pipe(csv())
        .on('data', async (row) => {
            const keys = Object.keys(row)
            const rows = {
                'ISBN': row[`${keys[0]}`],
                'Bucket': row[`${keys[1]}`]
            }
            data.push(rows)


        })
        .on('end', async () => {
            const browser = await puppeteer.launch({
                headless: true
            });

            const page = await browser.newPage();
            await page.goto('https://www.ziffit.com/en-gb/log-in');
            await page.type('#email', args.slice(2,4)[0]);
            await page.type('#password', args.slice(2,4)[1]);
            await page.keyboard.press('Enter');
            await page.waitForNavigation( {
                timeout: 100000
            });
            await page.waitForTimeout(10000);
            await page.goto('https://www.ziffit.com/en-gb/basket');



            await page.screenshot({
                path: 'beforefill.png'
            });
            for (let dat of data) {
                const keys1 = Object.keys(dat)
                await page.waitForTimeout(2000);
                for (let s = 0; s <= dat[`${keys1[1]}`]; s++) {
                    if (num === parseInt(args[args.length - 1]) || (num + dat[`${keys1[1]}`]) >= parseInt(args[args.length - 1])) {
                        console.log('200', num, 's loop', s, 'num + s', num + s, 'range', range)
                        // writeStream.write(`${data[j]},${num},no\n`)
                        await page.waitForSelector('.ziffittable');
                        const recordList = await page.$$eval('table.ziffittable tbody tr',(trows)=>{
                            let rowList = []    
                            trows.forEach(row => {
                                    const tdList = Array.from(row.querySelectorAll('th'), column => column.innerText); // getting textvalue of each column of a row and adding them to a list.   
                                    const book = {
                                        isbn:tdList[1],
                                        type:tdList[2],
                                        title:tdList[0],
                                        price:tdList[3]
                                    }
                                        rowList.push(book)
            
                                });
                            return rowList;
                        })

                        recordList.forEach((record,i) =>{
                            data1.forEach((obj,j) =>{
                                if(record['isbn'] === obj['ISBN']){
            
                                    data1[j]['title'] = record['title']
                                    data1[j]['price'] = record['price']
            
                                }
                            })
                        })
                        await page.waitForSelector('.buttonHolder');
                        await page.click('.buttonHolder')

                        num = 0
                        await page.waitForNavigation( {
                            timeout: 100000
                        });
                        await page.waitForTimeout(3000);
                        await page.goto('https://www.ziffit.com/en-gb/basket');
                        console.log('number1', num)

                    }
                    await page.waitForTimeout(3000);
                    await page.type('.form-control', dat[`${keys1[0]}`]);
                    await page.keyboard.press('Enter');
                    await page.waitForSelector('.alert', {
                        timeout: 100000
                    });

                    const test = await page.$$('.alert');
                    console.log('num',dat[`${keys1[0]}`], num, s)


                    try {
                        if (test[0]?._remoteObject.description === 'div.alert.alert-danger') {

                            break
                        }
                    } catch (err) {
                        console.log(err)
                    }

                    num = num + 1;
                    loop = s
                    console.log('loop after s',loop)
                }
                await page.screenshot({
                    path: `afterfill1.png`
                });


                const roaw = {
                    'ISBN': dat[`${keys1[0]}`],
                    'Bucket': dat[`${keys1[1]}`],
                    'hits': loop
                }
                data1.push(roaw)
                console.log('number of hits to make it to the basket', num, 's loop', loop)
                loop = 0

            }
            await page.waitForSelector('.ziffittable');
            const recordList = await page.$$eval('table.ziffittable tbody tr',(trows)=>{
                let rowList = []    
                trows.forEach(row => {
// (tr < th < a) anchor tag text contains country name
                        const tdList = Array.from(row.querySelectorAll('th'), column => column.innerText); // getting textvalue of each column of a row and adding them to a list.   
                        const book = {
                            isbn:tdList[1],
                            type:tdList[2],
                            title:tdList[0],
                            price:tdList[3],
                            
                        }
                            rowList.push(book)

                    });
                return rowList;
            })

            recordList.forEach((record,i) =>{
                data1.forEach((obj,j) =>{
                    if(record['isbn'] === obj['ISBN']){
                        data1[j]['title'] = record['title']
                        data1[j]['price'] = record['price']

                    }
                })
            })



            //  writeStream.write(`${data[j]},${num},no\n`)
             await page.waitForSelector('.buttonHolder');
             await page.click('.buttonHolder')

            num = 0
            await page.waitForNavigation( {
                timeout: 100000
            });
            await page.waitForTimeout(3000);
            await page.goto('https://www.ziffit.com/en-gb/basket');
            console.log('number1', num)
            rows = json2csv(data1, {
                header: true
            });


            fs.writeFileSync('isbns1.csv', rows);
            console.log('number', num)
            await browser.close();
            console.log('CSV file successfully processed');

        })
}


const clickByText = async (page, text) => {
    const escapedText = escapeXpathString(text);
    const linkHandlers = await page.$x(`//a[contains(text(), ${escapedText})]`);

    if (linkHandlers.length > 0) {
        await linkHandlers[0].click();
    } else {
        throw new Error(`Link not found: ${text}`);
    }
};

scriptUrl()