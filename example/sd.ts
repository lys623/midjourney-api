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
    // Debug: true,
    Ws: true,
    BotId:'1101146088049750076',
  });
  await client.Connect();
  client.wsClient?.on('messageCreate',function(event){
    if(event.author.username!=='StableDreamer') return;
    if(!event.attachments.length){
      // create
      if(event.flags===0){
        console.log('create success',event.content,event.id)
      }else{
        console.log('create fail',event.content)
      }
    }else{
      // done
      console.log('image done',event)
    }
  })
  console.log('client',client.config.SalaiToken)
  let res= await client.ImagineSD([
    {
      "type":3,
      "name":"prompt",
      "value":"a new ffxiv pirate job, miqote with blue hair, eyepatch, pirate hat, peg leg"
    },
    // {
    //   "type":3,
    //   "name":"style",
    //   "value":"Comic Book"
    // },
    {
      "type":3,
      "name":"aspect",
      "value":"1:1"
    }])
  // const msg = await client.Info();
  // console.log({ msg });
  console.log('res',res)
  // client.Close();
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
