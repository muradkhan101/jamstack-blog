document.addEventListener("DOMContentLoaded", function() {

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

    stickyObj = new StickyManager('.sidebar-title', '.sidebar');
    stickyObj.start();
    stickyObj.setEfficientListener();

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

    // stickybits('.sidebar', {stickyBitStickyOffset: 10, useStickyClasses: true});
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

var stickyObj;
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

ParallaxScroll.prototype.moveObject = function () {
    var newPos = (window.pageYOffset - this.offsetTop);
    if (this.offsetTop < window.pageYOffset + window.innerHeight && window.pageYOffset < this.offsetTop + this.height) {
        this.element.style['background-position'] = `0px ${-((newPos) * this.parallaxValue)}px`;
    }
}

ParallaxScroll.prototype.setListener = function() {
    window.addEventListener('scroll', () => {
        if (!this.scrolling) {
            window.requestAnimationFrame(() => {
                this.moveObject();
                this.scrolling = false;
            })
        }
        this.scrolling = true;
    })
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

function StickyAppear(el, parent, side) {
    this.element = el;
    this.offsetTopInitial = el.offsetTop;
    this.parent = this.element.parentElement;
    this.side = side;
    return this;
}

StickyAppear.prototype.updatePosition = function () {
    var pageY = window.pageYOffset;
    var windowH = window.innerHeight;
    var sidebarContainer = this.parent.children[this.parent.children.length-1];
    if (pageY + windowH > this.parent.offsetTop + 80 && !(pageY + 20 > this.parent.offsetTop)) {
        this.element.style.position = 'relative';
        sidebarContainer.style.top = '0px';
        this.element.style.top = '0px';
        var scaled = (-(pageY + windowH/2 - this.offsetTopInitial)/(250));
        this.element.style.transform = `translateX(${this.side}${Math.max(Math.round(scaled*100), 0)}%)`;
        sidebarContainer.style.top = `${this.element.offsetTop-pageY+this.element.offsetHeight}px`;
        if (this.parent.classList.contains('is-sticky')) this.parent.classList.remove('is-sticky');
        if (this.parent.classList.contains('hoverable')) this.parent.classList.remove('hoverable');
    } else if (pageY > this.parent.offsetTop) {
        this.element.style.top = `${Math.min(Math.round(pageY-this.parent.offsetTop), 20)}px`;
        this.element.style.position = 'fixed';
        this.element.style.transform = 'translateX(0%)';
        sidebarContainer.style.top = `${parseInt(this.element.style.top)+this.element.clientHeight}px`;
        if (!this.parent.classList.contains('is-sticky')) this.parent.classList.add('is-sticky');
    }
    if (!this.parent.classList.contains('hoverable') && this.element.style.transform.indexOf('(0%)') > -1) this.parent.classList.add('hoverable');
}

function StickyManager(selector, relativeSelector) {
    this.elements = document.querySelectorAll(selector);
    if (this.elements[0] === undefined) throw('No selectors found');
    if (document.querySelector(relativeSelector) === undefined) throw('Relative element not found');
    this.relativeSelector = relativeSelector;
    this.ticking = false;
    this.holder = [];
}

StickyManager.prototype.start = function () {
    this.elements.forEach((el, i) => {
        var side = (el.parentElement.classList.value.indexOf('right') > -1) ? '' : '-';
        this.holder[i] = new StickyAppear(el, this.relativeSelector, side);
    });
}

StickyManager.prototype.setEfficientListener = function() {
    window.addEventListener('scroll', () => {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.holder.forEach(e => e.updatePosition());
                this.ticking = false;
            })
        }
        this.ticking = true;
    })
}