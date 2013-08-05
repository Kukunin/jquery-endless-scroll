/**
 * Author: Sergey Kukunin
 * See: https://github.com/Kukunin/jquery-endless-scroll
 */
(function($) {

	//Declaration of modules
	var scrollModule = {
		init: function(options, obj) {
			obj.options = $.extend({
				scrollContainer: window,
				scrollPadding: 100,
				scrollEventDelay: 300
			}, options);
			this.options = obj.options;
			obj.scrollModule = this;

			this.bind();
		},
		bind: function() {
			$(this.options.scrollContainer).on("scroll.jes", $.proxy(function(event) {
				if ( this._tId ) { return; }

				this.scrollHandler(event);
				//Clean up mark
				this._tId= setTimeout($.proxy(function(){
					this._tId = null;
				},this), this.options.scrollEventDelay);

			}, this));
		},
		unbind: function() {
			$(this.options.scrollContainer).off("scroll.jes");
		},
		scrollHandler: function(ev) {
			var $scrollable = $(ev.currentTarget),
				$entities = $(this.options.entity, this.options.container),
				$firstEntity = $entities.first(),
				$lastEntity = $entities.last();

			var scrollTop = $scrollable.scrollTop(),
				height = $scrollable.height(),
				scrollBottom = scrollTop + height;

			var topEntityPosition = $firstEntity.position().top,
				topTarget = topEntityPosition + this.options.scrollPadding,
				bottomEntityPosition = $lastEntity.outerHeight() + $lastEntity.position().top,
				bottomTarget = bottomEntityPosition - this.options.scrollPadding;

			if ( scrollBottom > bottomTarget ) {
				$(this.options.container).trigger("jes:bottomThreshold");
			} else if ( scrollTop < topTarget ) {
				$(this.options.container).trigger("jes:topThreshold");
			}
		}
	}

	var ajaxModule = {
		init: function(options, obj) {
			obj.options = $.extend({
			}, options);

			this.options = obj.options;
			obj.ajaxModule = this;
		},
		loadPage: function(url, placement) {
			//The hash with methods list
			//depends from placement
			var actions = {
					top: {
						find: 'first',
						inject: 'insertBefore'
					},
					bottom: {
						find: 'last',
						inject: 'insertAfter'
					}
				},
				action = actions[placement];

			//Make AJAX query
			$.get(url, null, $.proxy(function (data) {
			var containerSelector = this.options.container,
				container = $(containerSelector, data).first();

				if ( !container.length ) {
					// if the element is a root element, try to filter it
					container = $(data).filter(containerSelector).first();
				}

				if ( container.length ) {
					//Find the cursor
					var cursor = $(this.options.entity, containerSelector)[action.find]();
					//Find and insert entities
					container.find(this.options.entity)[action.inject](cursor);
				}
			}, this), 'html');
		}
	}

	$.fn.endlessScroll = function(options) {

		//Initialize modules
		this.options = $.extend(true, {
			container: "#container",
			entity: ".entity",
			_modules: [ scrollModule, ajaxModule ],
			modules: []
		}, options);


		//Merge custom options with default
		$.merge(this.options.modules, this.options._modules);
		//Init modules
		this.options.modules.forEach($.proxy(function(module) {
			module.init(this.options, this);
		},this));


		return this;
	}

})(jQuery);
