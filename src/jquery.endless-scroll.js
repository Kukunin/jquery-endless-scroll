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

			$(obj.options.scrollContainer).on("scroll.jes", $.proxy(function(event) {
				if ( this._tId ) { return; }

				this.scrollHandler(event);
				//Clean up mark
				this._tId= setTimeout($.proxy(function(){
					this._tId = null;
				},this), obj.options.scrollEventDelay);

			}, this));
		},
		scrollHandler: function(ev) {
		}
	}

	$.fn.endlessScroll = function(options) {

		//Initialize modules
		this.options = $.extend(true, {
			container: "#container",
			entity: ".entity",
			_modules: [ scrollModule ],
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
