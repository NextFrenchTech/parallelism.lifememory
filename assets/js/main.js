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
				return $a.prev('h2').html();
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

		document.addEventListener("DOMContentLoaded", function() {
			var popup = document.getElementById("popup");
			var acceptButton = document.getElementById("acceptButton");
			var rejectButton = document.getElementById("rejectButton");
			var audio = document.getElementById("audio");

			// Vérifier si l'utilisateur a déjà répondu
			var userResponse = getCookie("userResponse");

			if (userResponse === "accepted") {
				// Si l'utilisateur a déjà répondu "accepté", masquer la pop-up et afficher l'audio
				popup.style.display = "none";
			//audio.style.display = "block"; // Afficher l'audio
				audio.play(); // Démarrer la lecture audio
			} else if (userResponse === "rejected") {
				// Si l'utilisateur a déjà répondu "rejeté", masquer la pop-up
				popup.style.display = "none";
			} else {
				// Afficher la fenêtre pop-up après 1 seconde si l'utilisateur n'a pas encore répondu
				setTimeout(function() {
					popup.style.display = "block";
				}, 1000);
			}

			// Gérer la réponse de l'utilisateur
			acceptButton.addEventListener("click", function() {
				popup.style.display = "none";
			//audio.style.display = "block"; // Afficher l'audio
				audio.play(); // Démarrer la lecture audio
				setCookie("userResponse", "accepted"); // Enregistrer la réponse dans un cookie de session
			});

			rejectButton.addEventListener("click", function() {
				popup.style.display = "none";
				setCookie("userResponse", "rejected"); // Enregistrer la réponse dans un cookie de session
			});

			// Fonction pour définir un cookie de session
			function setCookie(name, value) {
				document.cookie = name + "=" + value + ";path=/;SameSite=Lax;Secure";
			}

			// Fonction pour récupérer la valeur d'un cookie
			function getCookie(name) {
				const cookieName = name + "=";
				const cookies = document.cookie.split(';');
				const cookie = cookies.find(c => c.trim().startsWith(cookieName));
				return cookie ? cookie.trim().substring(cookieName.length) : "";
			}
		});

		// Fonction pour passer à la piste audio suivante
		function playNext() {
			const audio = document.getElementById('audio');
			const sources = audio.getElementsByTagName('source');

			// Recherche de la source actuelle
			let currentSourceIndex = -1;
			for (let i = 0; i < sources.length; i++) {
				if (sources[i].src === audio.src) {
					currentSourceIndex = i;
					break;
				}
			}

			// Calcul de l'index de la source suivante
			const nextSourceIndex = (currentSourceIndex + 1) % sources.length;

			// Mise à jour de la source audio et lecture
			audio.src = sources[nextSourceIndex].src;
			audio.load(); // Recharge le lecteur audio pour prendre en compte la nouvelle source
			audio.play(); // Lance la lecture de la nouvelle source
		}

		// Lancer la première piste audio
		document.addEventListener("DOMContentLoaded", function() {
			playNext();
		});



/* autoScroll */

	// autoScroll /Mobi|Android/i
		// L400 Fonction pour détecter si l'utilisateur est sur un appareil mobile

		let isPaused = false; // Variable pour suivre l'état de la pause du défilement

		// Fonction pour démarrer le gestionnaire d'événement de défilement
		function startAutoScroll() {
			let scrollStep = 1; // Nombre de pixels à faire défiler par intervalle
			let delay = 15; // Intervalle en millisecondes entre chaque défilement

			if (isMobile()) {
				// Défilement vertical pour les appareils mobiles
				function scrollDown() {
					if (!isPaused) {
						window.scrollBy(0, scrollStep);
						if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
							setTimeout(scrollUp, delay);
						} else {
							setTimeout(scrollDown, delay);
						}
					}
				}

				function scrollUp() {
					if (!isPaused) {
						window.scrollBy(0, -scrollStep);
						if (window.scrollY <= 0) {
							setTimeout(scrollDown, delay);
						} else {
							setTimeout(scrollUp, delay);
						}
					}
				}

				scrollDown();

				let touchStartY = 0;

				// Gestion des événements tactiles
				window.addEventListener('touchstart', function(event) {
					touchStartY = event.touches[0].clientY;
				});

				// Gestion de la mise en pause du défilement
				window.addEventListener('touchmove', function(event) {
					let touchMoveY = event.touches[0].clientY;
					let deltaY = touchMoveY - touchStartY;

					if (Math.abs(deltaY) > 10) { // Sensibilité du mouvement de doigt
						isPaused = true;// Empêche le défilement naturel
					}
				});
			}
		}

		// Fonction pour démarrer le défilement au click
		document.getElementById('acceptButton').addEventListener('click', startAutoScroll);
		document.getElementById('rejectButton').addEventListener('click', startAutoScroll);

		// Fonction pour démarrer le défilement automatique
		//window.onload = function() {
		//	setTimeout(startAutoScroll, 0); // Délai de 0 secondes avant de démarrer le défilement automatique
		//};



/* autoSwitch */

	// autoSwitch /Mobi|Android/i
		// L400 Fonction pour détecter si l'utilisateur est sur un appareil mobile

		// Fonction pour passer à la photo suivante
		function nextPhoto() {
			if (isMobile() && $('body').hasClass('is-poptrox-visible')) {
				// Simuler un clic sur le bouton "suivant" de Poptrox
				var nextButton = $('.nav-next');
				if (nextButton.length) {
					nextButton.click();
				}
			}
		}

		// Définir l'intervalle pour changer de photo toutes les 5 secondes (5000 ms)
		setInterval(nextPhoto, 5000);



/* autoView */

	// autoView /Full|Device

		// Fonction pour passer à la video suivante
		document.addEventListener('DOMContentLoaded', function() {
			var videoPlayer = document.getElementById('videoPlayer');

			// Liste des vidéos
			var videos = [
				{ src: 'videos/vid04.mp4', poster: 'images/bg.jpg' },
				{ src: 'videos/vid05.mp4' },
			];

			var currentVideoIndex = 0;

			// Fonction pour charger une vidéo
			function loadVideo(index) {
				if (index < videos.length) {
					videoPlayer.src = videos[index].src;
					videoPlayer.poster = videos[index].poster;
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