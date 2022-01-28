# WIP
# BDO-Market-Notifier-Console-App
A Node.js console application that consumes the Black Desert Online Market Place Waitlist API. It utilizes Amazon SNS to send a text message if a desired item has been found in the waitlist. This app does require you to set up your own AWS account.




## Table of Contents
- [Getting Started](#getting-started)
- [Modifications](#modifications)
  - [Desired Items](#desired-items)
  - [dotenv](#dotenv)
- [Premade Lists](#premade-lists) 
  - [Blackstar Mainhands](#blackstar-mainhands)


## Getting Started
- Download the BDO-Market-Notifier-Console-App and install Node.js.
- To install Node.js, you can download the LTS version here: https://nodejs.org/en/

## Modifications
### Desired Items
To modifying which items you desire to be notified for, you must add them into the desiredItems array.
- First, you MUST specify the id of the item. Ids for items can be found on various sites like BDOCodex. [For example, The Id for Blackstar Longbow is 715003](https://bdocodex.com/us/item/715003/)
- Second, you can include a name, typically you'll want it to be the actual name of the item but it doesn't actually matter, its mainly for you to make sense of it. Also the text message will include the name of the item found.
- Third, the subId is the enhancement level of the item. So on accessories, TET is 4 and PEN is 5. For weapons and armours, PEN is 20. If subId is not included, it will notify you for all versions of the item that is in the market waitlist.
- Lastly, make sure to follow the formatting, the last item shouldn't need the , after the closing curly brace! There is also a premade list of all the current Blackstar Mainhands further down the page.

### dotenv
You don't need to know what a dotenv (.env) file is but all you need to know is that you store your sensitive information here. I didn't include mine in here (that's the whole point) so you have to create your own and fill it out yourself. Don't worry it is very easy!
- First open notepad and copy and paste the text below and do save as all files and make it .env and put it inside the same folder as the app.js file!
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
RECEIVING_PHONE_NUMBER=
```
- Then follow this guide on how to set up an AWS account with Amazon SNS: https://medium.com/@pkthakur01/sending-text-sms-using-aws-sns-in-node-js-d83d0764120e
Once you have filled in your acess key, secret key, and region you can ignore the rest.
- After you are done following that guide you may need to add your phone number, the one you wanna send texts to, to the sandbox, on the same page as your Amazon SNS, Text messaging page there should be an option for that.
- The only part not in that guide is the RECEIVING_PHONE_NUMBER, for that you must put the phone number you wish to receive it on along with the country code and +. eg. for USA and Canada its +1 and if your phone number was 123-555-4567 it should look like this: RECEIVING_PHONE_NUMBER=+11235554567





## Premade Lists
### Blackstar Mainhands
```
const desiredItems = [
    {
        id: 715001,
        name: ' PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715003,
        name: ' PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715005,
        name: ' PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715007,
        name: ' PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715009,
        name: ' PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715013,
        name: ' PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715016,
        name: ' PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715017,
        name: ' PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715019,
        name: ' PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715021,
        name: ' PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 718616,
        name: ' PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 690563,
        name: ' PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 692045,
        name: ' PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 730564,
        name: ' PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 732313,
        name: ' PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 733063,
        name: ' PEN: Blackstar Mainhand',
        subId: 20,
    }
]
```
