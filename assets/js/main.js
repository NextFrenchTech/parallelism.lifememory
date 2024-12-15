/*
	Parallelism by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$main = $('#main'),
		settings = {

			// Keyboard shortcuts.
				keyboardShortcuts: {

					// If true, enables scrolling via keyboard shortcuts.
						enabled: true,

					// Sets the distance to scroll when using the left/right arrow keys.
						distance: 50

				},

			// Scroll wheel.
				scrollWheel: {

					// If true, enables scrolling via the scroll wheel.
						enabled: true,

					// Sets the scroll wheel factor. (Ideally) a value between 0 and 1 (lower = slower scroll, higher = faster scroll).
						factor: 1

				},

			// Scroll zones.
				scrollZones: {

					// If true, enables scrolling via scroll zones on the left/right edges of the scren.
						enabled: true,

					// Sets the speed at which the page scrolls when a scroll zone is active (higher = faster scroll, lower = slower scroll).
						speed: 15

				}

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Tweaks/fixes.

		// Mobile: Revert to native scrolling.
			if (browser.mobile) {

				// Disable all scroll-assist features.
					settings.keyboardShortcuts.enabled = false;
					settings.scrollWheel.enabled = false;
					settings.scrollZones.enabled = false;

				// Re-enable overflow on main.
					$main.css('overflow-x', 'auto');

			}

		// IE: Fix min-height/flexbox.
			if (browser.name == 'ie')
				$wrapper.css('height', '100vh');

		// iOS: Compensate for address bar.
			if (browser.os == 'ios')
				$wrapper.css('min-height', 'calc(100vh - 30px)');

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Items.

		// Assign a random "delay" class to each thumbnail item.
			$('.item.thumb').each(function() {
				$(this).addClass('delay-' + Math.floor((Math.random() * 6) + 1));
			});

		// IE: Fix thumbnail images.
			if (browser.name == 'ie')
				$('.item.thumb').each(function() {

					var $this = $(this),
						$img = $this.find('img');

					$this
						.css('background-image', 'url(' + $img.attr('src') + ')')
						.css('background-size', 'cover')
						.css('background-position', 'center');

					$img
						.css('opacity', '0');

				});

	// Poptrox.
		$main.poptrox({
			onPopupOpen: function() { $body.addClass('is-poptrox-visible'); },
			onPopupClose: function() { $body.removeClass('is-poptrox-visible'); },
			overlayColor: '#1a1f2c',
			overlayOpacity: 0.75,
			popupCloserText: '',
			popupLoaderText: '',
			selector: '.item.thumb a.image',
			caption: function($a) {
				return $a.prev('h3').html();
			},
			usePopupDefaultStyling: false,
			usePopupCloser: false,
			usePopupCaption: true,
			usePopupNav: true,
			windowMargin: 50
		});

		breakpoints.on('>small', function() {
			$main[0]._poptrox.windowMargin = 50;
		});

		breakpoints.on('<=small', function() {
			$main[0]._poptrox.windowMargin = 0;
		});

	// Keyboard shortcuts.
		if (settings.keyboardShortcuts.enabled)
			(function() {

				$window

					// Keypress event.
						.on('keydown', function(event) {

							var scrolled = false;

							if ($body.hasClass('is-poptrox-visible'))
								return;

							switch (event.keyCode) {

								// Left arrow.
									case 37:
										$main.scrollLeft($main.scrollLeft() - settings.keyboardShortcuts.distance);
										scrolled = true;
										break;

								// Right arrow.
									case 39:
										$main.scrollLeft($main.scrollLeft() + settings.keyboardShortcuts.distance);
										scrolled = true;
										break;

								// Page Up.
									case 33:
										$main.scrollLeft($main.scrollLeft() - $window.width() + 100);
										scrolled = true;
										break;

								// Page Down, Space.
									case 34:
									case 32:
										$main.scrollLeft($main.scrollLeft() + $window.width() - 100);
										scrolled = true;
										break;

								// Home.
									case 36:
										$main.scrollLeft(0);
										scrolled = true;
										break;

								// End.
									case 35:
										$main.scrollLeft($main.width());
										scrolled = true;
										break;

							}

							// Scrolled?
								if (scrolled) {

									// Prevent default.
										event.preventDefault();
										event.stopPropagation();

									// Stop link scroll.
										$main.stop();

								}

						});

			})();

	// Scroll wheel.
		if (settings.scrollWheel.enabled)
			(function() {

				// Based on code by @miorel + @pieterv of Facebook (thanks guys :)
				// github.com/facebook/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
					var normalizeWheel = function(event) {

						var	pixelStep = 10,
							lineHeight = 40,
							pageHeight = 800,
							sX = 0,
							sY = 0,
							pX = 0,
							pY = 0;

						// Legacy.
							if ('detail' in event)
								sY = event.detail;
							else if ('wheelDelta' in event)
								sY = event.wheelDelta / -120;
							else if ('wheelDeltaY' in event)
								sY = event.wheelDeltaY / -120;

							if ('wheelDeltaX' in event)
								sX = event.wheelDeltaX / -120;

						// Side scrolling on FF with DOMMouseScroll.
							if ('axis' in event
							&&	event.axis === event.HORIZONTAL_AXIS) {
								sX = sY;
								sY = 0;
							}

						// Calculate.
							pX = sX * pixelStep;
							pY = sY * pixelStep;

							if ('deltaY' in event)
								pY = event.deltaY;

							if ('deltaX' in event)
								pX = event.deltaX;

							if ((pX || pY)
							&&	event.deltaMode) {

								if (event.deltaMode == 1) {
									pX *= lineHeight;
									pY *= lineHeight;
								}
								else {
									pX *= pageHeight;
									pY *= pageHeight;
								}

							}

						// Fallback if spin cannot be determined.
							if (pX && !sX)
								sX = (pX < 1) ? -1 : 1;

							if (pY && !sY)
								sY = (pY < 1) ? -1 : 1;

						// Return.
							return {
								spinX: sX,
								spinY: sY,
								pixelX: pX,
								pixelY: pY
							};

					};

				// Wheel event.
					$body.on('wheel', function(event) {

						// Disable on <=small.
							if (breakpoints.active('<=small'))
								return;

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Stop link scroll.
							$main.stop();

						// Calculate delta, direction.
							var	n = normalizeWheel(event.originalEvent),
								x = (n.pixelX != 0 ? n.pixelX : n.pixelY),
								delta = Math.min(Math.abs(x), 150) * settings.scrollWheel.factor,
								direction = x > 0 ? 1 : -1;

						// Scroll page.
							$main.scrollLeft($main.scrollLeft() + (delta * direction));

					});

			})();

	// Scroll zones.
		if (settings.scrollZones.enabled)
			(function() {

				var	$left = $('<div class="scrollZone left"></div>'),
					$right = $('<div class="scrollZone right"></div>'),
					$zones = $left.add($right),
					paused = false,
					intervalId = null,
					direction,
					activate = function(d) {

						// Disable on <=small.
							if (breakpoints.active('<=small'))
								return;

						// Paused? Bail.
							if (paused)
								return;

						// Stop link scroll.
							$main.stop();

						// Set direction.
							direction = d;

						// Initialize interval.
							clearInterval(intervalId);

							intervalId = setInterval(function() {
								$main.scrollLeft($main.scrollLeft() + (settings.scrollZones.speed * direction));
							}, 25);

					},
					deactivate = function() {

						// Unpause.
							paused = false;

						// Clear interval.
							clearInterval(intervalId);

					};

				$zones
					.appendTo($wrapper)
					.on('mouseleave mousedown', function(event) {
						deactivate();
					});

				$left
					.css('left', '0')
					.on('mouseenter', function(event) {
						activate(-1);
					});

				$right
					.css('right', '0')
					.on('mouseenter', function(event) {
						activate(1);
					});

				$body
					.on('---pauseScrollZone', function(event) {

						// Pause.
							paused = true;

						// Unpause after delay.
							setTimeout(function() {
								paused = false;
							}, 500);

					});

			})();

})(jQuery);



/* ------------------------------ */
/*           CUSTOM  JS           */
/* ------------------------------ */



/* /Mobi|Android/i.test */

	// Fonction pour détecter si l'utilisateur est sur un appareil mobile

		function isMobile() {
			return /Mobi|Android/i.test(navigator.userAgent);
		}



/* audioPlaylist */

	// autoPlayAudio

		// L'événement DOMContentLoaded est déclenché lorsque le document HTML a été complètement chargé et analysé
		document.addEventListener("DOMContentLoaded", () => {
			// Variables
			const popup = document.getElementById("popup");  // Popup principale
			const acceptButton = document.getElementById("acceptButton");  // Bouton pour accepter l'audio
			const rejectButton = document.getElementById("rejectButton");  // Bouton pour rejeter l'audio
			const popupPursue = document.getElementById("popupPursue");  // Popup de reprise
			const resumeButton = document.getElementById("resumeButton");  // Bouton pour reprendre l'audio
			const cancelButton = document.getElementById("cancelButton");  // Bouton pour annuler la reprise
			const audio = document.getElementById("audio");  // Élément audio
			let isAudioPlaying = false;  // Flag pour vérifier si l'audio est en cours
			let isPopupVisible = false;  // Flag pour éviter l'affichage de multiples popups
			
			// Fonction pour afficher une popup après un délai
			const showPopup = (popupElement) => {
				if (!isPopupVisible) {  // Vérifie que la popup n'est pas déjà affichée
					setTimeout(() => {
						popupElement.style.display = "block";  // Affiche la popup
						popupElement.style.zIndex = 2147483647;  // Met la popup au-dessus des autres éléments
						isPopupVisible = true;  // Marque la popup comme visible
					}, 1000);  // Délai de 1 seconde avant d'afficher
				}
			};
			
			// Fonction pour démarrer la lecture de l'audio
			const playAudio = () => {
				isAudioPlaying = true;  // L'audio commence à être joué
				audio.play().catch(error => console.error("Erreur de lecture audio: ", error));  // Gestion des erreurs de lecture
			};
		
			// Fonction pour gérer la réponse de l'utilisateur
			const handleUserResponse = (response) => {
				sessionStorage.setItem("userResponse", response);  // Sauvegarde la réponse
				popup.style.display = "none";  // Masque la popup
				isPopupVisible = false;  // Réinitialise l'état de la popup
				if (response === "accepted") {
					playAudio();  // Si accepté, démarre l'audio
				}
			};
		
			// Fonction pour reprendre la lecture après une pause
			const handleResume = () => {
				popupPursue.style.display = "none";  // Masque la popup de reprise
				isPopupVisible = false;  // Réinitialise le flag de la popup
				playAudio();  // Reprend la lecture audio
			};
		
			// Fonction pour annuler la reprise de l'audio
			const handleCancel = () => {
				popupPursue.style.display = "none";  // Masque la popup de reprise
				sessionStorage.setItem("userResponse", "rejected");  // Enregistre "rejected" dans sessionStorage
				resetPlaylist();  // Réinitialise la playlist audio
				isPopupVisible = false;  // Réinitialise le flag de la popup
			};
		
			// Fonction pour réinitialiser la playlist audio
			const resetPlaylist = () => {
				const sources = audio.getElementsByTagName('source');  // Récupère toutes les sources audio
				if (sources.length > 0) {
					audio.src = sources[0].src;  // Remet la première source comme source
					audio.load();  // Recharge l'audio
				}
			};
		
			// Fonction pour passer à la prochaine piste audio
			const playNext = () => {
				const sources = Array.from(audio.getElementsByTagName('source'));  // Convertit les sources en tableau
				const currentSourceIndex = sources.findIndex(src => src.src === audio.src);  // Trouve l'index de la source actuelle
				const nextSourceIndex = (currentSourceIndex + 1) % sources.length;  // Calcule l'index de la prochaine source
				
				audio.src = sources[nextSourceIndex].src;  // Met à jour la source
				audio.load();  // Recharge la nouvelle piste
				playAudio();  // Démarre la lecture de la nouvelle piste
			};
		
			// Événements pour les boutons de réponse
			acceptButton.addEventListener("click", () => handleUserResponse("accepted"));  // L'utilisateur accepte
			rejectButton.addEventListener("click", () => {
				handleUserResponse("rejected");  // L'utilisateur rejette
				resetPlaylist();  // Réinitialise la playlist si rejeté
			});
			resumeButton.addEventListener("click", handleResume);  // Reprendre la lecture audio
			cancelButton.addEventListener("click", handleCancel);  // Annuler la reprise et réinitialiser
		
			// Gestion de la perte de focus de la fenêtre
			window.addEventListener("blur", () => {
				isAudioPlaying = !audio.paused;  // Marque que l'audio est mis en pause
				audio.pause();  // Met l'audio en pause
			});
		
			// Gestion de la reprise de focus de la fenêtre
			window.addEventListener("focus", () => {
				const userResponseOnFocus = sessionStorage.getItem("userResponse");
				if (!userResponseOnFocus && popup.style.display !== "block") {
					showPopup(popup);  // Affiche la popup initiale si aucune réponse précédente
				} else if (userResponseOnFocus === "accepted") {
					showPopup(popupPursue);  // Affiche la popup de reprise si accepté
				} else if (userResponseOnFocus === "rejected") {
					showPopup(popup);  // Affiche la popup initiale si rejeté
				}
			});
		
			// Quand la piste audio se termine, passe à la suivante
			audio.addEventListener("ended", playNext);  // Passe à la piste suivante à la fin de la lecture
		
			// Initialisation
			sessionStorage.removeItem("userResponse");  // Réinitialise la réponse de l'utilisateur à chaque nouveau chargement
			showPopup(popup);  // Affiche la popup initiale au chargement de la page
		
			// Gestion de la visibilité de la page
			document.addEventListener("visibilitychange", () => {
				if (!document.hidden) {  // La page devient visible
					const userResponseOnFocus = sessionStorage.getItem("userResponse");
		
					// Vérifie si une popup est déjà affichée pour éviter les doublons
					if (!isPopupVisible) {  
						if (audio.paused) {  // Si l'audio est en pause
							if (userResponseOnFocus === "accepted") {
								showPopup(popupPursue);  // Affiche la popup de reprise si accepté
							} else if (userResponseOnFocus === "rejected") {
								showPopup(popup);  // Affiche la popup initiale si rejeté
							}
						}
					}
				}
			});
		});



/* autoScroll */

	// autoScroll /Mobi|Android/i

       	// L400. Fonction pour détecter si l'utilisateur est sur un appareil mobile

        // Constantes pour les valeurs configurables
        const SCROLL_STEP = 1; // Nombre de pixels à faire défiler par intervalle
        const DELAY = 15; // Intervalle en millisecondes entre chaque défilement
        const TOUCH_SENSITIVITY = 10; // Sensibilité du mouvement de doigt

        let isPaused = false; // Variable pour suivre l'état de la pause du défilement

        // Fonction pour démarrer le gestionnaire d'événement de défilement
        function startAutoScroll() {
            if (isMobile()) {
                // Défilement vertical pour les appareils mobiles
                function scrollDown() {
                    if (!isPaused) {
                        window.scrollBy(0, SCROLL_STEP); // Fait défiler la fenêtre vers le bas
                        // Vérifie si la fenêtre a atteint le bas de la page
                        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
                            setTimeout(scrollUp, DELAY); // Si le bas de la page est atteint, défile vers le haut
                        } else {
                            setTimeout(scrollDown, DELAY); // Sinon, continue de défiler vers le bas
                        }
                    }
                }

                function scrollUp() {
                    if (!isPaused) {
                        window.scrollBy(0, -SCROLL_STEP); // Fait défiler la fenêtre vers le haut
                        // Vérifie si la fenêtre a atteint le haut de la page
                        if (window.scrollY <= 0) {
                            setTimeout(scrollDown, DELAY); // Si le haut de la page est atteint, défile vers le bas
                        } else {
                            setTimeout(scrollUp, DELAY); // Sinon, continue de défiler vers le haut
                        }
                    }
                }

                scrollDown(); // Démarre le défilement vers le bas

                let touchStartY = 0;

                // Gestion des événements tactiles
                window.addEventListener('touchstart', function(event) {
                    touchStartY = event.touches[0].clientY; // Enregistre la position de départ du toucher
                });

                // Gestion de la mise en pause du défilement
                window.addEventListener('touchmove', function(event) {
                    let touchMoveY = event.touches[0].clientY; // Récupère la position actuelle du toucher
                    let deltaY = touchMoveY - touchStartY; // Calcule le déplacement en y

                    if (Math.abs(deltaY) > TOUCH_SENSITIVITY) { // Vérifie si le déplacement dépasse la sensibilité
                        isPaused = true; // Met en pause le défilement
                    }
                });
            }
        }

        // Fonction pour démarrer le défilement au clic
        function startAutoScrollOnClick() {
            startAutoScroll(); // Démarre le défilement automatique
            isPaused = false; // Réinitialiser l'état de la pause
        }

        // Ajout de l'événement de démarrage du défilement automatique aux boutons
        document.getElementById('acceptButton').addEventListener('click', startAutoScrollOnClick);
        document.getElementById('rejectButton').addEventListener('click', startAutoScrollOnClick);

		// Fonction pour démarrer le défilement automatique
		//window.onload = function() {
		//	setTimeout(startAutoScroll, 0); // Délai de 0 secondes avant de démarrer le défilement automatique
		//};



/* autoSwitch */

	// autoSwitch /Mobi|Android/i
	
		// L400. Fonction pour détecter si l'utilisateur est sur un appareil mobile

		// Fonction pour passer à la photo suivante
		function nextPhoto() {
			if (isMobile() && document.body.classList.contains('is-poptrox-visible')) {
				// Simuler un clic sur le bouton "suivant" de Poptrox
				var nextButton = document.querySelector('.nav-next');
				if (nextButton) {
					nextButton.click();
				}
			}
			
			// Appel récursif pour exécuter la fonction après 5 secondes
			setTimeout(nextPhoto, 5000);
		}

		// Appel initial de la fonction nextPhoto
		nextPhoto();



/* autoView */

	// autoView /Full|Device

		// Fonction pour passer à la video suivante
		document.addEventListener('DOMContentLoaded', function() {
			var videoPlayer = document.getElementById('videoPlayer');

			// Liste des vidéos
			var videos = [
				{ src: 'videos/vid06.mp4' },
				{ src: 'videos/vid07.mp4' },
				{ src: 'videos/vid08.mp4' },
				//{ src: 'videos/.mp4', poster: 'images/.jpg' },
			];

			var currentVideoIndex = 0;

			// Fonction pour charger une vidéo
			function loadVideo(index) {
				if (index < videos.length) {
					videoPlayer.src = videos[index].src;
					//videoPlayer.poster = videos[index].poster;
					videoPlayer.load();
					videoPlayer.play();
				}
			}

			// Écouteur d'événement pour la fin de la vidéo
			videoPlayer.addEventListener('ended', function() {
				currentVideoIndex++;
				if (currentVideoIndex < videos.length) {
					loadVideo(currentVideoIndex);
				} else {
					// Réinitialiser à la première vidéo si toutes les vidéos sont jouées
					currentVideoIndex = 0;
					loadVideo(currentVideoIndex);
				}
			});

			// Charger la première vidéo
			loadVideo(currentVideoIndex);
		});