// Add listeners
chrome.extension.onMessage.addListener(function(request,sender,sendResponse){
	// Add a listener to load replacements strings from storage
	if(request.subject == "content load request" || request.subject == "popup load request") {
		var replacementKeys = new Array("like", "unlike", "likeThis", "likesThis", "likeThisCap");

		// Get replacements, send them back
		chrome.storage.sync.get(replacementKeys, function(data) {	
			// Send to content script		
			if (request.subject == "content load request") {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		            chrome.tabs.sendMessage(
		            	tabs[0].id, 
		            	{
		            		subject: "replacement strings",
		            		like: data["like"],
		            		unlike: data["unlike"],
		            		likeThis: data["likeThis"],
		            		likesThis: data["likesThis"],
		            		likeThisCap: data["likeThisCap"]
		            	}
		            );  
				});
			}
			// Send to popup
			else {
				chrome.extension.sendMessage(
					{
						subject: "replacement strings",
						like: data["like"],
						unlike: data["unlike"],
						likeThis: data["likeThis"],
						likesThis: data["likesThis"],
						likeThisCap: data["likeThisCap"]
					});
			}
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
            		subject: "replacement strings",
            		like: likeReplace,
            		unlike: unlikeReplace,
            		likeThis: likeThisReplace,
            		likesThis: likesThisReplace,
            		likeThisCap: likeThisCapReplace
            	}	
            );  
		});
	}
});