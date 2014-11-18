(function () {
	/*
	 * Correction of Firefox bug related to scaling images in flex-containers
	 *  If the bug is detected, the script applies a CSS class to the error-causing elements
	**/
	"use strict";
	
	function testFirefoxBug() {
		var criticalElements, 
			criticalElementsSelector = 'main > article',
			critWidth = 0,
			referenceElement,
			flexContainer,
			flexContainerSelector = 'main',
			correctWidth,
			targetElementSelector = 'img, .text-illustrate',
			targetElements,
			correctionClass = 'ff-flexbox-correction',
			corrClassPattern = new RegExp(correctionClass),
			correctedElements,
			rantingText = 'Firefox has a bug. Images with an assigned max-width in percent are not resized correctly when in a container which has display:flex. Go, yell at Mozilla!';

		
		criticalElements = document.querySelectorAll(criticalElementsSelector);
		Array.prototype.forEach.call(criticalElements, function(e) {
			var width = e.getBoundingClientRect().width;
			critWidth = Math.max(width, critWidth);
		});
		/*referenceElement = document.querySelector(referenceElementSelector);*/
		flexContainer = document.querySelector(flexContainerSelector);
		referenceElement = document.createElement('article');
		flexContainer.appendChild(referenceElement);

		correctWidth = referenceElement.getBoundingClientRect().width;
		flexContainer.removeChild(referenceElement);
		if (correctWidth === critWidth) {
			correctedElements = document.querySelectorAll('.' + correctionClass);
			if (correctedElements.length === 0) {
				return;
			} else {
				Array.prototype.forEach.call(correctedElements, function(e) {
					e.className = e.className.replace(corrClassPattern, '');
				});
			}
		} else if (critWidth > correctWidth) {
			console.warn(rantingText);
			targetElements = document.querySelectorAll(targetElementSelector);
			Array.prototype.forEach.call(targetElements, function(e) {
				var classes = e.className;
				e.className = classes + ' ' + correctionClass;
			});
		}
	}
	/* Invoke on load */
	document.addEventListener('DOMContentLoaded', testFirefoxBug, false);
	window.addEventListener('resize', testFirefoxBug, false);
})();
