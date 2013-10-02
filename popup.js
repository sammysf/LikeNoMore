// Tell the background script to save the new replacements 
// and content script to update page
function saveReplacements() {
	// Change empties (or spaces) to defaults
	var like = $("#like").val();
	if (like.length == 0)
		like = "Like"; 
	var unlike = $("#unlike").val();
	if (unlike.length == 0)
		unlike = "Unlike";
	var likeThis = $("#likeThis").val();
	if (likeThis.length == 0)
		likeThis = "like this";
	var likesThis = $("#likesThis").val();
	if (likesThis.length == 0)
		likesThis = "likes this";
	var likeThisCap = likeThis;

	// Send message
	chrome.extension.sendMessage(
		{
			subject:"save replacement strings request",
			like: like,
			unlike: unlike,
			likeThis: likeThis,
			likesThis: likesThis,
			likeThisCap: likeThisCap
		}
	);

	// Just saved, so we can't save again until something new is typed
	$("#Save").attr("disabled", true);

	// Just saved, so now we can Revert!
	$("#Revert").attr("disabled", false);

	// Update internal data values for fields
	$(":text").each(function() {
		$(this).data('oldVal', $(this).val());
	});
}

// Clear the values, then save them
function clearAndSaveReplacements() {
	$(":text").each(function() {
		$(this).val("");
	});
	saveReplacements();

	// Just reverted, so now we can't revert again yet
	$("#Revert").attr("disabled", true);
}

// Automatically enable Save button if user changes text from what is in the database
function autoEnableSave() {
	$(":text").each(function() {
		var textField = $(this);
		textField.data('oldVal', textField.val());

		textField.bind("propertychange keyup input paste", function(event){
			var saveButton = $("#Save");
			var numberOfDefaultTextFields = saveButton.data('numberOfDefaultTextFields');

			// If value has changed from default, enable Save button
			if (textField.data('oldVal') != textField.val()) {
				if (textField.data('isDefault') == true)				
					saveButton.data('numberOfDefaultTextFields', numberOfDefaultTextFields-1).trigger('changeData');
				textField.data('isDefault', false);
			}
			else {
				if (textField.data('isDefault') == false)
					saveButton.data('numberOfDefaultTextFields', numberOfDefaultTextFields+1).trigger('changeData');
				textField.data('isDefault', true);
			}
		});
	});
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
				$("#like").val(request.like);
				shouldDisableRevert = false;
			}

			if (request.unlike != "Unlike") {
				$("#unlike").val(request.unlike);
				shouldDisableRevert = false;
			}

			if (request.likeThis != "like this") {
				$("#likeThis").val(request.likeThis);
				shouldDisableRevert = false;
			}

			if (request.likesThis != "likes this") {
				$("#likesThis").val(request.likesThis);
				shouldDisableRevert = false;
			}

			$("#Save").attr("disabled", true);
			$("#Revert").attr("disabled", shouldDisableRevert);

			// Set up the Save button disabling
			$("#Save").data('numberOfDefaultTextFields', 4);
			$(":text").each(function() {
				$(this).data('isDefault', true);
			});
			autoEnableSave();
		}
	});

	// Set up button onclick functionality
	$("#Save").click(saveReplacements);
	$("#Revert").click(clearAndSaveReplacements);

	// Add event listener to Save button for when data is updated
	$("#Save").on("changeData", function(e) {
		var saveButton = $(this);
		if (saveButton.data('numberOfDefaultTextFields') == 4) 
			saveButton.attr("disabled", true);
		else
			saveButton.attr("disabled", false);
	});
}