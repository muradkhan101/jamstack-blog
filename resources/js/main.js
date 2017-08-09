document.addEventListener("DOMContentLoaded", function() {
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
    window.addEventListener('resize', scrollHolder.updateAll);
})
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

document.getElementById('burger-holder').addEventListener('click', function() {
    document.getElementById('mobile-nav-bar').classList.toggle('is-open');
})

// Make JS so sidebars appear as you scroll down. Not like a breakpoint thing though.
// They should move into place as you scroll. In other words, their position is scroll dependent.
// Could do a thing with JS where you randomly selected points in SVG and colorize them on scroll