process.env.NTBA_FIX_319 = ""+1;

const token = process.env.TOKEN;
const TelegramBot = require('node-telegram-bot-api');

const telebot = new TelegramBot(token);
const chatId = process.env.CHATID
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-schedule');

var set = new Set();
var array = new Array()

function fmAlarm() {
 const url='https://www.fmkorea.com/index.php?mid=digital&category=484400583'
  // 네이버 실검 가져오기
  axios
    .get(url)
    .then((data) => {
      const $ = cheerio.load(data.data);
      const list = $('table > tbody >tr > td.title.hotdeal_var8 >a.hx').each(
        (index, item) => {
          if (
            item['children'][0]['data'].includes('문상') ||
            item['children'][0]['data'].includes('문화상품권')||
            item['children'][0]['data'].includes('컬쳐')
          ) {
            if (!set.has(item['children'][0]['data'])) {
              set.add(item['children'][0]['data']);
              array.push(item['children'][0]['data']+"\n"+url+item['attribs']["href"])
              console.log("????",item['children'][0]['data']+"\n"+url+item['attribs']["href"])

              
              telebot.sendMessage(chatId, array.shift());
          
            }
          }
        }
      );
    
    })
    
    .catch((err) => {
      console.dir(err);
    });
}

async function upbitAlarm() {
  // 네이버 실검 가져오기
    const apiurl ="https://api-manager.upbit.com/api/v1/notices?page=1&per_page=20&thread_name=general"
    const url = "https://upbit.com/service_center/notice"
    const res =await fetch (apiurl)
    const json = await res.json()
    for(var i =0;i<10;i++){
      const item=json['data']['list'][i]['title']
      if(!item.includes("차 에어드랍")
        &&item.includes("에어드랍")
      &&!set.has(item))
        {
          set.add(item)
          array.push(
            item+"\n"
            +url+"?id="+json['data']['list'][i]['id']
          )
          telebot.sendMessage(chatId,array.shift())
        }
    }   

}


async function coinbitAlarm() {
  // 네이버 실검 가져오기
    const apiurl ="https://api-manager.upbit.com/api/v1/notices?page=1&per_page=20&thread_name=general"
    const url = "https://upbit.com/service_center/notice"
    const res =await fetch (apiurl)
    const json = await res.json()
    for(var i =0;i<10;i++){
      const item=json['data']['list'][i]['title']
      if(!item.includes("차 에어드랍")
        &&item.includes("에어드랍")
      &&!set.has(item))
        {
          set.add(item)
          array.push(
            item+"\n"
            +url+"?id="+json['data']['list'][i]['id']
          )
          telebot.sendMessage(chatId,array.shift())
        }
    }   
}
function _TelegramBot(){
  telebot.sendMessage(chatId,"엄준식")
}


cron.scheduleJob({ second: 10 }, () => {
  upbitAlarm();
  fmAlarm();
 //_TelegramBot()
  console.log('엄');
});

export default function handler(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ name: 'John Doe' }));
}
