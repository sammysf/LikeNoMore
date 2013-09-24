// Replacement strings default values
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

// Load initial replacements and create a listener for subsequent replacements
function loadReplacements() {
	// Load initial replacements
	chrome.extension.sendMessage({subject:"content load request"});

	// Receive replacements
	chrome.extension.onMessage.addListener(function(request,sender,sendResponse){
		if(request.subject === "replacement strings") {
			LIKE_REPLACE = request.like;
			UNLIKE_REPLACE = request.unlike;
			LIKE_THIS_REPLACE = request.likeThis;
			LIKES_THIS_REPLACE = request.likesThis;
			LIKE_THIS_CAP_REPLACE = request.likeThisCap;
		}
	});

	if (LIKE_REPLACE === null || LIKE_REPLACE === undefined) { alert(LIKE_REPLACE); LIKE_REPLACE = "Like"; }
	if (UNLIKE_REPLACE == "") UNLIKE_REPLACE = "Unlike";
	if (LIKE_THIS_REPLACE == "") LIKE_THIS_REPLACE = "like this";
	if (LIKES_THIS_REPLACE == "") LIKES_THIS_REPLACE = "likes this";
	if (LIKE_THIS_CAP_REPLACE == "") LIKE_THIS_CAP_REPLACE = "Like This";
}

function tempFunction() {
	var array = document.getElementsByClassName("UFICommentLikeButton UFICommentLikedButton");
	for (var i = 0; i < array.length; i++) {
		alert("Hi");
		alert("aria-label: " + array[i].getAttribute("aria-label"));
	}
}

// When the page has loaded
$(document).ready(function() {
	loadReplacements();

	// Selectors
	var LIKE_BUTTON_SELECTOR = "a.UFILikeLink";
	var UNLIKE_BUTTON_SELECTOR = "button.like_link stat_elem as_link .saving_message";
	var LIKE_TEXT_SELECTOR = "div.UFILikeSentenceText";
	var LIKE_THUMBS_UP_SELECTOR = "a.UFICommentLikeButton.UFICommentLikedButton";
	var LIKE_THUMBS_UP_SELECTOR_2 = "a.img._8o._8r.UFILikeThumb.UFIImageBlockImage";
	var POP_LIKE_TEXT_SELECTOR = "div._52c9.lfloat";	

	// Need to do this repeatedly because Facebook dynamically loads as you scroll
	setInterval(function() {
		$(LIKE_BUTTON_SELECTOR).each(function() {
			replaceLike($(this));
		});

		$(UNLIKE_BUTTON_SELECTOR).each(function() {
			replaceLike($(this));
		});

		$(LIKE_TEXT_SELECTOR).each(function() {
			replaceLikeThis($(this));
		});
		$(LIKE_THUMBS_UP_SELECTOR).each(function() {
			// window.alert("aria-label: " + this.getAttribute("aria-label"));
			// window.alert("class " + this.getAttribute("class"));			
			// window.alert("class " + $(this).attr("class"));
			// window.alert("role " + $(this).attr("role"));
			// window.alert("rel " + $(this).attr("rel"));
			// window.alert("data-hover " + $(this).attr("data-hover"));
			// window.alert("data-tooltip-alignh " + $(this).attr("data-tooltip-alignh"));
			// window.alert("ajaxify " + $(this).attr("ajaxify"));
			// window.alert("href " + $(this).attr("href"));
			// window.alert("data-reactid " + $(this).attr("data-reactid"));
			// window.alert("aria-label " + $(this).attr("aria-label"));
			// window.alert("id " + $(this).attr("id"));
			// this.setAttribute("aria-label", "Hey now");
			$(this).attr('aria-label', LIKE_REPLACE);
		});
		var array = document.getElementsByClassName("UFICommentLikeButton UFICommentLikedButton");
		for (var i = 0; i < array.length; i++) {
			alert("Hi");
			alert("aria-label: " + array[i].getAttribute("aria-label"));
		}

		// Hover text over thumbs up button
		$(LIKE_THUMBS_UP_SELECTOR_2).each(function() {
			// $(this).attr('title', LIKE_REPLACE);
			replaceHoverText($(this));
		})
		
		// Popover dialog header
		$(POP_LIKE_TEXT_SELECTOR).each(function() {
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
		var original = $elem.text();
		if (original === "Like" || original === OLD_LIKE_REPLACE)
			$elem.text(LIKE_REPLACE);
		
		else if (original === "Unlike" || original === OLD_UNLIKE_REPLACE)
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
			if (_this.nodeType == 3) { // Text node
				// We're looking for a string with a period (because 'like this' and 'likes this' always end in a period)
				if (_this.textContent.indexOf(".") >= 0) {

					var index = _this.textContent.lastIndexOf(" like this");
					if (index < 0) index = _this.textContent.lastIndexOf(" " + OLD_LIKE_THIS_REPLACE);
					if (index >= 0)
						_this.textContent = _this.textContent.substring(0,index) + " " + LIKE_THIS_REPLACE + ".";
					else {
						index = _this.textContent.lastIndexOf(" likes this");
						if (index < 0) index = _this.textContent.lastIndexOf(" " + OLD_LIKES_THIS_REPLACE);
						_this.textContent = _this.textContent.substring(0,index) + " " + LIKES_THIS_REPLACE + ".";
					}
				}			
			}
			else {
				replaceLikeThis($(this));
			}
		});
	}

	function replaceHoverText($elem) {	
		var newLikeCapitalized = LIKE_REPLACE.charAt(0).toUpperCase() + LIKE_REPLACE.substring(1);
		var newUnlikeCapitalized = UNLIKE_REPLACE.charAt(0).toUpperCase() + UNLIKE_REPLACE.substring(1);

		var oldStringLength;
		var newHoverText;

		var index = $elem.attr("title").indexOf("Like");
		oldStringLength = 4;
		if (index < 0) { 			
			index = $elem.attr("title").indexOf(newLikeCapitalized); 
			oldStringLength = newLikeCapitalized.length;
		}
		if (index >= 0) {
			newHoverText = newLikeCapitalized + $elem.attr("title").substring(oldStringLength);
		}
		else {
			index = $elem.attr("title").indexOf("Unlike");
			oldStringLength = 6;
			if (index < 0) { 
				index = $elem.attr("title").indexOf(newUnlikeCapitalized); 
				oldStringLength = newUnlikeCapitalized.length;
			}
			newHoverText = newUnlikeCapitalized + $elem.attr("title").substring(oldStringLength);
		}

		$elem.attr("title", newHoverText);
	}

	
});
