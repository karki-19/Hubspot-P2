import Slack from "@slack/bolt";
import dotenv from "dotenv"

dotenv.config();

export const sendMessageToSlack = async(name)=>{
    // console.log("Testing-1")
    const app = new Slack.App({
        signingSecret: process.env.SLACK_SIGNIN_SECRET,
        token:process.env.SLACK_BOT_TOKEN,
    })
  
    await app.client.chat.postMessage({
        token:process.env.SLACK_BOT_TOKEN,
        channel:process.env.CHANNEL,
        text:`Hello new ${name} Welcome to the Channel`
    })
}

// sendMessageToSlack();