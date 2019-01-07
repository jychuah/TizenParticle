/*global tau */
/*jslint unparam: true */
(function (tau) {
	
	var preferences = {
			username: null,
			access_token: null,
			device_id: null,
			device_name: null,
			devices: null
	}
	
	function setPreference(property, value) {
		preferences[property] = value;
		tizen.preference.setValue(property, value);
		console.log("settPreference", preferences);
	}
	
	function login(username, password) {
		showLoadingPopup("Logging in to Particle.io");
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
				if (response.error) {
					console.log("Login error", response);
					showErrorPopup("Unable to log in");
				} else {
					// Login success
					console.log("Login success", response);
					setPreference("access_token", response.access_token);
					retrieveDevices();
				}
			}
		).catch(
			(error) => {
				console.error("Error while attempting logging in", error);
				tau.showPopup("#loginErrorPopup");
				timeoutPopup();
			}
		);
	}
	
	function loginBtn() {
		console.log("log in");
		let email = document.getElementById("email").value;
		let password = document.getElementById("password").value;
		setPreference("username", email);
		login(email, password);
	}
	
	function logoutBtn() {
		console.log("log out");
		tau.changePage("#login");
	}
	
	function showLoadingPopup(message) {
		document.getElementById("loadingMessage").innerHTML = message;
		tau.openPopup("#loadingPopup");
	}
	
	function showErrorPopup(message) {
		document.getElementById("errorMessage").innerHTML = message;
		tau.openPopup("#errorPopup");
		setTimeout(function() {
			tau.closePopup();
		}, 2000);
	}
	
	function showSuccessPopup(message) {
		document.getElementById("successMessage").innerHTML = message;
		tau.openPopup("#successPopup");
		setTimeout(function() {
			tau.closePopup();
		}, 2000);
	}
	
	function showLogoutPopup() {
		console.log("Show logout popup");
		tau.openPopup("#logoutPopup");
	}
	
	function retrieveDevices() {
		if (preferences.access_token) {
			console.log("Trying access token", preferences.access_token);
			showLoadingPopup("Retrieving devices");
			fetch(
				"https://api.particle.io/v1/devices",
				{
					method: "GET",
					headers: {
						"Authorization" : "Bearer " + preferences.access_token,
					},
				}
			).then(
				(response) => {
					return response.json();
				}
			).then(
				(response) => {
					if (response.error) {
						console.log("Token error", response);
						showErrorPopup("Unable to retrieve devices");
					} else {
						// Login success
						console.log("Token success", response);
						showSuccessPopup("Devices retrieved");
						tau.changePage("#main");
					}
				}
			).catch(
				(error) => {
					console.error("Error: ", error);
					showErrorPopup("Error while retrieving devices");
				}
			);
		}
	}
	
	function closePopup() {
		tua.closePopup();
	}
		
	function start() {
		document.addEventListener("DOMContentLoaded", function(event) {
			tau.openPopup("#splashPopup");
			document.getElementById("logoutBtn").addEventListener("click", showLogoutPopup);
			document.getElementById("logoutOkBtn").addEventListener("click", logoutBtn);
			document.getElementById("loginBtn").addEventListener("click", loginBtn);
			document.getElementById("successPopup").addEventListener("click", closePopup);
			document.getElementById("errorPopup").addEventListener("click", closePopup);
			for (var property in preferences) {
				if (tizen.preference.exists(property)) {
					preferences[property] = tizen.preference.getValue(property);
				}
			}
			console.log("Preferences", preferences);

			if (preferences.username) {
				document.getElementById("email").value = preferences.username;
			}
			tau.closePopup();
			retrieveDevices();
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
	
	start();
	
}(tau));

