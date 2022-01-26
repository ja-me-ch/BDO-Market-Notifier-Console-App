const dotenv = require('dotenv')
dotenv.config()
const axios = require('axios');
const aws = require('aws-sdk');
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});


//Add Desired Items here:
const desiredItems = [
    {
        id: 715001,
        name: 'PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715003,
        name: 'PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715005,
        name: 'PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715007,
        name: 'PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715009,
        name: 'PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715013,
        name: 'PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715016,
        name: 'PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715017,
        name: 'PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715019,
        name: 'PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 715021,
        name: 'PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 718616,
        name: 'PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 690563,
        name: 'PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 692045,
        name: 'PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 730564,
        name: 'PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 732313,
        name: 'PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 733063,
        name: 'PEN: Blackstar Mainhand',
        subId: 20,
    },
    {
        id: 11102,
        name: 'Leeburs',
        subId: 20,
    },
    {
        id: 11103,
        name: 'Uwugons'
    }
]



let liveAtTimes = []; //Keeps track of what items have been already notified in this session

const displayLastRefreshTime = function () { //Displays current time when called
    let lastRefreshTime = new Date();
    lastRefreshTime.getTime();

    let meridiem = 'AM';
    let displayedHours = lastRefreshTime.getHours();
    let displayedMinutes = lastRefreshTime.getMinutes();
    if (displayedHours > 12) {
        displayedHours -= 12;
        meridiem = 'PM';
    }
    if (displayedMinutes < 10) {
        displayedMinutes = `0${displayedMinutes}`
    }

    console.log(`Last Refreshed: ${displayedHours}:${displayedMinutes} ${meridiem}`);
}

const sendSMS = (publishParams) => { //Sends SMS according to details in .env file
    const sns = new aws.SNS({ apiVersion: '2010-03-31' }).publish(publishParams).promise()
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        })
}

const delimitResultMsg = function (resultMsg) {
    let delimitedItems = []
    let pipeDelimited = resultMsg.split('|')
    for (let i = 0; i < pipeDelimited.length; i++) {
        let dashDelimited = pipeDelimited[i].split('-');
        if (dashDelimited[0] !== '') {
            delimitedItems.push({
                id: parseInt(dashDelimited[0]),
                subId: parseInt(dashDelimited[1]),
                price: parseInt(dashDelimited[2]),
                liveAt: parseInt(dashDelimited[3])
            })
        };
    }
    return delimitedItems;
}

const checkArrayForItem = function (items) {
    for (let i = 0; i < items.length; i++) {
        desiredItems.forEach(e => {
            if (e.id === items[i].id) {
                if (liveAtTimes.includes(items[i].liveAt)) {
                    console.log(`Notifications for this ${items[i].id} has already been sent`);
                }
                else {
                    liveAtTimes.push(items[i].liveAt);
                    let publishParams = {
                        Message: `${e.name} has been listed on the market.`,
                        PhoneNumber: process.env.RECEIVING_PHONE_NUMBER
                    };
                    if (e.subId !== undefined) {
                        if (e.subId === items[i].subId) {
                            console.log(`Message: ${publishParams.Message} has been sent to: ${publishParams.PhoneNumber}`);
                            //sendSMS(publishParams);
                        }

                    }
                    else {
                        console.log(`Message: ${publishParams.Message} has been sent to: ${publishParams.PhoneNumber}`);
                        //sendSMS(publishParams);
                    }

                }
            }
        })//end of forEach
    }

}

const getWorldMarketWaitList = async function () {
    const bdoAPI = 'https://na-trade.naeu.playblackdesert.com/Trademarket/GetWorldMarketWaitList'
    const arshaAPI = 'https://api.arsha.io/v2/na/GetWorldMarketWaitList'

    const apiUsage = bdoAPI; //Change this to arshaAPI if you want to use API.Arsha.IO instead

    const config = {
        method: 'post',
        url: apiUsage,
        headers: {}
    };


    let items = await axios(config)
        .then(function (response) {
            if (apiUsage === bdoAPI) return response.data.resultMsg; //returns list of items in market waitlist
            else return response.data;
        })
        .catch(function (error) {
            return error;
        });

    if (apiUsage === bdoAPI) {
        items = delimitResultMsg(items);
    }

    console.log(items);
    return items;
}


setInterval(async () => {
    console.clear();

    let items = await getWorldMarketWaitList();


    if (items.length > 0) {
        checkArrayForItem(items);
    }
    else console.log('No items currently in waitlist.');

    displayLastRefreshTime();

}, 60000)

const main = async function () {
    let items = await getWorldMarketWaitList();


    if (items.length > 0) {
        checkArrayForItem(items);
    }
    else console.log('No items currently in waitlist.');
}

main();

