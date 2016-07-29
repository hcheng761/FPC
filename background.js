//console.log("this works, at least")
//chrome.tabs.executeScript(null, { file: "jquery.js" }, function() {
//    chrome.tabs.executeScript(null, { file: "content.js" });
//});
//"http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=JasonNar-fpc-PRD-45a6394d9-fdc20cc4&GLOBAL-ID=EBAY-US&RESPONSE-DATA-FORMAT=JSON&callback=_cb_findItemsByKeywords&REST-PAYLOAD&keywords=harry%20potter&paginationInput.entriesPerPage=3"

//http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=JasonNar-fpc-PRD-45a6394d9-fdc20cc4&GLOBAL-ID=EBAY-US&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=harry%20potter&paginationInput.entriesPerPage=3
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    console.log(request.greeting);
    if (request.greeting == "call api") {
	//Submit the request
	var myResponse;
	console.log(request.myUrl);
  	$.get(request.myUrl, function(data) {
		//alert("Data Loaded: " + data);
		_cb_findItemsByKeywords(data);
		myResponse = data;
	}, "json" );
      sendResponse({farewell: "got it"});
      return true;
	//sendResponse({farewell: myResponse });
    }
    else if (request.greeting == "get url from tab") {
	var rawUrl;
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
	    rawUrl = tabs[0].url;
	    //parse the url
	    //alert(rawUrl);
	    var startPattern = /[?q=]/i;//delimits the start of query
	    var endPattern = /[&]/i;//delimits the end of query
	    var indexStart = rawUrl.search(startPattern);//delimits the start of query
	    var indexEnd = rawUrl.search(endPattern);//find end of searched query
	    //alert(indexStart);
	    //alert(indexEnd);
	    //alert(rawUrl);
	    //alert(rawUrl.substring(indexStart+3,indexEnd));
	    sendResponse({keywords: rawUrl.substring(indexStart+3,indexEnd)});
	    
	});
	
	return true;//keeps the event listener channel open asynchronously
    }
 });

// Parse the response and build an HTML table to display search results
function _cb_findItemsByKeywords(root) {
	//alert("in call-back function!");
	var items = root.findItemsByKeywordsResponse[0].searchResult[0].item || [];
	var html = [];
	html.push('<table width="100%" border="0" cellspacing="0" cellpadding="3"><tbody>');
	for (var i = 0; i < items.length; ++i) {
		var item	= items[i];
		var title	= item.title;
		var pic		= item.galleryURL;
		var viewitem 	= item.viewItemURL;
		var currentPrice;
		var currentCurrency;
		if(item.listingInfo[0].buyItNowPrice) {//not all products are buy it now
			currentCurrency = item.listingInfo[0].buyItNowPrice[0]['@currencyId'];
			currentPrice= item.listingInfo[0].buyItNowPrice[0]['__value__'];
		} else if(item.sellingStatus[0].currentPrice) {//most products have this selling options
			currentCurrency = item.sellingStatus[0].currentPrice[0]['@currencyId'];
			currentPrice= item.sellingStatus[0].currentPrice[0]['__value__'];	
		}
		
		//var buyNowPrice = item.listingInfo.buyItNowPrice;//if any
		
		if (null != title && null != viewitem) {
			html.push('<tr><td>' + '<img src="' + pic + '" border="0">' + '</td>' +
			'<td><a href="' + viewitem + '" target="_blank">' + title + '</a></td>'+
			'<td>' + '<ul>' + 
				'<li> Current Price: ' + currentCurrency + ' ' + currentPrice + '</li>' +  
				'</ul>' +
			'</td></tr>');
		}
	}
	
	html.push('</tdbody></table>');
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  		chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello", newhtml: html});
	});
	//document.getElementById("content").innerHTML = html.join("");
}	// End _cb_findItemsByKeywords() function



