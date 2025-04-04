/*!
 * reveal.js-lightbox v1.0.5
 * https://github.com/rajgoel/reveal.js-lightbox
 * Copyright (c) 2021 Raj Goel
 * License: MIT
 */

var RevealLightbox = (function(){
        "use strict";
        // Based on https://www.w3schools.com/howto/howto_js_lightbox.asp

        var lbContext = {}; // Initialise the context
        lbContext.images = []; // Create an empty images array

        // Creates the lightbox, opens it, and populates with the first image. Attaches event listeners
        function createLightbox(imgSrc, imgDesc, currentGroup) { // Create the lightbox and populate it with the first image. Attaches event listeners.
                lbContext.currentGroup = currentGroup; // Stores the current group in the context
                lbContext.currentImage = 0; // Sets the current image counter to 0
                lbContext.images = []; // Empties the images array

                // Find all elements in the current group
                var currentGroupImgs = document.querySelectorAll('[data-lightbox="' + lbContext.currentGroup + '"]');
                currentGroupImgs.forEach(function(element, index) {
                        var thisImgSrc = element.getAttribute('href');
                        var thisImgDesc = element.getAttribute('data-title');
                        var thisImg = [thisImgSrc, thisImgDesc];
                        lbContext.images.push(thisImg); // Add the image src and description to the images array

                        if (thisImgSrc == imgSrc && thisImgDesc == imgDesc) { // Check if the current element in the loop is the one that was clicked on
                                lbContext.currentImage = index; // Stores the current image index in the context
                        }
                });

                // Create the lightbox elements
                var lightbox = document.createElement('div');
                lightbox.classList.add('lightbox');
                var lightboxcontent = document.createElement('img');
                lightboxcontent.classList.add('lightbox-content');
                var lightboxcaption = document.createElement('div');
                lightboxcaption.classList.add('lightbox-caption');
                var close = document.createElement('span');
                close.classList.add('lightbox-close');
                close.innerHTML = '&times;'; // Creates the close button

                // Add the prev/next buttons if there's more than one image
                if (lbContext.images.length > 1) {
                        var prev = document.createElement('a');
                        prev.classList.add('lightbox-prev');
                        prev.innerHTML = '&#10094;';
                        var next = document.createElement('a');
                        next.classList.add('lightbox-next');
                        next.innerHTML = '&#10095;';
                }

                // Add the elements to the lightbox
                lightbox.appendChild(close);
                lightbox.appendChild(lightboxcontent);
                lightbox.appendChild(lightboxcaption);
                if (lbContext.images.length > 1) {
                        lightbox.appendChild(prev);
                        lightbox.appendChild(next);
                }
                document.body.appendChild(lightbox); // Add the lightbox to the document body

                // Add the image src and description to the lightbox
                setImage(lbContext.currentImage);

                // Add event listener for the close button
                close.addEventListener('click', function() {
                        closeLightbox();
                });

                // Add event listener for clicking outside the image
                 lightbox.addEventListener('click', function(event) {
                    // Close if clicked outside the image content or prev/next buttons
                    if (event.target === lightbox) {
                        closeLightbox();
                    }
                });

                // Add event listeners for the prev/next buttons
                if (lbContext.images.length > 1) {
                        prev.addEventListener('click', function() {
                                prevImage();
                        });
                        next.addEventListener('click', function() {
                                nextImage();
                        });
                }

                // Add event listener for the escape key
                document.addEventListener('keydown', function(e) {
                        if (e.key === "Escape") { // If escape is pressed, close the lightbox
                                closeLightbox();
                        }
                        if (e.key === "ArrowLeft" && lbContext.images.length > 1) { // If left arrow is pressed, go to the previous image
                                prevImage();
                        }
                        if (e.key === "ArrowRight" && lbContext.images.length > 1) { // If right arrow is pressed, go to the next image
                                nextImage();
                        }
                });

        }

        // Sets the src and description for the image based on the index in the images array
        function setImage(imgIndex) {
                var lightboxcontent = document.querySelector('.lightbox-content');
                var lightboxcaption = document.querySelector('.lightbox-caption');
                var img = lbContext.images[imgIndex]; // Get the image src and description from the array
                lightboxcontent.src = img[0]; // Set the image src
                lightboxcaption.innerHTML = img[1] ? img[1] : ''; // Set the image description if it exists
                lbContext.currentImage = imgIndex; // Stores the current image index in the context
        }

        // Calculates the next image index and calls setImage()
        function nextImage() {
                var nextImageIndex = lbContext.currentImage + 1; // Finds the next image index
                if (nextImageIndex >= lbContext.images.length) { // If the next image index is greater than the total number of images
                        nextImageIndex = 0; // Set the next image index to the first image
                }
                setImage(nextImageIndex); // Calls the setImage function with the next image index
        }

        // Calculates the previous image index and calls setImage()
        function prevImage() {
                var prevImageIndex = lbContext.currentImage - 1; // Finds the previous image index
                if (prevImageIndex < 0) { // If the previous image index is less than 0
                        prevImageIndex = lbContext.images.length - 1; // Set the previous image index to the last image
                }
                setImage(prevImageIndex); // Calls the setImage function with the previous image index
        }

        // Closes the lightbox by removing it from the document body
        function closeLightbox() {
                var lightbox = document.querySelector('.lightbox'); // Selects the lightbox element
                if (lightbox) { // If the lightbox element exists
                        lightbox.parentNode.removeChild(lightbox); // Remove the lightbox element from the document body
                }
        }

        // Initializes the lightbox by attaching event listeners to all elements with the data-lightbox attribute
        function init() {
                // Find all elements with data-lightbox attribute
                var elements = document.querySelectorAll('[data-lightbox]');
                elements.forEach(function(element) {
                        // Add event listener to each element
                        element.addEventListener('click', function(event) {
                                event.preventDefault(); // Prevent the default action of the link
                                var imgSrc = element.getAttribute('href'); // Get the image src
                                var imgDesc = element.getAttribute('data-title'); // Get the image description
                                var currentGroup = element.getAttribute('data-lightbox'); // Get the group name
                                createLightbox(imgSrc, imgDesc, currentGroup); // Call the createLightbox function
                        });
                });
        }

        // Return the init function so it can be called externally (e.g., by Reveal.js plugin system)
        return {
                id: 'RevealLightbox', // Added an ID for potential reference
                init: init
        };
})();

// If Reveal object exists, register the plugin.
// This might run too early if Reveal is loaded after this script.
// A better approach is initializing via Reveal.initialize plugins array.
/*
if(typeof Reveal !== 'undefined') {
    Reveal.registerPlugin('lightbox', RevealLightbox);
}
*/