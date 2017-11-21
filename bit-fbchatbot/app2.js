const https = require('https')
    // express를 요청하라
const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const request = require('request')

let jsonParser = bodyParser.json()
let urlParser = bodyParser.urlencoded({ extended: true })

// express()함수를 사용할수 있는 변수 생성
const app = express()
app.use(jsonParser)
app.use(urlParser)

// 인증서 데이터를 로딩
let options = {
    key: fs.readFileSync(''),
    cert: fs.readFileSync(''),
    ca: fs.readFileSync('')
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
app.get('/webhook', function(req, res) {
    consol.log(req.query)

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
// 1) 사용자가 페이스북 페이지로 메시지를 보낸다.
// 2) 페이스북 메신저 서버가 이 서버의 '/webhook' URL로 POST요청 한다.
// 3) 이 서버는 이 POST 요청을 처리한 후 응답한다.
// 4) 페이스북 메신저 서버가 사용자에게 메시지를 보낸다.
// 5) 사용자의 메신저에 응답 내용이 출력된다.
app.post('/webhook', function(req, res) {
    console.log(req.body);
    var data = req.body; // 페이스북 메신저 서버에서 보낸 데이터

    // 우리가 만든 페이스북 페이지로 보낸 메시지인지 검사한다.
    if (data.object === 'page') {

        // 여러 사용자가 메시지를 동시에 보낼 때
        // 페이스북 메신저 서버는 통신 효율을 위해 
        // 그 사용자들의 메시지들을 묶어서 한 번에 보내준다.
        // 그 경우 data.entry에는 여러 사용자들의 메시지가 배열로 들어있다.
        data.entry.forEach(function(entry) {
            // 각각의 엔트리에 들어있는 메시지를 처리해보자
            // 어느 페이지에 보내는지
            var pageID = entry.id
                // 언제 보내는지
            var timeOfEvent = entry.time

            // 각 엔트리당 메시지가 여러 개일 수 있기 때문에 배열로 처리한다.
            entry.messaging.forEach(function(event) {
                // 메시지가 있다면 처리(응답)
                if (event.message) {
                    var senderID = event.sender.id
                    var recipientID = event.recipient.id
                    var timeOfMessage = event.timestamp
                    var message = event.message
                    var messageText = message.text

                    console.log("senderID=", senderID)
                    console.log("recipientID=", recipientID)
                    console.log("messageText=", messageText)

                    // 이제 답변 데이터를 준비한다.
                    var messageData = {
                        recipient: {
                            id: recipientID
                        },
                        message: {
                            text: 'hello22!'
                        }
                    }

                    callSendAPI(messageData)
                } else { //  그 밖엔 그냥 콘솔창에 출력한다.
                    console.log("Webhook received unknown event: ", event);
                }
            })
        })
        res.sendStatus(200);
    }
})

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
            console.error(response);
            console.error(error);
        }
    });
}

// 만약 요청이 잘 처리되었다면 이 함수를 호출하라 (9999는 접속 포트번호이다!)
https.createServer(options, app).listen(9999, function() {
    console.log('서버가 시작되었습니다!')
})