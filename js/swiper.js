function Slider(props) {
    const { slider, duration = 3000, vertical = false, auto = true, animate = true, page = null, parallax = false } = props;
    this.$slider = slider;
    this.duration = duration;
    this.vertical = vertical;
    this.auto = auto;
    this.animate = animate;
    this.$page = page;
    this.parallax = parallax;
    if (this.$page) {
        this.pageHeight = this.$page.height() || 800;
    }
    this.$itemWrapper = this.$slider.find('.item-list');
    this.$items = this.$slider.find('.item');
    this.$next = this.$slider.find('.next');
    this.$prev = this.$slider.find('.prev');
    this.$dots = this.$slider.find('.dot');
    this.length = this.$items.length;
    this.width = props.width || this.$slider.width();
    this.height = props.height || this.$slider.height();
    this.beforeChange = props.beforeChange || function () {};
    this.afterChange = props.afterChange || function () {};
    this.current = 0;
    this.locked = false;
}

Slider.prototype = {
    init() {
        this._setItem(this.vertical ? 'height' : 'width');
        this.autoChange();
        this._listen();
    },
    _listen() {
        this.$next.on('click', () => {
            if (!this.$next.hasClass('disabled')) {
                this.disabledAutoChange();
                this.next();
            }
        });
        this.$prev.on('click', () => {
            if (!this.$prev.hasClass('disabled')) {
                this.disabledAutoChange();
                this.prev();
            }
        });
        this.$dots.on('click', ev => {
            const $this = $(ev.currentTarget);
            const index = this.$dots.index($this);
            if (index !== this.current) {
                this._active($this.addClass('active'));
                this.current = index;
                this.change();
            }
        });
        if (this.parallax) {
            const $window = $(window);
            const $body = $(document.body);
            let ended = false;
            let delta = 0;
            let scrollHeight = 0;
            $body.on('mousewheel.parallax', (ev) => {
                const scrollTop = $window.scrollTop();
                const targetTop = this.$page.offset().top;
                if (scrollTop >= targetTop && scrollTop <= targetTop + this.pageHeight / 2) {
                    delta = -ev.originalEvent.wheelDelta || ev.originalEvent.detail;
                    if (!ended) {
                        ev.preventDefault();
                        ev.stopPropagation();
                    }
                    if (delta >= 0) {
                        scrollHeight += Math.abs(delta);
                        if (scrollHeight >= this.pageHeight / 2) {
                            scrollHeight = 0;
                            if (this.current < this.length - 1) {
                                this.current++;
                                this.change();
                            } else {
                                $body.off('mousewheel.parallax');
                                this.auto = true;
                                this.autoChange();
                                ended = true;
                            }
                        }
                    } else {
                        scrollHeight -= Math.abs(delta);
                        if (scrollHeight <= 0) {
                            scrollHeight = this.pageHeight;
                            if (this.current > 0) {
                                this.current--;
                                this.change();
                            } else {
                                $body.off('mousewheel.parallax');
                                this.auto = true;
                                this.autoChange();
                                ended = true;
                            }
                        }
                    }
                }
            });
        }
    },
    next() {
        this.current++;
        if (this.current > this.length - 1) {
            this.current = 0;
        }
        this.change();
    },
    prev() {
        this.current--;
        if (this.current < 0) {
            this.current = this.length - 1;
        }
        this.change();
    },
    change(id = this.current) {
        const property = this.vertical
            ? { top: -1 * this.height * this.current }
            : { left: -1 * this.width * this.current };
        this.locked = true;
        clearTimeout(this.timer);
        this.beforeChange(id);
        this._active(this.$dots.eq(id));
        this._changeBtnStatus();
        if (this.animate) {
            this.$itemWrapper.animate(property, () => {
                this.locked = false;
                this.afterChange(id);
                this.autoChange();
            });
        } else {
            this.$itemWrapper.css(property);
            this.locked = false;
            this.afterChange(id);
            this.autoChange();
        }
    },
    autoChange() {
        if (this.auto) {
            this.timer = setTimeout(() => {
                this.next();
            }, this.duration);
        }
    },
    disabledAutoChange() {
        this.auto = false;
        clearTimeout(this.timer);
    },
    _setItem(direction) {
        this.$slider.css({ width: this.width, height: this.height });
        this.$itemWrapper.css(direction, this[direction] * this.length);
        this.$items.css(direction, this[direction]);
    },
    _active(target) {
        target.addClass('active').siblings().removeClass('active');
    },
    _changeBtnStatus() {
        if (this.current === 0) {
            this.$prev.addClass('disabled');
            this.$next.removeClass('disabled');
        } else if (this.current === this.length -1) {
            this.$next.addClass('disabled');
            this.$prev.removeClass('disabled');
        } else {
            this.$prev.removeClass('disabled');
            this.$next.removeClass('disabled');
        }
    }
};

$(function () {
    const userSlider = new Slider({
        slider: $('.users'),
        duration: 8000
    });
    userSlider.init();
});