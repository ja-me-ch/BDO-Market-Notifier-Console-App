const dotenv = require('dotenv')
dotenv.config()

const aws = require('aws-sdk');
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const axios = require('axios');


const blackstarMainhandIds = [715001, 715003, 715005, 715007, 715009, 715011, 715013, 715016, 715017, 715019, 715021, 718616, 690563, 692045, 730564, 732313, 733063]
let liveAtTimes = [];


console.log('BDO Market Notifier Console App');

const displayLastRefreshTime = function () {
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


const sendSMS = (publishParams) => {
    const sns = new aws.SNS({ apiVersion: '2010-03-31' }).publish(publishParams).promise()
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        })
}

const checkArrayForItem = function (items) {
    for (let i = 0; i < items.length; i++) {
        if (blackstarMainhandIds.includes(items[i].id)) {

            if (liveAtTimes.includes(items[i].liveAt)) {
                console.log(`Notifications for this ${items[i].id} has already been sent`);
            }
            else {
                liveAtTimes.push(items[i].liveAt);

                let publishParams = {
                    Message: `${items[i].id} FOUND!`,
                    PhoneNumber: process.env.RECEIVING_PHONE_NUMBER
                };

                //sendSMS(publishParams);

                console.log(`${items[i].id} FOUND!`);
            }
        }
    }
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

setInterval(async () => {
    console.clear();
    const bdoAPI = 'https://na-trade.naeu.playblackdesert.com/Trademarket/GetWorldMarketWaitList'
    const arshaAPI = 'https://api.arsha.io/v2/na/GetWorldMarketWaitList'

    const apiUsage = bdoAPI;

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


    if (items.length >= 1) {
        checkArrayForItem(items);
    }

    displayLastRefreshTime();
    console.log(items);

}, 60000)




