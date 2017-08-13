document.addEventListener("DOMContentLoaded", function() {
    window.scrollTo(0, 0);
    //Masonry initialization
    if (document.querySelector('.home-masonry-grid')) {
        masonry = new Masonry('.home-masonry-grid', {
            itemSelector: ".grid-item",
            columnWidth: ".grid-sizer",
            percentPosition: "true",
            gutter: 10
        })
        masonry.layout();
    }


    // Parallax initialization
    scrollHolder = new ParallaxScrollHolder('.parallax');
    scrollHolder.start();
    window.addEventListener('resize', function(){scrollHolder.updateAll});

    // Burger menu listener
    if (document.getElementById('burger-holder')) {
        document.getElementById('burger-holder').addEventListener('click', function() {
            document.getElementById('mobile-nav-bar').classList.toggle('is-open');
        })
    }
    // Start Nav Bar scroll listener
    if (document.getElementById('mobile-nav-bar') || document.getElementById('nav-bar')) {
        document.addEventListener('scroll', function(){userScrolled = true;})
        navbarHeight = document.getElementById('mobile-nav-bar').clientHeight;
        navBars = [document.getElementById('mobile-nav-bar'), document.getElementById('nav-bar')];
        setInterval(function () {
            if (userScrolled) {
                hasScrolled();
                userScrolled = false;
            }
        }, 250);
    }

    stickybits('.sidebar', {stickyBitStickyOffset: 10, useStickyClasses: true});
})
// Hide/show Nav Bar with scroll
var userScrolled;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight;
var navBars;

function hasScrolled() {
    var scrollPos = window.pageYOffset;
    if (Math.abs(lastScrollTop - scrollPos) <= delta)
        return;
    if (scrollPos > lastScrollTop && scrollPos > navbarHeight){
        navBars.forEach(function(el){
            el.classList.add('nav-hidden');
        })
    } else {
        if(scrollPos + window.innerHeight < document.body.scrollHeight) {
            navBars.forEach(function(el){
                el.classList.remove('nav-hidden');
            })
        }
    }
    lastScrollTop = scrollPos;
}

var masonry;
var scrollHolder;
function ParallaxScroll(el) {
    this.parallaxValue = parseFloat(el.getAttribute('value')) || 0.5;
    this.element = el;
    this.offsetTop = el.offsetTop;
    this.height = el.clientHeight;
    this.scrolling = false;
    return this;
}

ParallaxScroll.prototype.moveObject = function (event) {
    if (!this.scrolling) {
        var newPos = (event.pageY - this.offsetTop);
        if (this.offsetTop < event.pageY + window.innerHeight && event.pageY < this.offsetTop + this.height) {
            this.element.style['background-position'] = '0px ' + -((newPos) * this.parallaxValue) + 'px';
        }
        this.scrolling = true;
    } else {
        this.scrolling = false;
    }
}

ParallaxScroll.prototype.setListener = function() {
    document.addEventListener('scroll', (e)=>this.moveObject(e));
}
ParallaxScroll.prototype.update = function() {
    this.height = this.element.clientHeight;
    this.offsetTop = this.element.offsetTop;
}

function ParallaxScrollHolder(selector) {
    this.elements = document.querySelectorAll(selector);
    this.scrollObjects = [];
}
ParallaxScrollHolder.prototype.start = function () {
    this.elements.forEach((el, i) => {
        this.scrollObjects[i] = new ParallaxScroll(el);
        this.scrollObjects[i].setListener();
    })
}
ParallaxScrollHolder.prototype.updateAll = function() {
    this.scrollObjects.forEach(function(el) {
        el.update();
    })
}

// Make JS so sidebars appear as you scroll down. Not like a breakpoint thing though.
// They should move into place as you scroll. In other words, their position is scroll dependent.
// Could do a thing with JS where you randomly selected points in SVG and colorize them on scroll