// 메신저 서버에게 메시지 전달을 요청하는 도구 가져오기
const api = require('./api')


const sendTextMessage = (recipientId, messageText) => {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    api.callMessagesAPI(messageData);
}

const handleReceivePostback = (event) => {
    console.log('postback')
};


const sendImageMessage = (recipientId) => {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "http://ppss.kr/wp-content/uploads/2016/04/%ED%8A%B8%EB%9F%BC%ED%94%8401-549x411.jpg",
                    "is_reusable": true
                }
            }
        }
    };

    api.callMessagesAPI(messageData);
}

const sendButton1Message = (recipientId) => {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "검색 사이트를 선택하세요!",
                    "buttons": [{
                            "type": "web_url",
                            "url": "https://www.google.com",
                            "title": "구글"
                        },
                        {
                            "type": "web_url",
                            "url": "https://www.bing.com",
                            "title": "빙"
                        },
                        {
                            "type": "web_url",
                            "url": "https://www.yahoo.com",
                            "title": "야후"
                        }
                    ]
                }
            }
        }
    };

    api.callMessagesAPI(messageData);
}

const sendButton2Message = (recipientId) => {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "전화걸기예",
                    "buttons": [{
                        "type": "phone_number",
                        "title": "내전화번호",
                        "payload": "+821011112222"
                    }]
                }
            }
        }
    };

    api.callMessagesAPI(messageData);
}

const sendLedMessage = (recipientId) => {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "LED 동작 제어",
                    "buttons": [{
                            "type": "postback",
                            "title": "Led ON",
                            "payload": "led_on"
                        },
                        {
                            "type": "postback",
                            "title": "Led OFF",
                            "payload": "led_off"
                        }
                    ]
                }
            }
        }
    };

    api.callMessagesAPI(messageData);
}

const sendGenericMessage = (recipientId) => {
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

    api.callMessagesAPI(messageData);
}

module.exports = {
    sendTextMessage,
    sendLedMessage
};