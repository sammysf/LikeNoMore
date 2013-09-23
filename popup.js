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

	// Tell front to change Facebook page, save new values to XML
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

window.onload = function() {
	// Ask for current replacements
	chrome.extension.sendMessage({subject:"load replacement strings request"},function(response){
		// if(response.subject == "load replacement strings response") {			
		// 	document.getElementById("like").value = response.like;
		// 	document.getElementById("unlike").value = response.unlike;
		// 	document.getElementById("likeThis").value = response.likeThis;
		// 	document.getElementById("likesThis").value = response.likesThis;
		// }
	});

	// Receive replacements
	chrome.extension.onMessage.addListener(function(request,sender,sendResponse){
		if(request.subject === "load replacement strings response") {
			document.getElementById("like").value = request.like;
			document.getElementById("unlike").value = request.unlike;
			document.getElementById("likeThis").value = request.likeThis;
			document.getElementById("likesThis").value = request.likesThis;
		}
	});

	document.getElementById("Save").addEventListener('click', saveReplacements);
}