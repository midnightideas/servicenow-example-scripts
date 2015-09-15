/**
 * UI Script
 *
 * Name: CustomizePercentageCompleteCellView
 * Application: Global
 * Global: True
 * Active: True
 */

document.observe('dom:loaded', function() {
	// Says incident.u_score is the Percentage Complete field, but I don't like the % suffix when it's displayed in the list view.

	var headers = document.getElementsByTagName("thead")[0].childNodes[0].childNodes;

	// Find out the Cell Index of incident.u_score from the table header, so I don't have to hardcode the index in script.
	var u_score_cell_index = false;
	for (var i = 0; i < headers.length; i++) {
		if ("incident.u_score" == headers[i].getAttribute("glide_field")) {
			u_score_cell_index = i;
			break;
		}
	}
	if (false == u_score_cell_index) {
		return;
	}

	var all_percentage_complete_fields = document.getElementsByClassName("percent_complete_text");
	for (var i = 0; i < all_percentage_complete_fields.length; i++) {
		// If this Percentage Complete field is incident.u_score
		if (u_score_cell_index == all_percentage_complete_fields[i].parentNode.parentNode.cellIndex) {
			// Remove the % sign
			all_percentage_complete_fields[i].innerHTML = all_percentage_complete_fields[i].innerHTML.replace('%', '');
		}
	}
});