function saveReplacements() {
	alert('savereplacements');
	chrome.extension.sendMessage(
		{
			subject:"save replacement strings request",
			like: document.getElementById("like").value,
			unlike: document.getElementById("unlike").value,
			likeThis: document.getElementById("likeThis").value,
			likesThis: document.getElementById("likesThis").value,
			likeThisCap: document.getElementById("likeThisCap").value
		},
		function(response){}
	);
}