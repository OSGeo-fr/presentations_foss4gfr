/**
 * PhantomJS script to capture/render screenshots of the slides of a Reveal.js powered slideshow.
 */

var page = require('webpage').create();
var args = require('system').args;

// Get url to render from command line.
var url;
if (args.length < 2) {
    url = 'http://lab.hakim.se/reveal-js';
    console.warn('No url specified. Falling back on ' + url);
}
else {
    url = args[1];
}
// (Optional) prefix for renders.
var prefix = args.length >= 3 ? args[2] : 'slide-';


// Set render size.
page.viewportSize = { width: 1200, height: 900 };

// Open the url and do your thing.
page.open(url, function (status) {

    if (status !== 'success') {
        console.error('Failed to open url ' + url);
        phantom.exit();
    }

    // Disable slide transitions so we don't lose time on that.
    page.evaluate(function() {
        // Apparently setting "transition" and "backgroundTransition" to "none"
        // is enough to disable slide transitions, even if there are per-slide transitions.
        Reveal.configure({
            'transition': 'none',
            'backgroundTransition': 'none'
        });
        document.getElementsByClassName('controls')[0].style.display = 'None';
    });

    // Disable transitions on "fragmented views".
    page.evaluate(function() {
        var fragments = document.getElementsByClassName('fragment');
        for (var f = fragments.length - 1; f >= 0; f--) {
            fragments[f].classList.remove('fragment');
        }
    });


    // Render all slides.
    var slideCounter = 1;
    var isLastSlide = function() {
        return page.evaluate(function() {
            return Reveal.isLastSlide();
        });
    };
    var next = function() {
        return page.evaluate(function() {
            return Reveal.next();
        });
    };

    while (true) {
        // Capture.
        var slideNumberName = slideCounter;
        if (slideNumberName < 10) {
            slideNumberName = '00' + slideNumberName;
        } else if (slideNumberName < 100) {
            slideNumberName = '0' + slideNumberName;
        }

        var filename = prefix + slideNumberName + '.png';
        console.log('Rendering ' + filename);
        page.render(filename);

        // Go to next slide (if any).
        if (isLastSlide()) {
            break;
        }
        next();
        slideCounter++;
    }

    phantom.exit();

});
