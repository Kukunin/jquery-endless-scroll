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

			$(obj.options.scrollContainer).on("scroll.jes", $.proxy(function() {
				this.throttle(this.scrollHandler, obj.options.scrollEventDelay);
			}, this));
		},
		throttle: function(method, delay) {
			if ( method._tId ) { return; }

			method();
			//Clean up mark
			method._tId= setTimeout(function(){
				method._tId = null;
			}, delay);
		},
		scrollHandler: function() {
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
