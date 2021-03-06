/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    './component',
    '../extensions/throttle'
], function($, Toolkit) {

Toolkit.LazyLoad = Toolkit.Component.extend({
    name: 'LazyLoad',
    version: '2.0.0',

    /** Container to monitor scroll events on. */
    container: $(window),

    /** How many items have been loaded. */
    loaded: 0,

    /** Force load all timer. */
    timer: null,

    /**
     * Initialize the lazy load.
     *
     * @param {jQuery} container
     * @param {Object} [options]
     */
    constructor: function(container, options) {
        container = $(container);

        this.options = options = this.setOptions(options, container);
        this.elements = container.find(this.options.lazyClass);

        if (container.css('overflow') === 'auto') {
            this.container = container;
        }

        var callback = $.throttle(this.load.bind(this), options.throttle);

        // Set events
        this.addEvents([
            ['scroll', 'container', callback],
            ['resize', 'window', callback],
            ['ready', 'document', 'onReady']
        ]);

        this.initialize();
    },

    /**
     * Load all images when destroying.
     */
    destructor: function() {
        clearTimeout(this.timer);
        this.loadAll();
    },

    /**
     * Verify that the element is within the current browser viewport.
     *
     * @param {jQuery} node
     * @returns {bool}
     */
    inViewport: function(node) {
        node = $(node);

        var container = this.container,
            threshold = this.options.threshold,
            conHeight = container.height(),
            conWidth = container.width(),
            scrollTop = container.scrollTop(),
            scrollLeft = container.scrollLeft(),
            nodeOffset = node.offset(),
            left = nodeOffset.left,
            top = nodeOffset.top;

        // Re-adjust the offset to match the parent container
        // is() fails when checking against window
        if (container[0] !== window) {
            var conOffset = container.offset();

            left -= conOffset.left;
            top -= conOffset.top;
        }

        return (
            // Element is not hidden
            node.is(':visible') &&
            // Below the top
            (top >= (scrollTop - threshold)) &&
            // Above the bottom
            (top <= (scrollTop + conHeight + threshold)) &&
            // Right of the left
            (left >= (scrollLeft - threshold)) &&
            // Left of the right
            (left <= (scrollLeft + conWidth + threshold))
        );
    },

    /**
     * Loop over the lazy loaded elements and verify they are within the viewport.
     */
    load: function() {
        if (this.loaded >= this.elements.length) {
            this.shutdown();
            return;
        }

        this.fireEvent('loading');

        this.elements.each(function(index, node) {
            if (node && this.inViewport(node)) {
                this.show(node, index);
            }
        }.bind(this));

        this.fireEvent('loaded');
    },

    /**
     * Load the remaining hidden elements and remove any container events.
     */
    loadAll: function() {
        if (this.loaded >= this.elements.length) {
            return;
        }

        this.fireEvent('loadAll');

        this.elements.each(function(index, node) {
            this.show(node, index);
        }.bind(this));
    },

    /**
     * Show the element by removing the lazy load class.
     *
     * @param {jQuery} node
     * @param {Number} index
     */
    show: function(node, index) {
        node = $(node);

        this.fireEvent('showing', [node]);

        node.removeClass(this.options.lazyClass.substr(1));

        // Set the element being loaded for events
        this.element = node;

        // Replace src attributes on images
        node.find('img').each(function() {
            var image = $(this), src;

            if (Toolkit.isRetina) {
                src = image.data('src-retina');
            }

            if (!src) {
                src = image.data('src');
            }

            if (src) {
                image.attr('src', src);
            }
        });

        // Replace element with null since removing from the array causes it to break
        this.elements.splice(index, 1, null);
        this.loaded++;

        this.fireEvent('shown', [node]);
    },

    /**
     * When triggered, will shutdown the instance from executing any longer.
     * Any container events will be removed and loading will cease.
     */
    shutdown: function() {
        if (this.enabled) {
            this.disable();
            this.fireEvent('shutdown');
        }
    },

    /**
     * Event handler triggered on DOM ready.
     *
     * @private
     */
    onReady: function() {
        this.load();

        // Set force load on DOM ready
        if (this.options.forceLoad) {
            this.timer = setTimeout(this.loadAll.bind(this), this.options.delay);
        }
    }

}, {
    forceLoad: false,
    delay: 10000,
    threshold: 150,
    throttle: 50,
    lazyClass: '.lazy-load'
});

Toolkit.create('lazyLoad', function(options) {
    return new Toolkit.LazyLoad(this, options);
});

return Toolkit;
});