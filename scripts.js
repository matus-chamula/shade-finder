////////////////////////////
// Shade Finder Prototype //
////////////////////////////

var self = this;
var colorPicker = document.querySelector("#pdVariantsColorPicker");
var newColorPicker = document.querySelector("#pdSelectedVariant ~ button");

// Do nothing in case the browser is IE
if (window.document.documentMode) {
  return;
}

// Do nothing in case the link already exists
if (document.querySelector(".exponea-sf-link")) {
	return;
}

// Sanity check for the Color Picker
if (colorPicker) {
	colorPicker.insertAdjacentHTML("afterbegin", self.html);
}
else if (newColorPicker) {
	newColorPicker.insertAdjacentHTML("afterend", self.html);
}
else {
	return;
}

document.body.insertAdjacentHTML("afterbegin", "<style>" + self.style + "</style>");

var sfLink = document.querySelector(".exponea-sf-link");
if (newColorPicker) {
	sfLink.classList.add("exponea-sf-link-wrapper--new");
}
var sfOverlay = document.querySelector(".exponea-sf-overlay");
var sfModal = document.querySelector(".exponea-sf-modal");
var sfBack = document.querySelector(".exponea-sf-modal-back-wrapper");
var sfClose = document.querySelector(".exponea-sf-modal-close");

// GA tracking variables
var start;
var timeOpened;
var currentStep;

// Set the timeouts
var fadeTimeout = 250;
var carouselTimeout = 350;

// Show modal once the link is clicked
sfLink.addEventListener("click", function(e) {
	// Set Hotjar tracking
	if (typeof(hj) !== "undefined") {
		hj("event", "shadefinder");
	}
	// Set GA tracking
	start = Date.now();
	currentStep = "Shade";
	setSfLinkGA();
	// Disable native scroll to the top
	e.preventDefault();
	// window.scrollTo(0, 0);
	document.body.classList.add("noscroll");
	
	setTimeout(function() {
		// Display the modal window
		sfOverlay.classList.add("active");
		// Proceed to Step 4 right away if the user was there already
		if (selectedVariant !== undefined) {
			goToStep4(true);
		}
	}, fadeTimeout);
});

var step1 = document.querySelector("#step-1");
var step2 = document.querySelector("#step-2");
var step3 = document.querySelector("#step-3");
var step3Info = document.querySelector("#step-3-info");
var step4 = document.querySelector("#step-4");
var step1Opt = step1.querySelectorAll(".exponea-sf-modal-img-wrapper");
var step2Opt = step2.querySelectorAll(".exponea-sf-modal-img-wrapper");
var step3Opt = step3.querySelectorAll(".exponea-sf-modal-img-wrapper");
var step3Link = step3.querySelector(".exponea-sf-modal-link");
var step3Wrapper = step3.querySelector(".exponea-sf-modal-img-flex");
var toneImageUrl = "https://cdn.notinoimg.com/images/gallery/ux/shade-finder-v2/lam5092/";
var toneImages =	[[["005.jpg", "007.jpg", "010.jpg"], ["021.jpg", "023.jpg", "01.jpg"], ["006.jpg", "024.jpg", "02.jpg"]], 
					[["032.jpg", "047.jpg", "04.jpg"], ["03.jpg", "038.jpg", "48.jpg"], ["", "026.jpg", "045.jpg"]], 
					[["049.jpg", "055.jpg", "06.jpg"], ["051.jpg", "08.jpg", ""], ["050.jpg", "07.jpg", "09.jpg"]], 
					[["", "10.2.jpg", ""], ["", "10.3.jpg", ""], ["10.1.jpg", "10.jpg", ""]], 
					[["12.jpg", "15.jpg", "17.jpg"], ["13.2.jpg", "14.jpg", ""], ["11.jpg", "13.jpg", "13.3.jpg"]]];
var step3InfoButton = step3Info.querySelector(".exponea-sf-modal-button");
var variantsIDs =	[[["pd-variant-610848", "pd-variant-11634720", "pd-variant-610788"], ["pd-variant-11632057", "pd-variant-11632061", "pd-variant-616884"], ["pd-variant-15845374", "pd-variant-11632062", "pd-variant-616849"]], 
					[["pd-variant-15661152", "pd-variant-15845365", "pd-variant-610680"], ["pd-variant-616843", "pd-variant-15692975", "pd-variant-15692976"], ["", "pd-variant-15845454", "pd-variant-610836"]], 
					[["pd-variant-11632063", "pd-variant-610818", "pd-variant-610883"], ["pd-variant-11633589", "pd-variant-11633608", ""], ["pd-variant-11633559", "pd-variant-11633602", "pd-variant-11633623"]], 
					[["", "pd-variant-11633631", ""], ["", "pd-variant-15845456", ""], ["pd-variant-11633629", "pd-variant-610875", ""]], 
					[["pd-variant-616851", "pd-variant-11634719", "pd-variant-11634722"], ["pd-variant-11634121", "pd-variant-15692977", ""], ["pd-variant-616848", "pd-variant-620895", "pd-variant-11634718"]]];
var step4Header = step4.querySelector(".exponea-sf-modal-header");
var step4HeaderRe = step4.querySelector(".exponea-sf-modal-header--reopen");
var step4Section = step4.querySelector(".exponea-sf-modal-section");
var step4SectionRe = step4.querySelector(".exponea-sf-modal-section--reopen");
var step4Button = step4.querySelector(".exponea-sf-modal-button");
var step4ButtonRe = step4.querySelector(".exponea-sf-modal-button--reopen");
var step4ButtonRestart = step4.querySelector(".exponea-sf-modal-button--restart");

var selectedShade;
var selectedTone;
var selectedVariant;
var selectedProductImg;

// Close modal once the cross is clicked
sfClose.addEventListener("click", function() {
	// Set GA tracking
	setSfCloseGA();
	document.body.classList.remove("noscroll");
	sfOverlay.classList.remove("active");
	if (currentStep != "FinalShade") {
		goToStep1();
	}
});

// Close modal once Esc is pressed
window.addEventListener("keydown", function(e) {
	if (event.key === "Escape") {
		// Set GA tracking
		setSfCloseGA();
		document.body.classList.remove("noscroll");
		sfOverlay.classList.remove("active");
		if (currentStep != "FinalShade") {
			goToStep1();
		}
	}
}, true);

// Carousel scrolling
var carousel = step1.querySelector(".exponea-sf-modal-img-flex");
var prevButton = step1.querySelector(".carousel-control-prev");
var nextButton = step1.querySelector(".carousel-control-next");
prevButton.addEventListener("click", function(e) {
	e.preventDefault();
	carousel.style.overflowX = "scroll";
	carousel.scrollLeft = 0;
	nextButton.classList.remove("hidden");
	prevButton.classList.add("hidden");
	step1Opt[1].classList.remove("faded-left");
	setTimeout(function() {
		step1Opt[3].classList.add("faded-right");
		carousel.style.overflowX = "hidden";
	}, carouselTimeout);
});
nextButton.addEventListener("click", function(e) {
	e.preventDefault();
	carousel.style.overflowX = "scroll";
	carousel.scrollLeft += carousel.scrollWidth;
	nextButton.classList.add("hidden");
	prevButton.classList.remove("hidden");
	step1Opt[3].classList.remove("faded-right");
	setTimeout(function() {
		step1Opt[1].classList.add("faded-left");
		carousel.style.overflowX = "hidden";
	}, carouselTimeout);
});

// Return to the previous step
sfBack.addEventListener("click", function() {
	if (step2.style.display === "block") {
		// Set GA tracking
		setBackGA();
		goToStep1();
		// Discard the selected shade value
		selectedShade = undefined;
	}
	else if (step3.style.display === "block") {
		// Set GA tracking
		setBackGA();
		setTimeout(function() {
			// Remove the additional class related to cases with less than three items
			step3Opt.forEach(function(opt) {
				if (opt.classList.contains("exponea-sf-modal-img-wrapper--empty")) {
					opt.classList.remove("exponea-sf-modal-img-wrapper--empty");
				}
			});
		}, fadeTimeout);
		// Discard the selected tone value
		selectedTone = undefined;
		goToStep2(true);
	}
	else if (step3Info.style.display === "block") {
		// Set GA tracking
		setBackGA();
		fadeSteps(step3Info, step3);
		currentStep = "Recommendation";
	}
	else if (step4.style.display === "block") {
		// Set GA tracking
		setBackGA();
		goToStep3(true);
		// Discard the selected variant value
		selectedVariant = undefined;
	}
});

// Proceed to Step 2
step1Opt.forEach(function(opt, i) {
	opt.addEventListener("click", function() {
		// Set GA tracking
		setStep1GA(i);
		// Store the selected shade value
		selectedShade = i;
		goToStep2();
		// Set the images based on the selected option
		setStep2Images(i);
	});
});

// Proceed to Step 3
step2Opt.forEach(function(opt, i) {
	opt.addEventListener("click", function() {
		// Do nothing in case the are no product variants for the given Undertone
		if (opt.classList.contains("exponea-sf-modal-img-wrapper--none")) {
			return;
		}
		// Set GA tracking
		setStep2GA(i);
		// Store the selected tone value
		selectedTone = i;
		goToStep3();
		// Set the images based on the selected option
		setStep3Previews();
	});
});

// Show the Info section
step3Link.addEventListener("click", function() {
	// Set GA tracking
	setStep3HowGA();
	goToStep3Info();
});

// Hide the Info section
step3InfoButton.addEventListener("click", function() {
	// Set GA tracking
	setStep3HowButtonGA();
	goBackToStep3();
});

// Proceed to Step 4
step3Opt.forEach(function(opt, i) {
	opt.addEventListener("click", function() {
		// Set GA tracking
		setStep3GA(i);
		// Store the selected variant value
		selectedVariant = i;
		// Switch to the proper product variant
		if (newColorPicker) {
			newColorPicker.click();
			document.querySelector("div[class*='styled__DrawerBackground']").style.opacity = "0";
		}
		document.getElementById(variantsIDs[selectedShade][selectedTone][selectedVariant]).click();
		setTimeout(function() {
			goToStep4();
			// Set the image based on the selected option
			setStep4Preview();
		}, fadeTimeout);
	});
});

// Select the shade
step4Button.addEventListener("click", function() {
	// Set GA tracking
	setSfSelectGA();
	document.body.classList.remove("noscroll");
	sfOverlay.classList.remove("active");
});

step4ButtonRe.addEventListener("click", function() {
	// Set GA tracking
	setSfSelectGA();
	if (newColorPicker) {
		newColorPicker.click();
		document.querySelector("div[class*='styled__DrawerBackground']").style.opacity = "0";
	}
	document.getElementById(variantsIDs[selectedShade][selectedTone][selectedVariant]).click();
	document.body.classList.remove("noscroll");
	sfOverlay.classList.remove("active");
});

step4ButtonRestart.addEventListener("click", function() {
	// Set GA tracking
	setStep4RestartGA();
	selectedShade = undefined;
	selectedTone = undefined;
	selectedVariant = undefined;
	goToStep1();
});

function fadeSteps(stepFrom, stepTo) {
	stepFrom.style.opacity = "0";
	stepTo.style.display = "block";
	setTimeout(function() {
		stepFrom.style.display = "none";
		stepTo.style.opacity = "1";
		sfModal.scrollTo(0, 0);
	}, fadeTimeout);
}

function goToStep1() {
	if (step2.style.display === "block") {
		fadeSteps(step2, step1);
	}
	else if (step3.style.display === "block") {
		fadeSteps(step3, step1);
	}
	else if (step3Info.style.display === "block") {
		fadeSteps(step3Info, step1);
	}
	else if (step4.style.display === "block") {
		fadeSteps(step4, step1);
		resetStep4();
	}
	sfBack.style.display = "none";
	currentStep = "Shade";
}

function goToStep2(fromPrevious) {
	if (fromPrevious) {
		fadeSteps(step3, step2);
	}
	else {
		fadeSteps(step1, step2);
		sfBack.style.display = "block";
	}
	currentStep = "Undertone";
}

// Set the Step 2 images based on the option selected in the previous step
function setStep2Images(index) {
	var overlay = document.querySelectorAll(".exponea-sf-modal-img-overlay");
	if (index === 0) {
		document.querySelectorAll("#step-2 .exponea-sf-modal-img").forEach(img => img.src = "https://cdn.notinoimg.com/images/gallery/ux/shade-finder-v2/1eweb-1-1.jpg");
		overlay[0].style.background = "rgba(225, 169, 196, 0.18)";
		overlay[2].style.background = "rgba(255, 210, 85, 0.10)";
	}
	else if (index === 1) {
		document.querySelectorAll("#step-2 .exponea-sf-modal-img").forEach(img => img.src = "https://cdn.notinoimg.com/images/gallery/ux/shade-finder-v2/2dweb-1-1.jpg");
		overlay[0].style.background = "rgba(225, 169, 196, 0.13)";
		overlay[2].style.background = "rgba(255, 210, 85, 0.08)";
	}
	else if (index === 2) {
		document.querySelectorAll("#step-2 .exponea-sf-modal-img").forEach(img => img.src = "https://cdn.notinoimg.com/images/gallery/ux/shade-finder-v2/3dweb-1-1.jpg");
		overlay[0].style.background = "rgba(225, 169, 196, 0.16)";
		overlay[2].style.background = "rgba(255, 210, 85, 0.10)";
	}
	else if (index === 3) {
		document.querySelectorAll("#step-2 .exponea-sf-modal-img").forEach(img => img.src = "https://cdn.notinoimg.com/images/gallery/ux/shade-finder-v2/4fweb-1-1.jpg");
		overlay[0].style.background = "rgba(225, 169, 196, 0.11)";
		overlay[2].style.background = "rgba(255, 210, 85, 0.08)";
	}
	else if (index === 4) {
		document.querySelectorAll("#step-2 .exponea-sf-modal-img").forEach(img => img.src = "https://cdn.notinoimg.com/images/gallery/ux/shade-finder-v2/5fweb-1-1.jpg");
		overlay[0].style.background = "rgba(225, 169, 196, 0.10)";
		overlay[2].style.background = "rgba(255, 210, 85, 0.08)";
	}
	
	// Disable Undertone variant in case it doesn't have any product options available
	for (var i = 0; i < toneImages[selectedShade].length; i++) {
		var emptyCounter = 0;
		toneImages[selectedShade][i].forEach(function(j, k) {
			if (j === "") {
				emptyCounter++;
			}
			if (k === toneImages[selectedShade].length - 1 && emptyCounter === toneImages[selectedShade].length) {
				step2Opt[i].classList.add("exponea-sf-modal-img-wrapper--none");
				// step2Opt[i].removeEventListener("click", _listener);
			}
		});
	}
	
	step2.querySelector(".exponea-sf-modal-img").addEventListener("load", resizeOverlay);
	window.onresize = resizeOverlay;
}

// Set the proper height of the overlay in Step 2
function resizeOverlay() {
	var img = document.querySelector("#step-2 .exponea-sf-modal-img");
	var overlay = document.querySelectorAll(".exponea-sf-modal-img-overlay");
	if (img) {
		var height = img.clientHeight;
		for (var i = 0; i < overlay.length; i++) {
			overlay[i].style.height = height + "px";
		}
	}
}

function goToStep3(fromPrevious) {
	if (fromPrevious) {
		fadeSteps(step4, step3);
		resetStep4();
	}
	else {
		fadeSteps(step2, step3);
	}
	currentStep = "Recommendation";
}

function goToStep3Info() {
	fadeSteps(step3, step3Info);
	currentStep = "HowWeSelect";
}

function goBackToStep3() {
	fadeSteps(step3Info, step3);
	currentStep = "Recommendation";
}

// Set the Step 3 images based on the option selected in the previous step
function setStep3Previews() {
	step3Opt.forEach(function(opt, i) {
		// Hide option in case the image is not defined
		if (toneImages[selectedShade][selectedTone][i] === "") {
			opt.classList.add("exponea-sf-modal-img-wrapper--empty");
		}
		else {
			opt.querySelector(".exponea-sf-modal-img").src = toneImageUrl + toneImages[selectedShade][selectedTone][i];
		}
	});
}

function goToStep4(reopen) {
	if (reopen) {
		step4Header.style.display = "none";
		step4HeaderRe.style.display = "block";
		step4Section.style.display = "none";
		step4SectionRe.style.display = "block";
		step4Button.style.display = "none";
		step4ButtonRe.style.display = "inline-block";
		step4ButtonRestart.style.display = "inline-block";
	}
	else {
		fadeSteps(step3, step4);
	}
	currentStep = "FinalShade";
}

function setStep4Preview() {
	if (newColorPicker) {
		step4.querySelector(".exponea-sf-modal-img-desc").innerText = newColorPicker.innerText;
	}
	else {
		step4.querySelector(".exponea-sf-modal-img-desc").innerText = document.querySelector("#pdSelectedVariant div[aria-live='assertive'] div").innerText
	}
	selectedProductImg = document.querySelector(".slick-track .slick-current img").src;
	// selectedProductImg = document.querySelector("#pdImageGallery div[class^='styled__MainImgWrapper']").querySelector("img").src;
	step4.querySelector(".exponea-sf-modal-product-img").src = selectedProductImg;
	step4.querySelector(".exponea-sf-modal-product-swatch").src = toneImageUrl + toneImages[selectedShade][selectedTone][selectedVariant].replace(".jpg", ".png");
}

function resetStep4() {
	if (step4HeaderRe.style.display === "block") {
		setTimeout(function() {
			step4HeaderRe.style.display = "none";
			step4Header.style.display = "block";
			step4SectionRe.style.display = "none";
			step4Section.style.display = "block";
			step4ButtonRe.style.display = "none";
			step4ButtonRestart.style.display = "none";
			step4Button.style.display = "inline-block";
		}, fadeTimeout);
	}
}

function setSfLinkGA() {
	if (typeof window.NotinoAPI === "object") {
		var productCode = window.NotinoAPI.getProductCode();
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderLoaded', 'eventLabel': productCode, 'eventValue': undefined, 'eventNonInteraction': undefined});
	}
	else {
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderLoaded', 'eventLabel': 'LAMTIUW_KMUP20', 'eventValue': undefined, 'eventNonInteraction': undefined});
	}
}

function setSfCloseGA() {
	timeOpened = Math.floor((Date.now() - start) / 1000);
	dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderClosed', 'eventLabel': currentStep, 'eventValue': timeOpened, 'eventNonInteraction': undefined});
}

function setBackGA() {
	timeOpened = Math.floor((Date.now() - start) / 1000);
	dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderBack', 'eventLabel': currentStep, 'eventValue': timeOpened, 'eventNonInteraction': undefined});
}

function setStep1GA(option) {
	timeOpened = Math.floor((Date.now() - start) / 1000);
	if (option === 0) {
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderShadeSelected', 'eventLabel': 'UltraLight', 'eventValue': timeOpened, 'eventNonInteraction': undefined});
	}
	else if (option === 1) {
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderShadeSelected', 'eventLabel': 'Light', 'eventValue': timeOpened, 'eventNonInteraction': undefined});
	}
	else if (option === 2) {
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderShadeSelected', 'eventLabel': 'Medium', 'eventValue': timeOpened, 'eventNonInteraction': undefined});
	}
	else if (option === 3) {
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderShadeSelected', 'eventLabel': 'MediumDark', 'eventValue': timeOpened, 'eventNonInteraction': undefined});
	}
	else if (option === 4) {
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderShadeSelected', 'eventLabel': 'Dark', 'eventValue': timeOpened, 'eventNonInteraction': undefined});
	}
}

function setStep2GA(option) {
	timeOpened = Math.floor((Date.now() - start) / 1000);
	if (option === 0) {
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderUndertoneSelected', 'eventLabel': 'Cold', 'eventValue': timeOpened, 'eventNonInteraction': undefined});
	}
	else if (option === 1) {
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderUndertoneSelected', 'eventLabel': 'Neutral', 'eventValue': timeOpened, 'eventNonInteraction': undefined});
	}
	else if (option === 2) {
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderUndertoneSelected', 'eventLabel': 'Warm', 'eventValue': timeOpened, 'eventNonInteraction': undefined});
	}
}

function setStep3GA(option) {
	timeOpened = Math.floor((Date.now() - start) / 1000);
	if (option === 0) {
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderVariantSelected', 'eventLabel': 'Light', 'eventValue': timeOpened, 'eventNonInteraction': undefined});
	}
	else if (option === 1) {
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderVariantSelected', 'eventLabel': 'Optimal', 'eventValue': timeOpened, 'eventNonInteraction': undefined});
	}
	else if (option === 2) {
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderVariantSelected', 'eventLabel': 'Dark', 'eventValue': timeOpened, 'eventNonInteraction': undefined});
	}
}

function setStep3HowGA() {
	timeOpened = Math.floor((Date.now() - start) / 1000);
	dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderHowWeSelect', 'eventLabel': undefined, 'eventValue': timeOpened, 'eventNonInteraction': undefined});
}

function setStep3HowButtonGA() {
	timeOpened = Math.floor((Date.now() - start) / 1000);
	if (typeof window.NotinoAPI === "object") {
		var productCode = window.NotinoAPI.getProductCode();
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderIWantToChoseShade', 'eventLabel': productCode, 'eventValue': timeOpened, 'eventNonInteraction': undefined});
	}
	else {
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderIWantToChoseShade', 'eventLabel': 'LAMTIUW_KMUP20', 'eventValue': timeOpened, 'eventNonInteraction': undefined});
	}
}

function setSfSelectGA() {
	timeOpened = Math.floor((Date.now() - start) / 1000);
	if (typeof window.NotinoAPI === "object") {
		var productCode = window.NotinoAPI.getProductCode();
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderSelected', 'eventLabel': productCode, 'eventValue': timeOpened, 'eventNonInteraction': undefined});
	}
	else {
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderSelected', 'eventLabel': 'LAMTIUW_KMUP20', 'eventValue': timeOpened, 'eventNonInteraction': undefined})
	}
}

function setStep4RestartGA() {
	timeOpened = Math.floor((Date.now() - start) / 1000);
	if (typeof window.NotinoAPI === "object") {
		var productCode = window.NotinoAPI.getProductCode();
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderStartAgain', 'eventLabel': productCode, 'eventValue': timeOpened, 'eventNonInteraction': undefined});
	}
	else {
		dataLayer.push({'event': 'ga.event', 'eventCategory': 'Product', 'eventAction': 'ShadeFinderStartAgain', 'eventLabel': 'LAMTIUW_KMUP20', 'eventValue': timeOpened, 'eventNonInteraction': undefined});
	}
}

function getEventProperties(action, interactive) {
    return { action: action, banner_id: self.data.banner_id, banner_name: self.data.banner_name, banner_type: self.data.banner_type, variant_id: self.data.variant_id, variant_name: self.data.variant_name, interaction: interactive !== false ? true : false, location: window.location.href, path: window.location.pathname };
}
