const request = require('request');
const parseString = require('xml2js').parseString;
require('dotenv').config({ path: '/home/ec2-user/vars/.env' })

const searchNewAddress = (type, searchWord, callback) => {

    var url = 'http://openapi.epost.go.kr/postal/retrieveNewAdressAreaCdService/retrieveNewAdressAreaCdService/getNewAddressListAreaCd';
    var queryString = '?ServiceKey=' + process.env.OPENAPI_KEY; /* Service Key*/
    queryString += '&searchSe=' + type; /* dong : 동(읍/면)명 road :도로명[default] post : 우편번호 */
    queryString += '&srchwrd=' + encodeURIComponent(searchWord);
    queryString += '&countPerPage=10'; /* 페이지당 출력될 개수를 지정 */
    queryString += '&currentPage=1'; /* 출력될 페이지 번호 */

    request({
        uri: url + queryString,

    }, function(error, response, body) {
        // console.log('=>Status', response.statusCode);
        // console.log('=>Headers', JSON.stringify(response.headers));
        console.log('=>Reponse received', body);
        parseString(body, (err, result) => {
            var headers = result.NewAddressListResponse.cmmMsgHeader[0];
            var totalCount = headers.totalCount[0];
            var countPerPage = headers.countPerPage[0];
            var currentPage = headers.currentPage[0];

            console.log('[주소검색결과]')
            console.log(totalCount);
            console.log(countPerPage);
            console.log(currentPage);
            console.log('-----------------------------------------');

            var message = '';
            var addList = result.NewAddressListResponse.newAddressListAreaCd;
            for (var addr of addList) {
                message += '[' + addr.zipNo[0] + ']\n';
                message += '[' + addr.rnAdres[0] + ']\n';
                message += '[' + addr.lnmAdres[0] + ']\n';
                message += '\n';
            }

            callback(message);

        });
    });
};

//searchNewAddress('road', '양도로 18');

module.exports = {
    searchNewAddress
};