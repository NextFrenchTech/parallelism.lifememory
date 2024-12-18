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
				document.getElementById(PASSWORD_FORM_ID).style.display = "none";
				protectedContent.style.display = "block";
			} else {
				alert('Accès Refusé !');
			}
		});
	})();

	// Fonction pour désactiver l'accès à la console
    document.addEventListener('contextmenu', function(event) {
		// Désactiver Clic Droit
        event.preventDefault();
    });

    document.onkeydown = function(e) {
        // Désactiver F12
        if (e.keyCode == 123) {
            return false;
        }
        // Désactiver Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
            return false;
        }
        // Désactiver Ctrl+Shift+J
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
            return false;
        }
        // Désactiver Ctrl+U
        if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
            return false;
        }
        // Désactiver Ctrl+Shift+C (Inspecteur d'éléments)
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
            return false;
        }
    };