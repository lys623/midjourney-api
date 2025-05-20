import "dotenv/config";
import { Midjourney } from "../src";
import { sleep } from "../src/utils";
/**
 *
 * a simple example of how to use the imagine command
 * ```
 * npx tsx example/imagine.ts
 * ```
 */
let client1,client2;
const token='MTM3MzE3ODAzODYxNTAxOTUyMA.G4Mw4k.-uZ3l_sgjMofIKex7epSfdGH5EHNb4N-23eNqA'
const channelId='1374074820345593916'
async function main() {
  console.log('process.env.SERVER_ID',process.env.SERVER_ID)
  const client = new Midjourney({
    ServerId: null,
    // ServerId: <string>process.env.SERVER_ID,
    ChannelId: channelId,
    SalaiToken: token,
    Debug: true,
    Ws: true,
    writeLog:true
  });

  await client.Connect();
  await sleep(5000);
  console.log('------setting------')
  client.wsClient.on('createDone',async (data)=>{
    console.log('createDone---',data)
  })
  client.wsClient.on('messageCreate',async (data)=>{
    const text=data.embeds?.[0]?.footer?.text;
    const title=data.embeds?.[0]?.title;
    if(title?.includes('have permission')){
      return;
    }
    const banText=['year old','岁','year-old','years-old','years old']
    let shouldBan=false;
    // if(hasConsecutiveDigits(text)){
    //   shouldBan=true;
    // }
    if(text&&banText.some(item=>text?.includes(item))){
      shouldBan=true;
    }
    if(shouldBan){
      console.log('banText',text)
      const authorizing_integration_owners=data.interaction_metadata?.authorizing_integration_owners;
      Object.values(authorizing_integration_owners).forEach(val=>{
        const application_id=data.application_id;
        console.log('authorizing_integration_owners--',val,application_id,data.channel_id)
        console.log('discord link:',`https://discord.com/channels/${val}/${data.channel_id}`)
        if(val==0){
          deleteChannel(data.channel_id);
        }else{
          setBan(val,application_id);
        }
      })
    }
  })
  // const setting = await client.Settings();
  // console.log('------setting',setting);
//  const msg3=await client.Info();
//       console.log(msg3);
  // const msg = await client.Imagine(
  //   "close up,Rainbow dragon surrounded by a cute little Chinese boy,5 years old,wearing gorgeous Hanfu, Rainbow dragon,grand scene, minimalism, Chinese dragon, C4D rendering,Surrealism, master works, movie lighting, Ultra HD, fine detail, color rating,32K HD --ar 3:4 --niji 5",
  //   (uri: string, progress: string) => {
  //   }
  // ).then((res)=>{
  //   console.log('---res',res)
  //   return res;
  // }).catch((res)=>{
  //   console.log('---catch',res)
  // })
  // console.log('msg-----------222------1111',JSON.stringify(msg));
  // if (!msg) {
  //   console.log("no message");
  //   return;
  // }
  
  // const Variation = await client.Variation({
  //   index: 3,
  //   msgId: <string>msg.id,
  //   hash: <string>msg.hash,
  //   flags: msg.flags,
  //   content: 'close up,Rainbow dragon surrounded by a cute little Chinese boy,5 years old,wearing gorgeous Hanfu, Rainbow dragon,grand scene, minimalism, Chinese dragon, C4D rendering,Surrealism, master works, movie lighting, Ultra HD, fine detail, color rating,32K HD --ar 3:4 --niji 5',
  //   loading: (uri: string, progress: string) => {
  //     console.log("Variation.loading", uri, "progress", progress);
  //   },
  // });
  // console.log({ Variation });

  //  client.Imagine(`a dog and a cat play in the water`).then(res=>{
  //   console.log('res',res.options.reduce((b,c)=>{b.push(c.label);return b},[]))
  //  }).catch((error)=>{
  //   console.log('error',error)
  // })
  // const msg2 = await client.SetSuffix('--ar1:1')
  // client1=client;
  // client.wsClient.on('resetSuffix',async (data)=>{
  //   console.log('执行reset')
  //   const msg2 = await client.SetSuffix('--ar1:1')
  //   console.log(msg2);
  // })
  // setTimeout(async ()=>{
  //   await client.wsClient?.close()
  //   setTimeout(async ()=>{
  //     const msg2=await client.Info();
  //     console.log(msg2);
  //   },2000)
    
  // },5000)
}
main().then(()=>{
 
}).catch((err) => {
  console.error(err);
  process.exit(1);
})
// main2().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });


// setInterval(async ()=>{
//   const msg1 = await client1.SetSuffix('--ar1:1')
//   console.log(msg1);
// },30*1000)

async function setBan(authorizing_integration_owners,application_id){
  const date = new Date();
date.setDate(date.getDate() + 7);
const isoString = date.toISOString();
fetch(`https://discord.com/api/v9/guilds/${authorizing_integration_owners}/members/${application_id}`, {
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9",
      "authorization": token,
      "content-type": "application/json",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-audit-log-reason": "",
      "x-debug-options": "bugReporterEnabled",
      "x-discord-locale": "zh-CN",
      "x-discord-timezone": "Asia/Shanghai",
      "Referer": "https://discord.com/channels/1374185358073266317/1374185358073266320",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": `{\"communication_disabled_until\":\"${isoString}\"}`,
    "method": "PATCH"
  }).then(async (res)=>{
    let result=await res.json()
    console.log('-data---',result)
  })
}

async function deleteChannel(channelId){
  fetch(`https://discord.com/api/v9/channels/${channelId}?silent=false`, {
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9",
      "authorization": token,
      "priority": "u=1, i",
      "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-debug-options": "bugReporterEnabled",
      "x-discord-locale": "zh-CN",
      "x-discord-timezone": "Asia/Shanghai",
      "Referer": "https://discord.com/channels/@me",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "DELETE"
  });
}

// 判断字符串是否包含连续的4位以上数字
function hasConsecutiveDigits(str) {
  const regex = /\d{4,}/;
  return regex.test(str);
}

function hideTask(channelId,messageId){
  fetch(`https://discord.com/api/v9/channels/${channelId}/messages/${messageId}/reactions/%E2%9D%8C/%40me?location=Message%20Context%20Menu&type=0`, {
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "authorization": token,
      "priority": "u=1, i",
      "sec-ch-ua": "\"Chromium\";v=\"136\", \"Microsoft Edge\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-debug-options": "bugReporterEnabled",
      "x-discord-locale": "en-US",
      "x-discord-timezone": "Asia/Shanghai",
      "Referer": "https://discord.com/channels/1374277327600615485/1374277327600615488",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "PUT"
  }).then(async (res)=>{
    console.log('delete task---res',res)
  })
}

// hideTask('1374277327600615488','1374299809288163328')