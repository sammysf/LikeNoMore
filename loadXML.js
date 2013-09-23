// Load the XML document for reading/writing
function loadXMLDoc() {
	// Load file
	if (window.XMLHttpRequest) {
	  xhttp = new XMLHttpRequest();
	}
	else {
	  xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET","data.xml",false);
	xhttp.send();
	xmlDoc = xhttp.responseXML;

	return xmlDoc;
}

function loadXML() {
	// window.alert('HI');
	var xmlDoc = loadXMLDoc();

	// Parse text (debug)
	xmlText = "<theme><like>love</like><unlike>unlove</unlike><likeThis>love this</likeThis><likesThis>loves this</likesThis></theme>"
	parser = new DOMParser();
	parsedXML = parser.parseFromString(xmlText,"text/xml");

	// Current values
	var like = xmlDoc.getElementsByTagName("like")[0].childNodes[0].nodeValue;
	var unlike = xmlDoc.getElementsByTagName("unlike")[0].childNodes[0].nodeValue;
	var likeThis = xmlDoc.getElementsByTagName("likeThis")[0].childNodes[0].nodeValue;
	var likesThis = xmlDoc.getElementsByTagName("likesThis")[0].childNodes[0].nodeValue;
	var likeThisCap = xmlDoc.getElementsByTagName("likeThisCap")[0].childNodes[0].nodeValue;

	var replacementKeys = new Array("like", "unlike", "likeThis", "likesThis", "likeThisCap");
	// replacementStrings[0] = 
	chrome.storage.sync.get(replacementKeys, function(data) {
		// alert('data.like: ' + data.like);
			var replacementStrings = new Array();

		replacementStrings[0] = data["like"];
		replacementStrings[1] = data["unlike"];
		replacementStrings[2] = data["likeThis"];
		replacementStrings[3] = data["likesThis"];
		replacementStrings[4] = data["likeThisCap"];
		return replacementStrings;
		// return data['like'];
    });

	// Return the XML values
	// var replacementStrings = new Array();
	// replacementStrings[0] = like;
	// alert('0: ', replacementStrings[0]);
	// replacementStrings[1] = unlike;
	// replacementStrings[2] = likeThis;
	// replacementStrings[3] = likesThis;
	// replacementStrings[4] = likeThisCap;
	// return replacementStrings;
}

// Add listeners
chrome.extension.onMessage.addListener(function(request,sender,sendResponse){
	// Add a listener to load replacements strings from XML
	if(request.subject == "load replacement strings request") {
		// alert('message received, sending response');
		// var replacementStrings = loadXML();
	 //    sendResponse(
	 //    	{
	 //    		subject: "load replacement strings response",
		// 		like: replacementStrings[0],
		// 		unlike: replacementStrings[1],
		// 		likeThis: replacementStrings[2],
		// 		likesThis: replacementStrings[3],
		// 		likeThisCap: replacementStrings[4]
	 //    	}
	 //    );
		var replacementKeys = new Array("like", "unlike", "likeThis", "likesThis", "likeThisCap");
		// replacementStrings[0] = 
		chrome.storage.sync.get(replacementKeys, function(data) {
			var replacementStrings = new Array();
			replacementStrings[0] = data["like"];
			replacementStrings[1] = data["unlike"];
			replacementStrings[2] = data["likeThis"];
			replacementStrings[3] = data["likesThis"];
			replacementStrings[4] = data["likeThisCap"];
			
			chrome.extension.sendMessage(
				{
					subject: "load replacement strings response",
					like: data["like"],
					unlike: data["unlike"],
					likeThis: data["likeThis"],
					likesThis: data["likesThis"],
					likeThisCap: data["likeThisCap"]
				});
	    });
	}

	// Add a listener to save replacements strings to storage and send that info to content script
	else if(request.subject == "save replacement strings request") {
		// Get data from message
	    var likeReplace = request.like;
		var unlikeReplace = request.unlike;
		var likeThisReplace = request.likeThis;
		var likesThisReplace = request.likesThis;
		var likeThisCapReplace = request.likeThisCap;

		// Save to storage
		chrome.storage.sync.set({'like': request.like});
		chrome.storage.sync.set({'unlike': request.unlike});
		chrome.storage.sync.set({'likeThis': request.likeThis});
		chrome.storage.sync.set({'likesThis': request.likesThis});
		chrome.storage.sync.set({'likeThisCap': request.likeThisCap});

		// Send to content script
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(
            	tabs[0].id, 
            	{
            		subject: "load replacement strings request",
            		like: likeReplace,
            		unlike: unlikeReplace,
            		likeThis: likeThisReplace,
            		likesThis: likesThisReplace,
            		likeThisCap: likeThisCapReplace
            	}, 
            	function(response) {}
            );  
		});
	}
});