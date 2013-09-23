// Replacement strings
var LIKE_REPLACE = "Like";
var UNLIKE_REPLACE = "Unlike";
var LIKE_THIS_REPLACE = "like this";
var LIKES_THIS_REPLACE = "likes this";
var LIKE_THIS_CAP_REPLACE = "Like This";

var OLD_LIKE_REPLACE = "Like";
var OLD_UNLIKE_REPLACE = "Unlike";
var OLD_LIKE_THIS_REPLACE = "like this";
var OLD_LIKES_THIS_REPLACE = "likes this"
var OLD_LIKE_THIS_CAP_REPLACE = "Like This";

var SHOULD_REPLACE_THIS = false;

function loadReplacements() {
	// Load initial replacements
	chrome.extension.sendMessage({subject:"load replacement strings request"},function(response){
		if(response.subject == "load replacement strings response") {
		    LIKE_REPLACE = response.like;
			UNLIKE_REPLACE = response.unlike;
			LIKE_THIS_REPLACE = response.likeThis;
			LIKES_THIS_REPLACE = response.likesThis;
			LIKE_THIS_CAP_REPLACE = response.likeThisCap;
		}
	});

	// Receive new replacements
	chrome.extension.onMessage.addListener(function(request,sender,sendResponse){
		if(request.subject === "load replacement strings request") {
			LIKE_REPLACE = request.like;
			UNLIKE_REPLACE = request.unlike;
			LIKE_THIS_REPLACE = request.likeThis;
			LIKES_THIS_REPLACE = request.likesThis;
			LIKE_THIS_CAP_REPLACE = request.likeThisCap;
		}
	});
}

$(document).ready(function() {
	// xhttp = new XMLHttpRequest();
	// xhttp.open("GET","data.xml",false);
	// xhttp.send();
	// xmlDoc = xhttp.responseXML;

	// // Parse text (debug)
	// // var xmlText = "<theme><like>love</like><unlike>unlove</unlike><likeThis>love this</likeThis><likesThis>loves this</likesThis></theme>";
	// // var parsedXML = $.parseXML(xmlText);
	// // var $xml = $(parsedXML);
	// // var alert($xml.find("like"));
	// var xml = "<rss version='2.0'><channel><title>RSS Title</title></channel></rss>",
 //    xmlDoc = $.parseXML( xml ),
 //    $xml = $( xmlDoc ),
 //    $title = $xml.find( "title" );
 //    alert($title.text());

 //    $.ajax({
 //        type: "GET",
	// 	url: "data.xml",
	// 	dataType: "xml",
	// 	success: function(xml) {
	//  		$(xml).find("theme").each(function() {
	//  			var like = $(this).find("like").text();
	//  			alert(like);
	//  		}
	// 	}
	// });
	loadReplacements();

	// Selectors
	var LIKE_BUTTON_SELECTOR = "a.UFILikeLink";
	var SAVING_SELECTOR = "button.like_link stat_elem as_link .saving_message";
	var LIKE_TEXT_SELECTOR = "div.UFILikeSentenceText";
	var POP_LIKE_TEXT_SELECTOR = "div._52c9.lfloat";


	// Need to do this repeatedly because Facebook dynamically loads as you scroll
	setInterval(function() {
		$(LIKE_BUTTON_SELECTOR).each(function() {
			replaceLike($(this));
		});
		$(SAVING_SELECTOR).each(function() {
			replaceLike($(this));
		});
		$(LIKE_TEXT_SELECTOR).each(function() {
			replaceLikeThis($(this));
		});
		$(POP_LIKE_TEXT_SELECTOR).each(function() {
			// window.alert('hi');
			replaceLike($(this));
		});

		// Update all old replacements
		OLD_LIKE_REPLACE = LIKE_REPLACE;
		OLD_UNLIKE_REPLACE = UNLIKE_REPLACE;
		OLD_LIKE_THIS_REPLACE = LIKE_THIS_REPLACE;
		OLD_LIKES_THIS_REPLACE = LIKES_THIS_REPLACE;
		OLD_LIKE_THIS_CAP_REPLACE = LIKE_THIS_CAP_REPLACE;
	}, 200);


	// Simple replace
	function replaceLike($elem) {
		var original = $elem.text().toLowerCase();
		if (original === "like" || original === OLD_LIKE_REPLACE.toLowerCase())
			$elem.text(LIKE_REPLACE);
		
		else if (original === "unlike" || original === OLD_UNLIKE_REPLACE.toLowerCase())
			$elem.text(UNLIKE_REPLACE);
		
		else { // For the "People Who Like This" popover
			if ($elem.text().indexOf("People Who") >= 0)
				$elem.text("People Who " + LIKE_THIS_CAP_REPLACE);
		}
	}

	// More convoluted replace; need to recursively go down the spans until we find the
	// one we're looking for
	function replaceLikeThis($elem) {
		$elem.contents().each(function() {
			var _this = this;
			// alert(_this.textContent + ": " + _this.nodeName);
			if (_this.nodeType == 3) {
				// if (SHOULD_REPLACE_THIS) {
					// First swap
					// if (OLD_LIKE_THIS_REPLACE == LIKE_THIS_REPLACE) {
					// 	// alert("beg|" + _this.textContent + "|end");
					// 	_this.textContent = _this.textContent.replace("like this", LIKE_THIS_REPLACE);
					// 	_this.textContent = _this.textContent.replace("likes this", LIKES_THIS_REPLACE);
					// }
					// // Subsequent swaps
					// else if (LIKE_THIS_REPLACE != "") {
					// 	alert("Old: " + OLD_LIKE_THIS_REPLACE + ", New: ", + LIKE_THIS_REPLACE + "after");
						
					// 	_this.textContent = _this.textContent.replace(OLD_LIKE_THIS_REPLACE, LIKE_THIS_REPLACE);
					// 	_this.textContent = _this.textContent.replace(OLD_LIKES_THIS_REPLACE, LIKES_THIS_REPLACE);
					// 	OLD_LIKE_THIS_REPLACE = LIKE_THIS_REPLACE;
					// 	OLD_LIKES_THIS_REPLACE = LIKES_THIS_REPLACE;
					// }
					if (_this.textContent.indexOf(".") >= 0) {
						// if (_this.textContent == " like this." || _this.textContent == " "+OLD_LIKE_THIS_REPLACE+".")
						// 	_this.textContent = " " + LIKE_THIS_REPLACE + ".";
						// else
						// 	_this.textContent = " " + LIKES_THIS_REPLACE + ".";

						// SHOULD_REPLACE_THIS = false;

						var index = _this.textContent.lastIndexOf("like this");
						if (index < 0) index = _this.textContent.lastIndexOf(OLD_LIKE_THIS_REPLACE);
						if (index >= 0)
							_this.textContent = _this.textContent.substring(0,index) + LIKE_THIS_REPLACE + ".";
						else {
							index = _this.textContent.lastIndexOf("likes this");
							if (index < 0) index = _this.textContent.lastIndexOf(OLD_LIKES_THIS_REPLACE);
							_this.textContent = _this.textContent.substring(0,index) + LIKES_THIS_REPLACE + ".";
						}

						// var isFirstSwap = (OLD_LIKE_THIS_REPLACE == LIKE_THIS_REPLACE);
						// if (isFirstSwap) {
						// 	var index = _this.textContent.lastIndexOf("like this");
						// 	if (index >= 0)
						// 		_this.textContent = _this.textContent.substring(0,index) + LIKE_THIS_REPLACE + ".";
						// 	else {
						// 		index = _this.textContent.lastIndexOf("likes this");
						// 		_this.textContent = _this.textContent.substring(0,index) + LIKES_THIS_REPLACE + ".";
						// 	}
						// }

						// else {
						// 	var index = _this.textContent.lastIndexOf(OLD_LIKE_THIS_REPLACE);
						// 	if (index >= 0)
						// 		_this.textContent = _this.textContent.substring(0,index) + LIKE_THIS_REPLACE + ".";
						// 	else {
						// 		index = _this.textContent.lastIndexOf(OLD_LIKES_THIS_REPLACE);
						// 		_this.textContent = _this.textContent.substring(0,index) + LIKES_THIS_REPLACE + ".";
						// 	}
						// }
					}
				// }
				// else if (_this.textContent == " and ")
				// 	SHOULD_REPLACE_THIS = true;
			}
			else {
				// if (this.nodeName != "A")
					replaceLikeThis($(this));
			}
		});
	}
});