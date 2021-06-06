const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');
const json2csv = require('json2csv').parse
const util = require('util');
const _ = require('lodash')

async function scrapeUtil() {
    const url = 'https://www.ziffit.com/en-gb/trades/4742389'
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto('https://www.ziffit.com/en-gb/log-in');
    await page.type('#email', 'syedzaki.uddin@yahoo.com');
    await page.type('#password', '/21Jumpstreet/');
    await page.keyboard.press('Enter');
    await page.waitForNavigation( {
        timeout: 100000
    });
    await page.waitForTimeout(2000);

    await page.goto(`${url}`);

    await page.waitForTimeout(5000)

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
    console.log('Alist',rowsOfth.length,set.length)
    rowsOfth = rowsOfth.filter((i,e,a)=> i !== null)
    var counts = {};
    rowsOfth = rowsOfth.filter((i,e,a)=> i['title'] !== null)

    rowsOfth?.forEach(function(x,i) {
        counts[x] = (counts[x] || 0) + 1;
    });
    const vaal = {}
    const val = Object.keys(counts)
    rowsOfth1?.forEach(function(item,i) {

            if(val.includes(item['isbns']) ){
                vaal[`${item['isbns']}`] = {}
                vaal[`${item['isbns']}`]['title'] = item['title']  
                vaal[`${item['isbns']}`]['isbns'] = item['isbns']
                vaal[`${item['isbns']}`]['type'] = item['type']
                vaal[`${item['isbns']}`]['value'] = item['value']
                vaal[`${item['isbns']}`]['status'] = item['status']
                vaal[`${item['isbns']}`]['quantity'] = counts[`${item['isbns']}`]
            }
        
    });
    console.log('vallll',vaal)
    const pfff = Object.values(vaal)
    rigg = json2csv(pfff, {
        header: true
    });

    fs.writeFileSync('counts.csv', rigg);
    await browser.close()
   

   }



scrapeUtil()