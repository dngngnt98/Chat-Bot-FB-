const request = require('request')

const searchNewAddress = (searchWord) => {
    request({
        uri: 'http://openapi.epost.go.kr/postal/retrieveNewAdressAreaCdService/retrieveNewAdressAreaCdService/getNewAddressListAreaCd',
        qs: {
            'ServiceKey': 'latXqMWaqTQzm9UOSNHm % 2 Bl6lmeKMbgyb58z5CznKjBGjpvmcH6tXpB % 2 BHSrvWo6HzOrEkkqHMZc6xITF61mfUrQ % 3 D % 3 D',
            'searchSe': 'dong',
            'srchwrd': encodeURIComponent('searchWord'),
            'countPerPage': '10',
            'currentPage': '1'
        },
        method: 'GET',

    }, function(error, response, body) {
        console.log('=>Status', response.statusCode);
        console.log('=>Headers', JSON.stringify(response.headers));
        console.log('=>Reponse received', body);
    });
};

module.exports = {
    searchNewAddress
};