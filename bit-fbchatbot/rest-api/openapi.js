const request = require('request')

const searchNewAddress = (type, searchWord) => {

    var url = 'http://openapi.epost.go.kr/postal/retrieveNewAdressAreaCdService/retrieveNewAdressAreaCdService/getNewAddressListAreaCd';
    var queryString = '?ServiceKey=' + process.env.OPENAPI_KEY; /* Service Key*/
    queryString += '&searchSe=' + type; /* dong : 동(읍/면)명 road :도로명[default] post : 우편번호 */
    queryString += '&srchwrd=' + encodeURIComponent(searchWord);
    queryString += '&countPerPage=10'; /* 페이지당 출력될 개수를 지정 */
    queryString += '&currentPage=1'; /* 출력될 페이지 번호 */

    request({
        uri: url + queryString,
        // uri: 'http://openapi.epost.go.kr/postal/retrieveNewAdressAreaCdService/retrieveNewAdressAreaCdService/getNewAddressListAreaCd',
        // qs: {
        //     'ServiceKey': '7zzoOgBYZmF97yjzJb7C3cgqXqCe1ImhV21M93fB8BTiVfhBhOgD4I9Mr3Hd3NE8AnpalmxuYoNwLOAUkafA1Q%3D%3D',
        //     'searchSe': 'dong',
        //     'srchwrd': encodeURIComponent('searchWord'),
        //     'countPerPage': '10',
        //     'currentPage': '1'
        // },
    }, function(error, response, body) {
        console.log('=>Status', response.statusCode);
        console.log('=>Headers', JSON.stringify(response.headers));
        console.log('=>Reponse received', body);
    });
};

searchNewAddress('road', '양도로 18');

module.exports = {
    // searchNewAddress
};