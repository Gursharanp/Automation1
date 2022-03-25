
const puppeteer = require('puppeteer');
let excel=require("xlsx");
// (async () => {
//   const browser = await puppeteer.launch({headless:false});
//   const page = await browser.newPage();
//   await page.goto('https://facebook.com');
// //   await page.screenshot({ path: 'example.png' });

// //   await browser.close();
// })();

// let _page;
// let _browser;
// puppeteer.launch({headless:false})
// .then((browser)=>(_browser=browser))
// .then((browser)=>(_page=browser.newPage()))
// .then((page)=>page.goto('https://face  book.com'))
// .then(()=>_page)


(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null });
  const page = await browser.newPage();
  await page.goto('https://www.google.com/');
  await page.waitForSelector(".gLFyf.gsfi");
  await page.type('.gLFyf.gsfi', 'cowin');
  await page.keyboard.press("Enter");
  await page.waitForSelector(".LC20lb.MBeuO.DKV0Md");
  await page.click('.LC20lb.MBeuO.DKV0Md')
  // await page.waitForSelector("body > app-root > div > section > app-home > div.nearestCentersSection > div > appointment-table > div > div > div > div > div > div > div > div > div > div > form > mat-tab-group > mat-tab-header > div.mat-tab-label-container > div > div");
  let selector = ".mat-tab-labels #mat-tab-label-1-1"
  await page.waitForSelector(selector);
  await page.evaluate((selector) => document.querySelector(selector).click(), selector);
  await page.waitForSelector("#mat-input-0");
  await page.type('#mat-input-0', '140406');
  await page.keyboard.press("Enter");

  await page.waitForSelector(".main-slider-wrap.col.col-lg-3.col-md-3.col-sm-3.col-xs-12");
  let address = await page.evaluate(() => {
    let addressDataArr = document.querySelectorAll(".main-slider-wrap.col.col-lg-3.col-md-3.col-sm-3.col-xs-12")
    let add = [];
    for (let i = 0; i < addressDataArr.length; i++) {
      let addData = addressDataArr[i].textContent;
      add.push(addData);
    }
    return add;
  });

  await page.waitForSelector("li.availability-date")

  let date = await page.evaluate(() => {
    let slotDate = document.querySelectorAll("li.availability-date");
    let arr = [];
    for (let i = 0; i < slotDate.length; i++) {
      let data = slotDate[i].textContent;
      arr.push(data);
    }
    return arr;
  })

  await page.waitForSelector("li.ng-star-inserted .slots-box");
  let slots = await page.evaluate(() => {
    let arr = document.querySelectorAll("li.ng-star-inserted .slots-box")
    let st = [];
    for (let i = 0; i < arr.length; i++) {
      let data = arr[i].textContent;
      st.push(data)
    }
    return st;
  })

  await page.waitForSelector(".vaccine-list .vaccine-details");

  let vaccine=await page.evaluate(()=>{
    let arr=document.querySelectorAll(".vaccine-list .vaccine-details");
    let vac=[];
    for(let i=0;i<arr.length;i++){
      let data=arr[i].textContent;
      vac.push(data);
    }
    return vac
  })

  let result = { address, date, slots,vaccine };
  console.log(result);

let newWB=excel.utils.book_new();

  let obj_arr = [];

  for (let i = 0; i < 7; i++) {

    let obbj = [];
    for (let j = 0; j < result.address.length; j++) {

      let obj = {};

      obj['Date'] = result.date[i];
      obj['Center']=result.address[j];
      obj['VaccineName']=result.vaccine[j];

      for(let k=0;k<result.slots.length;k++){
        if(k%7==i && Math.floor(k/7)==j){
          if(result.slots[k]=="NA" || result.slots[k]==undefined){
            obj['Total']="NA"
          }else{
            let arr=result.slots[k].split(" ");
            arr.splice(10);
            // console.log(arr);
            obj['Total']=arr[1]
          }
        }
      }
      
      obbj.push(obj);
      obj_arr.push(obj);
    }
    // console.log(obj_arr);
    let newWS=excel.utils.json_to_sheet(obbj);
    excel.utils.book_append_sheet(newWB,newWS,result.date[i]);
  }
  excel.writeFile(newWB,'Vaccinate.xls');

})();
