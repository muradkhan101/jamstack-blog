//Masonry initialization
document.addEventListener("DOMContentLoaded", function() {
    var masonry = new Masonry('.home-masonry-grid', {
        itemSelector: ".grid-item",
        columnWidth: ".grid-sizer",
        percentPosition: "true",
        gutter: 10
    })

    masonry.layout();
})

var pScroll = [];

function ParallaxScroll(el) {
    this.parallaxValue = parseFloat(el.getAttribute('value')) || 0.5;
    this.element = el;
    this.offsetTop = el.offsetTop;
    this.height = el.clientHeight;
    return this;
}

ParallaxScroll.prototype.moveObject = function (event) {
    var newPos = (event.pageY-this.offsetTop);
    if (newPos > -10 && event.pageY < this.offsetTop + this.height+10) {
        this.element.style['background-position'] = '0px ' + -((newPos)*this.parallaxValue) + 'px';
    }
}

ParallaxScroll.prototype.setListener = function() {
    document.addEventListener('scroll', (e)=>this.moveObject(e));
}

document.querySelectorAll('.parallax').forEach(function(el, i) {
    pScrolls[i] = new ParallaxScroll(el);
    pScrolls[i].setListener();
})
//Could add container class to start scroll with could let you choose the name for your selector