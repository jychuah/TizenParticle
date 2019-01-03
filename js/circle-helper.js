/*global tau */
/*jslint unparam: true */
(function (tau) {
	
	function login(username, password) {
		username="jychuah@gmail.com";
		password="badpassword";
		tau.openPopup("#loggingInPopup");
		fetch(
			"https://api.particle.io/oauth/token",
			{
				method: "POST",
				headers: {
					"Authorization" : "Basic cGFydGljbGU6cGFydGljbGU=",
					"Content-Type" : "application/x-www-form-urlencoded"
				},
				body: encodeURI("grant_type=password&username=" + username + "&password=" + password)
			}
		).then(
			(response) => {
				return response.json();
			}
		).then(
			(response) => {
				console.log("Success: ", response);
			}
		).catch(
			(error) => {
				console.error("Error: ", error);
			}
		).finally(
			() => {
				tau.closePopup();
			}
		);
	}
	
	function loginBtn() {
		console.log("log in");
		let email = document.getElementById("email").value;
		let password = document.getElementById("password").value;
		console.log("Credentials:", email, password);
		login(email, password);
	}
	
	function logoutBtn() {
		console.log("log out");
		tau.changePage("#login");
	}
	
	function showLogoutPopup() {
		console.log("Show logout popup");
		tau.openPopup("#logoutPopup");
	}
	
	function closePopup() {
		tau.closePopup();
	}
	
	function events() {
		document.addEventListener("DOMContentLoaded", function(event) {
			document.getElementById("logoutBtn").addEventListener("click", showLogoutPopup);
			document.getElementById("logoutOkBtn").addEventListener("click", logoutBtn);
			document.getElementById("loginBtn").addEventListener("click", loginBtn);
		});
	}
	
	function start() {
		let loggedIn = false;
		/*
		if (loggedIn) {
			tau.changePage("#main");
		} else {
			tau.changePage("#login");
		}
		*/
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
	start();
	
}(tau));

