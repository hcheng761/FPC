//console.log("this works, at least");
//alert("YO!");		searchform > tsf-p > nosjv logocont
					//http://i.imgur.com/Z9z75pr.png

var localLogo = chrome.extension.getURL("logo.png");
/*
$('.pslmain').append("<img id = 'clickable'>");
  $('#clickable').each(function(index, image)  {
    $('#clickable').attr('src', localLogo);
    $('#clickable').attr('width', '50px');
    $('#clickable').attr('height', '43px');
  });*/

$('.r').append("<img class = 'clickable'>");
  $('.clickable').each(function(index, image)  {
    $('.clickable').attr('src', localLogo);
    $('.clickable').attr('width', '50px');
    $('.clickable').attr('height', '43px');
});
//alert("Changed something.");
$('img').on('click', function() {
//alert("Now we here");

// Create the HTML for the message
var msg = '<div class=\"header\"><a id=\"close\" href="#">close X</a></div>';
msg += '<div class=\"contentfpc\" id=\"contentfpc\"><h2>Information to be inquired.</h2></div>';

var elNote = document.createElement('div');       // Create a new element
elNote.setAttribute('id', 'note');                // Add an id of note
elNote.innerHTML = msg;                           // Add the message
document.body.appendChild(elNote);                // Add it to the page

var queryKeywords;
var url;
chrome.runtime.sendMessage({greeting: "get url from tab"}, function(response) {
  console.log(response.keywords);
  queryKeywords = response.keywords;
  alert(queryKeywords);

  // Construct the request
// Replace MyAppID with your Production AppID
    url = "http://svcs.ebay.com/services/search/FindingService/v1";
    url += "?OPERATION-NAME=findItemsByKeywords";
    url += "&SERVICE-VERSION=1.0.0";
    url += "&SECURITY-APPNAME=JasonNar-fpc-PRD-45a6394d9-fdc20cc4";
    url += "&GLOBAL-ID=EBAY-US";
    url += "&RESPONSE-DATA-FORMAT=JSON";
    url += "&REST-PAYLOAD";
    url += "&keywords=" + queryKeywords;
    url += "&paginationInput.entriesPerPage=3"
    alert(url);
    console.log(url);
    chrome.runtime.sendMessage({greeting: "call api", myUrl: url}, function(response) {
  	console.log(response.farewell);//log signifies successful response
  
});

});




//alert(url);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello") {
	alert("got html from extension");
	alert(request.newhtml);
	document.getElementById("contentfpc").innerHTML = request.newhtml.join("");
      //sendResponse({farewell: "goodbye"});

    }
});

function dismissNote() {                          // Declare function
  document.body.removeChild(elNote);              // Remove the note
}

var elClose = document.getElementById('close');   // Get the close button
elClose.addEventListener('click', dismissNote, false);// Click close-clear note
});

// Get the url from the search on current tab
//chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
//    var tabUrl = tabs[0].tabUrl;
	//console.log(tabUrl);
//});



// Parse the response and build an HTML table to display search results
function _cb_findItemsByKeywords(root) {
	console.log("in call-back function!");
	var items = root.findItemsByKeywordsResponse[0].searchResult[0].item || [];
	var html = [];
	html.push('<table width="100%" border="0" cellspacing="0" cellpadding="3"><tbody>');
	for (var i = 0; i < items.length; ++i) {
		var item	= items[i];
		var title	= item.title;
		var pic		= item.galleryURL;
		var viewitem 	= item.viewItemURL;
		var currentPrice= item.sellingStatus.currentPrice;
		var buyNowPrice = item.listingInfo.buyItNowPrice;//if any
		if (null != title && null != viewitem) {
			html.push('<tr><td>' + '<img src="' + pic + '" border="0">' + '</td>' +
			'<td><a href="' + viewitem + '" target="_blank">' + title + '</a></td>'+
			'<td>' + '<ul>' + 
				'<li> Current Price: ' + currentPrice + '</li>' + 
				'<li> Buy It Now (if any): ' + buyNowPrice + '</li>' + 
				'</ul>' +
			'</td></tr>');
		}
	}
	html.push('</tdbody></table>');
	document.getElementById("content").innerHTML = html.join("");
}	// End _cb_findItemsByKeywords() function

