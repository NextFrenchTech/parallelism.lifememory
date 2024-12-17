/* Accès Protégé au site */

	// Fonction pour protéger l'accès au site
	(function() {
		"use strict";
	
		const PASSWORD_FORM_ID = 'contenu-password';
		const PROTECTED_CONTENT_ID = 'contenu-protege';
		const MESSAGE_BOX_ID = 'message-box';
		const PASSWORD = atob('aGVsbG9Xb3JsZCE=');
	
		var passwordForm = document.querySelector(`#${PASSWORD_FORM_ID} form`);
		var protectedContent = document.getElementById(PROTECTED_CONTENT_ID);
		var messageBox = document.getElementById(MESSAGE_BOX_ID);
	
		if (!passwordForm || !protectedContent || !messageBox) {
			console.error("Elements not found.");
			return;
		}
	
		protectedContent.style.display = "none";
	
		passwordForm.addEventListener('submit', function(event) {
			event.preventDefault();
	
			var passwordInput = this.querySelector('input[name="answer"]').value;
	
			if (passwordInput === PASSWORD) {
				showMessage("Accès Autorisé !", "success");
				document.getElementById(PASSWORD_FORM_ID).style.display = "none";
				protectedContent.style.display = "block";
			} else {
				showMessage("Accès Refusé !", "error");
			}
		});
	
		function showMessage(message, type) {
			messageBox.textContent = message;
			messageBox.className = "message " + type;
		}
	})();