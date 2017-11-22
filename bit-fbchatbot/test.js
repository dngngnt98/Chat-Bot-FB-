var parseString = require('xml2js').parseString;

var xml = ' <?xml version="1.0" encoding="UTF-8" standalone="yes"?><NewAddressListResponse><cmmMsgHeader><requestMsgId></requestMsgId><responseMsgId></responseMsgId><responseTime>20171122:195710262</responseTime><successYN>Y</successYN><returnCode>00</returnCode><errMsg></errMsg><totalCount>1</totalCount><countPerPage>10</countPerPage><totalPage>1</totalPage><currentPage>1</currentPage></cmmMsgHeader><newAddressListAreaCd><zipNo>10114</zipNo><lnmAdres>경기도 김포시 양도로 18 (풍무동, 양도마을서해아파트)</lnmAdres><rnAdres>경기도 김포시 풍무동 147 양도마을서해아파트</rnAdres></newAddressListAreaCd></NewAddressListResponse>'

parseString(xml, (err, result) => {
    var headers = result.NewAddressListResponse.cmmMsgHeader[0];
    var totalCount = headers.totalCount[0];
    var countPerPage = headers.countPerPage[0];
    var currentPage = headers.currentPage[0];
    console.log(totalCount);
    console.log(countPerPage);
    console.log(currentPage);
    console.log('-----------------------------------------');

    var addList = result.NewAddressListResponse.newAddressListAreaCd;
    for (var addr of addList) {
        console.log(addr.zipNo[0]);
        console.log(addr.rnAdres[0]);
        console.log(addr.lnmAdres[0]);
    }

});