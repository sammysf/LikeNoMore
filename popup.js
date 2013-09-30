// Tell the background script to save the new replacements
function saveReplacements() {
	console.log(document.getElementById("like").value);

	// Change empties (or spaces) to defaults
	var like = document.getElementById("like").value;
	if (like.length == 0)
		like = "Like"; 
	var unlike = document.getElementById("unlike").value;
	if (unlike.length == 0)
		unlike = "Unlike";
	var likeThis = document.getElementById("likeThis").value;
	if (likeThis.length == 0)
		likeThis = "like this";
	var likesThis = document.getElementById("likesThis").value;
	if (likesThis.length == 0)
		likesThis = "likes this";
	var likeThisCap = likeThis;

	// Tell front to change Facebook page, save new values to storage
	chrome.extension.sendMessage(
		{
			subject:"save replacement strings request",
			like: like,
			unlike: unlike,
			likeThis: likeThis,
			likesThis: likesThis,
			likeThisCap: likeThisCap
		},
		function(response){}
	);

	// Just saved, so we can't save again until something new is typed
	// document.getElementById("Save").disabled = true;

	// Just saved, so now we can Revert!
	document.getElementById("Revert").disabled = false;
}

// Clear the values, then save them
function clearAndSaveReplacements() {
	document.getElementById("like").value = "";
	document.getElementById("unlike").value = "";
	document.getElementById("likeThis").value = "";
	document.getElementById("likesThis").value = "";
	saveReplacements();

	// Just reverted, so now we can't revert again yet
	document.getElementById("Revert").disabled = true;
}

window.onload = function() {
	// Ask for current replacements
	chrome.extension.sendMessage({subject:"popup load request"});

	// Receive replacements
	chrome.extension.onMessage.addListener(function(request,sender,sendResponse){
		if(request.subject === "replacement strings") {
			// If everything is a default, disable the revert button
			var shouldDisableRevert = true;

			// If the fields match the default value, don't actually insert anything
			if (request.like != "Like") {
				document.getElementById("like").value = request.like;
				shouldDisableRevert = false;
			}

			if (request.unlike != "Unlike") {
				document.getElementById("unlike").value = request.unlike;
				shouldDisableRevert = false;
			}

			if (request.likeThis != "like this") {
				document.getElementById("likeThis").value = request.likeThis;
				shouldDisableRevert = false;
			}

			if (request.likesThis != "likes this") {
				document.getElementById("likesThis").value = request.likesThis;
				shouldDisableRevert = false;
			}

			if (shouldDisableRevert)
				document.getElementById("Revert").disabled = true;
		}
	});

	// Setup button functionality
	document.getElementById("Save").addEventListener('click', saveReplacements);
	document.getElementById("Revert").addEventListener('click', clearAndSaveReplacements);
}