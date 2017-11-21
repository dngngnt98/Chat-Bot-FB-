const request = require('request')

const searchNewAddress = (searchWord) => {
    request({
        uri: 'http://openapi.epost.go.kr/postal/retrieveNewAdressAreaCdService/retrieveNewAdressAreaCdService/getNewAddressListAreaCd',
        qs: {
            'ServiceKey': '7zzoOgBYZmF97yjzJb7C3cgqXqCe1ImhV21M93fB8BTiVfhBhOgD4I9Mr3Hd3NE8AnpalmxuYoNwLOAUkafA1Q%3D%3D',
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