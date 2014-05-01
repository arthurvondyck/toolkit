/**
 * @copyright   2010-2014, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

Toolkit.Drop = Toolkit.Component.extend(function(nodes, options) {
    this.component = 'Drop';
    this.version = '1.4.0';
    this.options = this.setOptions(options);

    // Last opened drop menu
    this.element = null;

    // Nodes found in the page on initialization
    this.nodes = $(nodes);

    // Last node to open a menu
    this.node = null;

    // Initialize events
    this.events = {
        'clickout document .@drop': 'hide',
        'clickout document {selector}': 'hide',
        '{mode} document {selector}': 'onShow'
    };

    this.initialize();
}, {

    /**
     * Hide the opened element and remove active state.
     */
    hide: function() {
        var element = this.element;

        if (element && element.is(':shown')) {
            element.conceal();

            this.node
                .aria('toggled', false)
                .removeClass('is-active');

            this.fireEvent('hide', [element, this.node]);
        }
    },

    /**
     * Open the target element and apply active state.
     *
     * @param {jQuery} node
     */
    show: function(node) {
        this.element.reveal();

        this.node = node = $(node)
            .aria('toggled', true)
            .addClass('is-active');

        this.fireEvent('show', [this.element, node]);
    },

    /**
     * When a node is clicked, grab the target from the attribute.
     * Validate the target element, then either display or hide.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onShow: function(e) {
        e.preventDefault();

        var node = $(e.currentTarget),
            options = this.options,
            target = this.readValue(node, options.getTarget);

        if (!target || target.substr(0, 1) !== '#') {
            return;
        }

        // Hide previous drops
        if (options.hideOpened && this.node && !this.node.is(node)) {
            this.hide();
        }

        this.element = $(target);
        this.node = node;

        if (!this.element.is(':shown')) {
            this.show(node);
        } else {
            this.hide();
        }
    }

}, {
    mode: 'click',
    getTarget: 'data-drop',
    hideOpened: true
});

Toolkit.create('drop', function(options) {
    return new Toolkit.Drop(this, options);
}, true);