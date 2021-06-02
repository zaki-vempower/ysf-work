const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');
const json2csv = require('json2csv').parse

const  args = process.argv;

console.log('arg',args[args.length - 1])


const scriptUrl = async () => {
    const data = []
    const data1 = []
    const dat = []
    let book;
    let num = 0;
    let range = 200
    let loop = 0


}