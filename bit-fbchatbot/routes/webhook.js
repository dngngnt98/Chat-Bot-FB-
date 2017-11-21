// nodeJS에서 Express 모듈을 사용할 경우 
// 다음과 같이 express의 라우터 객체에 클라이언트 요청을 처리할 함수를 등록한다. 
// 만약 Express 모듈을 사용하지 않는다면 다음 코드는 무효하다.
//import express from 'express';
const express = require('express');

// 클라이언트 요청이 들어왔을 때 함수를 호출해주는 객체 
const router = express.Router();

// 메시지 이벤트를 처리할 API를 가져온다.
const receiveApi = require('../messenger-api-helpers/receives')

// 페이스북 서버에서 이 서버의 유효성을 검사하기 위해 요청 
// => webhook.js는 클라이언트에서 URL '/webhook'으로 요청이 들어 왔을 때 실행한다.
// => 그래서 기본 URL이 이미 '/webhook' 이다.
// => 그러니까 '/webhook' URL을 지정하기 위해서는 그냥 '/'로 해야한다.  
router.get('/', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

// 메시지 처리 
// 1) 사용자가 페이지북 페이지로 메시지를 보낸다.
// 2) 페이스북 메신저 서버가 이 서버의 '/webhook' URL POST 요청한다.
// 3) 이 서버는 이 POST 요청을 처리한 후 응답한다.
// 4) 페이브북 메신저 서버가 사용자에게 메시지를 보낸다.
// 5) 사용자의 메신저에 응답 내용을 출력된다.
router.post('/', (req, res) => {

    // 메신저 서버에서 요청을 받으면 일단 응답한다.
    res.sendStatus(200);

    // 응답한 후 요청을 처리하는 작업을 수행한다.
    // => 메신저 서버가 보낸 데이터를 꺼낸다.
    var data = req.body;

    // 챗봇에 연결된 페이지에 보낸 메시지인 경우에만 처리한다.
    // Make sure this is a page subscription
    if (data.object === 'page') {
        // 페이지가 받은 데이터 덩어리(entry)가 여러 개일 수 있기 때문에
        // 반복적으로 처리해야 한다.
        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function(entry) {
            // 메시지 관련 데이터가 들어 있지 않다면 요청 처리를 종료한다.
            if (!entry.messaging) {
                return;
            }

            var pageID = entry.id;
            var timeOfEvent = entry.time;

            // 메시지에 들어 있는 각각의 이벤트를 처리한다.
            // Iterate over each messaging event
            entry.messaging.forEach(function(event) {
                if (event.message) {
                    console.log('event.message===> ', event.message)
                    receiveApi.handleReceiveMessage(event);
                } else if (event.postback) {
                    console.log('event.postback===> ', event.postback)
                    receiveApi.handleReceivePostback(event);
                } else {
                    //console.log("unknown event===> ", event);
                }
            }); // entry.messaging.forEach()
        }); // data.entry.forEach()

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know
        // you've successfully received the callback. Otherwise, the request
        // will time out and we will keep trying to resend.
    } // if(data.object == 'page')
}); // router.post('/', ...)

module.exports = router;