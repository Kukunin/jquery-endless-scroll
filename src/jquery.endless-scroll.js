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

			this._toplock = true;
			this._bottomlock = true;
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

			//Don't trigger event again, if already fired
			//Visitor have to leave the area and get back to fire event again
			//Process top threshold
			if ( scrollTop < topTarget ) {
				if ( !this._toplock ) {
					$(this.options.container).trigger("jes:topThreshold");
					this._toplock = true;
				}
			} else {
				this._toplock = false;
			}

			//Process bottom threshold
			if ( scrollBottom > bottomTarget ) {
				if ( !this._bottomlock ) {
					$(this.options.container).trigger("jes:bottomThreshold");
					this._bottomlock = true;
				}
			} else {
				this._bottomlock = false;
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
		loadPage: function(url, placement, callback) {
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
			$.get(url, null, $.proxy(function (_data) {
				var data = $("<div>").html(_data),
				containerSelector = this.options.container,
				container = $(containerSelector, data).first();

				if ( container.length ) {
					//Find the cursor
					var cursor = $(this.options.entity, containerSelector)[action.find]();
					//Find and insert entities
					container.find(this.options.entity)[action.inject](cursor);
				}

				if ( $.isFunction(callback) ) {
					callback(data);
				}
			}, this), 'html');
		}
	}

	var navigationModule = {
		init: function(options, obj) {
			obj.options = $.extend({
				nextPage: ".pagination a[rel=next]",
				previousPage: ".pagination a[rel=previous]"
			}, options);

			this.options = obj.options;

			$.each([{
				selector: this.options.nextPage,
				event: "jes:bottomThreshold.navigation",
				placement: 'bottom'
			}, {
				selector: this.options.previousPage,
				event: "jes:topThreshold.navigation",
				placement: 'top'
			}], $.proxy(function(i, v) {
				v.element = $(v.selector);
				if ( v.element.length ) {
					var url = v.element.prop("href"),
					lock = false;
					v.element.remove();

					$(this.options.container).on(v.event, function() {
						//this object is container
						if ( lock || !url ) return;

						lock = true;
						obj.ajaxModule.loadPage(url, v.placement, $.proxy(function( data ) {
							//Search new next link
							var newElement = $(v.selector, $(data));
							if ( newElement.length ) {
								//Update URL and remove lock
								lock = false;
								url = newElement.prop("href");
							} else {
								//Remove event at all
								$(this).off(v.event);
							}
						}, this));
					});
				}
			},this));
		}
	}

	$.fn.endlessScroll = function(options) {

		//Initialize modules
		this.options = $.extend(true, {
			container: "#container",
			entity: ".entity",
			_modules: [ scrollModule, ajaxModule, navigationModule ],
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
