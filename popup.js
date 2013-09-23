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
}

// Clear the values, then save them
function clearAndSaveReplacements() {
	document.getElementById("like").value = "";
	document.getElementById("unlike").value = "";
	document.getElementById("likeThis").value = "";
	document.getElementById("likesThis").value = "";
	saveReplacements();
}

window.onload = function() {
	// Ask for current replacements
	chrome.extension.sendMessage({subject:"popup load request"});

	// Receive replacements
	chrome.extension.onMessage.addListener(function(request,sender,sendResponse){
		if(request.subject === "replacement strings") {
			document.getElementById("like").value = request.like;
			document.getElementById("unlike").value = request.unlike;
			document.getElementById("likeThis").value = request.likeThis;
			document.getElementById("likesThis").value = request.likesThis;
		}
	});

	// Setup button functionality
	document.getElementById("Save").addEventListener('click', saveReplacements);
	document.getElementById("Revert").addEventListener('click', clearAndSaveReplacements);
}