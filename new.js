//  (async () => {

//    const browser = await puppeteer.launch();
    
//    const page = await browser.newPage();

//    //Navigating to Test Project Contact Form
//    await page.goto('https://www.ziffit.com/en-gb/basket');
//    for (let i of data){
//     let bucket = 200
//     let j;
    
//      for(let s;s<=200;s++){
//      //Taking screenshot of initial page UI
//      await page.screenshot({path: 'beforefill.png'});
    
//      //Waiting for form to load
//      await page.type('.form-control', data[i]);
    
//      //Enter on subject
//      await page.keyboard.press('Enter');  

//      await page.waitForTimeout(2000);

//      const fname = await page.waitForSelector(".alert .alert-danger");


//      await page.screenshot({path: `pics/afterfill${j}.png`});

// //     //Taking screenshot of initial page UI

    
//  }

//      await browser.close();
//    }

//  })();