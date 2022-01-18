const dotenv = require('dotenv')
dotenv.config()

const aws = require('aws-sdk');
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const axios = require('axios');
const config = {
    method: 'post',
    url: 'https://api.arsha.io/v2/na/GetWorldMarketWaitList',
    headers: {}
};

const blackstarMainhandIds = [715001, 715003, 715005, 715007, 715009, 715011, 715013, 715016, 715017, 715019, 715021, 718616, 690563, 692045, 730564, 732313, 733063, 12257]
let liveAtTimes = [];

console.log('BDO Market Notifier Console App');

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
                console.log(`Notifications for ${items[i].name} has already been sent`);
            }
            else {
                liveAtTimes.push(items[i].liveAt);

                let publishParams = {
                    Message: `${items[i].name} FOUND!`,
                    PhoneNumber: process.env.RECEIVING_PHONE_NUMBER
                };

                sendSMS(publishParams);

                console.log(`${items[i].name} FOUND!`);
                //Insert Callback to send text message to my phone
            }
        }
    }
}
setInterval(async () => {
    let items = await axios(config)
        .then(function (response) {
            return response.data; //returns list of items in market waitlist
        })
        .catch(function (error) {
            return error;
        });

    if (items.length >= 1) {
        checkArrayForItem(items);
    }
}, 5000)
