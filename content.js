var localLogo = chrome.extension.getURL("logo.png");

/*if ($('.stt__selected-view-item').text() == 'Grid')
{
  $('._tyb shop__secondary').append("<img class = 'clickable'>");
    $('.clickable').each(function(index, image)  {
    $('.clickable').attr('src', localLogo);
    $('.clickable').attr('width', '20px');
    $('.clickable').attr('height', '17px');
  });
}
else
{*/ 

//$('.clickable').click(logoClick());

// Create the HTML for the message

$('.ab_ctl').first().prepend('<div class=\"contentfpc\"></div>');
$('.contentfpc').append("<img class = 'clickable'>");
$('.clickable').attr('src', localLogo);
$('.clickable').attr('width', '35px');
$('.clickable').attr('height', '30px');

var queryKeywords;
var url;
chrome.runtime.sendMessage({greeting: "get url from tab"}, function(response) {
  console.log(response.keywords);
  queryKeywords = response.keywords;
  //alert(queryKeywords);

// Create a JavaScript array of the item filters you want to use in your request
var filterarray = [
  {"name":"FreeShippingOnly",
   "value":"true",
   "paramName":"",
   "paramValue":""},
  {"name":"ListingType",
   "value":["AuctionWithBIN", "FixedPrice"],
   "paramName":"",
   "paramValue":""},
  ];
// Define global variable for the URL filter
var urlfilter = "";
// Generates an indexed URL snippet from the array of item filters
function  buildURLArray() {
  // Iterate through each filter in the array
  for(var i=0; i<filterarray.length; i++) {
    //Index each item filter in filterarray
    var itemfilter = filterarray[i];
    // Iterate through each parameter in each item filter
    for(var index in itemfilter) {
      // Check to see if the paramter has a value (some don't)
      if (itemfilter[index] !== "") {
        if (itemfilter[index] instanceof Array) {
          for(var r=0; r<itemfilter[index].length; r++) {
          var value = itemfilter[index][r];
          urlfilter += "&itemFilter\(" + i + "\)." + index + "\(" + r + "\)=" + value ;
          }
        }
        else {
          urlfilter += "&itemFilter\(" + i + "\)." + index + "=" + itemfilter[index];
        }
      }
    }
  }
}  // End buildURLArray() function

// Execute the function to build the URL filter
buildURLArray(filterarray);

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
    url += urlfilter;
    //alert(url);
    console.log(url);
    chrome.runtime.sendMessage({greeting: "call api", myUrl: url}, function(response) {
  	console.log(response.farewell);//log signifies successful response
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
    	$(".contentfpc").append(request.newhtml.join(""));
  });



/*
function dismissNote() {                          // Declare function
  //document.body.removeChild(elNote);              // Remove the note
  $("#note").remove();
}

var elClose = document.getElementById('close');   // Get the close button
elClose.addEventListener('click', dismissNote, false);// Click close-clear note
*/
//}

// Get the url from the search on current tab
//chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
//    var tabUrl = tabs[0].tabUrl;
	//console.log(tabUrl);
//});


/*
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

*/