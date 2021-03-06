// express를 요청하라
const express = require('express')
const https = require('https')
const fs = require('fs')
const bodyParser = require('body-parser')
const request = require('request')

let jsonParser = bodyParser.json()
let urlParser = bodyParser.urlencoded({ extended: true })

// .env 파일의 내용을 로딩한다.
require('dotenv').config()

// express()함수를 사용할수 있는 변수 생성
const app = express()
app.use(jsonParser)
app.use(urlParser)


// 인증서 데이터를 로딩
let options = {
    key: fs.readFileSync('custom.key'),
    cert: fs.readFileSync('www_kkook_xyz.crt'),
    ca: fs.readFileSync('www_kkook_xyz.ca-bundle')
}

// 정적 파일의 경로를 지정해야 express에서 찾아 클라이언트에게 보낼 수 있다.
app.use(express.static('public'))

// get요청(/hello)이 들어왔을때 사용할 함수 등록
app.get('/hello', function(req, res) {
    // 헤드값 출력
    res.writeHead(200, {
        'Content-Type': 'text/plain;charset=UTF-8'
    })
    res.write('hello!\n')
    res.end()
})

app.get('/hello2', function(req, res) {
    // 헤드값 출력
    res.writeHead(200, {
        'Content-Type': 'text/plain;charset=UTF-8'
    })
    res.write('hello2!\n')
    res.end()
})

// Webhook validation
// 페이스북 서버에서 이 서버의 유효성을 겁사하기 위해 요청
app.get('/webhook', function(req, res) {
    console.log(req.query)
    console.log(process.env)
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

// Message processing
app.post('/webhook', function(req, res) {
    //console.log(req.body);
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function(entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            // Iterate over each messaging event
            entry.messaging.forEach(function(event) {
                if (event.message) {
                    console.log('event.message===>', event.message)
                    receivedMessage(event)
                } else if (event.postback) {
                    console.log(req.body)
                    console.log('event.postback===> ', event.postback)
                    receivedPostback(event);
                } else {
                    //console.log("unknown event: ", event);
                }
            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know
        // you've successfully received the callback. Otherwise, the request
        // will time out and we will keep trying to resend.
        res.sendStatus(200);
    }
});

// Incoming events handling
function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);

    var messageId = message.mid;
    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {
        // If we receive a text message, check to see if it matches a keyword
        // and send back the template example. Otherwise, just echo the text we received.

        if (messageText.startsWith("op:")) {
            let arr = messageText.substring(3).split(',')
            let result = 0
            switch (arr[0]) {
                case 'plus':
                    result = parseInt(arr[1]) + parseInt(arr[2]);
                    break;
            }
            sendTextMessage(senderID, "결과=" + result)
        } else if (messageText == 'generic') {
            sendGenericMessage(senderID)
        } else {
            sendTextMessage(senderID, "올바른 명령이 아닙니다.")
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
}

function receivedPostback(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback 
    // button for Structured Messages. 
    var payload = event.postback.payload;

    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);

    // When a postback is called, we'll send a message back to the sender to 
    // let them know it was successful
    sendTextMessage(senderID, "Postback called");
}

//////////////////////////
// Sending helpers
//////////////////////////
function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    callSendAPI(messageData);
}

function sendGenericMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{
                        title: "rift",
                        subtitle: "Next-generation virtual reality",
                        item_url: "https://www.oculus.com/en-us/rift/",
                        image_url: "http://messengerdemo.parseapp.com/img/rift.png",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/rift/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for first bubble",
                        }],
                    }, {
                        title: "touch",
                        subtitle: "Your Hands, Now in VR",
                        item_url: "https://www.oculus.com/en-us/touch/",
                        image_url: "http://messengerdemo.parseapp.com/img/touch.png",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/touch/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for second bubble",
                        }]
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData

    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            console.log("Successfully sent generic message with id %s to recipient %s",
                messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            //console.error(response);
            console.error(error);
        }
    });
}

// 만약 요청이 잘 처리되었다면 이 함수를 호출하라 (9999는 접속 포트번호이다!)
https.createServer(options, app).listen(9999, function() {
    console.log('서버가 시작되었습니다!')
})