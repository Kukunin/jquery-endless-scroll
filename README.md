jquery-endless-scroll
=====================

Implementation for infinity scroll using jQuery. It is unobtrusive, has module structure for easy setup and extending

Features
--------

* Unobtrusive
* SEO friendly
* Supports any modern browser, IE9+ (IE8 and lower doesn't support pushStates)
* Has module structure, easy to extend
* Support next/previous page dynamic loading
* Uses jQuery's global events (`$.on`, `$.off`, `$.trigger`)
* Requires jQuery 1.7+

Getting started
--------

**Before you can use this plugin, make sure you have fully working static pagination.**
For minimal configuration, you need to run:

```javascript
var endlessScroll = $.endlessScroll({
    container : ".container",
    entity: ".entity",
    nextPage: ".pagination a.next",
    previousPage: ".pagination a.before"
});
```

_Note: Pass only selector as option, not element itself. Plugin use selectors to find the similar nodes in newly loaded page_.
Use returned object `endlessScroll` to call API methods or subscribe on events.

Options
----------
`jquery-endless-scroll` supports several options:

* `container` - **Required**. Selector for container of entities. This object will be used to add new entities. _Default: "#container"_
* `entity` - **Required**. Selector for entity inside container. Don't include container selector here. _Default: ".entity"_
* `modules` - Array of custom modules. You can read about modules below. _Default: []_
* `scrollContainer` - Object to listen the onScroll event. _Default: window_
* `scrollPadding` - Distance before the end of scroll to fire the next/prev page event. _Default: 100_
* `scrollEventDelay` - Interval between processing scroll events. Higher value - lesser load for visitor's browser, but bigger lag and vice versa. _Default: 300_
* `nextPage` - Selector for next page link. _Default: ".pagination a[rel=next]"_
* `previousPage` - Selector for previous page link. _Default: ".pagination a[rel=previous]"_

API
-------------

Returned object from `$.endlessScroll` method is used to call API methods. Internally, the plugin consists of several modules, so don't be confused to call specific module before API call. So, plugin has the further API methods:

* `endlessScroll.scrollModule.bind()` - set handler for scroll events
* `endlessScroll.scrollModule.unbind()` - remove handler from scroll events
* `endlessScroll.ajaxModule.loadPage(url, placement, callback)` - use this method to load next bunch of entities directly. Internally, this method are called on corresponding scroll events. Arguments:
 * `url` - the url of next page, used in AJAX call
 * `placement` - "top" or "bottom"
 * `callback(data)` - called, when page is loaded. jQueyr object, created from page's HTML will be passed as argument


Events
---------

Plugin supports a bunch of events. You can add listeners directly on your container object _(e.g. `$("#container")`)_ or on `endlessScroll.container` object (they are the same objects).

* `jes:topThreshold` - Fired, when visitor reaches the begin of container. Used to load previous page
* `jes:bottomThreshold` - Fired, when visitor reaches the end of container. Used to load next page
* `jes:scrollToPage` - Fired, when visitor scroll entities to specific page. Used to change URL in address bar on scrolling
* `jes:beforePageLoad(url, placement)` - Fired immediately before AJAX call to next page. Arguments are URL of the call and placement ("top" or "bottom")
* `jes:afterPageLoad(url, placement, data, entities)` - Fired after AJAX call is made and entities are placed to page. Arguments:
 * `url` - the url of next page, used in AJAX call
 * `placement` - "top" or "bottom"
 * `data` - jQuery object, created from new page's HTML
 * `entities` - list of newly added entities


Development
----------

I've created this plugin for one project, and it is fully working there. However, I haven't tested it well in other situations. Feel free to open issue, describe the environment and I'll fix the plugin for you ASAP (just several day). Also, feel free to fork and improve it youself. Don't forget to send pull requests back to me. Thanks you!
