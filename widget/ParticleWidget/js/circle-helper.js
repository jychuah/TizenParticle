/*global tau */
/*jslint unparam: true */
(function (tau) {
	
	function events() {
		document.addEventListener("DOMContentLoaded", function(event) {
			var item = tizen.preference.getValue("test");
			console.log("widget loaded value", item);
			document.getElementById("output").innerHTML = item;
		});
	}

	// This logic works only on circular device.
	if (tau.support.shape.circle) {
		/**
		 * pagebeforeshow event handler
		 * Do preparatory works and adds event listeners
		 */
		document.addEventListener("pagebeforeshow", function (event) {
			/**
			 * page - Active page element
			 * list - NodeList object for lists in the page
			 */
			var page,
				list;

			page = event.target;
			if (page.id !== "page-snaplistview" && page.id !== "page-swipelist" && page.id !== "page-marquee-list") {
				list = page.querySelector(".ui-listview");
				if (list) {
					tau.widget.ArcListview(list);
				}
			}
		});
	}
	
	events();
}(tau));
