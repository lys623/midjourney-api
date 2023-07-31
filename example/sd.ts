import "dotenv/config";
import { Midjourney } from "../src";
/**
 *
 * a simple example of using the info api
 * ```
 * npx tsx example/info.ts
 * ```
 */
async function main() {
  const client = new Midjourney({
    ServerId: <string>process.env.SERVER_ID,
    ChannelId: <string>process.env.CHANNEL_ID,
    SalaiToken: <string>process.env.SALAI_TOKEN,
    Debug: true,
    Ws: true,
    BotId:'1101146088049750076',
  });
  await client.Connect();
  
  client.wsClient?.on('notFoundCallback',function(event){
    if(event.author.username!=='StableDreamer') return;
    console.log('notFoundCallback',event)
  })
  client.wsClient?.on('messageDelete',function(event){
    if(event.author.username!=='StableDreamer') return;
    console.log('notFoundCallback',event)
  })
  console.log('client',client.config.SalaiToken)
  const options=[
    {
      "type":3,
      "name":"prompt",
      "value":"a new ffxiv pirate job, miqote with blue hair, eyepatch, pirate hat, peg leg"
    },
    {
      "type":3,
      "name":"aspect",
      "value":"1:1"
    }
  ]
  client.ImagineSD(options).then((res)=>{
      console.log('res',res.originMessage)
    }).catch((error)=>{
      console.log('error',error)
    })
  // const msg = await client.Info();
}
main()
  .then(() => {
    // console.log("finished");
    // process.exit(0);
  })
  .catch((err) => {
    // console.log("finished");
    // console.error(err);
    // process.exit(1);
  });
