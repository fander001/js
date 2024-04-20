//=============================================================================
// rpg_core.js v1.6.1
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * This is not a class, but contains some methods that will be added to the
 * standard Javascript objects.
 *
 * @class JsExtensions
 */
function JsExtensions() {
    throw new Error('This is not a class');
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * @method Number.prototype.clamp
 * @param {Number} min The lower boundary
 * @param {Number} max The upper boundary
 * @return {Number} A number in the range (min, max)
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

/**
 * Returns a modulo value which is always positive.
 *
 * @method Number.prototype.mod
 * @param {Number} n The divisor
 * @return {Number} A modulo value
 */
Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};

/**
 * Replaces %1, %2 and so on in the string to the arguments.
 *
 * @method String.prototype.format
 * @param {Any} ...args The objects to format
 * @return {String} A formatted string
 */
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/%([0-9]+)/g, function(s, n) {
        return args[Number(n) - 1];
    });
};

/**
 * Makes a number string with leading zeros.
 *
 * @method String.prototype.padZero
 * @param {Number} length The length of the output string
 * @return {String} A string with leading zeros
 */
String.prototype.padZero = function(length){
    var s = this;
    while (s.length < length) {
        s = '0' + s;
    }
    return s;
};

/**
 * Makes a number string with leading zeros.
 *
 * @method Number.prototype.padZero
 * @param {Number} length The length of the output string
 * @return {String} A string with leading zeros
 */
Number.prototype.padZero = function(length){
    return String(this).padZero(length);
};

Object.defineProperties(Array.prototype, {
    /**
     * Checks whether the two arrays are same.
     *
     * @method Array.prototype.equals
     * @param {Array} array The array to compare to
     * @return {Boolean} True if the two arrays are same
     */
    equals: {
        enumerable: false,
        value: function(array) {
            if (!array || this.length !== array.length) {
                return false;
            }
            for (var i = 0; i < this.length; i++) {
                if (this[i] instanceof Array && array[i] instanceof Array) {
                    if (!this[i].equals(array[i])) {
                        return false;
                    }
                } else if (this[i] !== array[i]) {
                    return false;
                }
            }
            return true;
        }
    },
    /**
     * Makes a shallow copy of the array.
     *
     * @method Array.prototype.clone
     * @return {Array} A shallow copy of the array
     */
    clone: {
        enumerable: false,
        value: function() {
            return this.slice(0);
        }
    },
    /**
     * Checks whether the array contains a given element.
     *
     * @method Array.prototype.contains
     * @param {Any} element The element to search for
     * @return {Boolean} True if the array contains a given element
     */
    contains : {
        enumerable: false,
        value: function(element) {
            return this.indexOf(element) >= 0;
        }
    }
});

/**
 * Checks whether the string contains a given string.
 *
 * @method String.prototype.contains
 * @param {String} string The string to search for
 * @return {Boolean} True if the string contains a given string
 */
String.prototype.contains = function(string) {
    return this.indexOf(string) >= 0;
};

/**
 * Generates a random integer in the range (0, max-1).
 *
 * @static
 * @method Math.randomInt
 * @param {Number} max The upper boundary (excluded)
 * @return {Number} A random integer
 */
Math.randomInt = function(max) {
    return Math.floor(max * Math.random());
};

//-----------------------------------------------------------------------------
/**
 * The static class that defines utility methods.
 *
 * @class Utils
 */
function Utils() {
    throw new Error('This is a static class');
}

/**
 * The name of the RPG Maker. 'MV' in the current version.
 *
 * @static
 * @property RPGMAKER_NAME
 * @type String
 * @final
 */
Utils.RPGMAKER_NAME = 'MV';

/**
 * The version of the RPG Maker.
 *
 * @static
 * @property RPGMAKER_VERSION
 * @type String
 * @final
 */
Utils.RPGMAKER_VERSION = "1.6.1";

/**
 * Checks whether the option is in the query string.
 *
 * @static
 * @method isOptionValid
 * @param {String} name The option name
 * @return {Boolean} True if the option is in the query string
 */
Utils.isOptionValid = function(name) {
    if (location.search.slice(1).split('&').contains(name)) {return 1;};
    if (typeof nw !== "undefined" && nw.App.argv.length > 0 && nw.App.argv[0].split('&').contains(name)) {return 1;};
    return 0;
};

/**
 * Checks whether the platform is NW.js.
 *
 * @static
 * @method isNwjs
 * @return {Boolean} True if the platform is NW.js
 */
Utils.isNwjs = function() {
    return typeof require === 'function' && typeof process === 'object';
};

/**
 * Checks whether the platform is a mobile device.
 *
 * @static
 * @method isMobileDevice
 * @return {Boolean} True if the platform is a mobile device
 */
Utils.isMobileDevice = function() {
    var r = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return !!navigator.userAgent.match(r);
};

/**
 * Checks whether the browser is Mobile Safari.
 *
 * @static
 * @method isMobileSafari
 * @return {Boolean} True if the browser is Mobile Safari
 */
Utils.isMobileSafari = function() {
    var agent = navigator.userAgent;
    return !!(agent.match(/iPhone|iPad|iPod/) && agent.match(/AppleWebKit/) &&
              !agent.match('CriOS'));
};

/**
 * Checks whether the browser is Android Chrome.
 *
 * @static
 * @method isAndroidChrome
 * @return {Boolean} True if the browser is Android Chrome
 */
Utils.isAndroidChrome = function() {
    var agent = navigator.userAgent;
    return !!(agent.match(/Android/) && agent.match(/Chrome/));
};

/**
 * Checks whether the browser can read files in the game folder.
 *
 * @static
 * @method canReadGameFiles
 * @return {Boolean} True if the browser can read files in the game folder
 */
Utils.canReadGameFiles = function() {
    var scripts = document.getElementsByTagName('script');
    var lastScript = scripts[scripts.length - 1];
    var xhr = new XMLHttpRequest();
    try {
        xhr.open('GET', lastScript.src);
        xhr.overrideMimeType('text/javascript');
        xhr.send();
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Makes a CSS color string from RGB values.
 *
 * @static
 * @method rgbToCssColor
 * @param {Number} r The red value in the range (0, 255)
 * @param {Number} g The green value in the range (0, 255)
 * @param {Number} b The blue value in the range (0, 255)
 * @return {String} CSS color string
 */
Utils.rgbToCssColor = function(r, g, b) {
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
};

Utils._id = 1;
Utils.generateRuntimeId = function(){
    return Utils._id++;
};

Utils._supportPassiveEvent = null;
/**
 * Test this browser support passive event feature
 * 
 * @static
 * @method isSupportPassiveEvent
 * @return {Boolean} this browser support passive event or not
 */
Utils.isSupportPassiveEvent = function() {
    if (typeof Utils._supportPassiveEvent === "boolean") {
        return Utils._supportPassiveEvent;
    }
    // test support passive event
    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
    var passive = false;
    var options = Object.defineProperty({}, "passive", {
        get: function() { passive = true; }
    });
    window.addEventListener("test", null, options);
    Utils._supportPassiveEvent = passive;
    return passive;
}

//-----------------------------------------------------------------------------
/**
 * The resource class. Allows to be collected as a garbage if not use for some time or ticks
 *
 * @class CacheEntry
 * @constructor
 * @param {ResourceManager} resource manager
 * @param {string} key, url of the resource
 * @param {string} item - Bitmap, HTML5Audio, WebAudio - whatever you want to store in the cache
 */
function CacheEntry(cache, key, item) {
    this.cache = cache;
    this.key = key;
    this.item = item;
    this.cached = false;
    this.touchTicks = 0;
    this.touchSeconds = 0;
    this.ttlTicks = 0;
    this.ttlSeconds = 0;
    this.freedByTTL = false;
}

/**
 * frees the resource
 */
CacheEntry.prototype.free = function (byTTL) {
    this.freedByTTL = byTTL || false;
    if (this.cached) {
        this.cached = false;
        delete this.cache._inner[this.key];
    }
};

/**
 * Allocates the resource
 * @returns {CacheEntry}
 */
CacheEntry.prototype.allocate = function () {
    if (!this.cached) {
        this.cache._inner[this.key] = this;
        this.cached = true;
    }
    this.touch();
    return this;
};

/**
 * Sets the time to live
 * @param {number} ticks TTL in ticks, 0 if not set
 * @param {number} time TTL in seconds, 0 if not set
 * @returns {CacheEntry}
 */
CacheEntry.prototype.setTimeToLive = function (ticks, seconds) {
    this.ttlTicks = ticks || 0;
    this.ttlSeconds = seconds || 0;
    return this;
};

CacheEntry.prototype.isStillAlive = function () {
    var cache = this.cache;
    return ((this.ttlTicks == 0) || (this.touchTicks + this.ttlTicks < cache.updateTicks )) &&
        ((this.ttlSeconds == 0) || (this.touchSeconds + this.ttlSeconds < cache.updateSeconds ));
};

/**
 * makes sure that resource wont freed by Time To Live
 * if resource was already freed by TTL, put it in cache again
 */
CacheEntry.prototype.touch = function () {
    var cache = this.cache;
    if (this.cached) {
        this.touchTicks = cache.updateTicks;
        this.touchSeconds = cache.updateSeconds;
    } else if (this.freedByTTL) {
        this.freedByTTL = false;
        if (!cache._inner[this.key]) {
            cache._inner[this.key] = this;
        }
    }
};

/**
 * Cache for images, audio, or any other kind of resource
 * @param manager
 * @constructor
 */
function CacheMap(manager) {
    this.manager = manager;
    this._inner = {};
    this._lastRemovedEntries = {};
    this.updateTicks = 0;
    this.lastCheckTTL = 0;
    this.delayCheckTTL = 100.0;
    this.updateSeconds = Date.now();
}

/**
 * checks ttl of all elements and removes dead ones
 */
CacheMap.prototype.checkTTL = function () {
    var cache = this._inner;
    var temp = this._lastRemovedEntries;
    if (!temp) {
        temp = [];
        this._lastRemovedEntries = temp;
    }
    for (var key in cache) {
        var entry = cache[key];
        if (!entry.isStillAlive()) {
            temp.push(entry);
        }
    }
    for (var i = 0; i < temp.length; i++) {
        temp[i].free(true);
    }
    temp.length = 0;
};

/**
 * cache item
 * @param key url of cache element
 * @returns {*|null}
 */
CacheMap.prototype.getItem = function (key) {
    var entry = this._inner[key];
    if (entry) {
        return entry.item;
    }
    return null;
};

CacheMap.prototype.clear = function () {
    var keys = Object.keys(this._inner);
    for (var i = 0; i < keys.length; i++) {
        this._inner[keys[i]].free();
    }
};

CacheMap.prototype.setItem = function (key, item) {
    return new CacheEntry(this, key, item).allocate();
};

CacheMap.prototype.update = function(ticks, delta) {
    this.updateTicks += ticks;
    this.updateSeconds += delta;
    if (this.updateSeconds >= this.delayCheckTTL + this.lastCheckTTL) {
        this.lastCheckTTL = this.updateSeconds;
        this.checkTTL();
    }
};

function ImageCache(){
    this.initialize.apply(this, arguments);
}

ImageCache.limit = 10 * 1000 * 1000;

ImageCache.prototype.initialize = function(){
    this._items = {};
};

ImageCache.prototype.add = function(key, value){
    this._items[key] = {
        bitmap: value,
        touch: Date.now(),
        key: key
    };

    this._truncateCache();
};

ImageCache.prototype.get = function(key){
    if(this._items[key]){
        var item = this._items[key];
        item.touch = Date.now();
        return item.bitmap;
    }

    return null;
};

ImageCache.prototype.reserve = function(key, value, reservationId){
    if(!this._items[key]){
        this._items[key] = {
            bitmap: value,
            touch: Date.now(),
            key: key
        };
    }

    this._items[key].reservationId = reservationId;
};

ImageCache.prototype.releaseReservation = function(reservationId){
    var items = this._items;

    Object.keys(items)
        .map(function(key){return items[key];})
        .forEach(function(item){
            if(item.reservationId === reservationId){
                delete item.reservationId;
            }
        });
};

ImageCache.prototype._truncateCache = function(){
    var items = this._items;
    var sizeLeft = ImageCache.limit;

    Object.keys(items).map(function(key){
        return items[key];
    }).sort(function(a, b){
        return b.touch - a.touch;
    }).forEach(function(item){
        if(sizeLeft > 0 || this._mustBeHeld(item)){
            var bitmap = item.bitmap;
            sizeLeft -= bitmap.width * bitmap.height;
        }else{
            delete items[item.key];
        }
    }.bind(this));
};

ImageCache.prototype._mustBeHeld = function(item){
    // request only is weak so It's purgeable
    if(item.bitmap.isRequestOnly()) return false;
    // reserved item must be held
    if(item.reservationId) return true;
    // not ready bitmap must be held (because of checking isReady())
    if(!item.bitmap.isReady()) return true;
    // then the item may purgeable
    return false;
};

ImageCache.prototype.isReady = function(){
    var items = this._items;
    return !Object.keys(items).some(function(key){
        return !items[key].bitmap.isRequestOnly() && !items[key].bitmap.isReady();
    });
};

ImageCache.prototype.getErrorBitmap = function(){
    var items = this._items;
    var bitmap = null;
    if(Object.keys(items).some(function(key){
            if(items[key].bitmap.isError()){
                bitmap = items[key].bitmap;
                return true;
            }
            return false;
        })) {
        return bitmap;
    }

    return null;
};
function RequestQueue(){
    this.initialize.apply(this, arguments);
}

RequestQueue.prototype.initialize = function(){
    this._queue = [];
};

RequestQueue.prototype.enqueue = function(key, value){
    this._queue.push({
        key: key,
        value: value,
    });
};

RequestQueue.prototype.update = function(){
    if(this._queue.length === 0) return;

    var top = this._queue[0];
    if(top.value.isRequestReady()){
        this._queue.shift();
        if(this._queue.length !== 0){
            this._queue[0].value.startRequest();
        }
    }else{
        top.value.startRequest();
    }
};

RequestQueue.prototype.raisePriority = function(key){
    for(var n = 0; n < this._queue.length; n++){
        var item = this._queue[n];
        if(item.key === key){
            this._queue.splice(n, 1);
            this._queue.unshift(item);
            break;
        }
    }
};

RequestQueue.prototype.clear = function(){
    this._queue.splice(0);
};
//-----------------------------------------------------------------------------
/**
 * The point class.
 *
 * @class Point
 * @constructor
 * @param {Number} x The x coordinate
 * @param {Number} y The y coordinate
 */
function Point() {
    this.initialize.apply(this, arguments);
}

Point.prototype = Object.create(PIXI.Point.prototype);
Point.prototype.constructor = Point;

Point.prototype.initialize = function(x, y) {
    PIXI.Point.call(this, x, y);
};

/**
 * The x coordinate.
 *
 * @property x
 * @type Number
 */

/**
 * The y coordinate.
 *
 * @property y
 * @type Number
 */

//-----------------------------------------------------------------------------
/**
 * The rectangle class.
 *
 * @class Rectangle
 * @constructor
 * @param {Number} x The x coordinate for the upper-left corner
 * @param {Number} y The y coordinate for the upper-left corner
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 */
function Rectangle() {
    this.initialize.apply(this, arguments);
}

Rectangle.prototype = Object.create(PIXI.Rectangle.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.initialize = function(x, y, width, height) {
    PIXI.Rectangle.call(this, x, y, width, height);
};

/**
 * @static
 * @property emptyRectangle
 * @type Rectangle
 * @private
 */
Rectangle.emptyRectangle = new Rectangle(0, 0, 0, 0);

/**
 * The x coordinate for the upper-left corner.
 *
 * @property x
 * @type Number
 */

/**
 * The y coordinate for the upper-left corner.
 *
 * @property y
 * @type Number
 */

/**
 * The width of the rectangle.
 *
 * @property width
 * @type Number
 */

/**
 * The height of the rectangle.
 *
 * @property height
 * @type Number
 */

//-----------------------------------------------------------------------------
/**
 * The basic object that represents an image.
 *
 * @class Bitmap
 * @constructor
 * @param {Number} width The width of the bitmap
 * @param {Number} height The height of the bitmap
 */
function Bitmap() {
    this.initialize.apply(this, arguments);
}

//for iOS. img consumes memory. so reuse it.
Bitmap._reuseImages = [];


/**
 * Bitmap states(Bitmap._loadingState):
 *
 * none:
 * Empty Bitmap
 *
 * pending:
 * Url requested, but pending to load until startRequest called
 *
 * purged:
 * Url request completed and purged.
 *
 * requesting:
 * Requesting supplied URI now.
 *
 * requestCompleted:
 * Request completed
 *
 * decrypting:
 * requesting encrypted data from supplied URI or decrypting it.
 *
 * decryptCompleted:
 * Decrypt completed
 *
 * loaded:
 * loaded. isReady() === true, so It's usable.
 *
 * error:
 * error occurred
 *
 */


Bitmap.prototype._createCanvas = function(width, height){
    this.__canvas = this.__canvas || document.createElement('canvas');
    this.__context = this.__canvas.getContext('2d');

    this.__canvas.width = Math.max(width || 0, 1);
    this.__canvas.height = Math.max(height || 0, 1);

    if(this._image){
        var w = Math.max(this._image.width || 0, 1);
        var h = Math.max(this._image.height || 0, 1);
        this.__canvas.width = w;
        this.__canvas.height = h;
        this._createBaseTexture(this._canvas);

        this.__context.drawImage(this._image, 0, 0);
    }

    this._setDirty();
};

Bitmap.prototype._createBaseTexture = function(source){
    this.__baseTexture = new PIXI.BaseTexture(source);
    this.__baseTexture.mipmap = false;
    this.__baseTexture.width = source.width;
    this.__baseTexture.height = source.height;

    if (this._smooth) {
        this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
    } else {
        this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }
};

Bitmap.prototype._clearImgInstance = function(){
    this._image.src = "";
    this._image.onload = null;
    this._image.onerror = null;
    this._errorListener = null;
    this._loadListener = null;

    Bitmap._reuseImages.push(this._image);
    this._image = null;
};

//
//We don't want to waste memory, so creating canvas is deferred.
//
Object.defineProperties(Bitmap.prototype, {
    _canvas: {
        get: function(){
            if(!this.__canvas)this._createCanvas();
            return this.__canvas;
        }
    },
    _context: {
        get: function(){
            if(!this.__context)this._createCanvas();
            return this.__context;
        }
    },

    _baseTexture: {
        get: function(){
            if(!this.__baseTexture) this._createBaseTexture(this._image || this.__canvas);
            return this.__baseTexture;
        }
    }
});

Bitmap.prototype._renewCanvas = function(){
    var newImage = this._image;
    if(newImage && this.__canvas && (this.__canvas.width < newImage.width || this.__canvas.height < newImage.height)){
        this._createCanvas();
    }
};

Bitmap.prototype.initialize = function(width, height) {
    if(!this._defer){
        this._createCanvas(width, height);
    }

    this._image = null;
    this._url = '';
    this._paintOpacity = 255;
    this._smooth = false;
    this._loadListeners = [];
    this._loadingState = 'none';
    this._decodeAfterRequest = false;

    /**
     * Cache entry, for images. In all cases _url is the same as cacheEntry.key
     * @type CacheEntry
     */
    this.cacheEntry = null;

    /**
     * The face name of the font.
     *
     * @property fontFace
     * @type String
     */
    this.fontFace = 'GameFont';

    /**
     * The size of the font in pixels.
     *
     * @property fontSize
     * @type Number
     */
    this.fontSize = 28;

    /**
     * Whether the font is italic.
     *
     * @property fontItalic
     * @type Boolean
     */
    this.fontItalic = false;

    /**
     * The color of the text in CSS format.
     *
     * @property textColor
     * @type String
     */
    this.textColor = '#ffffff';

    /**
     * The color of the outline of the text in CSS format.
     *
     * @property outlineColor
     * @type String
     */
    this.outlineColor = 'rgba(0, 0, 0, 0.5)';

    /**
     * The width of the outline of the text.
     *
     * @property outlineWidth
     * @type Number
     */
    this.outlineWidth = 4;
};

/**
 * Loads a image file and returns a new bitmap object.
 *
 * @static
 * @method load
 * @param {String} url The image url of the texture
 * @return Bitmap
 */
Bitmap.load = function(url) {
    var bitmap = Object.create(Bitmap.prototype);
    bitmap._defer = true;
    bitmap.initialize();

    bitmap._decodeAfterRequest = true;
    bitmap._requestImage(url);

    return bitmap;
};

/**
 * Takes a snapshot of the game screen and returns a new bitmap object.
 *
 * @static
 * @method snap
 * @param {Stage} stage The stage object
 * @return Bitmap
 */
Bitmap.snap = function(stage) {
    var width = Graphics.width;
    var height = Graphics.height;
    var bitmap = new Bitmap(width, height);
    var context = bitmap._context;
    var renderTexture = PIXI.RenderTexture.create(width, height);
    if (stage) {
        Graphics._renderer.render(stage, renderTexture);
        stage.worldTransform.identity();
        var canvas = null;
        if (Graphics.isWebGL()) {
            canvas = Graphics._renderer.extract.canvas(renderTexture);
        } else {
            canvas = renderTexture.baseTexture._canvasRenderTarget.canvas;
        }
        context.drawImage(canvas, 0, 0);
    } else {

    }
    renderTexture.destroy({ destroyBase: true });
    bitmap._setDirty();
    return bitmap;
};

/**
 * Checks whether the bitmap is ready to render.
 *
 * @method isReady
 * @return {Boolean} True if the bitmap is ready to render
 */
Bitmap.prototype.isReady = function() {
    return this._loadingState === 'loaded' || this._loadingState === 'none';
};

/**
 * Checks whether a loading error has occurred.
 *
 * @method isError
 * @return {Boolean} True if a loading error has occurred
 */
Bitmap.prototype.isError = function() {
    return this._loadingState === 'error';
};

/**
 * touch the resource
 * @method touch
 */
Bitmap.prototype.touch = function() {
    if (this.cacheEntry) {
        this.cacheEntry.touch();
    }
};

/**
 * [read-only] The url of the image file.
 *
 * @property url
 * @type String
 */
Object.defineProperty(Bitmap.prototype, 'url', {
    get: function() {
        return this._url;
    },
    configurable: true
});

/**
 * [read-only] The base texture that holds the image.
 *
 * @property baseTexture
 * @type PIXI.BaseTexture
 */
Object.defineProperty(Bitmap.prototype, 'baseTexture', {
    get: function() {
        return this._baseTexture;
    },
    configurable: true
});

/**
 * [read-only] The bitmap canvas.
 *
 * @property canvas
 * @type HTMLCanvasElement
 */
Object.defineProperty(Bitmap.prototype, 'canvas', {
    get: function() {
        return this._canvas;
    },
    configurable: true
});

/**
 * [read-only] The 2d context of the bitmap canvas.
 *
 * @property context
 * @type CanvasRenderingContext2D
 */
Object.defineProperty(Bitmap.prototype, 'context', {
    get: function() {
        return this._context;
    },
    configurable: true
});

/**
 * [read-only] The width of the bitmap.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(Bitmap.prototype, 'width', {
    get: function() {
        if(this.isReady()){
            return this._image? this._image.width: this._canvas.width;
        }

        return 0;
    },
    configurable: true
});

/**
 * [read-only] The height of the bitmap.
 *
 * @property height
 * @type Number
 */
Object.defineProperty(Bitmap.prototype, 'height', {
    get: function() {
        if(this.isReady()){
            return this._image? this._image.height: this._canvas.height;
        }

        return 0;
    },
    configurable: true
});

/**
 * [read-only] The rectangle of the bitmap.
 *
 * @property rect
 * @type Rectangle
 */
Object.defineProperty(Bitmap.prototype, 'rect', {
    get: function() {
        return new Rectangle(0, 0, this.width, this.height);
    },
    configurable: true
});

/**
 * Whether the smooth scaling is applied.
 *
 * @property smooth
 * @type Boolean
 */
Object.defineProperty(Bitmap.prototype, 'smooth', {
    get: function() {
        return this._smooth;
    },
    set: function(value) {
        if (this._smooth !== value) {
            this._smooth = value;
            if(this.__baseTexture){
                if (this._smooth) {
                    this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
                } else {
                    this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                }
            }
        }
    },
    configurable: true
});

/**
 * The opacity of the drawing object in the range (0, 255).
 *
 * @property paintOpacity
 * @type Number
 */
Object.defineProperty(Bitmap.prototype, 'paintOpacity', {
    get: function() {
        return this._paintOpacity;
    },
    set: function(value) {
      if (this._paintOpacity !== value) {
          this._paintOpacity = value;
          this._context.globalAlpha = this._paintOpacity / 255;
      }
    },
    configurable: true
});

/**
 * Resizes the bitmap.
 *
 * @method resize
 * @param {Number} width The new width of the bitmap
 * @param {Number} height The new height of the bitmap
 */
Bitmap.prototype.resize = function(width, height) {
    width = Math.max(width || 0, 1);
    height = Math.max(height || 0, 1);
    this._canvas.width = width;
    this._canvas.height = height;
    this._baseTexture.width = width;
    this._baseTexture.height = height;
};

/**
 * Performs a block transfer.
 *
 * @method blt
 * @param {Bitmap} source The bitmap to draw
 * @param {Number} sx The x coordinate in the source
 * @param {Number} sy The y coordinate in the source
 * @param {Number} sw The width of the source image
 * @param {Number} sh The height of the source image
 * @param {Number} dx The x coordinate in the destination
 * @param {Number} dy The y coordinate in the destination
 * @param {Number} [dw=sw] The width to draw the image in the destination
 * @param {Number} [dh=sh] The height to draw the image in the destination
 */
Bitmap.prototype.blt = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;
    if (sx >= 0 && sy >= 0 && sw > 0 && sh > 0 && dw > 0 && dh > 0 &&
            sx + sw <= source.width && sy + sh <= source.height) {
        this._context.globalCompositeOperation = 'source-over';
        this._context.drawImage(source._canvas, sx, sy, sw, sh, dx, dy, dw, dh);
        this._setDirty();
    }
};

/**
 * Performs a block transfer, using assumption that original image was not modified (no hue)
 *
 * @method blt
 * @param {Bitmap} source The bitmap to draw
 * @param {Number} sx The x coordinate in the source
 * @param {Number} sy The y coordinate in the source
 * @param {Number} sw The width of the source image
 * @param {Number} sh The height of the source image
 * @param {Number} dx The x coordinate in the destination
 * @param {Number} dy The y coordinate in the destination
 * @param {Number} [dw=sw] The width to draw the image in the destination
 * @param {Number} [dh=sh] The height to draw the image in the destination
 */
Bitmap.prototype.bltImage = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;
    if (sx >= 0 && sy >= 0 && sw > 0 && sh > 0 && dw > 0 && dh > 0 &&
        sx + sw <= source.width && sy + sh <= source.height) {
        this._context.globalCompositeOperation = 'source-over';
        this._context.drawImage(source._image, sx, sy, sw, sh, dx, dy, dw, dh);
        this._setDirty();
    }
};

/**
 * Returns pixel color at the specified point.
 *
 * @method getPixel
 * @param {Number} x The x coordinate of the pixel in the bitmap
 * @param {Number} y The y coordinate of the pixel in the bitmap
 * @return {String} The pixel color (hex format)
 */
Bitmap.prototype.getPixel = function(x, y) {
    var data = this._context.getImageData(x, y, 1, 1).data;
    var result = '#';
    for (var i = 0; i < 3; i++) {
        result += data[i].toString(16).padZero(2);
    }
    return result;
};

/**
 * Returns alpha pixel value at the specified point.
 *
 * @method getAlphaPixel
 * @param {Number} x The x coordinate of the pixel in the bitmap
 * @param {Number} y The y coordinate of the pixel in the bitmap
 * @return {String} The alpha value
 */
Bitmap.prototype.getAlphaPixel = function(x, y) {
    var data = this._context.getImageData(x, y, 1, 1).data;
    return data[3];
};

/**
 * Clears the specified rectangle.
 *
 * @method clearRect
 * @param {Number} x The x coordinate for the upper-left corner
 * @param {Number} y The y coordinate for the upper-left corner
 * @param {Number} width The width of the rectangle to clear
 * @param {Number} height The height of the rectangle to clear
 */
Bitmap.prototype.clearRect = function(x, y, width, height) {
    this._context.clearRect(x, y, width, height);
    this._setDirty();
};

/**
 * Clears the entire bitmap.
 *
 * @method clear
 */
Bitmap.prototype.clear = function() {
    this.clearRect(0, 0, this.width, this.height);
};

/**
 * Fills the specified rectangle.
 *
 * @method fillRect
 * @param {Number} x The x coordinate for the upper-left corner
 * @param {Number} y The y coordinate for the upper-left corner
 * @param {Number} width The width of the rectangle to fill
 * @param {Number} height The height of the rectangle to fill
 * @param {String} color The color of the rectangle in CSS format
 */
Bitmap.prototype.fillRect = function(x, y, width, height, color) {
    var context = this._context;
    context.save();
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
    context.restore();
    this._setDirty();
};

/**
 * Fills the entire bitmap.
 *
 * @method fillAll
 * @param {String} color The color of the rectangle in CSS format
 */
Bitmap.prototype.fillAll = function(color) {
    this.fillRect(0, 0, this.width, this.height, color);
};

/**
 * Draws the rectangle with a gradation.
 *
 * @method gradientFillRect
 * @param {Number} x The x coordinate for the upper-left corner
 * @param {Number} y The y coordinate for the upper-left corner
 * @param {Number} width The width of the rectangle to fill
 * @param {Number} height The height of the rectangle to fill
 * @param {String} color1 The gradient starting color
 * @param {String} color2 The gradient ending color
 * @param {Boolean} vertical Wether the gradient should be draw as vertical or not
 */
Bitmap.prototype.gradientFillRect = function(x, y, width, height, color1,
                                             color2, vertical) {
    var context = this._context;
    var grad;
    if (vertical) {
        grad = context.createLinearGradient(x, y, x, y + height);
    } else {
        grad = context.createLinearGradient(x, y, x + width, y);
    }
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    context.save();
    context.fillStyle = grad;
    context.fillRect(x, y, width, height);
    context.restore();
    this._setDirty();
};

/**
 * Draw a bitmap in the shape of a circle
 *
 * @method drawCircle
 * @param {Number} x The x coordinate based on the circle center
 * @param {Number} y The y coordinate based on the circle center
 * @param {Number} radius The radius of the circle
 * @param {String} color The color of the circle in CSS format
 */
Bitmap.prototype.drawCircle = function(x, y, radius, color) {
    var context = this._context;
    context.save();
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fill();
    context.restore();
    this._setDirty();
};

/**
 * Draws the outline text to the bitmap.
 *
 * @method drawText
 * @param {String} text The text that will be drawn
 * @param {Number} x The x coordinate for the left of the text
 * @param {Number} y The y coordinate for the top of the text
 * @param {Number} maxWidth The maximum allowed width of the text
 * @param {Number} lineHeight The height of the text line
 * @param {String} align The alignment of the text
 */
Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align) {
    // Note: Firefox has a bug with textBaseline: Bug 737852
    //       So we use 'alphabetic' here.
    if (text !== undefined) {
        var tx = x;
        var ty = y + lineHeight - (lineHeight - this.fontSize * 0.7) / 2;
        var context = this._context;
        var alpha = context.globalAlpha;
        maxWidth = maxWidth || 0xffffffff;
        if (align === 'center') {
            tx += maxWidth / 2;
        }
        if (align === 'right') {
            tx += maxWidth;
        }
        context.save();
        context.font = this._makeFontNameText();
        context.textAlign = align;
        context.textBaseline = 'alphabetic';
        context.globalAlpha = 1;
        this._drawTextOutline(text, tx, ty, maxWidth);
        context.globalAlpha = alpha;
        this._drawTextBody(text, tx, ty, maxWidth);
        context.restore();
        this._setDirty();
    }
};

/**
 * Returns the width of the specified text.
 *
 * @method measureTextWidth
 * @param {String} text The text to be measured
 * @return {Number} The width of the text in pixels
 */
Bitmap.prototype.measureTextWidth = function(text) {
    var context = this._context;
    context.save();
    context.font = this._makeFontNameText();
    var width = context.measureText(text).width;
    context.restore();
    return width;
};

/**
 * Changes the color tone of the entire bitmap.
 *
 * @method adjustTone
 * @param {Number} r The red strength in the range (-255, 255)
 * @param {Number} g The green strength in the range (-255, 255)
 * @param {Number} b The blue strength in the range (-255, 255)
 */
Bitmap.prototype.adjustTone = function(r, g, b) {
    if ((r || g || b) && this.width > 0 && this.height > 0) {
        var context = this._context;
        var imageData = context.getImageData(0, 0, this.width, this.height);
        var pixels = imageData.data;
        for (var i = 0; i < pixels.length; i += 4) {
            pixels[i + 0] += r;
            pixels[i + 1] += g;
            pixels[i + 2] += b;
        }
        context.putImageData(imageData, 0, 0);
        this._setDirty();
    }
};

/**
 * Rotates the hue of the entire bitmap.
 *
 * @method rotateHue
 * @param {Number} offset The hue offset in 360 degrees
 */
Bitmap.prototype.rotateHue = function(offset) {
    function rgbToHsl(r, g, b) {
        var cmin = Math.min(r, g, b);
        var cmax = Math.max(r, g, b);
        var h = 0;
        var s = 0;
        var l = (cmin + cmax) / 2;
        var delta = cmax - cmin;

        if (delta > 0) {
            if (r === cmax) {
                h = 60 * (((g - b) / delta + 6) % 6);
            } else if (g === cmax) {
                h = 60 * ((b - r) / delta + 2);
            } else {
                h = 60 * ((r - g) / delta + 4);
            }
            s = delta / (255 - Math.abs(2 * l - 255));
        }
        return [h, s, l];
    }

    function hslToRgb(h, s, l) {
        var c = (255 - Math.abs(2 * l - 255)) * s;
        var x = c * (1 - Math.abs((h / 60) % 2 - 1));
        var m = l - c / 2;
        var cm = c + m;
        var xm = x + m;

        if (h < 60) {
            return [cm, xm, m];
        } else if (h < 120) {
            return [xm, cm, m];
        } else if (h < 180) {
            return [m, cm, xm];
        } else if (h < 240) {
            return [m, xm, cm];
        } else if (h < 300) {
            return [xm, m, cm];
        } else {
            return [cm, m, xm];
        }
    }

    if (offset && this.width > 0 && this.height > 0) {
        offset = ((offset % 360) + 360) % 360;
        var context = this._context;
        var imageData = context.getImageData(0, 0, this.width, this.height);
        var pixels = imageData.data;
        for (var i = 0; i < pixels.length; i += 4) {
            var hsl = rgbToHsl(pixels[i + 0], pixels[i + 1], pixels[i + 2]);
            var h = (hsl[0] + offset) % 360;
            var s = hsl[1];
            var l = hsl[2];
            var rgb = hslToRgb(h, s, l);
            pixels[i + 0] = rgb[0];
            pixels[i + 1] = rgb[1];
            pixels[i + 2] = rgb[2];
        }
        context.putImageData(imageData, 0, 0);
        this._setDirty();
    }
};

/**
 * Applies a blur effect to the bitmap.
 *
 * @method blur
 */
Bitmap.prototype.blur = function() {
    for (var i = 0; i < 2; i++) {
        var w = this.width;
        var h = this.height;
        var canvas = this._canvas;
        var context = this._context;
        var tempCanvas = document.createElement('canvas');
        var tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = w + 2;
        tempCanvas.height = h + 2;
        tempContext.drawImage(canvas, 0, 0, w, h, 1, 1, w, h);
        tempContext.drawImage(canvas, 0, 0, w, 1, 1, 0, w, 1);
        tempContext.drawImage(canvas, 0, 0, 1, h, 0, 1, 1, h);
        tempContext.drawImage(canvas, 0, h - 1, w, 1, 1, h + 1, w, 1);
        tempContext.drawImage(canvas, w - 1, 0, 1, h, w + 1, 1, 1, h);
        context.save();
        context.fillStyle = 'black';
        context.fillRect(0, 0, w, h);
        context.globalCompositeOperation = 'lighter';
        context.globalAlpha = 1 / 9;
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                context.drawImage(tempCanvas, x, y, w, h, 0, 0, w, h);
            }
        }
        context.restore();
    }
    this._setDirty();
};

/**
 * Add a callback function that will be called when the bitmap is loaded.
 *
 * @method addLoadListener
 * @param {Function} listner The callback function
 */
Bitmap.prototype.addLoadListener = function(listner) {
    if (!this.isReady()) {
        this._loadListeners.push(listner);
    } else {
        listner(this);
    }
};

/**
 * @method _makeFontNameText
 * @private
 */
Bitmap.prototype._makeFontNameText = function() {
    return (this.fontItalic ? 'Italic ' : '') +
            this.fontSize + 'px ' + this.fontFace;
};

/**
 * @method _drawTextOutline
 * @param {String} text
 * @param {Number} tx
 * @param {Number} ty
 * @param {Number} maxWidth
 * @private
 */
Bitmap.prototype._drawTextOutline = function(text, tx, ty, maxWidth) {
    var context = this._context;
    context.strokeStyle = this.outlineColor;
    context.lineWidth = this.outlineWidth;
    context.lineJoin = 'round';
    context.strokeText(text, tx, ty, maxWidth);
};

/**
 * @method _drawTextBody
 * @param {String} text
 * @param {Number} tx
 * @param {Number} ty
 * @param {Number} maxWidth
 * @private
 */
Bitmap.prototype._drawTextBody = function(text, tx, ty, maxWidth) {
    var context = this._context;
    context.fillStyle = this.textColor;
    context.fillText(text, tx, ty, maxWidth);
};

/**
 * @method _onLoad
 * @private
 */
Bitmap.prototype._onLoad = function() {
    this._image.removeEventListener('load', this._loadListener);
    this._image.removeEventListener('error', this._errorListener);

    this._renewCanvas();

    switch(this._loadingState){
        case 'requesting':
            this._loadingState = 'requestCompleted';
            if(this._decodeAfterRequest){
                this.decode();
            }else{
                this._loadingState = 'purged';
                this._clearImgInstance();
            }
            break;

        case 'decrypting':
            window.URL.revokeObjectURL(this._image.src);
            this._loadingState = 'decryptCompleted';
            if(this._decodeAfterRequest){
                this.decode();
            }else{
                this._loadingState = 'purged';
                this._clearImgInstance();
            }
            break;
    }
};

Bitmap.prototype.decode = function(){
    switch(this._loadingState){
        case 'requestCompleted': case 'decryptCompleted':
            this._loadingState = 'loaded';

            if(!this.__canvas) this._createBaseTexture(this._image);
            this._setDirty();
            this._callLoadListeners();
            break;

        case 'requesting': case 'decrypting':
            this._decodeAfterRequest = true;
            if (!this._loader) {
                this._loader = ResourceHandler.createLoader(this._url, this._requestImage.bind(this, this._url), this._onError.bind(this));
                this._image.removeEventListener('error', this._errorListener);
                this._image.addEventListener('error', this._errorListener = this._loader);
            }
            break;

        case 'pending': case 'purged': case 'error':
            this._decodeAfterRequest = true;
            this._requestImage(this._url);
            break;
    }
};

/**
 * @method _callLoadListeners
 * @private
 */
Bitmap.prototype._callLoadListeners = function() {
    while (this._loadListeners.length > 0) {
        var listener = this._loadListeners.shift();
        listener(this);
    }
};

/**
 * @method _onError
 * @private
 */
Bitmap.prototype._onError = function() {
    this._image.removeEventListener('load', this._loadListener);
    this._image.removeEventListener('error', this._errorListener);
    this._loadingState = 'error';
};

/**
 * @method _setDirty
 * @private
 */
Bitmap.prototype._setDirty = function() {
    this._dirty = true;
};

/**
 * updates texture is bitmap was dirty
 * @method checkDirty
 */
Bitmap.prototype.checkDirty = function() {
    if (this._dirty) {
        this._baseTexture.update();
        this._dirty = false;
    }
};

Bitmap.request = function(url){
    var bitmap = Object.create(Bitmap.prototype);
    bitmap._defer = true;
    bitmap.initialize();

    bitmap._url = url;
    bitmap._loadingState = 'pending';

    return bitmap;
};

Bitmap.prototype._requestImage = function(url){
    if(Bitmap._reuseImages.length !== 0){
        this._image = Bitmap._reuseImages.pop();
    }else{
        this._image = new Image();
    }

    if (this._decodeAfterRequest && !this._loader) {
        this._loader = ResourceHandler.createLoader(url, this._requestImage.bind(this, url), this._onError.bind(this));
    }

    this._image = new Image();
    this._url = url;
    this._loadingState = 'requesting';

    if(!Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages) {
        this._loadingState = 'decrypting';
        Decrypter.decryptImg(url, this);
    } else {
        this._image.src = url;

        this._image.addEventListener('load', this._loadListener = Bitmap.prototype._onLoad.bind(this));
        this._image.addEventListener('error', this._errorListener = this._loader || Bitmap.prototype._onError.bind(this));
    }
};

Bitmap.prototype.isRequestOnly = function(){
    return !(this._decodeAfterRequest || this.isReady());
};

Bitmap.prototype.isRequestReady = function(){
    return this._loadingState !== 'pending' &&
        this._loadingState !== 'requesting' &&
        this._loadingState !== 'decrypting';
};

Bitmap.prototype.startRequest = function(){
    if(this._loadingState === 'pending'){
        this._decodeAfterRequest = false;
        this._requestImage(this._url);
    }
};

//-----------------------------------------------------------------------------
/**
 * The static class that carries out graphics processing.
 *
 * @class Graphics
 */
function Graphics() {
    throw new Error('This is a static class');
}

Graphics._cssFontLoading =  document.fonts && document.fonts.ready;
Graphics._fontLoaded = null;
Graphics._videoVolume = 1;

/**
 * Initializes the graphics system.
 *
 * @static
 * @method initialize
 * @param {Number} width The width of the game screen
 * @param {Number} height The height of the game screen
 * @param {String} type The type of the renderer.
 *                 'canvas', 'webgl', or 'auto'.
 */
Graphics.initialize = function(width, height, type) {
    this._width = width || 800;
    this._height = height || 600;
    this._rendererType = type || 'auto';
    this._boxWidth = this._width;
    this._boxHeight = this._height;

    this._scale = 1;
    this._realScale = 1;

    this._errorShowed = false;
    this._errorPrinter = null;
    this._canvas = null;
    this._video = null;
    this._videoUnlocked = false;
    this._videoLoading = false;
    this._upperCanvas = null;
    this._renderer = null;
    this._fpsMeter = null;
    this._modeBox = null;
    this._skipCount = 0;
    this._maxSkip = 3;
    this._rendered = false;
    this._loadingImage = null;
    this._loadingCount = 0;
    this._fpsMeterToggled = false;
    this._stretchEnabled = this._defaultStretchMode();

    this._canUseDifferenceBlend = false;
    this._canUseSaturationBlend = false;
    this._hiddenCanvas = null;

    this._testCanvasBlendModes();
    this._modifyExistingElements();
    this._updateRealScale();
    this._createAllElements();
    this._disableTextSelection();
    this._disableContextMenu();
    this._setupEventHandlers();
    this._setupCssFontLoading();
};


Graphics._setupCssFontLoading = function(){
    if(Graphics._cssFontLoading){
        document.fonts.ready.then(function(fonts){
            Graphics._fontLoaded = fonts;
        }).catch(function(error){
            SceneManager.onError(error);
        });
    }
};

Graphics.canUseCssFontLoading = function(){
    return !!this._cssFontLoading;
};

/**
 * The total frame count of the game screen.
 *
 * @static
 * @property frameCount
 * @type Number
 */
Graphics.frameCount     = 0;

/**
 * The alias of PIXI.blendModes.NORMAL.
 *
 * @static
 * @property BLEND_NORMAL
 * @type Number
 * @final
 */
Graphics.BLEND_NORMAL   = 0;

/**
 * The alias of PIXI.blendModes.ADD.
 *
 * @static
 * @property BLEND_ADD
 * @type Number
 * @final
 */
Graphics.BLEND_ADD      = 1;

/**
 * The alias of PIXI.blendModes.MULTIPLY.
 *
 * @static
 * @property BLEND_MULTIPLY
 * @type Number
 * @final
 */
Graphics.BLEND_MULTIPLY = 2;

/**
 * The alias of PIXI.blendModes.SCREEN.
 *
 * @static
 * @property BLEND_SCREEN
 * @type Number
 * @final
 */
Graphics.BLEND_SCREEN   = 3;

/**
 * Marks the beginning of each frame for FPSMeter.
 *
 * @static
 * @method tickStart
 */
Graphics.tickStart = function() {
    if (this._fpsMeter) {
        this._fpsMeter.tickStart();
    }
};

/**
 * Marks the end of each frame for FPSMeter.
 *
 * @static
 * @method tickEnd
 */
Graphics.tickEnd = function() {
    if (this._fpsMeter && this._rendered) {
        this._fpsMeter.tick();
    }
};

/**
 * Renders the stage to the game screen.
 *
 * @static
 * @method render
 * @param {Stage} stage The stage object to be rendered
 */
Graphics.render = function(stage) {
    if (this._skipCount === 0) {
        var startTime = Date.now();
        if (stage) {
            this._renderer.render(stage);
            if (this._renderer.gl && this._renderer.gl.flush) {
                this._renderer.gl.flush();
            }
        }
        var endTime = Date.now();
        var elapsed = endTime - startTime;
        this._skipCount = Math.min(Math.floor(elapsed / 15), this._maxSkip);
        this._rendered = true;
    } else {
        this._skipCount--;
        this._rendered = false;
    }
    this.frameCount++;
};

/**
 * Checks whether the renderer type is WebGL.
 *
 * @static
 * @method isWebGL
 * @return {Boolean} True if the renderer type is WebGL
 */
Graphics.isWebGL = function() {
    return this._renderer && this._renderer.type === PIXI.RENDERER_TYPE.WEBGL;
};

/**
 * Checks whether the current browser supports WebGL.
 *
 * @static
 * @method hasWebGL
 * @return {Boolean} True if the current browser supports WebGL.
 */
Graphics.hasWebGL = function() {
    try {
        var canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
        return false;
    }
};

/**
 * Checks whether the canvas blend mode 'difference' is supported.
 *
 * @static
 * @method canUseDifferenceBlend
 * @return {Boolean} True if the canvas blend mode 'difference' is supported
 */
Graphics.canUseDifferenceBlend = function() {
    return this._canUseDifferenceBlend;
};

/**
 * Checks whether the canvas blend mode 'saturation' is supported.
 *
 * @static
 * @method canUseSaturationBlend
 * @return {Boolean} True if the canvas blend mode 'saturation' is supported
 */
Graphics.canUseSaturationBlend = function() {
    return this._canUseSaturationBlend;
};

/**
 * Sets the source of the "Now Loading" image.
 *
 * @static
 * @method setLoadingImage
 */
Graphics.setLoadingImage = function(src) {
    this._loadingImage = new Image();
    this._loadingImage.src = src;
};

/**
 * Initializes the counter for displaying the "Now Loading" image.
 *
 * @static
 * @method startLoading
 */
Graphics.startLoading = function() {
    this._loadingCount = 0;
};

/**
 * Increments the loading counter and displays the "Now Loading" image if necessary.
 *
 * @static
 * @method updateLoading
 */
Graphics.updateLoading = function() {
    this._loadingCount++;
    this._paintUpperCanvas();
    this._upperCanvas.style.opacity = 1;
};

/**
 * Erases the "Now Loading" image.
 *
 * @static
 * @method endLoading
 */
Graphics.endLoading = function() {
    this._clearUpperCanvas();
    this._upperCanvas.style.opacity = 0;
};

/**
 * Displays the loading error text to the screen.
 *
 * @static
 * @method printLoadingError
 * @param {String} url The url of the resource failed to load
 */
Graphics.printLoadingError = function(url) {
    if (this._errorPrinter && !this._errorShowed) {
        this._errorPrinter.innerHTML = this._makeErrorHtml('Loading Error', 'Failed to load: ' + url);
        var button = document.createElement('button');
        button.innerHTML = 'Retry';
        button.style.fontSize = '24px';
        button.style.color = '#ffffff';
        button.style.backgroundColor = '#000000';
        button.onmousedown = button.ontouchstart = function(event) {
            ResourceHandler.retry();
            event.stopPropagation();
        };
        this._errorPrinter.appendChild(button);
        this._loadingCount = -Infinity;
    }
};

/**
 * Erases the loading error text.
 *
 * @static
 * @method eraseLoadingError
 */
Graphics.eraseLoadingError = function() {
    if (this._errorPrinter && !this._errorShowed) {
        this._errorPrinter.innerHTML = '';
        this.startLoading();
    }
};

/**
 * Displays the error text to the screen.
 *
 * @static
 * @method printError
 * @param {String} name The name of the error
 * @param {String} message The message of the error
 */
Graphics.printError = function(name, message) {
    this._errorShowed = true;
    if (this._errorPrinter) {
        this._errorPrinter.innerHTML = this._makeErrorHtml(name, message);
    }
    this._applyCanvasFilter();
    this._clearUpperCanvas();
};

/**
 * Shows the FPSMeter element.
 *
 * @static
 * @method showFps
 */
Graphics.showFps = function() {
    if (this._fpsMeter) {
        this._fpsMeter.show();
        this._modeBox.style.opacity = 1;
    }
};

/**
 * Hides the FPSMeter element.
 *
 * @static
 * @method hideFps
 */
Graphics.hideFps = function() {
    if (this._fpsMeter) {
        this._fpsMeter.hide();
        this._modeBox.style.opacity = 0;
    }
};

/**
 * Loads a font file.
 *
 * @static
 * @method loadFont
 * @param {String} name The face name of the font
 * @param {String} url The url of the font file
 */
Graphics.loadFont = function(name, url) {
    var style = document.createElement('style');
    var head = document.getElementsByTagName('head');
    var rule = '@font-face { font-family: "' + name + '"; src: url("' + url + '"); }';
    style.type = 'text/css';
    head.item(0).appendChild(style);
    style.sheet.insertRule(rule, 0);
    this._createFontLoader(name);
};

/**
 * Checks whether the font file is loaded.
 *
 * @static
 * @method isFontLoaded
 * @param {String} name The face name of the font
 * @return {Boolean} True if the font file is loaded
 */
Graphics.isFontLoaded = function(name) {
    if (Graphics._cssFontLoading) {
        if(Graphics._fontLoaded){
            return Graphics._fontLoaded.check('10px "'+name+'"');
        }

        return false;
    } else {
        if (!this._hiddenCanvas) {
            this._hiddenCanvas = document.createElement('canvas');
        }
        var context = this._hiddenCanvas.getContext('2d');
        var text = 'abcdefghijklmnopqrstuvwxyz';
        var width1, width2;
        context.font = '40px ' + name + ', sans-serif';
        width1 = context.measureText(text).width;
        context.font = '40px sans-serif';
        width2 = context.measureText(text).width;
        return width1 !== width2;
    }
};

/**
 * Starts playback of a video.
 *
 * @static
 * @method playVideo
 * @param {String} src
 */
Graphics.playVideo = function(src) {
    this._videoLoader = ResourceHandler.createLoader(null, this._playVideo.bind(this, src), this._onVideoError.bind(this));
    this._playVideo(src);
};

/**
 * @static
 * @method _playVideo
 * @param {String} src
 * @private
 */
Graphics._playVideo = function(src) {
    this._video.src = src;
    this._video.onloadeddata = this._onVideoLoad.bind(this);
    this._video.onerror = this._videoLoader;
    this._video.onended = this._onVideoEnd.bind(this);
    this._video.load();
    this._videoLoading = true;
};

/**
 * Checks whether the video is playing.
 *
 * @static
 * @method isVideoPlaying
 * @return {Boolean} True if the video is playing
 */
Graphics.isVideoPlaying = function() {
    return this._videoLoading || this._isVideoVisible();
};

/**
 * Checks whether the browser can play the specified video type.
 *
 * @static
 * @method canPlayVideoType
 * @param {String} type The video type to test support for
 * @return {Boolean} True if the browser can play the specified video type
 */
Graphics.canPlayVideoType = function(type) {
    return this._video && this._video.canPlayType(type);
};

/**
 * Sets volume of a video.
 *
 * @static
 * @method setVideoVolume
 * @param {Number} value
 */
Graphics.setVideoVolume = function(value) {
    this._videoVolume = value;
    if (this._video) {
        this._video.volume = this._videoVolume;
    }
};

/**
 * Converts an x coordinate on the page to the corresponding
 * x coordinate on the canvas area.
 *
 * @static
 * @method pageToCanvasX
 * @param {Number} x The x coordinate on the page to be converted
 * @return {Number} The x coordinate on the canvas area
 */
Graphics.pageToCanvasX = function(x) {
    if (this._canvas) {
        var left = this._canvas.offsetLeft;
        return Math.round((x - left) / this._realScale);
    } else {
        return 0;
    }
};

/**
 * Converts a y coordinate on the page to the corresponding
 * y coordinate on the canvas area.
 *
 * @static
 * @method pageToCanvasY
 * @param {Number} y The y coordinate on the page to be converted
 * @return {Number} The y coordinate on the canvas area
 */
Graphics.pageToCanvasY = function(y) {
    if (this._canvas) {
        var top = this._canvas.offsetTop;
        return Math.round((y - top) / this._realScale);
    } else {
        return 0;
    }
};

/**
 * Checks whether the specified point is inside the game canvas area.
 *
 * @static
 * @method isInsideCanvas
 * @param {Number} x The x coordinate on the canvas area
 * @param {Number} y The y coordinate on the canvas area
 * @return {Boolean} True if the specified point is inside the game canvas area
 */
Graphics.isInsideCanvas = function(x, y) {
    return (x >= 0 && x < this._width && y >= 0 && y < this._height);
};

/**
 * Calls pixi.js garbage collector
 */
Graphics.callGC = function() {
    if (Graphics.isWebGL()) {
        Graphics._renderer.textureGC.run();
    }
};


/**
 * The width of the game screen.
 *
 * @static
 * @property width
 * @type Number
 */
Object.defineProperty(Graphics, 'width', {
    get: function() {
        return this._width;
    },
    set: function(value) {
        if (this._width !== value) {
            this._width = value;
            this._updateAllElements();
        }
    },
    configurable: true
});

/**
 * The height of the game screen.
 *
 * @static
 * @property height
 * @type Number
 */
Object.defineProperty(Graphics, 'height', {
    get: function() {
        return this._height;
    },
    set: function(value) {
        if (this._height !== value) {
            this._height = value;
            this._updateAllElements();
        }
    },
    configurable: true
});

/**
 * The width of the window display area.
 *
 * @static
 * @property boxWidth
 * @type Number
 */
Object.defineProperty(Graphics, 'boxWidth', {
    get: function() {
        return this._boxWidth;
    },
    set: function(value) {
        this._boxWidth = value;
    },
    configurable: true
});

/**
 * The height of the window display area.
 *
 * @static
 * @property boxHeight
 * @type Number
 */
Object.defineProperty(Graphics, 'boxHeight', {
    get: function() {
        return this._boxHeight;
    },
    set: function(value) {
        this._boxHeight = value;
    },
    configurable: true
});

/**
 * The zoom scale of the game screen.
 *
 * @static
 * @property scale
 * @type Number
 */
Object.defineProperty(Graphics, 'scale', {
    get: function() {
        return this._scale;
    },
    set: function(value) {
        if (this._scale !== value) {
            this._scale = value;
            this._updateAllElements();
        }
    },
    configurable: true
});

/**
 * @static
 * @method _createAllElements
 * @private
 */
Graphics._createAllElements = function() {
    this._createErrorPrinter();
    this._createCanvas();
    this._createVideo();
    this._createUpperCanvas();
    this._createRenderer();
    this._createFPSMeter();
    this._createModeBox();
    this._createGameFontLoader();
};

/**
 * @static
 * @method _updateAllElements
 * @private
 */
Graphics._updateAllElements = function() {
    this._updateRealScale();
    this._updateErrorPrinter();
    this._updateCanvas();
    this._updateVideo();
    this._updateUpperCanvas();
    this._updateRenderer();
    this._paintUpperCanvas();
};

/**
 * @static
 * @method _updateRealScale
 * @private
 */
Graphics._updateRealScale = function() {
    if (this._stretchEnabled) {
        var h = window.innerWidth / this._width;
        var v = window.innerHeight / this._height;
        if (h >= 1 && h - 0.01 <= 1) h = 1;
        if (v >= 1 && v - 0.01 <= 1) v = 1;
        this._realScale = Math.min(h, v);
    } else {
        this._realScale = this._scale;
    }
};

/**
 * @static
 * @method _makeErrorHtml
 * @param {String} name
 * @param {String} message
 * @return {String}
 * @private
 */
Graphics._makeErrorHtml = function(name, message) {
    return ('<font color="yellow"><b>' + name + '</b></font><br>' +
            '<font color="white">' + message + '</font><br>');
};

/**
 * @static
 * @method _defaultStretchMode
 * @private
 */
Graphics._defaultStretchMode = function() {
    return Utils.isNwjs() || Utils.isMobileDevice();
};

/**
 * @static
 * @method _testCanvasBlendModes
 * @private
 */
Graphics._testCanvasBlendModes = function() {
    var canvas, context, imageData1, imageData2;
    canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    context = canvas.getContext('2d');
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = 'white';
    context.fillRect(0, 0, 1, 1);
    context.globalCompositeOperation = 'difference';
    context.fillStyle = 'white';
    context.fillRect(0, 0, 1, 1);
    imageData1 = context.getImageData(0, 0, 1, 1);
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = 'black';
    context.fillRect(0, 0, 1, 1);
    context.globalCompositeOperation = 'saturation';
    context.fillStyle = 'white';
    context.fillRect(0, 0, 1, 1);
    imageData2 = context.getImageData(0, 0, 1, 1);
    this._canUseDifferenceBlend = imageData1.data[0] === 0;
    this._canUseSaturationBlend = imageData2.data[0] === 0;
};

/**
 * @static
 * @method _modifyExistingElements
 * @private
 */
Graphics._modifyExistingElements = function() {
    var elements = document.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].style.zIndex > 0) {
            elements[i].style.zIndex = 0;
        }
    }
};

/**
 * @static
 * @method _createErrorPrinter
 * @private
 */
Graphics._createErrorPrinter = function() {
    this._errorPrinter = document.createElement('p');
    this._errorPrinter.id = 'ErrorPrinter';
    this._updateErrorPrinter();
    document.body.appendChild(this._errorPrinter);
};

/**
 * @static
 * @method _updateErrorPrinter
 * @private
 */
Graphics._updateErrorPrinter = function() {
    this._errorPrinter.width = this._width * 0.9;
    this._errorPrinter.height = 40;
    this._errorPrinter.style.textAlign = 'center';
    this._errorPrinter.style.textShadow = '1px 1px 3px #000';
    this._errorPrinter.style.fontSize = '20px';
    this._errorPrinter.style.zIndex = 99;
    this._centerElement(this._errorPrinter);
};

/**
 * @static
 * @method _createCanvas
 * @private
 */
Graphics._createCanvas = function() {
    this._canvas = document.createElement('canvas');
    this._canvas.id = 'GameCanvas';
    this._updateCanvas();
    document.body.appendChild(this._canvas);
};

/**
 * @static
 * @method _updateCanvas
 * @private
 */
Graphics._updateCanvas = function() {
    this._canvas.width = this._width;
    this._canvas.height = this._height;
    this._canvas.style.zIndex = 1;
    this._centerElement(this._canvas);
};

/**
 * @static
 * @method _createVideo
 * @private
 */
Graphics._createVideo = function() {
    this._video = document.createElement('video');
    this._video.id = 'GameVideo';
    this._video.style.opacity = 0;
    this._video.setAttribute('playsinline', '');
    this._video.volume = this._videoVolume;
    this._updateVideo();
    makeVideoPlayableInline(this._video);
    document.body.appendChild(this._video);
};

/**
 * @static
 * @method _updateVideo
 * @private
 */
Graphics._updateVideo = function() {
    this._video.width = this._width;
    this._video.height = this._height;
    this._video.style.zIndex = 2;
    this._centerElement(this._video);
};

/**
 * @static
 * @method _createUpperCanvas
 * @private
 */
Graphics._createUpperCanvas = function() {
    this._upperCanvas = document.createElement('canvas');
    this._upperCanvas.id = 'UpperCanvas';
    this._updateUpperCanvas();
    document.body.appendChild(this._upperCanvas);
};

/**
 * @static
 * @method _updateUpperCanvas
 * @private
 */
Graphics._updateUpperCanvas = function() {
    this._upperCanvas.width = this._width;
    this._upperCanvas.height = this._height;
    this._upperCanvas.style.zIndex = 3;
    this._centerElement(this._upperCanvas);
};

/**
 * @static
 * @method _clearUpperCanvas
 * @private
 */
Graphics._clearUpperCanvas = function() {
    var context = this._upperCanvas.getContext('2d');
    context.clearRect(0, 0, this._width, this._height);
};

/**
 * @static
 * @method _paintUpperCanvas
 * @private
 */
Graphics._paintUpperCanvas = function() {
    this._clearUpperCanvas();
    if (this._loadingImage && this._loadingCount >= 20) {
        var context = this._upperCanvas.getContext('2d');
        var dx = (this._width - this._loadingImage.width) / 2;
        var dy = (this._height - this._loadingImage.height) / 2;
        var alpha = ((this._loadingCount - 20) / 30).clamp(0, 1);
        context.save();
        context.globalAlpha = alpha;
        context.drawImage(this._loadingImage, dx, dy);
        context.restore();
    }
};

/**
 * @static
 * @method _createRenderer
 * @private
 */
Graphics._createRenderer = function() {
    PIXI.dontSayHello = true;
    var width = this._width;
    var height = this._height;
    var options = { view: this._canvas };
    try {
        switch (this._rendererType) {
        case 'canvas':
            this._renderer = new PIXI.CanvasRenderer(width, height, options);
            break;
        case 'webgl':
            this._renderer = new PIXI.WebGLRenderer(width, height, options);
            break;
        default:
            this._renderer = PIXI.autoDetectRenderer(width, height, options);
            break;
        }

        if(this._renderer && this._renderer.textureGC)
            this._renderer.textureGC.maxIdle = 1;

    } catch (e) {
        this._renderer = null;
    }
};

/**
 * @static
 * @method _updateRenderer
 * @private
 */
Graphics._updateRenderer = function() {
    if (this._renderer) {
        this._renderer.resize(this._width, this._height);
    }
};

/**
 * @static
 * @method _createFPSMeter
 * @private
 */
Graphics._createFPSMeter = function() {
    var options = { graph: 1, decimals: 0, theme: 'transparent', toggleOn: null };
    this._fpsMeter = new FPSMeter(options);
    this._fpsMeter.hide();
};

/**
 * @static
 * @method _createModeBox
 * @private
 */
Graphics._createModeBox = function() {
    var box = document.createElement('div');
    box.id = 'modeTextBack';
    box.style.position = 'absolute';
    box.style.left = '5px';
    box.style.top = '5px';
    box.style.width = '119px';
    box.style.height = '58px';
    box.style.background = 'rgba(0,0,0,0.2)';
    box.style.zIndex = 9;
    box.style.opacity = 0;

    var text = document.createElement('div');
    text.id = 'modeText';
    text.style.position = 'absolute';
    text.style.left = '0px';
    text.style.top = '41px';
    text.style.width = '119px';
    text.style.fontSize = '12px';
    text.style.fontFamily = 'monospace';
    text.style.color = 'white';
    text.style.textAlign = 'center';
    text.style.textShadow = '1px 1px 0 rgba(0,0,0,0.5)';
    text.innerHTML = this.isWebGL() ? 'WebGL mode' : 'Canvas mode';

    document.body.appendChild(box);
    box.appendChild(text);

    this._modeBox = box;
};

/**
 * @static
 * @method _createGameFontLoader
 * @private
 */
Graphics._createGameFontLoader = function() {
    this._createFontLoader('GameFont');
};

/**
 * @static
 * @method _createFontLoader
 * @param {String} name
 * @private
 */
Graphics._createFontLoader = function(name) {
    var div = document.createElement('div');
    var text = document.createTextNode('.');
    div.style.fontFamily = name;
    div.style.fontSize = '0px';
    div.style.color = 'transparent';
    div.style.position = 'absolute';
    div.style.margin = 'auto';
    div.style.top = '0px';
    div.style.left = '0px';
    div.style.width = '1px';
    div.style.height = '1px';
    div.appendChild(text);
    document.body.appendChild(div);
};

/**
 * @static
 * @method _centerElement
 * @param {HTMLElement} element
 * @private
 */
Graphics._centerElement = function(element) {
    var width = element.width * this._realScale;
    var height = element.height * this._realScale;
    element.style.position = 'absolute';
    element.style.margin = 'auto';
    element.style.top = 0;
    element.style.left = 0;
    element.style.right = 0;
    element.style.bottom = 0;
    element.style.width = width + 'px';
    element.style.height = height + 'px';
};

/**
 * @static
 * @method _disableTextSelection
 * @private
 */
Graphics._disableTextSelection = function() {
    var body = document.body;
    body.style.userSelect = 'none';
    body.style.webkitUserSelect = 'none';
    body.style.msUserSelect = 'none';
    body.style.mozUserSelect = 'none';
};

/**
 * @static
 * @method _disableContextMenu
 * @private
 */
Graphics._disableContextMenu = function() {
    var elements = document.body.getElementsByTagName('*');
    var oncontextmenu = function() { return false; };
    for (var i = 0; i < elements.length; i++) {
        elements[i].oncontextmenu = oncontextmenu;
    }
};

/**
 * @static
 * @method _applyCanvasFilter
 * @private
 */
Graphics._applyCanvasFilter = function() {
    if (this._canvas) {
        this._canvas.style.opacity = 0.5;
        this._canvas.style.filter = 'blur(8px)';
        this._canvas.style.webkitFilter = 'blur(8px)';
    }
};

/**
 * @static
 * @method _onVideoLoad
 * @private
 */
Graphics._onVideoLoad = function() {
    this._video.play();
    this._updateVisibility(true);
    this._videoLoading = false;
};

/**
 * @static
 * @method _onVideoError
 * @private
 */
Graphics._onVideoError = function() {
    this._updateVisibility(false);
    this._videoLoading = false;
};

/**
 * @static
 * @method _onVideoEnd
 * @private
 */
Graphics._onVideoEnd = function() {
    this._updateVisibility(false);
};

/**
 * @static
 * @method _updateVisibility
 * @param {Boolean} videoVisible
 * @private
 */
Graphics._updateVisibility = function(videoVisible) {
    this._video.style.opacity = videoVisible ? 1 : 0;
    this._canvas.style.opacity = videoVisible ? 0 : 1;
};

/**
 * @static
 * @method _isVideoVisible
 * @return {Boolean}
 * @private
 */
Graphics._isVideoVisible = function() {
    return this._video.style.opacity > 0;
};

/**
 * @static
 * @method _setupEventHandlers
 * @private
 */
Graphics._setupEventHandlers = function() {
    window.addEventListener('resize', this._onWindowResize.bind(this));
    document.addEventListener('keydown', this._onKeyDown.bind(this));
    document.addEventListener('keydown', this._onTouchEnd.bind(this));
    document.addEventListener('mousedown', this._onTouchEnd.bind(this));
    document.addEventListener('touchend', this._onTouchEnd.bind(this));
};

/**
 * @static
 * @method _onWindowResize
 * @private
 */
Graphics._onWindowResize = function() {
    this._updateAllElements();
};

/**
 * @static
 * @method _onKeyDown
 * @param {KeyboardEvent} event
 * @private
 */
Graphics._onKeyDown = function(event) {
    if (!event.ctrlKey && !event.altKey) {
        switch (event.keyCode) {
        case 113:   // F2
            event.preventDefault();
            this._switchFPSMeter();
            break;
        case 114:   // F3
            event.preventDefault();
            this._switchStretchMode();
            break;
        case 115:   // F4
            event.preventDefault();
            this._switchFullScreen();
            break;
        }
    }
};

/**
 * @static
 * @method _onTouchEnd
 * @param {TouchEvent} event
 * @private
 */
Graphics._onTouchEnd = function(event) {
    if (!this._videoUnlocked) {
        this._video.play();
        this._videoUnlocked = true;
    }
    if (this._isVideoVisible() && this._video.paused) {
        this._video.play();
    }
};

/**
 * @static
 * @method _switchFPSMeter
 * @private
 */
Graphics._switchFPSMeter = function() {
    if (this._fpsMeter.isPaused) {
        this.showFps();
        this._fpsMeter.showFps();
        this._fpsMeterToggled = false;
    } else if (!this._fpsMeterToggled) {
        this._fpsMeter.showDuration();
        this._fpsMeterToggled = true;
    } else {
        this.hideFps();
    }
};

/**
 * @static
 * @method _switchStretchMode
 * @return {Boolean}
 * @private
 */
Graphics._switchStretchMode = function() {
    this._stretchEnabled = !this._stretchEnabled;
    this._updateAllElements();
};

/**
 * @static
 * @method _switchFullScreen
 * @private
 */
Graphics._switchFullScreen = function() {
    if (this._isFullScreen()) {
        this._requestFullScreen();
    } else {
        this._cancelFullScreen();
    }
};

/**
 * @static
 * @method _isFullScreen
 * @return {Boolean}
 * @private
 */
Graphics._isFullScreen = function() {
    return ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitFullscreenElement &&
             !document.msFullscreenElement));
};

/**
 * @static
 * @method _requestFullScreen
 * @private
 */
Graphics._requestFullScreen = function() {
    var element = document.body;
    if (element.requestFullScreen) {
        element.requestFullScreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
};

/**
 * @static
 * @method _cancelFullScreen
 * @private
 */
Graphics._cancelFullScreen = function() {
    if (document.cancelFullScreen) {
        document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
};

//-----------------------------------------------------------------------------
/**
 * The static class that handles input data from the keyboard and gamepads.
 *
 * @class Input
 */
function Input() {
    throw new Error('This is a static class');
}

/**
 * Initializes the input system.
 *
 * @static
 * @method initialize
 */
Input.initialize = function() {
    this.clear();
    this._wrapNwjsAlert();
    this._setupEventHandlers();
};

/**
 * The wait time of the key repeat in frames.
 *
 * @static
 * @property keyRepeatWait
 * @type Number
 */
Input.keyRepeatWait = 24;

/**
 * The interval of the key repeat in frames.
 *
 * @static
 * @property keyRepeatInterval
 * @type Number
 */
Input.keyRepeatInterval = 6;

/**
 * A hash table to convert from a virtual key code to a mapped key name.
 *
 * @static
 * @property keyMapper
 * @type Object
 */
Input.keyMapper = {
    9: 'tab',       // tab
    13: 'ok',       // enter
    16: 'shift',    // shift
    17: 'control',  // control
    18: 'control',  // alt
    27: 'escape',   // escape
    32: 'ok',       // space
    33: 'pageup',   // pageup
    34: 'pagedown', // pagedown
    37: 'left',     // left arrow
    38: 'up',       // up arrow
    39: 'right',    // right arrow
    40: 'down',     // down arrow
    45: 'escape',   // insert
    81: 'pageup',   // Q
    87: 'pagedown', // W
    88: 'escape',   // X
    90: 'ok',       // Z
    96: 'escape',   // numpad 0
    98: 'down',     // numpad 2
    100: 'left',    // numpad 4
    102: 'right',   // numpad 6
    104: 'up',      // numpad 8
    120: 'debug'    // F9
};

/**
 * A hash table to convert from a gamepad button to a mapped key name.
 *
 * @static
 * @property gamepadMapper
 * @type Object
 */
Input.gamepadMapper = {
    0: 'ok',        // A
    1: 'cancel',    // B
    2: 'shift',     // X
    3: 'menu',      // Y
    4: 'pageup',    // LB
    5: 'pagedown',  // RB
    12: 'up',       // D-pad up
    13: 'down',     // D-pad down
    14: 'left',     // D-pad left
    15: 'right',    // D-pad right
};

/**
 * Clears all the input data.
 *
 * @static
 * @method clear
 */
Input.clear = function() {
    this._currentState = {};
    this._previousState = {};
    this._gamepadStates = [];
    this._latestButton = null;
    this._pressedTime = 0;
    this._dir4 = 0;
    this._dir8 = 0;
    this._preferredAxis = '';
    this._date = 0;
};

/**
 * Updates the input data.
 *
 * @static
 * @method update
 */
Input.update = function() {
    this._pollGamepads();
    if (this._currentState[this._latestButton]) {
        this._pressedTime++;
    } else {
        this._latestButton = null;
    }
    for (var name in this._currentState) {
        if (this._currentState[name] && !this._previousState[name]) {
            this._latestButton = name;
            this._pressedTime = 0;
            this._date = Date.now();
        }
        this._previousState[name] = this._currentState[name];
    }
    this._updateDirection();
};

/**
 * Checks whether a key is currently pressed down.
 *
 * @static
 * @method isPressed
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is pressed
 */
Input.isPressed = function(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isPressed('escape')) {
        return true;
    } else {
        return !!this._currentState[keyName];
    }
};

/**
 * Checks whether a key is just pressed.
 *
 * @static
 * @method isTriggered
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is triggered
 */
Input.isTriggered = function(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isTriggered('escape')) {
        return true;
    } else {
        return this._latestButton === keyName && this._pressedTime === 0;
    }
};

/**
 * Checks whether a key is just pressed or a key repeat occurred.
 *
 * @static
 * @method isRepeated
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is repeated
 */
Input.isRepeated = function(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isRepeated('escape')) {
        return true;
    } else {
        return (this._latestButton === keyName &&
                (this._pressedTime === 0 ||
                 (this._pressedTime >= this.keyRepeatWait &&
                  this._pressedTime % this.keyRepeatInterval === 0)));
    }
};

/**
 * Checks whether a key is kept depressed.
 *
 * @static
 * @method isLongPressed
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is long-pressed
 */
Input.isLongPressed = function(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isLongPressed('escape')) {
        return true;
    } else {
        return (this._latestButton === keyName &&
                this._pressedTime >= this.keyRepeatWait);
    }
};

/**
 * [read-only] The four direction value as a number of the numpad, or 0 for neutral.
 *
 * @static
 * @property dir4
 * @type Number
 */
Object.defineProperty(Input, 'dir4', {
    get: function() {
        return this._dir4;
    },
    configurable: true
});

/**
 * [read-only] The eight direction value as a number of the numpad, or 0 for neutral.
 *
 * @static
 * @property dir8
 * @type Number
 */
Object.defineProperty(Input, 'dir8', {
    get: function() {
        return this._dir8;
    },
    configurable: true
});

/**
 * [read-only] The time of the last input in milliseconds.
 *
 * @static
 * @property date
 * @type Number
 */
Object.defineProperty(Input, 'date', {
    get: function() {
        return this._date;
    },
    configurable: true
});

/**
 * @static
 * @method _wrapNwjsAlert
 * @private
 */
Input._wrapNwjsAlert = function() {
    if (Utils.isNwjs()) {
        var _alert = window.alert;
        window.alert = function() {
            var gui = require('nw.gui');
            var win = gui.Window.get();
            _alert.apply(this, arguments);
            win.focus();
            Input.clear();
        };
    }
};

/**
 * @static
 * @method _setupEventHandlers
 * @private
 */
Input._setupEventHandlers = function() {
    document.addEventListener('keydown', this._onKeyDown.bind(this));
    document.addEventListener('keyup', this._onKeyUp.bind(this));
    window.addEventListener('blur', this._onLostFocus.bind(this));
};

/**
 * @static
 * @method _onKeyDown
 * @param {KeyboardEvent} event
 * @private
 */
Input._onKeyDown = function(event) {
    if (this._shouldPreventDefault(event.keyCode)) {
        event.preventDefault();
    }
    if (event.keyCode === 144) {    // Numlock
        this.clear();
    }
    var buttonName = this.keyMapper[event.keyCode];
    if (ResourceHandler.exists() && buttonName === 'ok') {
        ResourceHandler.retry();
    } else if (buttonName) {
        this._currentState[buttonName] = true;
    }
};

/**
 * @static
 * @method _shouldPreventDefault
 * @param {Number} keyCode
 * @private
 */
Input._shouldPreventDefault = function(keyCode) {
    switch (keyCode) {
    case 8:     // backspace
    case 33:    // pageup
    case 34:    // pagedown
    case 37:    // left arrow
    case 38:    // up arrow
    case 39:    // right arrow
    case 40:    // down arrow
        return true;
    }
    return false;
};

/**
 * @static
 * @method _onKeyUp
 * @param {KeyboardEvent} event
 * @private
 */
Input._onKeyUp = function(event) {
    var buttonName = this.keyMapper[event.keyCode];
    if (buttonName) {
        this._currentState[buttonName] = false;
    }
    if (event.keyCode === 0) {  // For QtWebEngine on OS X
        this.clear();
    }
};

/**
 * @static
 * @method _onLostFocus
 * @private
 */
Input._onLostFocus = function() {
    this.clear();
};

/**
 * @static
 * @method _pollGamepads
 * @private
 */
Input._pollGamepads = function() {
    if (navigator.getGamepads) {
        var gamepads = navigator.getGamepads();
        if (gamepads) {
            for (var i = 0; i < gamepads.length; i++) {
                var gamepad = gamepads[i];
                if (gamepad && gamepad.connected) {
                    this._updateGamepadState(gamepad);
                }
            }
        }
    }
};

/**
 * @static
 * @method _updateGamepadState
 * @param {Gamepad} gamepad
 * @param {Number} index
 * @private
 */
Input._updateGamepadState = function(gamepad) {
    var lastState = this._gamepadStates[gamepad.index] || [];
    var newState = [];
    var buttons = gamepad.buttons;
    var axes = gamepad.axes;
    var threshold = 0.5;
    newState[12] = false;
    newState[13] = false;
    newState[14] = false;
    newState[15] = false;
    for (var i = 0; i < buttons.length; i++) {
        newState[i] = buttons[i].pressed;
    }
    if (axes[1] < -threshold) {
        newState[12] = true;    // up
    } else if (axes[1] > threshold) {
        newState[13] = true;    // down
    }
    if (axes[0] < -threshold) {
        newState[14] = true;    // left
    } else if (axes[0] > threshold) {
        newState[15] = true;    // right
    }
    for (var j = 0; j < newState.length; j++) {
        if (newState[j] !== lastState[j]) {
            var buttonName = this.gamepadMapper[j];
            if (buttonName) {
                this._currentState[buttonName] = newState[j];
            }
        }
    }
    this._gamepadStates[gamepad.index] = newState;
};

/**
 * @static
 * @method _updateDirection
 * @private
 */
Input._updateDirection = function() {
    var x = this._signX();
    var y = this._signY();

    this._dir8 = this._makeNumpadDirection(x, y);

    if (x !== 0 && y !== 0) {
        if (this._preferredAxis === 'x') {
            y = 0;
        } else {
            x = 0;
        }
    } else if (x !== 0) {
        this._preferredAxis = 'y';
    } else if (y !== 0) {
        this._preferredAxis = 'x';
    }

    this._dir4 = this._makeNumpadDirection(x, y);
};

/**
 * @static
 * @method _signX
 * @private
 */
Input._signX = function() {
    var x = 0;

    if (this.isPressed('left')) {
        x--;
    }
    if (this.isPressed('right')) {
        x++;
    }
    return x;
};

/**
 * @static
 * @method _signY
 * @private
 */
Input._signY = function() {
    var y = 0;

    if (this.isPressed('up')) {
        y--;
    }
    if (this.isPressed('down')) {
        y++;
    }
    return y;
};

/**
 * @static
 * @method _makeNumpadDirection
 * @param {Number} x
 * @param {Number} y
 * @return {Number}
 * @private
 */
Input._makeNumpadDirection = function(x, y) {
    if (x !== 0 || y !== 0) {
        return  5 - y * 3 + x;
    }
    return 0;
};

/**
 * @static
 * @method _isEscapeCompatible
 * @param {String} keyName
 * @return {Boolean}
 * @private
 */
Input._isEscapeCompatible = function(keyName) {
    return keyName === 'cancel' || keyName === 'menu';
};

//-----------------------------------------------------------------------------
/**
 * The static class that handles input data from the mouse and touchscreen.
 *
 * @class TouchInput
 */
function TouchInput() {
    throw new Error('This is a static class');
}

/**
 * Initializes the touch system.
 *
 * @static
 * @method initialize
 */
TouchInput.initialize = function() {
    this.clear();
    this._setupEventHandlers();
};

/**
 * The wait time of the pseudo key repeat in frames.
 *
 * @static
 * @property keyRepeatWait
 * @type Number
 */
TouchInput.keyRepeatWait = 24;

/**
 * The interval of the pseudo key repeat in frames.
 *
 * @static
 * @property keyRepeatInterval
 * @type Number
 */
TouchInput.keyRepeatInterval = 6;

/**
 * Clears all the touch data.
 *
 * @static
 * @method clear
 */
TouchInput.clear = function() {
    this._mousePressed = false;
    this._screenPressed = false;
    this._pressedTime = 0;
    this._events = {};
    this._events.triggered = false;
    this._events.cancelled = false;
    this._events.moved = false;
    this._events.released = false;
    this._events.wheelX = 0;
    this._events.wheelY = 0;
    this._triggered = false;
    this._cancelled = false;
    this._moved = false;
    this._released = false;
    this._wheelX = 0;
    this._wheelY = 0;
    this._x = 0;
    this._y = 0;
    this._date = 0;
};

/**
 * Updates the touch data.
 *
 * @static
 * @method update
 */
TouchInput.update = function() {
    this._triggered = this._events.triggered;
    this._cancelled = this._events.cancelled;
    this._moved = this._events.moved;
    this._released = this._events.released;
    this._wheelX = this._events.wheelX;
    this._wheelY = this._events.wheelY;
    this._events.triggered = false;
    this._events.cancelled = false;
    this._events.moved = false;
    this._events.released = false;
    this._events.wheelX = 0;
    this._events.wheelY = 0;
    if (this.isPressed()) {
        this._pressedTime++;
    }
};

/**
 * Checks whether the mouse button or touchscreen is currently pressed down.
 *
 * @static
 * @method isPressed
 * @return {Boolean} True if the mouse button or touchscreen is pressed
 */
TouchInput.isPressed = function() {
    return this._mousePressed || this._screenPressed;
};

/**
 * Checks whether the left mouse button or touchscreen is just pressed.
 *
 * @static
 * @method isTriggered
 * @return {Boolean} True if the mouse button or touchscreen is triggered
 */
TouchInput.isTriggered = function() {
    return this._triggered;
};

/**
 * Checks whether the left mouse button or touchscreen is just pressed
 * or a pseudo key repeat occurred.
 *
 * @static
 * @method isRepeated
 * @return {Boolean} True if the mouse button or touchscreen is repeated
 */
TouchInput.isRepeated = function() {
    return (this.isPressed() &&
            (this._triggered ||
             (this._pressedTime >= this.keyRepeatWait &&
              this._pressedTime % this.keyRepeatInterval === 0)));
};

/**
 * Checks whether the left mouse button or touchscreen is kept depressed.
 *
 * @static
 * @method isLongPressed
 * @return {Boolean} True if the left mouse button or touchscreen is long-pressed
 */
TouchInput.isLongPressed = function() {
    return this.isPressed() && this._pressedTime >= this.keyRepeatWait;
};

/**
 * Checks whether the right mouse button is just pressed.
 *
 * @static
 * @method isCancelled
 * @return {Boolean} True if the right mouse button is just pressed
 */
TouchInput.isCancelled = function() {
    return this._cancelled;
};

/**
 * Checks whether the mouse or a finger on the touchscreen is moved.
 *
 * @static
 * @method isMoved
 * @return {Boolean} True if the mouse or a finger on the touchscreen is moved
 */
TouchInput.isMoved = function() {
    return this._moved;
};

/**
 * Checks whether the left mouse button or touchscreen is released.
 *
 * @static
 * @method isReleased
 * @return {Boolean} True if the mouse button or touchscreen is released
 */
TouchInput.isReleased = function() {
    return this._released;
};

/**
 * [read-only] The horizontal scroll amount.
 *
 * @static
 * @property wheelX
 * @type Number
 */
Object.defineProperty(TouchInput, 'wheelX', {
    get: function() {
        return this._wheelX;
    },
    configurable: true
});

/**
 * [read-only] The vertical scroll amount.
 *
 * @static
 * @property wheelY
 * @type Number
 */
Object.defineProperty(TouchInput, 'wheelY', {
    get: function() {
        return this._wheelY;
    },
    configurable: true
});

/**
 * [read-only] The x coordinate on the canvas area of the latest touch event.
 *
 * @static
 * @property x
 * @type Number
 */
Object.defineProperty(TouchInput, 'x', {
    get: function() {
        return this._x;
    },
    configurable: true
});

/**
 * [read-only] The y coordinate on the canvas area of the latest touch event.
 *
 * @static
 * @property y
 * @type Number
 */
Object.defineProperty(TouchInput, 'y', {
    get: function() {
        return this._y;
    },
    configurable: true
});

/**
 * [read-only] The time of the last input in milliseconds.
 *
 * @static
 * @property date
 * @type Number
 */
Object.defineProperty(TouchInput, 'date', {
    get: function() {
        return this._date;
    },
    configurable: true
});

/**
 * @static
 * @method _setupEventHandlers
 * @private
 */
TouchInput._setupEventHandlers = function() {
    var isSupportPassive = Utils.isSupportPassiveEvent();
    document.addEventListener('mousedown', this._onMouseDown.bind(this));
    document.addEventListener('mousemove', this._onMouseMove.bind(this));
    document.addEventListener('mouseup', this._onMouseUp.bind(this));
    document.addEventListener('wheel', this._onWheel.bind(this));
    document.addEventListener('touchstart', this._onTouchStart.bind(this), isSupportPassive ? {passive: false} : false);
    document.addEventListener('touchmove', this._onTouchMove.bind(this), isSupportPassive ? {passive: false} : false);
    document.addEventListener('touchend', this._onTouchEnd.bind(this));
    document.addEventListener('touchcancel', this._onTouchCancel.bind(this));
    document.addEventListener('pointerdown', this._onPointerDown.bind(this));
};

/**
 * @static
 * @method _onMouseDown
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onMouseDown = function(event) {
    if (event.button === 0) {
        this._onLeftButtonDown(event);
    } else if (event.button === 1) {
        this._onMiddleButtonDown(event);
    } else if (event.button === 2) {
        this._onRightButtonDown(event);
    }
};

/**
 * @static
 * @method _onLeftButtonDown
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onLeftButtonDown = function(event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    if (Graphics.isInsideCanvas(x, y)) {
        this._mousePressed = true;
        this._pressedTime = 0;
        this._onTrigger(x, y);
    }
};

/**
 * @static
 * @method _onMiddleButtonDown
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onMiddleButtonDown = function(event) {
};

/**
 * @static
 * @method _onRightButtonDown
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onRightButtonDown = function(event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    if (Graphics.isInsideCanvas(x, y)) {
        this._onCancel(x, y);
    }
};

/**
 * @static
 * @method _onMouseMove
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onMouseMove = function(event) {
    if (this._mousePressed) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    }
};

/**
 * @static
 * @method _onMouseUp
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onMouseUp = function(event) {
    if (event.button === 0) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._mousePressed = false;
        this._onRelease(x, y);
    }
};

/**
 * @static
 * @method _onWheel
 * @param {WheelEvent} event
 * @private
 */
TouchInput._onWheel = function(event) {
    this._events.wheelX += event.deltaX;
    this._events.wheelY += event.deltaY;
    event.preventDefault();
};

/**
 * @static
 * @method _onTouchStart
 * @param {TouchEvent} event
 * @private
 */
TouchInput._onTouchStart = function(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i];
        var x = Graphics.pageToCanvasX(touch.pageX);
        var y = Graphics.pageToCanvasY(touch.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._screenPressed = true;
            this._pressedTime = 0;
            if (event.touches.length >= 2) {
                this._onCancel(x, y);
            } else {
                this._onTrigger(x, y);
            }
            event.preventDefault();
        }
    }
    if (window.cordova || window.navigator.standalone) {
        event.preventDefault();
    }
};

/**
 * @static
 * @method _onTouchMove
 * @param {TouchEvent} event
 * @private
 */
TouchInput._onTouchMove = function(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i];
        var x = Graphics.pageToCanvasX(touch.pageX);
        var y = Graphics.pageToCanvasY(touch.pageY);
        this._onMove(x, y);
    }
};

/**
 * @static
 * @method _onTouchEnd
 * @param {TouchEvent} event
 * @private
 */
TouchInput._onTouchEnd = function(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i];
        var x = Graphics.pageToCanvasX(touch.pageX);
        var y = Graphics.pageToCanvasY(touch.pageY);
        this._screenPressed = false;
        this._onRelease(x, y);
    }
};

/**
 * @static
 * @method _onTouchCancel
 * @param {TouchEvent} event
 * @private
 */
TouchInput._onTouchCancel = function(event) {
    this._screenPressed = false;
};

/**
 * @static
 * @method _onPointerDown
 * @param {PointerEvent} event
 * @private
 */
TouchInput._onPointerDown = function(event) {
    if (event.pointerType === 'touch' && !event.isPrimary) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            // For Microsoft Edge
            this._onCancel(x, y);
            event.preventDefault();
        }
    }
};

/**
 * @static
 * @method _onTrigger
 * @param {Number} x
 * @param {Number} y
 * @private
 */
TouchInput._onTrigger = function(x, y) {
    this._events.triggered = true;
    this._x = x;
    this._y = y;
    this._date = Date.now();
};

/**
 * @static
 * @method _onCancel
 * @param {Number} x
 * @param {Number} y
 * @private
 */
TouchInput._onCancel = function(x, y) {
    this._events.cancelled = true;
    this._x = x;
    this._y = y;
};

/**
 * @static
 * @method _onMove
 * @param {Number} x
 * @param {Number} y
 * @private
 */
TouchInput._onMove = function(x, y) {
    this._events.moved = true;
    this._x = x;
    this._y = y;
};

/**
 * @static
 * @method _onRelease
 * @param {Number} x
 * @param {Number} y
 * @private
 */
TouchInput._onRelease = function(x, y) {
    this._events.released = true;
    this._x = x;
    this._y = y;
};

//-----------------------------------------------------------------------------
/**
 * The basic object that is rendered to the game screen.
 *
 * @class Sprite
 * @constructor
 * @param {Bitmap} bitmap The image for the sprite
 */
function Sprite() {
    this.initialize.apply(this, arguments);
}

Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.voidFilter = new PIXI.filters.VoidFilter();

Sprite.prototype.initialize = function(bitmap) {
    var texture = new PIXI.Texture(new PIXI.BaseTexture());

    PIXI.Sprite.call(this, texture);

    this._bitmap = null;
    this._frame = new Rectangle();
    this._realFrame = new Rectangle();
    this._blendColor = [0, 0, 0, 0];
    this._colorTone = [0, 0, 0, 0];
    this._canvas = null;
    this._context = null;
    this._tintTexture = null;

    /**
     * use heavy renderer that will reduce border artifacts and apply advanced blendModes
     * @type {boolean}
     * @private
     */
    this._isPicture = false;

    this.spriteId = Sprite._counter++;
    this.opaque = false;

    this.bitmap = bitmap;
};

// Number of the created objects.
Sprite._counter = 0;

/**
 * The image for the sprite.
 *
 * @property bitmap
 * @type Bitmap
 */
Object.defineProperty(Sprite.prototype, 'bitmap', {
    get: function() {
        return this._bitmap;
    },
    set: function(value) {
        if (this._bitmap !== value) {
            this._bitmap = value;

            if(value){
                this._refreshFrame = true;
                value.addLoadListener(this._onBitmapLoad.bind(this));
            }else{
                this._refreshFrame = false;
                this.texture.frame = Rectangle.emptyRectangle;
            }
        }
    },
    configurable: true
});

/**
 * The width of the sprite without the scale.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(Sprite.prototype, 'width', {
    get: function() {
        return this._frame.width;
    },
    set: function(value) {
        this._frame.width = value;
        this._refresh();
    },
    configurable: true
});

/**
 * The height of the sprite without the scale.
 *
 * @property height
 * @type Number
 */
Object.defineProperty(Sprite.prototype, 'height', {
    get: function() {
        return this._frame.height;
    },
    set: function(value) {
        this._frame.height = value;
        this._refresh();
    },
    configurable: true
});

/**
 * The opacity of the sprite (0 to 255).
 *
 * @property opacity
 * @type Number
 */
Object.defineProperty(Sprite.prototype, 'opacity', {
    get: function() {
        return this.alpha * 255;
    },
    set: function(value) {
        this.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**
 * Updates the sprite for each frame.
 *
 * @method update
 */
Sprite.prototype.update = function() {
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
};

/**
 * Sets the x and y at once.
 *
 * @method move
 * @param {Number} x The x coordinate of the sprite
 * @param {Number} y The y coordinate of the sprite
 */
Sprite.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
};

/**
 * Sets the rectagle of the bitmap that the sprite displays.
 *
 * @method setFrame
 * @param {Number} x The x coordinate of the frame
 * @param {Number} y The y coordinate of the frame
 * @param {Number} width The width of the frame
 * @param {Number} height The height of the frame
 */
Sprite.prototype.setFrame = function(x, y, width, height) {
    this._refreshFrame = false;
    var frame = this._frame;
    if (x !== frame.x || y !== frame.y ||
            width !== frame.width || height !== frame.height) {
        frame.x = x;
        frame.y = y;
        frame.width = width;
        frame.height = height;
        this._refresh();
    }
};

/**
 * Gets the blend color for the sprite.
 *
 * @method getBlendColor
 * @return {Array} The blend color [r, g, b, a]
 */
Sprite.prototype.getBlendColor = function() {
    return this._blendColor.clone();
};

/**
 * Sets the blend color for the sprite.
 *
 * @method setBlendColor
 * @param {Array} color The blend color [r, g, b, a]
 */
Sprite.prototype.setBlendColor = function(color) {
    if (!(color instanceof Array)) {
        throw new Error('Argument must be an array');
    }
    if (!this._blendColor.equals(color)) {
        this._blendColor = color.clone();
        this._refresh();
    }
};

/**
 * Gets the color tone for the sprite.
 *
 * @method getColorTone
 * @return {Array} The color tone [r, g, b, gray]
 */
Sprite.prototype.getColorTone = function() {
    return this._colorTone.clone();
};

/**
 * Sets the color tone for the sprite.
 *
 * @method setColorTone
 * @param {Array} tone The color tone [r, g, b, gray]
 */
Sprite.prototype.setColorTone = function(tone) {
    if (!(tone instanceof Array)) {
        throw new Error('Argument must be an array');
    }
    if (!this._colorTone.equals(tone)) {
        this._colorTone = tone.clone();
        this._refresh();
    }
};

/**
 * @method _onBitmapLoad
 * @private
 */
Sprite.prototype._onBitmapLoad = function(bitmapLoaded) {
    if(bitmapLoaded === this._bitmap){
        if (this._refreshFrame && this._bitmap) {
            this._refreshFrame = false;
            this._frame.width = this._bitmap.width;
            this._frame.height = this._bitmap.height;
        }
    }

    this._refresh();
};

/**
 * @method _refresh
 * @private
 */
Sprite.prototype._refresh = function() {
    var frameX = Math.floor(this._frame.x);
    var frameY = Math.floor(this._frame.y);
    var frameW = Math.floor(this._frame.width);
    var frameH = Math.floor(this._frame.height);
    var bitmapW = this._bitmap ? this._bitmap.width : 0;
    var bitmapH = this._bitmap ? this._bitmap.height : 0;
    var realX = frameX.clamp(0, bitmapW);
    var realY = frameY.clamp(0, bitmapH);
    var realW = (frameW - realX + frameX).clamp(0, bitmapW - realX);
    var realH = (frameH - realY + frameY).clamp(0, bitmapH - realY);

    this._realFrame.x = realX;
    this._realFrame.y = realY;
    this._realFrame.width = realW;
    this._realFrame.height = realH;
    this.pivot.x = frameX - realX;
    this.pivot.y = frameY - realY;

    if (realW > 0 && realH > 0) {
        if (this._needsTint()) {
            this._createTinter(realW, realH);
            this._executeTint(realX, realY, realW, realH);
            this._tintTexture.update();
            this.texture.baseTexture = this._tintTexture;
            this.texture.frame = new Rectangle(0, 0, realW, realH);
        } else {
            if (this._bitmap) {
                this.texture.baseTexture = this._bitmap.baseTexture;
            }
            this.texture.frame = this._realFrame;
        }
    } else if (this._bitmap) {
        this.texture.frame = Rectangle.emptyRectangle;
    } else {
        this.texture.baseTexture.width = Math.max(this.texture.baseTexture.width, this._frame.x + this._frame.width);
        this.texture.baseTexture.height = Math.max(this.texture.baseTexture.height, this._frame.y + this._frame.height);
        this.texture.frame = this._frame;
    }
    this.texture._updateID++;
};

/**
 * @method _isInBitmapRect
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @return {Boolean}
 * @private
 */
Sprite.prototype._isInBitmapRect = function(x, y, w, h) {
    return (this._bitmap && x + w > 0 && y + h > 0 &&
            x < this._bitmap.width && y < this._bitmap.height);
};

/**
 * @method _needsTint
 * @return {Boolean}
 * @private
 */
Sprite.prototype._needsTint = function() {
    var tone = this._colorTone;
    return tone[0] || tone[1] || tone[2] || tone[3] || this._blendColor[3] > 0;
};

/**
 * @method _createTinter
 * @param {Number} w
 * @param {Number} h
 * @private
 */
Sprite.prototype._createTinter = function(w, h) {
    if (!this._canvas) {
        this._canvas = document.createElement('canvas');
        this._context = this._canvas.getContext('2d');
    }

    this._canvas.width = w;
    this._canvas.height = h;

    if (!this._tintTexture) {
        this._tintTexture = new PIXI.BaseTexture(this._canvas);
    }

    this._tintTexture.width = w;
    this._tintTexture.height = h;
    this._tintTexture.scaleMode = this._bitmap.baseTexture.scaleMode;
};

/**
 * @method _executeTint
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @private
 */
Sprite.prototype._executeTint = function(x, y, w, h) {
    var context = this._context;
    var tone = this._colorTone;
    var color = this._blendColor;

    context.globalCompositeOperation = 'copy';
    context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);

    if (Graphics.canUseSaturationBlend()) {
        var gray = Math.max(0, tone[3]);
        context.globalCompositeOperation = 'saturation';
        context.fillStyle = 'rgba(255,255,255,' + gray / 255 + ')';
        context.fillRect(0, 0, w, h);
    }

    var r1 = Math.max(0, tone[0]);
    var g1 = Math.max(0, tone[1]);
    var b1 = Math.max(0, tone[2]);
    context.globalCompositeOperation = 'lighter';
    context.fillStyle = Utils.rgbToCssColor(r1, g1, b1);
    context.fillRect(0, 0, w, h);

    if (Graphics.canUseDifferenceBlend()) {
        context.globalCompositeOperation = 'difference';
        context.fillStyle = 'white';
        context.fillRect(0, 0, w, h);

        var r2 = Math.max(0, -tone[0]);
        var g2 = Math.max(0, -tone[1]);
        var b2 = Math.max(0, -tone[2]);
        context.globalCompositeOperation = 'lighter';
        context.fillStyle = Utils.rgbToCssColor(r2, g2, b2);
        context.fillRect(0, 0, w, h);

        context.globalCompositeOperation = 'difference';
        context.fillStyle = 'white';
        context.fillRect(0, 0, w, h);
    }

    var r3 = Math.max(0, color[0]);
    var g3 = Math.max(0, color[1]);
    var b3 = Math.max(0, color[2]);
    var a3 = Math.max(0, color[3]);
    context.globalCompositeOperation = 'source-atop';
    context.fillStyle = Utils.rgbToCssColor(r3, g3, b3);
    context.globalAlpha = a3 / 255;
    context.fillRect(0, 0, w, h);

    context.globalCompositeOperation = 'destination-in';
    context.globalAlpha = 1;
    context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);
};

Sprite.prototype._renderCanvas_PIXI = PIXI.Sprite.prototype._renderCanvas;
Sprite.prototype._renderWebGL_PIXI = PIXI.Sprite.prototype._renderWebGL;

/**
 * @method _renderCanvas
 * @param {Object} renderer
 * @private
 */
Sprite.prototype._renderCanvas = function(renderer) {
    if (this.bitmap) {
        this.bitmap.touch();
    }
    if(this.bitmap && !this.bitmap.isReady()){
        return;
    }

    if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
        this._renderCanvas_PIXI(renderer);
    }
};

/**
 * checks if we need to speed up custom blendmodes
 * @param renderer
 * @private
 */
Sprite.prototype._speedUpCustomBlendModes = function(renderer) {
    var picture = renderer.plugins.picture;
    var blend = this.blendMode;
    if (renderer.renderingToScreen && renderer._activeRenderTarget.root) {
        if (picture.drawModes[blend]) {
            var stage = renderer._lastObjectRendered;
            var f = stage._filters;
            if (!f || !f[0]) {
                setTimeout(function () {
                    var f = stage._filters;
                    if (!f || !f[0]) {
                        stage.filters = [Sprite.voidFilter];
                        stage.filterArea = new PIXI.Rectangle(0, 0, Graphics.width, Graphics.height);
                    }
                }, 0);
            }
        }
    }
};

/**
 * @method _renderWebGL
 * @param {Object} renderer
 * @private
 */
Sprite.prototype._renderWebGL = function(renderer) {
    if (this.bitmap) {
        this.bitmap.touch();
    }
    if(this.bitmap && !this.bitmap.isReady()){
        return;
    }
    if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
        if (this._bitmap) {
            this._bitmap.checkDirty();
        }

        //copy of pixi-v4 internal code
        this.calculateVertices();

        if (this.pluginName === 'sprite' && this._isPicture) {
            // use heavy renderer, which reduces artifacts and applies corrent blendMode,
            // but does not use multitexture optimization
            this._speedUpCustomBlendModes(renderer);
            renderer.setObjectRenderer(renderer.plugins.picture);
            renderer.plugins.picture.render(this);
        } else {
            // use pixi super-speed renderer
            renderer.setObjectRenderer(renderer.plugins[this.pluginName]);
			renderer.plugins[this.pluginName].render(this);
        }
    }
};

// The important members from Pixi.js

/**
 * The visibility of the sprite.
 *
 * @property visible
 * @type Boolean
 */

/**
 * The x coordinate of the sprite.
 *
 * @property x
 * @type Number
 */

/**
 * The y coordinate of the sprite.
 *
 * @property y
 * @type Number
 */

/**
 * The origin point of the sprite. (0,0) to (1,1).
 *
 * @property anchor
 * @type Point
 */

/**
 * The scale factor of the sprite.
 *
 * @property scale
 * @type Point
 */

/**
 * The rotation of the sprite in radians.
 *
 * @property rotation
 * @type Number
 */

/**
 * The blend mode to be applied to the sprite.
 *
 * @property blendMode
 * @type Number
 */

/**
 * Sets the filters for the sprite.
 *
 * @property filters
 * @type Array
 */

/**
 * [read-only] The array of children of the sprite.
 *
 * @property children
 * @type Array
 */

/**
 * [read-only] The object that contains the sprite.
 *
 * @property parent
 * @type Object
 */

/**
 * Adds a child to the container.
 *
 * @method addChild
 * @param {Object} child The child to add
 * @return {Object} The child that was added
 */

/**
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {Object} child The child to add
 * @param {Number} index The index to place the child in
 * @return {Object} The child that was added
 */

/**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {Object} child The child to remove
 * @return {Object} The child that was removed
 */

/**
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {Number} index The index to get the child from
 * @return {Object} The child that was removed
 */

//-----------------------------------------------------------------------------
/**
 * The tilemap which displays 2D tile-based game map.
 *
 * @class Tilemap
 * @constructor
 */
function Tilemap() {
    this.initialize.apply(this, arguments);
}

Tilemap.prototype = Object.create(PIXI.Container.prototype);
Tilemap.prototype.constructor = Tilemap;

Tilemap.prototype.initialize = function() {
    PIXI.Container.call(this);

    this._margin = 20;
    this._width = Graphics.width + this._margin * 2;
    this._height = Graphics.height + this._margin * 2;
    this._tileWidth = 48;
    this._tileHeight = 48;
    this._mapWidth = 0;
    this._mapHeight = 0;
    this._mapData = null;
    this._layerWidth = 0;
    this._layerHeight = 0;
    this._lastTiles = [];

    /**
     * The bitmaps used as a tileset.
     *
     * @property bitmaps
     * @type Array
     */
    this.bitmaps = [];

    /**
     * The origin point of the tilemap for scrolling.
     *
     * @property origin
     * @type Point
     */
    this.origin = new Point();

    /**
     * The tileset flags.
     *
     * @property flags
     * @type Array
     */
    this.flags = [];

    /**
     * The animation count for autotiles.
     *
     * @property animationCount
     * @type Number
     */
    this.animationCount = 0;

    /**
     * Whether the tilemap loops horizontal.
     *
     * @property horizontalWrap
     * @type Boolean
     */
    this.horizontalWrap = false;

    /**
     * Whether the tilemap loops vertical.
     *
     * @property verticalWrap
     * @type Boolean
     */
    this.verticalWrap = false;

    this._createLayers();
    this.refresh();
};

/**
 * The width of the screen in pixels.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(Tilemap.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(value) {
        if (this._width !== value) {
            this._width = value;
            this._createLayers();
        }
    }
});

/**
 * The height of the screen in pixels.
 *
 * @property height
 * @type Number
 */
Object.defineProperty(Tilemap.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(value) {
        if (this._height !== value) {
            this._height = value;
            this._createLayers();
        }
    }
});

/**
 * The width of a tile in pixels.
 *
 * @property tileWidth
 * @type Number
 */
Object.defineProperty(Tilemap.prototype, 'tileWidth', {
    get: function() {
        return this._tileWidth;
    },
    set: function(value) {
        if (this._tileWidth !== value) {
            this._tileWidth = value;
            this._createLayers();
        }
    }
});

/**
 * The height of a tile in pixels.
 *
 * @property tileHeight
 * @type Number
 */
Object.defineProperty(Tilemap.prototype, 'tileHeight', {
    get: function() {
        return this._tileHeight;
    },
    set: function(value) {
        if (this._tileHeight !== value) {
            this._tileHeight = value;
            this._createLayers();
        }
    }
});

/**
 * Sets the tilemap data.
 *
 * @method setData
 * @param {Number} width The width of the map in number of tiles
 * @param {Number} height The height of the map in number of tiles
 * @param {Array} data The one dimensional array for the map data
 */
Tilemap.prototype.setData = function(width, height, data) {
    this._mapWidth = width;
    this._mapHeight = height;
    this._mapData = data;
};

/**
 * Checks whether the tileset is ready to render.
 *
 * @method isReady
 * @type Boolean
 * @return {Boolean} True if the tilemap is ready
 */
Tilemap.prototype.isReady = function() {
    for (var i = 0; i < this.bitmaps.length; i++) {
        if (this.bitmaps[i] && !this.bitmaps[i].isReady()) {
            return false;
        }
    }
    return true;
};

/**
 * Updates the tilemap for each frame.
 *
 * @method update
 */
Tilemap.prototype.update = function() {
    this.animationCount++;
    this.animationFrame = Math.floor(this.animationCount / 30);
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
    for (var i=0; i<this.bitmaps.length;i++) {
        if (this.bitmaps[i]) {
            this.bitmaps[i].touch();
        }
    }
};

/**
 * Forces to repaint the entire tilemap.
 *
 * @method refresh
 */
Tilemap.prototype.refresh = function() {
    this._lastTiles.length = 0;
};

/**
 * Forces to refresh the tileset
 *
 * @method refresh
 */
Tilemap.prototype.refreshTileset = function() {

};

/**
 * @method updateTransform
 * @private
 */
Tilemap.prototype.updateTransform = function() {
    var ox = Math.floor(this.origin.x);
    var oy = Math.floor(this.origin.y);
    var startX = Math.floor((ox - this._margin) / this._tileWidth);
    var startY = Math.floor((oy - this._margin) / this._tileHeight);
    this._updateLayerPositions(startX, startY);
    if (this._needsRepaint || this._lastAnimationFrame !== this.animationFrame ||
        this._lastStartX !== startX || this._lastStartY !== startY) {
        this._frameUpdated = this._lastAnimationFrame !== this.animationFrame;
        this._lastAnimationFrame = this.animationFrame;
        this._lastStartX = startX;
        this._lastStartY = startY;
        this._paintAllTiles(startX, startY);
        this._needsRepaint = false;
    }
    this._sortChildren();
    PIXI.Container.prototype.updateTransform.call(this);
};

/**
 * @method _createLayers
 * @private
 */
Tilemap.prototype._createLayers = function() {
    var width = this._width;
    var height = this._height;
    var margin = this._margin;
    var tileCols = Math.ceil(width / this._tileWidth) + 1;
    var tileRows = Math.ceil(height / this._tileHeight) + 1;
    var layerWidth = tileCols * this._tileWidth;
    var layerHeight = tileRows * this._tileHeight;
    this._lowerBitmap = new Bitmap(layerWidth, layerHeight);
    this._upperBitmap = new Bitmap(layerWidth, layerHeight);
    this._layerWidth = layerWidth;
    this._layerHeight = layerHeight;

    /*
     * Z coordinate:
     *
     * 0 : Lower tiles
     * 1 : Lower characters
     * 3 : Normal characters
     * 4 : Upper tiles
     * 5 : Upper characters
     * 6 : Airship shadow
     * 7 : Balloon
     * 8 : Animation
     * 9 : Destination
     */

    this._lowerLayer = new Sprite();
    this._lowerLayer.move(-margin, -margin, width, height);
    this._lowerLayer.z = 0;

    this._upperLayer = new Sprite();
    this._upperLayer.move(-margin, -margin, width, height);
    this._upperLayer.z = 4;

    for (var i = 0; i < 4; i++) {
        this._lowerLayer.addChild(new Sprite(this._lowerBitmap));
        this._upperLayer.addChild(new Sprite(this._upperBitmap));
    }

    this.addChild(this._lowerLayer);
    this.addChild(this._upperLayer);
};

/**
 * @method _updateLayerPositions
 * @param {Number} startX
 * @param {Number} startY
 * @private
 */
Tilemap.prototype._updateLayerPositions = function(startX, startY) {
    var m = this._margin;
    var ox = Math.floor(this.origin.x);
    var oy = Math.floor(this.origin.y);
    var x2 = (ox - m).mod(this._layerWidth);
    var y2 = (oy - m).mod(this._layerHeight);
    var w1 = this._layerWidth - x2;
    var h1 = this._layerHeight - y2;
    var w2 = this._width - w1;
    var h2 = this._height - h1;

    for (var i = 0; i < 2; i++) {
        var children;
        if (i === 0) {
            children = this._lowerLayer.children;
        } else {
            children = this._upperLayer.children;
        }
        children[0].move(0, 0, w1, h1);
        children[0].setFrame(x2, y2, w1, h1);
        children[1].move(w1, 0, w2, h1);
        children[1].setFrame(0, y2, w2, h1);
        children[2].move(0, h1, w1, h2);
        children[2].setFrame(x2, 0, w1, h2);
        children[3].move(w1, h1, w2, h2);
        children[3].setFrame(0, 0, w2, h2);
    }
};

/**
 * @method _paintAllTiles
 * @param {Number} startX
 * @param {Number} startY
 * @private
 */
Tilemap.prototype._paintAllTiles = function(startX, startY) {
    var tileCols = Math.ceil(this._width / this._tileWidth) + 1;
    var tileRows = Math.ceil(this._height / this._tileHeight) + 1;
    for (var y = 0; y < tileRows; y++) {
        for (var x = 0; x < tileCols; x++) {
            this._paintTiles(startX, startY, x, y);
        }
    }
};

/**
 * @method _paintTiles
 * @param {Number} startX
 * @param {Number} startY
 * @param {Number} x
 * @param {Number} y
 * @private
 */
Tilemap.prototype._paintTiles = function(startX, startY, x, y) {
    var tableEdgeVirtualId = 10000;
    var mx = startX + x;
    var my = startY + y;
    var dx = (mx * this._tileWidth).mod(this._layerWidth);
    var dy = (my * this._tileHeight).mod(this._layerHeight);
    var lx = dx / this._tileWidth;
    var ly = dy / this._tileHeight;
    var tileId0 = this._readMapData(mx, my, 0);
    var tileId1 = this._readMapData(mx, my, 1);
    var tileId2 = this._readMapData(mx, my, 2);
    var tileId3 = this._readMapData(mx, my, 3);
    var shadowBits = this._readMapData(mx, my, 4);
    var upperTileId1 = this._readMapData(mx, my - 1, 1);
    var lowerTiles = [];
    var upperTiles = [];

    if (this._isHigherTile(tileId0)) {
        upperTiles.push(tileId0);
    } else {
        lowerTiles.push(tileId0);
    }
    if (this._isHigherTile(tileId1)) {
        upperTiles.push(tileId1);
    } else {
        lowerTiles.push(tileId1);
    }

    lowerTiles.push(-shadowBits);

    if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
        if (!Tilemap.isShadowingTile(tileId0)) {
            lowerTiles.push(tableEdgeVirtualId + upperTileId1);
        }
    }

    if (this._isOverpassPosition(mx, my)) {
        upperTiles.push(tileId2);
        upperTiles.push(tileId3);
    } else {
        if (this._isHigherTile(tileId2)) {
            upperTiles.push(tileId2);
        } else {
            lowerTiles.push(tileId2);
        }
        if (this._isHigherTile(tileId3)) {
            upperTiles.push(tileId3);
        } else {
            lowerTiles.push(tileId3);
        }
    }

    var lastLowerTiles = this._readLastTiles(0, lx, ly);
    if (!lowerTiles.equals(lastLowerTiles) ||
            (Tilemap.isTileA1(tileId0) && this._frameUpdated)) {
        this._lowerBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
        for (var i = 0; i < lowerTiles.length; i++) {
            var lowerTileId = lowerTiles[i];
            if (lowerTileId < 0) {
                this._drawShadow(this._lowerBitmap, shadowBits, dx, dy);
            } else if (lowerTileId >= tableEdgeVirtualId) {
                this._drawTableEdge(this._lowerBitmap, upperTileId1, dx, dy);
            } else {
                this._drawTile(this._lowerBitmap, lowerTileId, dx, dy);
            }
        }
        this._writeLastTiles(0, lx, ly, lowerTiles);
    }

    var lastUpperTiles = this._readLastTiles(1, lx, ly);
    if (!upperTiles.equals(lastUpperTiles)) {
        this._upperBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
        for (var j = 0; j < upperTiles.length; j++) {
            this._drawTile(this._upperBitmap, upperTiles[j], dx, dy);
        }
        this._writeLastTiles(1, lx, ly, upperTiles);
    }
};

/**
 * @method _readLastTiles
 * @param {Number} i
 * @param {Number} x
 * @param {Number} y
 * @private
 */
Tilemap.prototype._readLastTiles = function(i, x, y) {
    var array1 = this._lastTiles[i];
    if (array1) {
        var array2 = array1[y];
        if (array2) {
            var tiles = array2[x];
            if (tiles) {
                return tiles;
            }
        }
    }
    return [];
};

/**
 * @method _writeLastTiles
 * @param {Number} i
 * @param {Number} x
 * @param {Number} y
 * @param {Array} tiles
 * @private
 */
Tilemap.prototype._writeLastTiles = function(i, x, y, tiles) {
    var array1 = this._lastTiles[i];
    if (!array1) {
        array1 = this._lastTiles[i] = [];
    }
    var array2 = array1[y];
    if (!array2) {
        array2 = array1[y] = [];
    }
    array2[x] = tiles;
};

/**
 * @method _drawTile
 * @param {Bitmap} bitmap
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */
Tilemap.prototype._drawTile = function(bitmap, tileId, dx, dy) {
    if (Tilemap.isVisibleTile(tileId)) {
        if (Tilemap.isAutotile(tileId)) {
            this._drawAutotile(bitmap, tileId, dx, dy);
        } else {
            this._drawNormalTile(bitmap, tileId, dx, dy);
        }
    }
};

/**
 * @method _drawNormalTile
 * @param {Bitmap} bitmap
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */
Tilemap.prototype._drawNormalTile = function(bitmap, tileId, dx, dy) {
    var setNumber = 0;

    if (Tilemap.isTileA5(tileId)) {
        setNumber = 4;
    } else {
        setNumber = 5 + Math.floor(tileId / 256);
    }

    var w = this._tileWidth;
    var h = this._tileHeight;
    var sx = (Math.floor(tileId / 128) % 2 * 8 + tileId % 8) * w;
    var sy = (Math.floor(tileId % 256 / 8) % 16) * h;

    var source = this.bitmaps[setNumber];
    if (source) {
        bitmap.bltImage(source, sx, sy, w, h, dx, dy, w, h);
    }
};

/**
 * @method _drawAutotile
 * @param {Bitmap} bitmap
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */
Tilemap.prototype._drawAutotile = function(bitmap, tileId, dx, dy) {
    var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
    var kind = Tilemap.getAutotileKind(tileId);
    var shape = Tilemap.getAutotileShape(tileId);
    var tx = kind % 8;
    var ty = Math.floor(kind / 8);
    var bx = 0;
    var by = 0;
    var setNumber = 0;
    var isTable = false;

    if (Tilemap.isTileA1(tileId)) {
        var waterSurfaceIndex = [0, 1, 2, 1][this.animationFrame % 4];
        setNumber = 0;
        if (kind === 0) {
            bx = waterSurfaceIndex * 2;
            by = 0;
        } else if (kind === 1) {
            bx = waterSurfaceIndex * 2;
            by = 3;
        } else if (kind === 2) {
            bx = 6;
            by = 0;
        } else if (kind === 3) {
            bx = 6;
            by = 3;
        } else {
            bx = Math.floor(tx / 4) * 8;
            by = ty * 6 + Math.floor(tx / 2) % 2 * 3;
            if (kind % 2 === 0) {
                bx += waterSurfaceIndex * 2;
            }
            else {
                bx += 6;
                autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
                by += this.animationFrame % 3;
            }
        }
    } else if (Tilemap.isTileA2(tileId)) {
        setNumber = 1;
        bx = tx * 2;
        by = (ty - 2) * 3;
        isTable = this._isTableTile(tileId);
    } else if (Tilemap.isTileA3(tileId)) {
        setNumber = 2;
        bx = tx * 2;
        by = (ty - 6) * 2;
        autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
    } else if (Tilemap.isTileA4(tileId)) {
        setNumber = 3;
        bx = tx * 2;
        by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
        if (ty % 2 === 1) {
            autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
        }
    }

    var table = autotileTable[shape];
    var source = this.bitmaps[setNumber];

    if (table && source) {
        var w1 = this._tileWidth / 2;
        var h1 = this._tileHeight / 2;
        for (var i = 0; i < 4; i++) {
            var qsx = table[i][0];
            var qsy = table[i][1];
            var sx1 = (bx * 2 + qsx) * w1;
            var sy1 = (by * 2 + qsy) * h1;
            var dx1 = dx + (i % 2) * w1;
            var dy1 = dy + Math.floor(i / 2) * h1;
            if (isTable && (qsy === 1 || qsy === 5)) {
                var qsx2 = qsx;
                var qsy2 = 3;
                if (qsy === 1) {
                    qsx2 = [0,3,2,1][qsx];
                }
                var sx2 = (bx * 2 + qsx2) * w1;
                var sy2 = (by * 2 + qsy2) * h1;
                bitmap.bltImage(source, sx2, sy2, w1, h1, dx1, dy1, w1, h1);
                dy1 += h1/2;
                bitmap.bltImage(source, sx1, sy1, w1, h1/2, dx1, dy1, w1, h1/2);
            } else {
                bitmap.bltImage(source, sx1, sy1, w1, h1, dx1, dy1, w1, h1);
            }
        }
    }
};

/**
 * @method _drawTableEdge
 * @param {Bitmap} bitmap
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */
Tilemap.prototype._drawTableEdge = function(bitmap, tileId, dx, dy) {
    if (Tilemap.isTileA2(tileId)) {
        var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
        var kind = Tilemap.getAutotileKind(tileId);
        var shape = Tilemap.getAutotileShape(tileId);
        var tx = kind % 8;
        var ty = Math.floor(kind / 8);
        var setNumber = 1;
        var bx = tx * 2;
        var by = (ty - 2) * 3;
        var table = autotileTable[shape];

        if (table) {
            var source = this.bitmaps[setNumber];
            var w1 = this._tileWidth / 2;
            var h1 = this._tileHeight / 2;
            for (var i = 0; i < 2; i++) {
                var qsx = table[2 + i][0];
                var qsy = table[2 + i][1];
                var sx1 = (bx * 2 + qsx) * w1;
                var sy1 = (by * 2 + qsy) * h1 + h1/2;
                var dx1 = dx + (i % 2) * w1;
                var dy1 = dy + Math.floor(i / 2) * h1;
                bitmap.bltImage(source, sx1, sy1, w1, h1/2, dx1, dy1, w1, h1/2);
            }
        }
    }
};

/**
 * @method _drawShadow
 * @param {Bitmap} bitmap
 * @param {Number} shadowBits
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */
Tilemap.prototype._drawShadow = function(bitmap, shadowBits, dx, dy) {
    if (shadowBits & 0x0f) {
        var w1 = this._tileWidth / 2;
        var h1 = this._tileHeight / 2;
        var color = 'rgba(0,0,0,0.5)';
        for (var i = 0; i < 4; i++) {
            if (shadowBits & (1 << i)) {
                var dx1 = dx + (i % 2) * w1;
                var dy1 = dy + Math.floor(i / 2) * h1;
                bitmap.fillRect(dx1, dy1, w1, h1, color);
            }
        }
    }
};

/**
 * @method _readMapData
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @return {Number}
 * @private
 */
Tilemap.prototype._readMapData = function(x, y, z) {
    if (this._mapData) {
        var width = this._mapWidth;
        var height = this._mapHeight;
        if (this.horizontalWrap) {
            x = x.mod(width);
        }
        if (this.verticalWrap) {
            y = y.mod(height);
        }
        if (x >= 0 && x < width && y >= 0 && y < height) {
            return this._mapData[(z * height + y) * width + x] || 0;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
};

/**
 * @method _isHigherTile
 * @param {Number} tileId
 * @return {Boolean}
 * @private
 */
Tilemap.prototype._isHigherTile = function(tileId) {
    return this.flags[tileId] & 0x10;
};

/**
 * @method _isTableTile
 * @param {Number} tileId
 * @return {Boolean}
 * @private
 */
Tilemap.prototype._isTableTile = function(tileId) {
    return Tilemap.isTileA2(tileId) && (this.flags[tileId] & 0x80);
};

/**
 * @method _isOverpassPosition
 * @param {Number} mx
 * @param {Number} my
 * @return {Boolean}
 * @private
 */
Tilemap.prototype._isOverpassPosition = function(mx, my) {
    return false;
};

/**
 * @method _sortChildren
 * @private
 */
Tilemap.prototype._sortChildren = function() {
    this.children.sort(this._compareChildOrder.bind(this));
};

/**
 * @method _compareChildOrder
 * @param {Object} a
 * @param {Object} b
 * @private
 */
Tilemap.prototype._compareChildOrder = function(a, b) {
    if (a.z !== b.z) {
        return a.z - b.z;
    } else if (a.y !== b.y) {
        return a.y - b.y;
    } else {
        return a.spriteId - b.spriteId;
    }
};

// Tile type checkers

Tilemap.TILE_ID_B      = 0;
Tilemap.TILE_ID_C      = 256;
Tilemap.TILE_ID_D      = 512;
Tilemap.TILE_ID_E      = 768;
Tilemap.TILE_ID_A5     = 1536;
Tilemap.TILE_ID_A1     = 2048;
Tilemap.TILE_ID_A2     = 2816;
Tilemap.TILE_ID_A3     = 4352;
Tilemap.TILE_ID_A4     = 5888;
Tilemap.TILE_ID_MAX    = 8192;

Tilemap.isVisibleTile = function(tileId) {
    return tileId > 0 && tileId < this.TILE_ID_MAX;
};

Tilemap.isAutotile = function(tileId) {
    return tileId >= this.TILE_ID_A1;
};

Tilemap.getAutotileKind = function(tileId) {
    return Math.floor((tileId - this.TILE_ID_A1) / 48);
};

Tilemap.getAutotileShape = function(tileId) {
    return (tileId - this.TILE_ID_A1) % 48;
};

Tilemap.makeAutotileId = function(kind, shape) {
    return this.TILE_ID_A1 + kind * 48 + shape;
};

Tilemap.isSameKindTile = function(tileID1, tileID2) {
    if (this.isAutotile(tileID1) && this.isAutotile(tileID2)) {
        return this.getAutotileKind(tileID1) === this.getAutotileKind(tileID2);
    } else {
        return tileID1 === tileID2;
    }
};

Tilemap.isTileA1 = function(tileId) {
    return tileId >= this.TILE_ID_A1 && tileId < this.TILE_ID_A2;
};

Tilemap.isTileA2 = function(tileId) {
    return tileId >= this.TILE_ID_A2 && tileId < this.TILE_ID_A3;
};

Tilemap.isTileA3 = function(tileId) {
    return tileId >= this.TILE_ID_A3 && tileId < this.TILE_ID_A4;
};

Tilemap.isTileA4 = function(tileId) {
    return tileId >= this.TILE_ID_A4 && tileId < this.TILE_ID_MAX;
};

Tilemap.isTileA5 = function(tileId) {
    return tileId >= this.TILE_ID_A5 && tileId < this.TILE_ID_A1;
};

Tilemap.isWaterTile = function(tileId) {
    if (this.isTileA1(tileId)) {
        return !(tileId >= this.TILE_ID_A1 + 96 && tileId < this.TILE_ID_A1 + 192);
    } else {
        return false;
    }
};

Tilemap.isWaterfallTile = function(tileId) {
    if (tileId >= this.TILE_ID_A1 + 192 && tileId < this.TILE_ID_A2) {
        return this.getAutotileKind(tileId) % 2 === 1;
    } else {
        return false;
    }
};

Tilemap.isGroundTile = function(tileId) {
    return this.isTileA1(tileId) || this.isTileA2(tileId) || this.isTileA5(tileId);
};

Tilemap.isShadowingTile = function(tileId) {
    return this.isTileA3(tileId) || this.isTileA4(tileId);
};

Tilemap.isRoofTile = function(tileId) {
    return this.isTileA3(tileId) && this.getAutotileKind(tileId) % 16 < 8;
};

Tilemap.isWallTopTile = function(tileId) {
    return this.isTileA4(tileId) && this.getAutotileKind(tileId) % 16 < 8;
};

Tilemap.isWallSideTile = function(tileId) {
    return (this.isTileA3(tileId) || this.isTileA4(tileId)) &&
            this.getAutotileKind(tileId) % 16 >= 8;
};

Tilemap.isWallTile = function(tileId) {
    return this.isWallTopTile(tileId) || this.isWallSideTile(tileId);
};

Tilemap.isFloorTypeAutotile = function(tileId) {
    return (this.isTileA1(tileId) && !this.isWaterfallTile(tileId)) ||
            this.isTileA2(tileId) || this.isWallTopTile(tileId);
};

Tilemap.isWallTypeAutotile = function(tileId) {
    return this.isRoofTile(tileId) || this.isWallSideTile(tileId);
};

Tilemap.isWaterfallTypeAutotile = function(tileId) {
    return this.isWaterfallTile(tileId);
};

// Autotile shape number to coordinates of tileset images

Tilemap.FLOOR_AUTOTILE_TABLE = [
    [[2,4],[1,4],[2,3],[1,3]],[[2,0],[1,4],[2,3],[1,3]],
    [[2,4],[3,0],[2,3],[1,3]],[[2,0],[3,0],[2,3],[1,3]],
    [[2,4],[1,4],[2,3],[3,1]],[[2,0],[1,4],[2,3],[3,1]],
    [[2,4],[3,0],[2,3],[3,1]],[[2,0],[3,0],[2,3],[3,1]],
    [[2,4],[1,4],[2,1],[1,3]],[[2,0],[1,4],[2,1],[1,3]],
    [[2,4],[3,0],[2,1],[1,3]],[[2,0],[3,0],[2,1],[1,3]],
    [[2,4],[1,4],[2,1],[3,1]],[[2,0],[1,4],[2,1],[3,1]],
    [[2,4],[3,0],[2,1],[3,1]],[[2,0],[3,0],[2,1],[3,1]],
    [[0,4],[1,4],[0,3],[1,3]],[[0,4],[3,0],[0,3],[1,3]],
    [[0,4],[1,4],[0,3],[3,1]],[[0,4],[3,0],[0,3],[3,1]],
    [[2,2],[1,2],[2,3],[1,3]],[[2,2],[1,2],[2,3],[3,1]],
    [[2,2],[1,2],[2,1],[1,3]],[[2,2],[1,2],[2,1],[3,1]],
    [[2,4],[3,4],[2,3],[3,3]],[[2,4],[3,4],[2,1],[3,3]],
    [[2,0],[3,4],[2,3],[3,3]],[[2,0],[3,4],[2,1],[3,3]],
    [[2,4],[1,4],[2,5],[1,5]],[[2,0],[1,4],[2,5],[1,5]],
    [[2,4],[3,0],[2,5],[1,5]],[[2,0],[3,0],[2,5],[1,5]],
    [[0,4],[3,4],[0,3],[3,3]],[[2,2],[1,2],[2,5],[1,5]],
    [[0,2],[1,2],[0,3],[1,3]],[[0,2],[1,2],[0,3],[3,1]],
    [[2,2],[3,2],[2,3],[3,3]],[[2,2],[3,2],[2,1],[3,3]],
    [[2,4],[3,4],[2,5],[3,5]],[[2,0],[3,4],[2,5],[3,5]],
    [[0,4],[1,4],[0,5],[1,5]],[[0,4],[3,0],[0,5],[1,5]],
    [[0,2],[3,2],[0,3],[3,3]],[[0,2],[1,2],[0,5],[1,5]],
    [[0,4],[3,4],[0,5],[3,5]],[[2,2],[3,2],[2,5],[3,5]],
    [[0,2],[3,2],[0,5],[3,5]],[[0,0],[1,0],[0,1],[1,1]]
];

Tilemap.WALL_AUTOTILE_TABLE = [
    [[2,2],[1,2],[2,1],[1,1]],[[0,2],[1,2],[0,1],[1,1]],
    [[2,0],[1,0],[2,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]],
    [[2,2],[3,2],[2,1],[3,1]],[[0,2],[3,2],[0,1],[3,1]],
    [[2,0],[3,0],[2,1],[3,1]],[[0,0],[3,0],[0,1],[3,1]],
    [[2,2],[1,2],[2,3],[1,3]],[[0,2],[1,2],[0,3],[1,3]],
    [[2,0],[1,0],[2,3],[1,3]],[[0,0],[1,0],[0,3],[1,3]],
    [[2,2],[3,2],[2,3],[3,3]],[[0,2],[3,2],[0,3],[3,3]],
    [[2,0],[3,0],[2,3],[3,3]],[[0,0],[3,0],[0,3],[3,3]]
];

Tilemap.WATERFALL_AUTOTILE_TABLE = [
    [[2,0],[1,0],[2,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]],
    [[2,0],[3,0],[2,1],[3,1]],[[0,0],[3,0],[0,1],[3,1]]
];

// The important members from Pixi.js

/**
 * [read-only] The array of children of the tilemap.
 *
 * @property children
 * @type Array
 */

/**
 * [read-only] The object that contains the tilemap.
 *
 * @property parent
 * @type Object
 */

/**
 * Adds a child to the container.
 *
 * @method addChild
 * @param {Object} child The child to add
 * @return {Object} The child that was added
 */

/**
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {Object} child The child to add
 * @param {Number} index The index to place the child in
 * @return {Object} The child that was added
 */

/**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {Object} child The child to remove
 * @return {Object} The child that was removed
 */

/**
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {Number} index The index to get the child from
 * @return {Object} The child that was removed
 */

//-----------------------------------------------------------------------------
/**
 * The tilemap which displays 2D tile-based game map using shaders
 *
 * @class Tilemap
 * @constructor
 */
function ShaderTilemap() {
    Tilemap.apply(this, arguments);
    this.roundPixels = true;
}

ShaderTilemap.prototype = Object.create(Tilemap.prototype);
ShaderTilemap.prototype.constructor = ShaderTilemap;

// we need this constant for some platforms (Samsung S4, S5, Tab4, HTC One H8)
PIXI.glCore.VertexArrayObject.FORCE_NATIVE = true;
PIXI.settings.GC_MODE = PIXI.GC_MODES.AUTO;
PIXI.tilemap.TileRenderer.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.tilemap.TileRenderer.DO_CLEAR = true;

/**
 * Uploads animation state in renderer
 *
 * @method _hackRenderer
 * @private
 */
ShaderTilemap.prototype._hackRenderer = function(renderer) {
    var af = this.animationFrame % 4;
    if (af==3) af = 1;
    renderer.plugins.tilemap.tileAnim[0] = af * this._tileWidth;
    renderer.plugins.tilemap.tileAnim[1] = (this.animationFrame % 3) * this._tileHeight;
    return renderer;
};

/**
 * PIXI render method
 *
 * @method renderCanvas
 * @param {Object} pixi renderer
 */
ShaderTilemap.prototype.renderCanvas = function(renderer) {
    this._hackRenderer(renderer);
    PIXI.Container.prototype.renderCanvas.call(this, renderer);
};


/**
 * PIXI render method
 *
 * @method renderWebGL
 * @param {Object} pixi renderer
 */
ShaderTilemap.prototype.renderWebGL = function(renderer) {
    this._hackRenderer(renderer);
    PIXI.Container.prototype.renderWebGL.call(this, renderer);
};

/**
 * Forces to repaint the entire tilemap AND update bitmaps list if needed
 *
 * @method refresh
 */
ShaderTilemap.prototype.refresh = function() {
    if (this._lastBitmapLength !== this.bitmaps.length) {
        this._lastBitmapLength = this.bitmaps.length;
        this.refreshTileset();
    };
    this._needsRepaint = true;
};

/**
 * Call after you update tileset
 *
 * @method updateBitmaps
 */
ShaderTilemap.prototype.refreshTileset = function() {
    var bitmaps = this.bitmaps.map(function(x) { return x._baseTexture ? new PIXI.Texture(x._baseTexture) : x; } );
    this.lowerLayer.setBitmaps(bitmaps);
    this.upperLayer.setBitmaps(bitmaps);
};

/**
 * @method updateTransform
 * @private
 */
ShaderTilemap.prototype.updateTransform = function() {
    if (this.roundPixels) {
        var ox = Math.floor(this.origin.x);
        var oy = Math.floor(this.origin.y);
    } else {
        ox = this.origin.x;
        oy = this.origin.y;
    }
    var startX = Math.floor((ox - this._margin) / this._tileWidth);
    var startY = Math.floor((oy - this._margin) / this._tileHeight);
    this._updateLayerPositions(startX, startY);
    if (this._needsRepaint ||
        this._lastStartX !== startX || this._lastStartY !== startY) {
        this._lastStartX = startX;
        this._lastStartY = startY;
        this._paintAllTiles(startX, startY);
        this._needsRepaint = false;
    }
    this._sortChildren();
    PIXI.Container.prototype.updateTransform.call(this);
};

/**
 * @method _createLayers
 * @private
 */
ShaderTilemap.prototype._createLayers = function() {
    var width = this._width;
    var height = this._height;
    var margin = this._margin;
    var tileCols = Math.ceil(width / this._tileWidth) + 1;
    var tileRows = Math.ceil(height / this._tileHeight) + 1;
    var layerWidth = this._layerWidth = tileCols * this._tileWidth;
    var layerHeight = this._layerHeight = tileRows * this._tileHeight;
    this._needsRepaint = true;

    if (!this.lowerZLayer) {
        //@hackerham: create layers only in initialization. Doesn't depend on width/height
        this.addChild(this.lowerZLayer = new PIXI.tilemap.ZLayer(this, 0));
        this.addChild(this.upperZLayer = new PIXI.tilemap.ZLayer(this, 4));

        var parameters = PluginManager.parameters('ShaderTilemap');
        var useSquareShader = Number(parameters.hasOwnProperty('squareShader') ? parameters['squareShader'] : 0);

        this.lowerZLayer.addChild(this.lowerLayer = new PIXI.tilemap.CompositeRectTileLayer(0, [], useSquareShader));
        this.lowerLayer.shadowColor = new Float32Array([0.0, 0.0, 0.0, 0.5]);
        this.upperZLayer.addChild(this.upperLayer = new PIXI.tilemap.CompositeRectTileLayer(4, [], useSquareShader));
    }
};

/**
 * @method _updateLayerPositions
 * @param {Number} startX
 * @param {Number} startY
 * @private
 */
ShaderTilemap.prototype._updateLayerPositions = function(startX, startY) {
    if (this.roundPixels) {
        var ox = Math.floor(this.origin.x);
        var oy = Math.floor(this.origin.y);
    } else {
        ox = this.origin.x;
        oy = this.origin.y;
    }
    this.lowerZLayer.position.x = startX * this._tileWidth - ox;
    this.lowerZLayer.position.y = startY * this._tileHeight - oy;
    this.upperZLayer.position.x = startX * this._tileWidth - ox;
    this.upperZLayer.position.y = startY * this._tileHeight - oy;
};

/**
 * @method _paintAllTiles
 * @param {Number} startX
 * @param {Number} startY
 * @private
 */
ShaderTilemap.prototype._paintAllTiles = function(startX, startY) {
    this.lowerZLayer.clear();
    this.upperZLayer.clear();
    var tileCols = Math.ceil(this._width / this._tileWidth) + 1;
    var tileRows = Math.ceil(this._height / this._tileHeight) + 1;
    for (var y = 0; y < tileRows; y++) {
        for (var x = 0; x < tileCols; x++) {
            this._paintTiles(startX, startY, x, y);
        }
    }
};

/**
 * @method _paintTiles
 * @param {Number} startX
 * @param {Number} startY
 * @param {Number} x
 * @param {Number} y
 * @private
 */
ShaderTilemap.prototype._paintTiles = function(startX, startY, x, y) {
    var mx = startX + x;
    var my = startY + y;
    var dx = x * this._tileWidth, dy = y * this._tileHeight;
    var tileId0 = this._readMapData(mx, my, 0);
    var tileId1 = this._readMapData(mx, my, 1);
    var tileId2 = this._readMapData(mx, my, 2);
    var tileId3 = this._readMapData(mx, my, 3);
    var shadowBits = this._readMapData(mx, my, 4);
    var upperTileId1 = this._readMapData(mx, my - 1, 1);
    var lowerLayer = this.lowerLayer.children[0];
    var upperLayer = this.upperLayer.children[0];

    if (this._isHigherTile(tileId0)) {
        this._drawTile(upperLayer, tileId0, dx, dy);
    } else {
        this._drawTile(lowerLayer, tileId0, dx, dy);
    }
    if (this._isHigherTile(tileId1)) {
        this._drawTile(upperLayer, tileId1, dx, dy);
    } else {
        this._drawTile(lowerLayer, tileId1, dx, dy);
    }

    this._drawShadow(lowerLayer, shadowBits, dx, dy);
    if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
        if (!Tilemap.isShadowingTile(tileId0)) {
            this._drawTableEdge(lowerLayer, upperTileId1, dx, dy);
        }
    }

    if (this._isOverpassPosition(mx, my)) {
        this._drawTile(upperLayer, tileId2, dx, dy);
        this._drawTile(upperLayer, tileId3, dx, dy);
    } else {
        if (this._isHigherTile(tileId2)) {
            this._drawTile(upperLayer, tileId2, dx, dy);
        } else {
            this._drawTile(lowerLayer, tileId2, dx, dy);
        }
        if (this._isHigherTile(tileId3)) {
            this._drawTile(upperLayer, tileId3, dx, dy);
        } else {
            this._drawTile(lowerLayer, tileId3, dx, dy);
        }
    }
};

/**
 * @method _drawTile
 * @param {Array} layers
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */
ShaderTilemap.prototype._drawTile = function(layer, tileId, dx, dy) {
    if (Tilemap.isVisibleTile(tileId)) {
        if (Tilemap.isAutotile(tileId)) {
            this._drawAutotile(layer, tileId, dx, dy);
        } else {
            this._drawNormalTile(layer, tileId, dx, dy);
        }
    }
};

/**
 * @method _drawNormalTile
 * @param {Array} layers
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */
ShaderTilemap.prototype._drawNormalTile = function(layer, tileId, dx, dy) {
    var setNumber = 0;

    if (Tilemap.isTileA5(tileId)) {
        setNumber = 4;
    } else {
        setNumber = 5 + Math.floor(tileId / 256);
    }

    var w = this._tileWidth;
    var h = this._tileHeight;
    var sx = (Math.floor(tileId / 128) % 2 * 8 + tileId % 8) * w;
    var sy = (Math.floor(tileId % 256 / 8) % 16) * h;

    layer.addRect(setNumber, sx, sy, dx, dy, w, h);
};

/**
 * @method _drawAutotile
 * @param {Array} layers
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */
ShaderTilemap.prototype._drawAutotile = function(layer, tileId, dx, dy) {
    var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
    var kind = Tilemap.getAutotileKind(tileId);
    var shape = Tilemap.getAutotileShape(tileId);
    var tx = kind % 8;
    var ty = Math.floor(kind / 8);
    var bx = 0;
    var by = 0;
    var setNumber = 0;
    var isTable = false;
    var animX = 0, animY = 0;

    if (Tilemap.isTileA1(tileId)) {
        setNumber = 0;
        if (kind === 0) {
            animX = 2;
            by = 0;
        } else if (kind === 1) {
            animX = 2;
            by = 3;
        } else if (kind === 2) {
            bx = 6;
            by = 0;
        } else if (kind === 3) {
            bx = 6;
            by = 3;
        } else {
            bx = Math.floor(tx / 4) * 8;
            by = ty * 6 + Math.floor(tx / 2) % 2 * 3;
            if (kind % 2 === 0) {
                animX = 2;
            }
            else {
                bx += 6;
                autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
                animY = 1;
            }
        }
    } else if (Tilemap.isTileA2(tileId)) {
        setNumber = 1;
        bx = tx * 2;
        by = (ty - 2) * 3;
        isTable = this._isTableTile(tileId);
    } else if (Tilemap.isTileA3(tileId)) {
        setNumber = 2;
        bx = tx * 2;
        by = (ty - 6) * 2;
        autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
    } else if (Tilemap.isTileA4(tileId)) {
        setNumber = 3;
        bx = tx * 2;
        by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
        if (ty % 2 === 1) {
            autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
        }
    }

    var table = autotileTable[shape];
    var w1 = this._tileWidth / 2;
    var h1 = this._tileHeight / 2;
    for (var i = 0; i < 4; i++) {
        var qsx = table[i][0];
        var qsy = table[i][1];
        var sx1 = (bx * 2 + qsx) * w1;
        var sy1 = (by * 2 + qsy) * h1;
        var dx1 = dx + (i % 2) * w1;
        var dy1 = dy + Math.floor(i / 2) * h1;
        if (isTable && (qsy === 1 || qsy === 5)) {
            var qsx2 = qsx;
            var qsy2 = 3;
            if (qsy === 1) {
                //qsx2 = [0, 3, 2, 1][qsx];
                qsx2 = (4-qsx)%4;
            }
            var sx2 = (bx * 2 + qsx2) * w1;
            var sy2 = (by * 2 + qsy2) * h1;
            layer.addRect(setNumber, sx2, sy2, dx1, dy1, w1, h1, animX, animY);
            layer.addRect(setNumber, sx1, sy1, dx1, dy1+h1/2, w1, h1/2, animX, animY);
        } else {
            layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1, animX, animY);
        }
    }
};

/**
 * @method _drawTableEdge
 * @param {Array} layers
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */
ShaderTilemap.prototype._drawTableEdge = function(layer, tileId, dx, dy) {
    if (Tilemap.isTileA2(tileId)) {
        var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
        var kind = Tilemap.getAutotileKind(tileId);
        var shape = Tilemap.getAutotileShape(tileId);
        var tx = kind % 8;
        var ty = Math.floor(kind / 8);
        var setNumber = 1;
        var bx = tx * 2;
        var by = (ty - 2) * 3;
        var table = autotileTable[shape];
        var w1 = this._tileWidth / 2;
        var h1 = this._tileHeight / 2;
        for (var i = 0; i < 2; i++) {
            var qsx = table[2 + i][0];
            var qsy = table[2 + i][1];
            var sx1 = (bx * 2 + qsx) * w1;
            var sy1 = (by * 2 + qsy) * h1 + h1 / 2;
            var dx1 = dx + (i % 2) * w1;
            var dy1 = dy + Math.floor(i / 2) * h1;
            layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1/2);
        }
    }
};

/**
 * @method _drawShadow
 * @param {Number} shadowBits
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */
ShaderTilemap.prototype._drawShadow = function(layer, shadowBits, dx, dy) {
    if (shadowBits & 0x0f) {
        var w1 = this._tileWidth / 2;
        var h1 = this._tileHeight / 2;
        for (var i = 0; i < 4; i++) {
            if (shadowBits & (1 << i)) {
                var dx1 = dx + (i % 2) * w1;
                var dy1 = dy + Math.floor(i / 2) * h1;
                layer.addRect(-1, 0, 0, dx1, dy1, w1, h1);
            }
        }
    }
};
//-----------------------------------------------------------------------------
/**
 * The sprite object for a tiling image.
 *
 * @class TilingSprite
 * @constructor
 * @param {Bitmap} bitmap The image for the tiling sprite
 */
function TilingSprite() {
    this.initialize.apply(this, arguments);
}

TilingSprite.prototype = Object.create(PIXI.extras.PictureTilingSprite.prototype);
TilingSprite.prototype.constructor = TilingSprite;

TilingSprite.prototype.initialize = function(bitmap) {
    var texture = new PIXI.Texture(new PIXI.BaseTexture());

    PIXI.extras.PictureTilingSprite.call(this, texture);

    this._bitmap = null;
    this._width = 0;
    this._height = 0;
    this._frame = new Rectangle();
    this.spriteId = Sprite._counter++;
    /**
     * The origin point of the tiling sprite for scrolling.
     *
     * @property origin
     * @type Point
     */
    this.origin = new Point();

    this.bitmap = bitmap;
};

TilingSprite.prototype._renderCanvas_PIXI = PIXI.extras.PictureTilingSprite.prototype._renderCanvas;
TilingSprite.prototype._renderWebGL_PIXI = PIXI.extras.PictureTilingSprite.prototype._renderWebGL;

/**
 * @method _renderCanvas
 * @param {Object} renderer
 * @private
 */
TilingSprite.prototype._renderCanvas = function(renderer) {
    if (this._bitmap) {
        this._bitmap.touch();
    }
    if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
        this._renderCanvas_PIXI(renderer);
    }
};

/**
 * @method _renderWebGL
 * @param {Object} renderer
 * @private
 */
TilingSprite.prototype._renderWebGL = function(renderer) {
    if (this._bitmap) {
        this._bitmap.touch();
    }
    if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
        if (this._bitmap) {
            this._bitmap.checkDirty();
        }
        this._renderWebGL_PIXI(renderer);
    }
};

/**
 * The image for the tiling sprite.
 *
 * @property bitmap
 * @type Bitmap
 */
Object.defineProperty(TilingSprite.prototype, 'bitmap', {
    get: function() {
        return this._bitmap;
    },
    set: function(value) {
        if (this._bitmap !== value) {
            this._bitmap = value;
            if (this._bitmap) {
                this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
            } else {
                this.texture.frame = Rectangle.emptyRectangle;
            }
        }
    },
    configurable: true
});

/**
 * The opacity of the tiling sprite (0 to 255).
 *
 * @property opacity
 * @type Number
 */
Object.defineProperty(TilingSprite.prototype, 'opacity', {
    get: function() {
        return this.alpha * 255;
    },
    set: function(value) {
        this.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**
 * Updates the tiling sprite for each frame.
 *
 * @method update
 */
TilingSprite.prototype.update = function() {
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
};

/**
 * Sets the x, y, width, and height all at once.
 *
 * @method move
 * @param {Number} x The x coordinate of the tiling sprite
 * @param {Number} y The y coordinate of the tiling sprite
 * @param {Number} width The width of the tiling sprite
 * @param {Number} height The height of the tiling sprite
 */
TilingSprite.prototype.move = function(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this._width = width || 0;
    this._height = height || 0;
};

/**
 * Specifies the region of the image that the tiling sprite will use.
 *
 * @method setFrame
 * @param {Number} x The x coordinate of the frame
 * @param {Number} y The y coordinate of the frame
 * @param {Number} width The width of the frame
 * @param {Number} height The height of the frame
 */
TilingSprite.prototype.setFrame = function(x, y, width, height) {
    this._frame.x = x;
    this._frame.y = y;
    this._frame.width = width;
    this._frame.height = height;
    this._refresh();
};

/**
 * @method updateTransform
 * @private
 */
TilingSprite.prototype.updateTransform = function() {
    this.tilePosition.x = Math.round(-this.origin.x);
    this.tilePosition.y = Math.round(-this.origin.y);
    this.updateTransformTS();
};

TilingSprite.prototype.updateTransformTS = PIXI.extras.TilingSprite.prototype.updateTransform;

/**
 * @method _onBitmapLoad
 * @private
 */
TilingSprite.prototype._onBitmapLoad = function() {
    this.texture.baseTexture = this._bitmap.baseTexture;
    this._refresh();
};

/**
 * @method _refresh
 * @private
 */
TilingSprite.prototype._refresh = function() {
    var frame = this._frame.clone();
    if (frame.width === 0 && frame.height === 0 && this._bitmap) {
        frame.width = this._bitmap.width;
        frame.height = this._bitmap.height;
    }
    this.texture.frame = frame;
    this.texture._updateID++;
    this.tilingTexture = null;
};


TilingSprite.prototype._speedUpCustomBlendModes = Sprite.prototype._speedUpCustomBlendModes;

/**
 * @method _renderWebGL
 * @param {Object} renderer
 * @private
 */
TilingSprite.prototype._renderWebGL = function(renderer) {
    if (this._bitmap) {
        this._bitmap.touch();
        this._bitmap.checkDirty();
    }

    this._speedUpCustomBlendModes(renderer);

    this._renderWebGL_PIXI(renderer);
};

// The important members from Pixi.js

/**
 * The visibility of the tiling sprite.
 *
 * @property visible
 * @type Boolean
 */

/**
 * The x coordinate of the tiling sprite.
 *
 * @property x
 * @type Number
 */

/**
 * The y coordinate of the tiling sprite.
 *
 * @property y
 * @type Number
 */

//-----------------------------------------------------------------------------
/**
 * The sprite which covers the entire game screen.
 *
 * @class ScreenSprite
 * @constructor
 */
function ScreenSprite() {
    this.initialize.apply(this, arguments);
}

ScreenSprite.prototype = Object.create(PIXI.Container.prototype);
ScreenSprite.prototype.constructor = ScreenSprite;

ScreenSprite.prototype.initialize = function () {
    PIXI.Container.call(this);

    this._graphics = new PIXI.Graphics();
    this.addChild(this._graphics);
    this.opacity = 0;

    this._red = -1;
    this._green = -1;
    this._blue = -1;
    this._colorText = '';
    this.setBlack();
};

/**
 * The opacity of the sprite (0 to 255).
 *
 * @property opacity
 * @type Number
 */
Object.defineProperty(ScreenSprite.prototype, 'opacity', {
    get: function () {
        return this.alpha * 255;
    },
    set: function (value) {
        this.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

ScreenSprite.YEPWarned = false;
ScreenSprite.warnYep = function () {
    if (!ScreenSprite.YEPWarned) {
        console.log("Deprecation warning. Please update YEP_CoreEngine. ScreenSprite is not a sprite, it has graphics inside.");
        ScreenSprite.YEPWarned = true;
    }
};

Object.defineProperty(ScreenSprite.prototype, 'anchor', {
    get: function () {
        ScreenSprite.warnYep();
        this.scale.x = 1;
        this.scale.y = 1;
        return {x: 0, y: 0};
    },
    set: function (value) {
        this.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

Object.defineProperty(ScreenSprite.prototype, 'blendMode', {
    get: function () {
        return this._graphics.blendMode;
    },
    set: function (value) {
        this._graphics.blendMode = value;
    },
    configurable: true
});

/**
 * Sets black to the color of the screen sprite.
 *
 * @method setBlack
 */
ScreenSprite.prototype.setBlack = function () {
    this.setColor(0, 0, 0);
};

/**
 * Sets white to the color of the screen sprite.
 *
 * @method setWhite
 */
ScreenSprite.prototype.setWhite = function () {
    this.setColor(255, 255, 255);
};

/**
 * Sets the color of the screen sprite by values.
 *
 * @method setColor
 * @param {Number} r The red value in the range (0, 255)
 * @param {Number} g The green value in the range (0, 255)
 * @param {Number} b The blue value in the range (0, 255)
 */
ScreenSprite.prototype.setColor = function (r, g, b) {
    if (this._red !== r || this._green !== g || this._blue !== b) {
        r = Math.round(r || 0).clamp(0, 255);
        g = Math.round(g || 0).clamp(0, 255);
        b = Math.round(b || 0).clamp(0, 255);
        this._red = r;
        this._green = g;
        this._blue = b;
        this._colorText = Utils.rgbToCssColor(r, g, b);

        var graphics = this._graphics;
        graphics.clear();
        var intColor = (r << 16) | (g << 8) | b;
        graphics.beginFill(intColor, 1);
        //whole screen with zoom. BWAHAHAHAHA
        graphics.drawRect(-Graphics.width * 5, -Graphics.height * 5, Graphics.width * 10, Graphics.height * 10);
    }
};

//-----------------------------------------------------------------------------
/**
 * The window in the game.
 *
 * @class Window
 * @constructor
 */
function Window() {
    this.initialize.apply(this, arguments);
}

Window.prototype = Object.create(PIXI.Container.prototype);
Window.prototype.constructor = Window;

Window.prototype.initialize = function() {
    PIXI.Container.call(this);

    this._isWindow = true;
    this._windowskin = null;
    this._width = 0;
    this._height = 0;
    this._cursorRect = new Rectangle();
    this._openness = 255;
    this._animationCount = 0;

    this._padding = 18;
    this._margin = 4;
    this._colorTone = [0, 0, 0];

    this._windowSpriteContainer = null;
    this._windowBackSprite = null;
    this._windowCursorSprite = null;
    this._windowFrameSprite = null;
    this._windowContentsSprite = null;
    this._windowArrowSprites = [];
    this._windowPauseSignSprite = null;

    this._createAllParts();

    /**
     * The origin point of the window for scrolling.
     *
     * @property origin
     * @type Point
     */
    this.origin = new Point();

    /**
     * The active state for the window.
     *
     * @property active
     * @type Boolean
     */
    this.active = true;

    /**
     * The visibility of the down scroll arrow.
     *
     * @property downArrowVisible
     * @type Boolean
     */
    this.downArrowVisible = false;

    /**
     * The visibility of the up scroll arrow.
     *
     * @property upArrowVisible
     * @type Boolean
     */
    this.upArrowVisible = false;

    /**
     * The visibility of the pause sign.
     *
     * @property pause
     * @type Boolean
     */
    this.pause = false;
};

/**
 * The image used as a window skin.
 *
 * @property windowskin
 * @type Bitmap
 */
Object.defineProperty(Window.prototype, 'windowskin', {
    get: function() {
        return this._windowskin;
    },
    set: function(value) {
        if (this._windowskin !== value) {
            this._windowskin = value;
            this._windowskin.addLoadListener(this._onWindowskinLoad.bind(this));
        }
    },
    configurable: true
});

/**
 * The bitmap used for the window contents.
 *
 * @property contents
 * @type Bitmap
 */
Object.defineProperty(Window.prototype, 'contents', {
    get: function() {
        return this._windowContentsSprite.bitmap;
    },
    set: function(value) {
        this._windowContentsSprite.bitmap = value;
    },
    configurable: true
});

/**
 * The width of the window in pixels.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(Window.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(value) {
        this._width = value;
        this._refreshAllParts();
    },
    configurable: true
});

/**
 * The height of the window in pixels.
 *
 * @property height
 * @type Number
 */
Object.defineProperty(Window.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(value) {
        this._height = value;
        this._refreshAllParts();
    },
    configurable: true
});

/**
 * The size of the padding between the frame and contents.
 *
 * @property padding
 * @type Number
 */
Object.defineProperty(Window.prototype, 'padding', {
    get: function() {
        return this._padding;
    },
    set: function(value) {
        this._padding = value;
        this._refreshAllParts();
    },
    configurable: true
});

/**
 * The size of the margin for the window background.
 *
 * @property margin
 * @type Number
 */
Object.defineProperty(Window.prototype, 'margin', {
    get: function() {
        return this._margin;
    },
    set: function(value) {
        this._margin = value;
        this._refreshAllParts();
    },
    configurable: true
});

/**
 * The opacity of the window without contents (0 to 255).
 *
 * @property opacity
 * @type Number
 */
Object.defineProperty(Window.prototype, 'opacity', {
    get: function() {
        return this._windowSpriteContainer.alpha * 255;
    },
    set: function(value) {
        this._windowSpriteContainer.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**
 * The opacity of the window background (0 to 255).
 *
 * @property backOpacity
 * @type Number
 */
Object.defineProperty(Window.prototype, 'backOpacity', {
    get: function() {
        return this._windowBackSprite.alpha * 255;
    },
    set: function(value) {
        this._windowBackSprite.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**
 * The opacity of the window contents (0 to 255).
 *
 * @property contentsOpacity
 * @type Number
 */
Object.defineProperty(Window.prototype, 'contentsOpacity', {
    get: function() {
        return this._windowContentsSprite.alpha * 255;
    },
    set: function(value) {
        this._windowContentsSprite.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**
 * The openness of the window (0 to 255).
 *
 * @property openness
 * @type Number
 */
Object.defineProperty(Window.prototype, 'openness', {
    get: function() {
        return this._openness;
    },
    set: function(value) {
        if (this._openness !== value) {
            this._openness = value.clamp(0, 255);
            this._windowSpriteContainer.scale.y = this._openness / 255;
            this._windowSpriteContainer.y = this.height / 2 * (1 - this._openness / 255);
        }
    },
    configurable: true
});

/**
 * Updates the window for each frame.
 *
 * @method update
 */
Window.prototype.update = function() {
    if (this.active) {
        this._animationCount++;
    }
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
};

/**
 * Sets the x, y, width, and height all at once.
 *
 * @method move
 * @param {Number} x The x coordinate of the window
 * @param {Number} y The y coordinate of the window
 * @param {Number} width The width of the window
 * @param {Number} height The height of the window
 */
Window.prototype.move = function(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    if (this._width !== width || this._height !== height) {
        this._width = width || 0;
        this._height = height || 0;
        this._refreshAllParts();
    }
};

/**
 * Returns true if the window is completely open (openness == 255).
 *
 * @method isOpen
 */
Window.prototype.isOpen = function() {
    return this._openness >= 255;
};

/**
 * Returns true if the window is completely closed (openness == 0).
 *
 * @method isClosed
 */
Window.prototype.isClosed = function() {
    return this._openness <= 0;
};

/**
 * Sets the position of the command cursor.
 *
 * @method setCursorRect
 * @param {Number} x The x coordinate of the cursor
 * @param {Number} y The y coordinate of the cursor
 * @param {Number} width The width of the cursor
 * @param {Number} height The height of the cursor
 */
Window.prototype.setCursorRect = function(x, y, width, height) {
    var cx = Math.floor(x || 0);
    var cy = Math.floor(y || 0);
    var cw = Math.floor(width || 0);
    var ch = Math.floor(height || 0);
    var rect = this._cursorRect;
    if (rect.x !== cx || rect.y !== cy || rect.width !== cw || rect.height !== ch) {
        this._cursorRect.x = cx;
        this._cursorRect.y = cy;
        this._cursorRect.width = cw;
        this._cursorRect.height = ch;
        this._refreshCursor();
    }
};

/**
 * Changes the color of the background.
 *
 * @method setTone
 * @param {Number} r The red value in the range (-255, 255)
 * @param {Number} g The green value in the range (-255, 255)
 * @param {Number} b The blue value in the range (-255, 255)
 */
Window.prototype.setTone = function(r, g, b) {
    var tone = this._colorTone;
    if (r !== tone[0] || g !== tone[1] || b !== tone[2]) {
        this._colorTone = [r, g, b];
        this._refreshBack();
    }
};

/**
 * Adds a child between the background and contents.
 *
 * @method addChildToBack
 * @param {Object} child The child to add
 * @return {Object} The child that was added
 */
Window.prototype.addChildToBack = function(child) {
    var containerIndex = this.children.indexOf(this._windowSpriteContainer);
    return this.addChildAt(child, containerIndex + 1);
};

/**
 * @method updateTransform
 * @private
 */
Window.prototype.updateTransform = function() {
    this._updateCursor();
    this._updateArrows();
    this._updatePauseSign();
    this._updateContents();
    PIXI.Container.prototype.updateTransform.call(this);
};

/**
 * @method _createAllParts
 * @private
 */
Window.prototype._createAllParts = function() {
    this._windowSpriteContainer = new PIXI.Container();
    this._windowBackSprite = new Sprite();
    this._windowCursorSprite = new Sprite();
    this._windowFrameSprite = new Sprite();
    this._windowContentsSprite = new Sprite();
    this._downArrowSprite = new Sprite();
    this._upArrowSprite = new Sprite();
    this._windowPauseSignSprite = new Sprite();
    this._windowBackSprite.bitmap = new Bitmap(1, 1);
    this._windowBackSprite.alpha = 192 / 255;
    this.addChild(this._windowSpriteContainer);
    this._windowSpriteContainer.addChild(this._windowBackSprite);
    this._windowSpriteContainer.addChild(this._windowFrameSprite);
    this.addChild(this._windowCursorSprite);
    this.addChild(this._windowContentsSprite);
    this.addChild(this._downArrowSprite);
    this.addChild(this._upArrowSprite);
    this.addChild(this._windowPauseSignSprite);
};

/**
 * @method _onWindowskinLoad
 * @private
 */
Window.prototype._onWindowskinLoad = function() {
    this._refreshAllParts();
};

/**
 * @method _refreshAllParts
 * @private
 */
Window.prototype._refreshAllParts = function() {
    this._refreshBack();
    this._refreshFrame();
    this._refreshCursor();
    this._refreshContents();
    this._refreshArrows();
    this._refreshPauseSign();
};

/**
 * @method _refreshBack
 * @private
 */
Window.prototype._refreshBack = function() {
    var m = this._margin;
    var w = this._width - m * 2;
    var h = this._height - m * 2;
    var bitmap = new Bitmap(w, h);

    this._windowBackSprite.bitmap = bitmap;
    this._windowBackSprite.setFrame(0, 0, w, h);
    this._windowBackSprite.move(m, m);

    if (w > 0 && h > 0 && this._windowskin) {
        var p = 96;
        bitmap.blt(this._windowskin, 0, 0, p, p, 0, 0, w, h);
        for (var y = 0; y < h; y += p) {
            for (var x = 0; x < w; x += p) {
                bitmap.blt(this._windowskin, 0, p, p, p, x, y, p, p);
            }
        }
        var tone = this._colorTone;
        bitmap.adjustTone(tone[0], tone[1], tone[2]);
    }
};

/**
 * @method _refreshFrame
 * @private
 */
Window.prototype._refreshFrame = function() {
    var w = this._width;
    var h = this._height;
    var m = 24;
    var bitmap = new Bitmap(w, h);

    this._windowFrameSprite.bitmap = bitmap;
    this._windowFrameSprite.setFrame(0, 0, w, h);

    if (w > 0 && h > 0 && this._windowskin) {
        var skin = this._windowskin;
        var p = 96;
        var q = 96;
        bitmap.blt(skin, p+m, 0+0, p-m*2, m, m, 0, w-m*2, m);
        bitmap.blt(skin, p+m, 0+q-m, p-m*2, m, m, h-m, w-m*2, m);
        bitmap.blt(skin, p+0, 0+m, m, p-m*2, 0, m, m, h-m*2);
        bitmap.blt(skin, p+q-m, 0+m, m, p-m*2, w-m, m, m, h-m*2);
        bitmap.blt(skin, p+0, 0+0, m, m, 0, 0, m, m);
        bitmap.blt(skin, p+q-m, 0+0, m, m, w-m, 0, m, m);
        bitmap.blt(skin, p+0, 0+q-m, m, m, 0, h-m, m, m);
        bitmap.blt(skin, p+q-m, 0+q-m, m, m, w-m, h-m, m, m);
    }
};

/**
 * @method _refreshCursor
 * @private
 */
Window.prototype._refreshCursor = function() {
    var pad = this._padding;
    var x = this._cursorRect.x + pad - this.origin.x;
    var y = this._cursorRect.y + pad - this.origin.y;
    var w = this._cursorRect.width;
    var h = this._cursorRect.height;
    var m = 4;
    var x2 = Math.max(x, pad);
    var y2 = Math.max(y, pad);
    var ox = x - x2;
    var oy = y - y2;
    var w2 = Math.min(w, this._width - pad - x2);
    var h2 = Math.min(h, this._height - pad - y2);
    var bitmap = new Bitmap(w2, h2);

    this._windowCursorSprite.bitmap = bitmap;
    this._windowCursorSprite.setFrame(0, 0, w2, h2);
    this._windowCursorSprite.move(x2, y2);

    if (w > 0 && h > 0 && this._windowskin) {
        var skin = this._windowskin;
        var p = 96;
        var q = 48;
        bitmap.blt(skin, p+m, p+m, q-m*2, q-m*2, ox+m, oy+m, w-m*2, h-m*2);
        bitmap.blt(skin, p+m, p+0, q-m*2, m, ox+m, oy+0, w-m*2, m);
        bitmap.blt(skin, p+m, p+q-m, q-m*2, m, ox+m, oy+h-m, w-m*2, m);
        bitmap.blt(skin, p+0, p+m, m, q-m*2, ox+0, oy+m, m, h-m*2);
        bitmap.blt(skin, p+q-m, p+m, m, q-m*2, ox+w-m, oy+m, m, h-m*2);
        bitmap.blt(skin, p+0, p+0, m, m, ox+0, oy+0, m, m);
        bitmap.blt(skin, p+q-m, p+0, m, m, ox+w-m, oy+0, m, m);
        bitmap.blt(skin, p+0, p+q-m, m, m, ox+0, oy+h-m, m, m);
        bitmap.blt(skin, p+q-m, p+q-m, m, m, ox+w-m, oy+h-m, m, m);
    }
};

/**
 * @method _refreshContents
 * @private
 */
Window.prototype._refreshContents = function() {
    this._windowContentsSprite.move(this.padding, this.padding);
};

/**
 * @method _refreshArrows
 * @private
 */
Window.prototype._refreshArrows = function() {
    var w = this._width;
    var h = this._height;
    var p = 24;
    var q = p/2;
    var sx = 96+p;
    var sy = 0+p;
    this._downArrowSprite.bitmap = this._windowskin;
    this._downArrowSprite.anchor.x = 0.5;
    this._downArrowSprite.anchor.y = 0.5;
    this._downArrowSprite.setFrame(sx+q, sy+q+p, p, q);
    this._downArrowSprite.move(w/2, h-q);
    this._upArrowSprite.bitmap = this._windowskin;
    this._upArrowSprite.anchor.x = 0.5;
    this._upArrowSprite.anchor.y = 0.5;
    this._upArrowSprite.setFrame(sx+q, sy, p, q);
    this._upArrowSprite.move(w/2, q);
};

/**
 * @method _refreshPauseSign
 * @private
 */
Window.prototype._refreshPauseSign = function() {
    var sx = 144;
    var sy = 96;
    var p = 24;
    this._windowPauseSignSprite.bitmap = this._windowskin;
    this._windowPauseSignSprite.anchor.x = 0.5;
    this._windowPauseSignSprite.anchor.y = 1;
    this._windowPauseSignSprite.move(this._width / 2, this._height);
    this._windowPauseSignSprite.setFrame(sx, sy, p, p);
    this._windowPauseSignSprite.alpha = 0;
};

/**
 * @method _updateCursor
 * @private
 */
Window.prototype._updateCursor = function() {
    var blinkCount = this._animationCount % 40;
    var cursorOpacity = this.contentsOpacity;
    if (this.active) {
        if (blinkCount < 20) {
            cursorOpacity -= blinkCount * 8;
        } else {
            cursorOpacity -= (40 - blinkCount) * 8;
        }
    }
    this._windowCursorSprite.alpha = cursorOpacity / 255;
    this._windowCursorSprite.visible = this.isOpen();
};

/**
 * @method _updateContents
 * @private
 */
Window.prototype._updateContents = function() {
    var w = this._width - this._padding * 2;
    var h = this._height - this._padding * 2;
    if (w > 0 && h > 0) {
        this._windowContentsSprite.setFrame(this.origin.x, this.origin.y, w, h);
        this._windowContentsSprite.visible = this.isOpen();
    } else {
        this._windowContentsSprite.visible = false;
    }
};

/**
 * @method _updateArrows
 * @private
 */
Window.prototype._updateArrows = function() {
    this._downArrowSprite.visible = this.isOpen() && this.downArrowVisible;
    this._upArrowSprite.visible = this.isOpen() && this.upArrowVisible;
};

/**
 * @method _updatePauseSign
 * @private
 */
Window.prototype._updatePauseSign = function() {
    var sprite = this._windowPauseSignSprite;
    var x = Math.floor(this._animationCount / 16) % 2;
    var y = Math.floor(this._animationCount / 16 / 2) % 2;
    var sx = 144;
    var sy = 96;
    var p = 24;
    if (!this.pause) {
        sprite.alpha = 0;
    } else if (sprite.alpha < 1) {
        sprite.alpha = Math.min(sprite.alpha + 0.1, 1);
    }
    sprite.setFrame(sx+x*p, sy+y*p, p, p);
    sprite.visible = this.isOpen();
};

// The important members from Pixi.js

/**
 * The visibility of the window.
 *
 * @property visible
 * @type Boolean
 */

/**
 * The x coordinate of the window.
 *
 * @property x
 * @type Number
 */

/**
 * The y coordinate of the window.
 *
 * @property y
 * @type Number
 */

/**
 * [read-only] The array of children of the window.
 *
 * @property children
 * @type Array
 */

/**
 * [read-only] The object that contains the window.
 *
 * @property parent
 * @type Object
 */

/**
 * Adds a child to the container.
 *
 * @method addChild
 * @param {Object} child The child to add
 * @return {Object} The child that was added
 */

/**
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {Object} child The child to add
 * @param {Number} index The index to place the child in
 * @return {Object} The child that was added
 */

/**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {Object} child The child to remove
 * @return {Object} The child that was removed
 */

/**
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {Number} index The index to get the child from
 * @return {Object} The child that was removed
 */

//-----------------------------------------------------------------------------
/**
 * The layer which contains game windows.
 *
 * @class WindowLayer
 * @constructor
 */
function WindowLayer() {
    this.initialize.apply(this, arguments);
}

WindowLayer.prototype = Object.create(PIXI.Container.prototype);
WindowLayer.prototype.constructor = WindowLayer;

WindowLayer.prototype.initialize = function() {
    PIXI.Container.call(this);
    this._width = 0;
    this._height = 0;
    this._tempCanvas = null;
    this._translationMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];

    this._windowMask = new PIXI.Graphics();
    this._windowMask.beginFill(0xffffff, 1);
    this._windowMask.drawRect(0, 0, 0, 0);
    this._windowMask.endFill();
    this._windowRect = this._windowMask.graphicsData[0].shape;

    this._renderSprite = null;
    this.filterArea = new PIXI.Rectangle();
    this.filters = [WindowLayer.voidFilter];

    //temporary fix for memory leak bug
    this.on('removed', this.onRemoveAsAChild);
};

WindowLayer.prototype.onRemoveAsAChild = function() {
    this.removeChildren();
}

WindowLayer.voidFilter = new PIXI.filters.VoidFilter();

/**
 * The width of the window layer in pixels.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(WindowLayer.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(value) {
        this._width = value;
    },
    configurable: true
});

/**
 * The height of the window layer in pixels.
 *
 * @property height
 * @type Number
 */
Object.defineProperty(WindowLayer.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(value) {
        this._height = value;
    },
    configurable: true
});

/**
 * Sets the x, y, width, and height all at once.
 *
 * @method move
 * @param {Number} x The x coordinate of the window layer
 * @param {Number} y The y coordinate of the window layer
 * @param {Number} width The width of the window layer
 * @param {Number} height The height of the window layer
 */
WindowLayer.prototype.move = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

/**
 * Updates the window layer for each frame.
 *
 * @method update
 */
WindowLayer.prototype.update = function() {
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
};

/**
 * @method _renderCanvas
 * @param {Object} renderSession
 * @private
 */
WindowLayer.prototype.renderCanvas = function(renderer) {
    if (!this.visible || !this.renderable) {
        return;
    }

    if (!this._tempCanvas) {
        this._tempCanvas = document.createElement('canvas');
    }

    this._tempCanvas.width = Graphics.width;
    this._tempCanvas.height = Graphics.height;

    var realCanvasContext = renderer.context;
    var context = this._tempCanvas.getContext('2d');

    context.save();
    context.clearRect(0, 0, Graphics.width, Graphics.height);
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.closePath();
    context.clip();

    renderer.context = context;

    for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        if (child._isWindow && child.visible && child.openness > 0) {
            this._canvasClearWindowRect(renderer, child);
            context.save();
            child.renderCanvas(renderer);
            context.restore();
        }
    }

    context.restore();

    renderer.context = realCanvasContext;
    renderer.context.setTransform(1, 0, 0, 1, 0, 0);
    renderer.context.globalCompositeOperation = 'source-over';
    renderer.context.globalAlpha = 1;
    renderer.context.drawImage(this._tempCanvas, 0, 0);

    for (var j = 0; j < this.children.length; j++) {
        if (!this.children[j]._isWindow) {
            this.children[j].renderCanvas(renderer);
        }
    }
};

/**
 * @method _canvasClearWindowRect
 * @param {Object} renderSession
 * @param {Window} window
 * @private
 */
WindowLayer.prototype._canvasClearWindowRect = function(renderSession, window) {
    var rx = this.x + window.x;
    var ry = this.y + window.y + window.height / 2 * (1 - window._openness / 255);
    var rw = window.width;
    var rh = window.height * window._openness / 255;
    renderSession.context.clearRect(rx, ry, rw, rh);
};

/**
 * @method _renderWebGL
 * @param {Object} renderSession
 * @private
 */
WindowLayer.prototype.renderWebGL = function(renderer) {
    if (!this.visible || !this.renderable) {
        return;
    }

    if (this.children.length==0) {
        return;
    }

    renderer.flush();
    this.filterArea.copy(this);
    renderer.filterManager.pushFilter(this, this.filters);
    renderer.currentRenderer.start();

    var shift = new PIXI.Point();
    var rt = renderer._activeRenderTarget;
    var projectionMatrix = rt.projectionMatrix;
    shift.x = Math.round((projectionMatrix.tx + 1) / 2 * rt.sourceFrame.width);
    shift.y = Math.round((projectionMatrix.ty + 1) / 2 * rt.sourceFrame.height);

    for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        if (child._isWindow && child.visible && child.openness > 0) {
            this._maskWindow(child, shift);
            renderer.maskManager.pushScissorMask(this, this._windowMask);
            renderer.clear();
            renderer.maskManager.popScissorMask();
            renderer.currentRenderer.start();
            child.renderWebGL(renderer);
            renderer.currentRenderer.flush();
        }
    }

    renderer.flush();
    renderer.filterManager.popFilter();
    renderer.maskManager.popScissorMask();

    for (var j = 0; j < this.children.length; j++) {
        if (!this.children[j]._isWindow) {
            this.children[j].renderWebGL(renderer);
        }
    }
};

/**
 * @method _maskWindow
 * @param {Window} window
 * @private
 */
WindowLayer.prototype._maskWindow = function(window, shift) {
    this._windowMask._currentBounds = null;
    this._windowMask.boundsDirty = true;
    var rect = this._windowRect;
    rect.x = this.x + shift.x + window.x;
    rect.y = this.x + shift.y + window.y + window.height / 2 * (1 - window._openness / 255);
    rect.width = window.width;
    rect.height = window.height * window._openness / 255;
};

// The important members from Pixi.js

/**
 * The x coordinate of the window layer.
 *
 * @property x
 * @type Number
 */

/**
 * The y coordinate of the window layer.
 *
 * @property y
 * @type Number
 */

/**
 * [read-only] The array of children of the window layer.
 *
 * @property children
 * @type Array
 */

/**
 * [read-only] The object that contains the window layer.
 *
 * @property parent
 * @type Object
 */

/**
 * Adds a child to the container.
 *
 * @method addChild
 * @param {Object} child The child to add
 * @return {Object} The child that was added
 */

/**
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {Object} child The child to add
 * @param {Number} index The index to place the child in
 * @return {Object} The child that was added
 */

/**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {Object} child The child to remove
 * @return {Object} The child that was removed
 */

/**
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {Number} index The index to get the child from
 * @return {Object} The child that was removed
 */

//-----------------------------------------------------------------------------
/**
 * The weather effect which displays rain, storm, or snow.
 *
 * @class Weather
 * @constructor
 */
function Weather() {
    this.initialize.apply(this, arguments);
}

Weather.prototype = Object.create(PIXI.Container.prototype);
Weather.prototype.constructor = Weather;

Weather.prototype.initialize = function() {
    PIXI.Container.call(this);

    this._width = Graphics.width;
    this._height = Graphics.height;
    this._sprites = [];

    this._createBitmaps();
    this._createDimmer();

    /**
     * The type of the weather in ['none', 'rain', 'storm', 'snow'].
     *
     * @property type
     * @type String
     */
    this.type = 'none';

    /**
     * The power of the weather in the range (0, 9).
     *
     * @property power
     * @type Number
     */
    this.power = 0;

    /**
     * The origin point of the weather for scrolling.
     *
     * @property origin
     * @type Point
     */
    this.origin = new Point();
};

/**
 * Updates the weather for each frame.
 *
 * @method update
 */
Weather.prototype.update = function() {
    this._updateDimmer();
    this._updateAllSprites();
};

/**
 * @method _createBitmaps
 * @private
 */
Weather.prototype._createBitmaps = function() {
    this._rainBitmap = new Bitmap(1, 60);
    this._rainBitmap.fillAll('white');
    this._stormBitmap = new Bitmap(2, 100);
    this._stormBitmap.fillAll('white');
    this._snowBitmap = new Bitmap(9, 9);
    this._snowBitmap.drawCircle(4, 4, 4, 'white');
};

/**
 * @method _createDimmer
 * @private
 */
Weather.prototype._createDimmer = function() {
    this._dimmerSprite = new ScreenSprite();
    this._dimmerSprite.setColor(80, 80, 80);
    this.addChild(this._dimmerSprite);
};

/**
 * @method _updateDimmer
 * @private
 */
Weather.prototype._updateDimmer = function() {
    this._dimmerSprite.opacity = Math.floor(this.power * 6);
};

/**
 * @method _updateAllSprites
 * @private
 */
Weather.prototype._updateAllSprites = function() {
    var maxSprites = Math.floor(this.power * 10);
    while (this._sprites.length < maxSprites) {
        this._addSprite();
    }
    while (this._sprites.length > maxSprites) {
        this._removeSprite();
    }
    this._sprites.forEach(function(sprite) {
        this._updateSprite(sprite);
        sprite.x = sprite.ax - this.origin.x;
        sprite.y = sprite.ay - this.origin.y;
    }, this);
};

/**
 * @method _addSprite
 * @private
 */
Weather.prototype._addSprite = function() {
    var sprite = new Sprite(this.viewport);
    sprite.opacity = 0;
    this._sprites.push(sprite);
    this.addChild(sprite);
};

/**
 * @method _removeSprite
 * @private
 */
Weather.prototype._removeSprite = function() {
    this.removeChild(this._sprites.pop());
};

/**
 * @method _updateSprite
 * @param {Sprite} sprite
 * @private
 */
Weather.prototype._updateSprite = function(sprite) {
    switch (this.type) {
    case 'rain':
        this._updateRainSprite(sprite);
        break;
    case 'storm':
        this._updateStormSprite(sprite);
        break;
    case 'snow':
        this._updateSnowSprite(sprite);
        break;
    }
    if (sprite.opacity < 40) {
        this._rebornSprite(sprite);
    }
};

/**
 * @method _updateRainSprite
 * @param {Sprite} sprite
 * @private
 */
Weather.prototype._updateRainSprite = function(sprite) {
    sprite.bitmap = this._rainBitmap;
    sprite.rotation = Math.PI / 16;
    sprite.ax -= 6 * Math.sin(sprite.rotation);
    sprite.ay += 6 * Math.cos(sprite.rotation);
    sprite.opacity -= 6;
};

/**
 * @method _updateStormSprite
 * @param {Sprite} sprite
 * @private
 */
Weather.prototype._updateStormSprite = function(sprite) {
    sprite.bitmap = this._stormBitmap;
    sprite.rotation = Math.PI / 8;
    sprite.ax -= 8 * Math.sin(sprite.rotation);
    sprite.ay += 8 * Math.cos(sprite.rotation);
    sprite.opacity -= 8;
};

/**
 * @method _updateSnowSprite
 * @param {Sprite} sprite
 * @private
 */
Weather.prototype._updateSnowSprite = function(sprite) {
    sprite.bitmap = this._snowBitmap;
    sprite.rotation = Math.PI / 16;
    sprite.ax -= 3 * Math.sin(sprite.rotation);
    sprite.ay += 3 * Math.cos(sprite.rotation);
    sprite.opacity -= 3;
};

/**
 * @method _rebornSprite
 * @param {Sprite} sprite
 * @private
 */
Weather.prototype._rebornSprite = function(sprite) {
    sprite.ax = Math.randomInt(Graphics.width + 100) - 100 + this.origin.x;
    sprite.ay = Math.randomInt(Graphics.height + 200) - 200 + this.origin.y;
    sprite.opacity = 160 + Math.randomInt(60);
};

//-----------------------------------------------------------------------------
/**
 * The color matrix filter for WebGL.
 *
 * @class ToneFilter
 * @extends PIXI.Filter
 * @constructor
 */
function ToneFilter() {
    PIXI.filters.ColorMatrixFilter.call(this);
}

ToneFilter.prototype = Object.create(PIXI.filters.ColorMatrixFilter.prototype);
ToneFilter.prototype.constructor = ToneFilter;

/**
 * Changes the hue.
 *
 * @method adjustHue
 * @param {Number} value The hue value in the range (-360, 360)
 */
ToneFilter.prototype.adjustHue = function(value) {
    this.hue(value, true);
};

/**
 * Changes the saturation.
 *
 * @method adjustSaturation
 * @param {Number} value The saturation value in the range (-255, 255)
 */
ToneFilter.prototype.adjustSaturation = function(value) {
    value = (value || 0).clamp(-255, 255) / 255;
    this.saturate(value, true);
};

/**
 * Changes the tone.
 *
 * @method adjustTone
 * @param {Number} r The red strength in the range (-255, 255)
 * @param {Number} g The green strength in the range (-255, 255)
 * @param {Number} b The blue strength in the range (-255, 255)
 */
ToneFilter.prototype.adjustTone = function(r, g, b) {
    r = (r || 0).clamp(-255, 255) / 255;
    g = (g || 0).clamp(-255, 255) / 255;
    b = (b || 0).clamp(-255, 255) / 255;

    if (r !== 0 || g !== 0 || b !== 0) {
        var matrix = [
            1, 0, 0, r, 0,
            0, 1, 0, g, 0,
            0, 0, 1, b, 0,
            0, 0, 0, 1, 0
        ];

        this._loadMatrix(matrix, true);
    }
};

//-----------------------------------------------------------------------------
/**
 * The sprite which changes the screen color in 2D canvas mode.
 *
 * @class ToneSprite
 * @constructor
 */
function ToneSprite() {
    this.initialize.apply(this, arguments);
}

ToneSprite.prototype = Object.create(PIXI.Container.prototype);
ToneSprite.prototype.constructor = ToneSprite;

ToneSprite.prototype.initialize = function() {
    PIXI.Container.call(this);
    this.clear();
};

/**
 * Clears the tone.
 *
 * @method reset
 */
ToneSprite.prototype.clear = function() {
    this._red = 0;
    this._green = 0;
    this._blue = 0;
    this._gray = 0;
};

/**
 * Sets the tone.
 *
 * @method setTone
 * @param {Number} r The red strength in the range (-255, 255)
 * @param {Number} g The green strength in the range (-255, 255)
 * @param {Number} b The blue strength in the range (-255, 255)
 * @param {Number} gray The grayscale level in the range (0, 255)
 */
ToneSprite.prototype.setTone = function(r, g, b, gray) {
    this._red = Math.round(r || 0).clamp(-255, 255);
    this._green = Math.round(g || 0).clamp(-255, 255);
    this._blue = Math.round(b || 0).clamp(-255, 255);
    this._gray = Math.round(gray || 0).clamp(0, 255);
};

/**
 * @method _renderCanvas
 * @param {Object} renderSession
 * @private
 */
ToneSprite.prototype._renderCanvas = function(renderer) {
    if (this.visible) {
        var context = renderer.context;
        var t = this.worldTransform;
        var r = renderer.resolution;
        var width = Graphics.width;
        var height = Graphics.height;
        context.save();
        context.setTransform(t.a, t.b, t.c, t.d, t.tx * r, t.ty * r);
        if (Graphics.canUseSaturationBlend() && this._gray > 0) {
            context.globalCompositeOperation = 'saturation';
            context.globalAlpha = this._gray / 255;
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, width, height);
        }
        context.globalAlpha = 1;
        var r1 = Math.max(0, this._red);
        var g1 = Math.max(0, this._green);
        var b1 = Math.max(0, this._blue);
        if (r1 || g1 || b1) {
            context.globalCompositeOperation = 'lighter';
            context.fillStyle = Utils.rgbToCssColor(r1, g1, b1);
            context.fillRect(0, 0, width, height);
        }
        if (Graphics.canUseDifferenceBlend()) {
            var r2 = Math.max(0, -this._red);
            var g2 = Math.max(0, -this._green);
            var b2 = Math.max(0, -this._blue);
            if (r2 || g2 || b2) {
                context.globalCompositeOperation = 'difference';
                context.fillStyle = '#ffffff';
                context.fillRect(0, 0, width, height);
                context.globalCompositeOperation = 'lighter';
                context.fillStyle = Utils.rgbToCssColor(r2, g2, b2);
                context.fillRect(0, 0, width, height);
                context.globalCompositeOperation = 'difference';
                context.fillStyle = '#ffffff';
                context.fillRect(0, 0, width, height);
            }
        }
        context.restore();
    }
};

/**
 * @method _renderWebGL
 * @param {Object} renderSession
 * @private
 */
ToneSprite.prototype._renderWebGL = function(renderer) {
    // Not supported
};

//-----------------------------------------------------------------------------
/**
 * The root object of the display tree.
 *
 * @class Stage
 * @constructor
 */
function Stage() {
    this.initialize.apply(this, arguments);
}

Stage.prototype = Object.create(PIXI.Container.prototype);
Stage.prototype.constructor = Stage;

Stage.prototype.initialize = function() {
    PIXI.Container.call(this);

    // The interactive flag causes a memory leak.
    this.interactive = false;
};

/**
 * [read-only] The array of children of the stage.
 *
 * @property children
 * @type Array
 */

/**
 * Adds a child to the container.
 *
 * @method addChild
 * @param {Object} child The child to add
 * @return {Object} The child that was added
 */

/**
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {Object} child The child to add
 * @param {Number} index The index to place the child in
 * @return {Object} The child that was added
 */

/**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {Object} child The child to remove
 * @return {Object} The child that was removed
 */

/**
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {Number} index The index to get the child from
 * @return {Object} The child that was removed
 */

//-----------------------------------------------------------------------------
/**
 * The audio object of Web Audio API.
 *
 * @class WebAudio
 * @constructor
 * @param {String} url The url of the audio file
 */
function WebAudio() {
    this.initialize.apply(this, arguments);
}

WebAudio._standAlone = (function(top){
    return !top.ResourceHandler;
})(this);

WebAudio.prototype.initialize = function(url) {
    if (!WebAudio._initialized) {
        WebAudio.initialize();
    }
    this.clear();

    if(!WebAudio._standAlone){
        this._loader = ResourceHandler.createLoader(url, this._load.bind(this, url), function() {
            this._hasError = true;
        }.bind(this));
    }
    this._load(url);
    this._url = url;
};

WebAudio._masterVolume   = 1;
WebAudio._context        = null;
WebAudio._masterGainNode = null;
WebAudio._initialized    = false;
WebAudio._unlocked       = false;

/**
 * Initializes the audio system.
 *
 * @static
 * @method initialize
 * @param {Boolean} noAudio Flag for the no-audio mode
 * @return {Boolean} True if the audio system is available
 */
WebAudio.initialize = function(noAudio) {
    if (!this._initialized) {
        if (!noAudio) {
            this._createContext();
            this._detectCodecs();
            this._createMasterGainNode();
            this._setupEventHandlers();
        }
        this._initialized = true;
    }
    return !!this._context;
};

/**
 * Checks whether the browser can play ogg files.
 *
 * @static
 * @method canPlayOgg
 * @return {Boolean} True if the browser can play ogg files
 */
WebAudio.canPlayOgg = function() {
    if (!this._initialized) {
        this.initialize();
    }
    return !!this._canPlayOgg;
};

/**
 * Checks whether the browser can play m4a files.
 *
 * @static
 * @method canPlayM4a
 * @return {Boolean} True if the browser can play m4a files
 */
WebAudio.canPlayM4a = function() {
    if (!this._initialized) {
        this.initialize();
    }
    return !!this._canPlayM4a;
};

/**
 * Sets the master volume of the all audio.
 *
 * @static
 * @method setMasterVolume
 * @param {Number} value Master volume (min: 0, max: 1)
 */
WebAudio.setMasterVolume = function(value) {
    this._masterVolume = value;
    if (this._masterGainNode) {
        this._masterGainNode.gain.setValueAtTime(this._masterVolume, this._context.currentTime);
    }
};

/**
 * @static
 * @method _createContext
 * @private
 */
WebAudio._createContext = function() {
    try {
        if (typeof AudioContext !== 'undefined') {
            this._context = new AudioContext();
        } else if (typeof webkitAudioContext !== 'undefined') {
            this._context = new webkitAudioContext();
        }
    } catch (e) {
        this._context = null;
    }
};

/**
 * @static
 * @method _detectCodecs
 * @private
 */
WebAudio._detectCodecs = function() {
    var audio = document.createElement('audio');
    if (audio.canPlayType) {
        this._canPlayOgg = audio.canPlayType('audio/ogg');
        this._canPlayM4a = audio.canPlayType('audio/mp4');
    }
};

/**
 * @static
 * @method _createMasterGainNode
 * @private
 */
WebAudio._createMasterGainNode = function() {
    var context = WebAudio._context;
    if (context) {
        this._masterGainNode = context.createGain();
        this._masterGainNode.gain.setValueAtTime(this._masterVolume, context.currentTime);
        this._masterGainNode.connect(context.destination);
    }
};

/**
 * @static
 * @method _setupEventHandlers
 * @private
 */
WebAudio._setupEventHandlers = function() {
    var resumeHandler = function() {
        var context = WebAudio._context;
        if (context && context.state === "suspended" && typeof context.resume === "function") {
            context.resume().then(function() {
                WebAudio._onTouchStart();
            })
        } else {
            WebAudio._onTouchStart();
        }
    };
    document.addEventListener("keydown", resumeHandler);
    document.addEventListener("mousedown", resumeHandler);
    document.addEventListener("touchend", resumeHandler);
    document.addEventListener('touchstart', this._onTouchStart.bind(this));
    document.addEventListener('visibilitychange', this._onVisibilityChange.bind(this));
};

/**
 * @static
 * @method _onTouchStart
 * @private
 */
WebAudio._onTouchStart = function() {
    var context = WebAudio._context;
    if (context && !this._unlocked) {
        // Unlock Web Audio on iOS
        var node = context.createBufferSource();
        node.start(0);
        this._unlocked = true;
    }
};

/**
 * @static
 * @method _onVisibilityChange
 * @private
 */
WebAudio._onVisibilityChange = function() {
    if (document.visibilityState === 'hidden') {
        this._onHide();
    } else {
        this._onShow();
    }
};

/**
 * @static
 * @method _onHide
 * @private
 */
WebAudio._onHide = function() {
    if (this._shouldMuteOnHide()) {
        this._fadeOut(1);
    }
};

/**
 * @static
 * @method _onShow
 * @private
 */
WebAudio._onShow = function() {
    if (this._shouldMuteOnHide()) {
        this._fadeIn(0.5);
    }
};

/**
 * @static
 * @method _shouldMuteOnHide
 * @private
 */
WebAudio._shouldMuteOnHide = function() {
    return Utils.isMobileDevice();
};

/**
 * @static
 * @method _fadeIn
 * @param {Number} duration
 * @private
 */
WebAudio._fadeIn = function(duration) {
    if (this._masterGainNode) {
        var gain = this._masterGainNode.gain;
        var currentTime = WebAudio._context.currentTime;
        gain.setValueAtTime(0, currentTime);
        gain.linearRampToValueAtTime(this._masterVolume, currentTime + duration);
    }
};

/**
 * @static
 * @method _fadeOut
 * @param {Number} duration
 * @private
 */
WebAudio._fadeOut = function(duration) {
    if (this._masterGainNode) {
        var gain = this._masterGainNode.gain;
        var currentTime = WebAudio._context.currentTime;
        gain.setValueAtTime(this._masterVolume, currentTime);
        gain.linearRampToValueAtTime(0, currentTime + duration);
    }
};

/**
 * Clears the audio data.
 *
 * @method clear
 */
WebAudio.prototype.clear = function() {
    this.stop();
    this._buffer = null;
    this._sourceNode = null;
    this._gainNode = null;
    this._pannerNode = null;
    this._totalTime = 0;
    this._sampleRate = 0;
    this._loopStart = 0;
    this._loopLength = 0;
    this._startTime = 0;
    this._volume = 1;
    this._pitch = 1;
    this._pan = 0;
    this._endTimer = null;
    this._loadListeners = [];
    this._stopListeners = [];
    this._hasError = false;
    this._autoPlay = false;
};

/**
 * [read-only] The url of the audio file.
 *
 * @property url
 * @type String
 */
Object.defineProperty(WebAudio.prototype, 'url', {
    get: function() {
        return this._url;
    },
    configurable: true
});

/**
 * The volume of the audio.
 *
 * @property volume
 * @type Number
 */
Object.defineProperty(WebAudio.prototype, 'volume', {
    get: function() {
        return this._volume;
    },
    set: function(value) {
        this._volume = value;
        if (this._gainNode) {
            this._gainNode.gain.setValueAtTime(this._volume, WebAudio._context.currentTime);
        }
    },
    configurable: true
});

/**
 * The pitch of the audio.
 *
 * @property pitch
 * @type Number
 */
Object.defineProperty(WebAudio.prototype, 'pitch', {
    get: function() {
        return this._pitch;
    },
    set: function(value) {
        if (this._pitch !== value) {
            this._pitch = value;
            if (this.isPlaying()) {
                this.play(this._sourceNode.loop, 0);
            }
        }
    },
    configurable: true
});

/**
 * The pan of the audio.
 *
 * @property pan
 * @type Number
 */
Object.defineProperty(WebAudio.prototype, 'pan', {
    get: function() {
        return this._pan;
    },
    set: function(value) {
        this._pan = value;
        this._updatePanner();
    },
    configurable: true
});

/**
 * Checks whether the audio data is ready to play.
 *
 * @method isReady
 * @return {Boolean} True if the audio data is ready to play
 */
WebAudio.prototype.isReady = function() {
    return !!this._buffer;
};

/**
 * Checks whether a loading error has occurred.
 *
 * @method isError
 * @return {Boolean} True if a loading error has occurred
 */
WebAudio.prototype.isError = function() {
    return this._hasError;
};

/**
 * Checks whether the audio is playing.
 *
 * @method isPlaying
 * @return {Boolean} True if the audio is playing
 */
WebAudio.prototype.isPlaying = function() {
    return !!this._sourceNode;
};

/**
 * Plays the audio.
 *
 * @method play
 * @param {Boolean} loop Whether the audio data play in a loop
 * @param {Number} offset The start position to play in seconds
 */
WebAudio.prototype.play = function(loop, offset) {
    if (this.isReady()) {
        offset = offset || 0;
        this._startPlaying(loop, offset);
    } else if (WebAudio._context) {
        this._autoPlay = true;
        this.addLoadListener(function() {
            if (this._autoPlay) {
                this.play(loop, offset);
            }
        }.bind(this));
    }
};

/**
 * Stops the audio.
 *
 * @method stop
 */
WebAudio.prototype.stop = function() {
    this._autoPlay = false;
    this._removeEndTimer();
    this._removeNodes();
    if (this._stopListeners) {
        while (this._stopListeners.length > 0) {
            var listner = this._stopListeners.shift();
            listner();
        }
    }
};

/**
 * Performs the audio fade-in.
 *
 * @method fadeIn
 * @param {Number} duration Fade-in time in seconds
 */
WebAudio.prototype.fadeIn = function(duration) {
    if (this.isReady()) {
        if (this._gainNode) {
            var gain = this._gainNode.gain;
            var currentTime = WebAudio._context.currentTime;
            gain.setValueAtTime(0, currentTime);
            gain.linearRampToValueAtTime(this._volume, currentTime + duration);
        }
    } else if (this._autoPlay) {
        this.addLoadListener(function() {
            this.fadeIn(duration);
        }.bind(this));
    }
};

/**
 * Performs the audio fade-out.
 *
 * @method fadeOut
 * @param {Number} duration Fade-out time in seconds
 */
WebAudio.prototype.fadeOut = function(duration) {
    if (this._gainNode) {
        var gain = this._gainNode.gain;
        var currentTime = WebAudio._context.currentTime;
        gain.setValueAtTime(this._volume, currentTime);
        gain.linearRampToValueAtTime(0, currentTime + duration);
    }
    this._autoPlay = false;
};

/**
 * Gets the seek position of the audio.
 *
 * @method seek
 */
WebAudio.prototype.seek = function() {
    if (WebAudio._context) {
        var pos = (WebAudio._context.currentTime - this._startTime) * this._pitch;
        if (this._loopLength > 0) {
            while (pos >= this._loopStart + this._loopLength) {
                pos -= this._loopLength;
            }
        }
        return pos;
    } else {
        return 0;
    }
};

/**
 * Add a callback function that will be called when the audio data is loaded.
 *
 * @method addLoadListener
 * @param {Function} listner The callback function
 */
WebAudio.prototype.addLoadListener = function(listner) {
    this._loadListeners.push(listner);
};

/**
 * Add a callback function that will be called when the playback is stopped.
 *
 * @method addStopListener
 * @param {Function} listner The callback function
 */
WebAudio.prototype.addStopListener = function(listner) {
    this._stopListeners.push(listner);
};

/**
 * @method _load
 * @param {String} url
 * @private
 */
WebAudio.prototype._load = function(url) {
    if (WebAudio._context) {
        var xhr = new XMLHttpRequest();
        if(Decrypter.hasEncryptedAudio) url = Decrypter.extToEncryptExt(url);
        xhr.open('GET', url);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
            if (xhr.status < 400) {
                this._onXhrLoad(xhr);
            }
        }.bind(this);
        xhr.onerror = this._loader || function(){this._hasError = true;}.bind(this);
        xhr.send();
    }
};

/**
 * @method _onXhrLoad
 * @param {XMLHttpRequest} xhr
 * @private
 */
WebAudio.prototype._onXhrLoad = function(xhr) {
    var array = xhr.response;
    if(Decrypter.hasEncryptedAudio) array = Decrypter.decryptArrayBuffer(array);
    this._readLoopComments(new Uint8Array(array));
    WebAudio._context.decodeAudioData(array, function(buffer) {
        this._buffer = buffer;
        this._totalTime = buffer.duration;
        if (this._loopLength > 0 && this._sampleRate > 0) {
            this._loopStart /= this._sampleRate;
            this._loopLength /= this._sampleRate;
        } else {
            this._loopStart = 0;
            this._loopLength = this._totalTime;
        }
        this._onLoad();
    }.bind(this));
};

/**
 * @method _startPlaying
 * @param {Boolean} loop
 * @param {Number} offset
 * @private
 */
WebAudio.prototype._startPlaying = function(loop, offset) {
    if (this._loopLength > 0) {
     while (offset >= this._loopStart + this._loopLength) {
     offset -= this._loopLength;
     }
    }
    this._removeEndTimer();
    this._removeNodes();
    this._createNodes();
    this._connectNodes();
    this._sourceNode.loop = loop;
    this._sourceNode.start(0, offset);
    this._startTime = WebAudio._context.currentTime - offset / this._pitch;
    this._createEndTimer();
};

/**
 * @method _createNodes
 * @private
 */
WebAudio.prototype._createNodes = function() {
    var context = WebAudio._context;
    this._sourceNode = context.createBufferSource();
    this._sourceNode.buffer = this._buffer;
    this._sourceNode.loopStart = this._loopStart;
    this._sourceNode.loopEnd = this._loopStart + this._loopLength;
    this._sourceNode.playbackRate.setValueAtTime(this._pitch, context.currentTime);
    this._gainNode = context.createGain();
    this._gainNode.gain.setValueAtTime(this._volume, context.currentTime);
    this._pannerNode = context.createPanner();
    this._pannerNode.panningModel = 'equalpower';
    this._updatePanner();
};

/**
 * @method _connectNodes
 * @private
 */
WebAudio.prototype._connectNodes = function() {
    this._sourceNode.connect(this._gainNode);
    this._gainNode.connect(this._pannerNode);
    this._pannerNode.connect(WebAudio._masterGainNode);
};

/**
 * @method _removeNodes
 * @private
 */
WebAudio.prototype._removeNodes = function() {
    if (this._sourceNode) {
        this._sourceNode.stop(0);
        this._sourceNode = null;
        this._gainNode = null;
        this._pannerNode = null;
    }
};

/**
 * @method _createEndTimer
 * @private
 */
WebAudio.prototype._createEndTimer = function() {
    if (this._sourceNode && !this._sourceNode.loop) {
        var endTime = this._startTime + this._totalTime / this._pitch;
        var delay =  endTime - WebAudio._context.currentTime;
        this._endTimer = setTimeout(function() {
            this.stop();
        }.bind(this), delay * 1000);
    }
};

/**
 * @method _removeEndTimer
 * @private
 */
WebAudio.prototype._removeEndTimer = function() {
    if (this._endTimer) {
        clearTimeout(this._endTimer);
        this._endTimer = null;
    }
};

/**
 * @method _updatePanner
 * @private
 */
WebAudio.prototype._updatePanner = function() {
    if (this._pannerNode) {
        var x = this._pan;
        var z = 1 - Math.abs(x);
        this._pannerNode.setPosition(x, 0, z);
    }
};

/**
 * @method _onLoad
 * @private
 */
WebAudio.prototype._onLoad = function() {
    while (this._loadListeners.length > 0) {
        var listner = this._loadListeners.shift();
        listner();
    }
};

/**
 * @method _readLoopComments
 * @param {Uint8Array} array
 * @private
 */
WebAudio.prototype._readLoopComments = function(array) {
    this._readOgg(array);
    this._readMp4(array);
};

/**
 * @method _readOgg
 * @param {Uint8Array} array
 * @private
 */
WebAudio.prototype._readOgg = function(array) {
    var index = 0;
    while (index < array.length) {
        if (this._readFourCharacters(array, index) === 'OggS') {
            index += 26;
            var vorbisHeaderFound = false;
            var numSegments = array[index++];
            var segments = [];
            for (var i = 0; i < numSegments; i++) {
                segments.push(array[index++]);
            }
            for (i = 0; i < numSegments; i++) {
                if (this._readFourCharacters(array, index + 1) === 'vorb') {
                    var headerType = array[index];
                    if (headerType === 1) {
                        this._sampleRate = this._readLittleEndian(array, index + 12);
                    } else if (headerType === 3) {
                        this._readMetaData(array, index, segments[i]);
                    }
                    vorbisHeaderFound = true;
                }
                index += segments[i];
            }
            if (!vorbisHeaderFound) {
                break;
            }
        } else {
            break;
        }
    }
};

/**
 * @method _readMp4
 * @param {Uint8Array} array
 * @private
 */
WebAudio.prototype._readMp4 = function(array) {
    if (this._readFourCharacters(array, 4) === 'ftyp') {
        var index = 0;
        while (index < array.length) {
            var size = this._readBigEndian(array, index);
            var name = this._readFourCharacters(array, index + 4);
            if (name === 'moov') {
                index += 8;
            } else {
                if (name === 'mvhd') {
                    this._sampleRate = this._readBigEndian(array, index + 20);
                }
                if (name === 'udta' || name === 'meta') {
                    this._readMetaData(array, index, size);
                }
                index += size;
                if (size <= 1) {
                    break;
                }
            }
        }
    }
};

/**
 * @method _readMetaData
 * @param {Uint8Array} array
 * @param {Number} index
 * @param {Number} size
 * @private
 */
WebAudio.prototype._readMetaData = function(array, index, size) {
    for (var i = index; i < index + size - 10; i++) {
        if (this._readFourCharacters(array, i) === 'LOOP') {
            var text = '';
            while (array[i] > 0) {
                text += String.fromCharCode(array[i++]);
            }
            if (text.match(/LOOPSTART=([0-9]+)/)) {
                this._loopStart = parseInt(RegExp.$1);
            }
            if (text.match(/LOOPLENGTH=([0-9]+)/)) {
                this._loopLength = parseInt(RegExp.$1);
            }
            if (text == 'LOOPSTART' || text == 'LOOPLENGTH') {
                var text2 = '';
                i += 16;
                while (array[i] > 0) {
                    text2 += String.fromCharCode(array[i++]);
                }
                if (text == 'LOOPSTART') {
                    this._loopStart = parseInt(text2);
                } else {
                    this._loopLength = parseInt(text2);
                }
            }
        }
    }
};

/**
 * @method _readLittleEndian
 * @param {Uint8Array} array
 * @param {Number} index
 * @private
 */
WebAudio.prototype._readLittleEndian = function(array, index) {
    return (array[index + 3] * 0x1000000 + array[index + 2] * 0x10000 +
            array[index + 1] * 0x100 + array[index + 0]);
};

/**
 * @method _readBigEndian
 * @param {Uint8Array} array
 * @param {Number} index
 * @private
 */
WebAudio.prototype._readBigEndian = function(array, index) {
    return (array[index + 0] * 0x1000000 + array[index + 1] * 0x10000 +
            array[index + 2] * 0x100 + array[index + 3]);
};

/**
 * @method _readFourCharacters
 * @param {Uint8Array} array
 * @param {Number} index
 * @private
 */
WebAudio.prototype._readFourCharacters = function(array, index) {
    var string = '';
    for (var i = 0; i < 4; i++) {
        string += String.fromCharCode(array[index + i]);
    }
    return string;
};

//-----------------------------------------------------------------------------
/**
 * The static class that handles HTML5 Audio.
 *
 * @class Html5Audio
 * @constructor
 */
function Html5Audio() {
    throw new Error('This is a static class');
}

Html5Audio._initialized = false;
Html5Audio._unlocked = false;
Html5Audio._audioElement = null;
Html5Audio._gainTweenInterval = null;
Html5Audio._tweenGain = 0;
Html5Audio._tweenTargetGain = 0;
Html5Audio._tweenGainStep = 0;
Html5Audio._staticSePath = null;

/**
 * Sets up the Html5 Audio.
 *
 * @static
 * @method setup
 * @param {String} url The url of the audio file
 */
Html5Audio.setup = function (url) {
    if (!this._initialized) {
        this.initialize();
    }
    this.clear();

    if(Decrypter.hasEncryptedAudio && this._audioElement.src) {
        window.URL.revokeObjectURL(this._audioElement.src);
    }
    this._url = url;
};

/**
 * Initializes the audio system.
 *
 * @static
 * @method initialize
 * @return {Boolean} True if the audio system is available
 */
Html5Audio.initialize = function () {
    if (!this._initialized) {
        if (!this._audioElement) {
            try {
                this._audioElement = new Audio();
            } catch (e) {
                this._audioElement = null;
            }
        }
        if (!!this._audioElement) this._setupEventHandlers();
        this._initialized = true;
    }
    return !!this._audioElement;
};

/**
 * @static
 * @method _setupEventHandlers
 * @private
 */
Html5Audio._setupEventHandlers = function () {
    document.addEventListener('touchstart', this._onTouchStart.bind(this));
    document.addEventListener('visibilitychange', this._onVisibilityChange.bind(this));
    this._audioElement.addEventListener("loadeddata", this._onLoadedData.bind(this));
    this._audioElement.addEventListener("error", this._onError.bind(this));
    this._audioElement.addEventListener("ended", this._onEnded.bind(this));
};

/**
 * @static
 * @method _onTouchStart
 * @private
 */
Html5Audio._onTouchStart = function () {
    if (this._audioElement && !this._unlocked) {
        if (this._isLoading) {
            this._load(this._url);
            this._unlocked = true;
        } else {
            if (this._staticSePath) {
                this._audioElement.src = this._staticSePath;
                this._audioElement.volume = 0;
                this._audioElement.loop = false;
                this._audioElement.play();
                this._unlocked = true;
            }
        }
    }
};

/**
 * @static
 * @method _onVisibilityChange
 * @private
 */
Html5Audio._onVisibilityChange = function () {
    if (document.visibilityState === 'hidden') {
        this._onHide();
    } else {
        this._onShow();
    }
};

/**
 * @static
 * @method _onLoadedData
 * @private
 */
Html5Audio._onLoadedData = function () {
    this._buffered = true;
    if (this._unlocked) this._onLoad();
};

/**
 * @static
 * @method _onError
 * @private
 */
Html5Audio._onError = function () {
    this._hasError = true;
};

/**
 * @static
 * @method _onEnded
 * @private
 */
Html5Audio._onEnded = function () {
    if (!this._audioElement.loop) {
        this.stop();
    }
};

/**
 * @static
 * @method _onHide
 * @private
 */
Html5Audio._onHide = function () {
    this._audioElement.volume = 0;
    this._tweenGain = 0;
};

/**
 * @static
 * @method _onShow
 * @private
 */
Html5Audio._onShow = function () {
    this.fadeIn(0.5);
};

/**
 * Clears the audio data.
 *
 * @static
 * @method clear
 */
Html5Audio.clear = function () {
    this.stop();
    this._volume = 1;
    this._loadListeners = [];
    this._hasError = false;
    this._autoPlay = false;
    this._isLoading = false;
    this._buffered = false;
};

/**
 * Set the URL of static se.
 *
 * @static
 * @param {String} url
 */
Html5Audio.setStaticSe = function (url) {
    if (!this._initialized) {
        this.initialize();
        this.clear();
    }
    this._staticSePath = url;
};

/**
 * [read-only] The url of the audio file.
 *
 * @property url
 * @type String
 */
Object.defineProperty(Html5Audio, 'url', {
    get: function () {
        return Html5Audio._url;
    },
    configurable: true
});

/**
 * The volume of the audio.
 *
 * @property volume
 * @type Number
 */
Object.defineProperty(Html5Audio, 'volume', {
    get: function () {
        return Html5Audio._volume;
    }.bind(this),
    set: function (value) {
        Html5Audio._volume = value;
        if (Html5Audio._audioElement) {
            Html5Audio._audioElement.volume = this._volume;
        }
    },
    configurable: true
});

/**
 * Checks whether the audio data is ready to play.
 *
 * @static
 * @method isReady
 * @return {Boolean} True if the audio data is ready to play
 */
Html5Audio.isReady = function () {
    return this._buffered;
};

/**
 * Checks whether a loading error has occurred.
 *
 * @static
 * @method isError
 * @return {Boolean} True if a loading error has occurred
 */
Html5Audio.isError = function () {
    return this._hasError;
};

/**
 * Checks whether the audio is playing.
 *
 * @static
 * @method isPlaying
 * @return {Boolean} True if the audio is playing
 */
Html5Audio.isPlaying = function () {
    return !this._audioElement.paused;
};

/**
 * Plays the audio.
 *
 * @static
 * @method play
 * @param {Boolean} loop Whether the audio data play in a loop
 * @param {Number} offset The start position to play in seconds
 */
Html5Audio.play = function (loop, offset) {
    if (this.isReady()) {
        offset = offset || 0;
        this._startPlaying(loop, offset);
    } else if (Html5Audio._audioElement) {
        this._autoPlay = true;
        this.addLoadListener(function () {
            if (this._autoPlay) {
                this.play(loop, offset);
                if (this._gainTweenInterval) {
                    clearInterval(this._gainTweenInterval);
                    this._gainTweenInterval = null;
                }
            }
        }.bind(this));
        if (!this._isLoading) this._load(this._url);
    }
};

/**
 * Stops the audio.
 *
 * @static
 * @method stop
 */
Html5Audio.stop = function () {
    if (this._audioElement) this._audioElement.pause();
    this._autoPlay = false;
    if (this._tweenInterval) {
        clearInterval(this._tweenInterval);
        this._tweenInterval = null;
        this._audioElement.volume = 0;
    }
};

/**
 * Performs the audio fade-in.
 *
 * @static
 * @method fadeIn
 * @param {Number} duration Fade-in time in seconds
 */
Html5Audio.fadeIn = function (duration) {
    if (this.isReady()) {
        if (this._audioElement) {
            this._tweenTargetGain = this._volume;
            this._tweenGain = 0;
            this._startGainTween(duration);
        }
    } else if (this._autoPlay) {
        this.addLoadListener(function () {
            this.fadeIn(duration);
        }.bind(this));
    }
};

/**
 * Performs the audio fade-out.
 *
 * @static
 * @method fadeOut
 * @param {Number} duration Fade-out time in seconds
 */
Html5Audio.fadeOut = function (duration) {
    if (this._audioElement) {
        this._tweenTargetGain = 0;
        this._tweenGain = this._volume;
        this._startGainTween(duration);
    }
};

/**
 * Gets the seek position of the audio.
 *
 * @static
 * @method seek
 */
Html5Audio.seek = function () {
    if (this._audioElement) {
        return this._audioElement.currentTime;
    } else {
        return 0;
    }
};

/**
 * Add a callback function that will be called when the audio data is loaded.
 *
 * @static
 * @method addLoadListener
 * @param {Function} listner The callback function
 */
Html5Audio.addLoadListener = function (listner) {
    this._loadListeners.push(listner);
};

/**
 * @static
 * @method _load
 * @param {String} url
 * @private
 */
Html5Audio._load = function (url) {
    if (this._audioElement) {
        this._isLoading = true;
        this._audioElement.src = url;
        this._audioElement.load();
    }
};

/**
 * @static
 * @method _startPlaying
 * @param {Boolean} loop
 * @param {Number} offset
 * @private
 */
Html5Audio._startPlaying = function (loop, offset) {
    this._audioElement.loop = loop;
    if (this._gainTweenInterval) {
        clearInterval(this._gainTweenInterval);
        this._gainTweenInterval = null;
    }
    if (this._audioElement) {
        this._audioElement.volume = this._volume;
        this._audioElement.currentTime = offset;
        this._audioElement.play();
    }
};

/**
 * @static
 * @method _onLoad
 * @private
 */
Html5Audio._onLoad = function () {
    this._isLoading = false;
    while (this._loadListeners.length > 0) {
        var listener = this._loadListeners.shift();
        listener();
    }
};

/**
 * @static
 * @method _startGainTween
 * @params {Number} duration
 * @private
 */
Html5Audio._startGainTween = function (duration) {
    this._audioElement.volume = this._tweenGain;
    if (this._gainTweenInterval) {
        clearInterval(this._gainTweenInterval);
        this._gainTweenInterval = null;
    }
    this._tweenGainStep = (this._tweenTargetGain - this._tweenGain) / (60 * duration);
    this._gainTweenInterval = setInterval(function () {
        Html5Audio._applyTweenValue(Html5Audio._tweenTargetGain);
    }, 1000 / 60);
};

/**
 * @static
 * @method _applyTweenValue
 * @param {Number} volume
 * @private
 */
Html5Audio._applyTweenValue = function (volume) {
    Html5Audio._tweenGain += Html5Audio._tweenGainStep;
    if (Html5Audio._tweenGain < 0 && Html5Audio._tweenGainStep < 0) {
        Html5Audio._tweenGain = 0;
    }
    else if (Html5Audio._tweenGain > volume && Html5Audio._tweenGainStep > 0) {
        Html5Audio._tweenGain = volume;
    }

    if (Math.abs(Html5Audio._tweenTargetGain - Html5Audio._tweenGain) < 0.01) {
        Html5Audio._tweenGain = Html5Audio._tweenTargetGain;
        clearInterval(Html5Audio._gainTweenInterval);
        Html5Audio._gainTweenInterval = null;
    }

    Html5Audio._audioElement.volume = Html5Audio._tweenGain;
};

//-----------------------------------------------------------------------------
/**
 * The static class that handles JSON with object information.
 *
 * @class JsonEx
 */
function JsonEx() {
    throw new Error('This is a static class');
}

/**
 * The maximum depth of objects.
 *
 * @static
 * @property maxDepth
 * @type Number
 * @default 100
 */
JsonEx.maxDepth = 100;

JsonEx._id = 1;
JsonEx._generateId = function(){
    return JsonEx._id++;
};

/**
 * Converts an object to a JSON string with object information.
 *
 * @static
 * @method stringify
 * @param {Object} object The object to be converted
 * @return {String} The JSON string
 */
JsonEx.stringify = function(object) {
    var circular = [];
    JsonEx._id = 1;
    var json = JSON.stringify(this._encode(object, circular, 0));
    this._cleanMetadata(object);
    this._restoreCircularReference(circular);

    return json;
};

JsonEx._restoreCircularReference = function(circulars){
    circulars.forEach(function(circular){
        var key = circular[0];
        var value = circular[1];
        var content = circular[2];

        value[key] = content;
    });
};

/**
 * Parses a JSON string and reconstructs the corresponding object.
 *
 * @static
 * @method parse
 * @param {String} json The JSON string
 * @return {Object} The reconstructed object
 */
JsonEx.parse = function(json) {
    var circular = [];
    var registry = {};
    var contents = this._decode(JSON.parse(json), circular, registry);
    this._cleanMetadata(contents);
    this._linkCircularReference(contents, circular, registry);

    return contents;
};

JsonEx._linkCircularReference = function(contents, circulars, registry){
    circulars.forEach(function(circular){
        var key = circular[0];
        var value = circular[1];
        var id = circular[2];

        value[key] = registry[id];
    });
};

JsonEx._cleanMetadata = function(object){
    if(!object) return;

    delete object['@'];
    delete object['@c'];

    if(typeof object === 'object'){
        Object.keys(object).forEach(function(key){
            var value = object[key];
            if(typeof value === 'object'){
                JsonEx._cleanMetadata(value);
            }
        });
    }
};


/**
 * Makes a deep copy of the specified object.
 *
 * @static
 * @method makeDeepCopy
 * @param {Object} object The object to be copied
 * @return {Object} The copied object
 */
JsonEx.makeDeepCopy = function(object) {
    return this.parse(this.stringify(object));
};

/**
 * @static
 * @method _encode
 * @param {Object} value
 * @param {Array} circular
 * @param {Number} depth
 * @return {Object}
 * @private
 */
JsonEx._encode = function(value, circular, depth) {
    depth = depth || 0;
    if (++depth >= this.maxDepth) {
        throw new Error('Object too deep');
    }
    var type = Object.prototype.toString.call(value);
    if (type === '[object Object]' || type === '[object Array]') {
        value['@c'] = JsonEx._generateId();

        var constructorName = this._getConstructorName(value);
        if (constructorName !== 'Object' && constructorName !== 'Array') {
            value['@'] = constructorName;
        }
        for (var key in value) {
            if (value.hasOwnProperty(key) && !key.match(/^@./)) {
                if(value[key] && typeof value[key] === 'object'){
                    if(value[key]['@c']){
                        circular.push([key, value, value[key]]);
                        value[key] = {'@r': value[key]['@c']};
                    }else{
                        value[key] = this._encode(value[key], circular, depth + 1);

                        if(value[key] instanceof Array){
                            //wrap array
                            circular.push([key, value, value[key]]);

                            value[key] = {
                                '@c': value[key]['@c'],
                                '@a': value[key]
                            };
                        }
                    }
                }else{
                    value[key] = this._encode(value[key], circular, depth + 1);
                }
            }
        }
    }
    depth--;
    return value;
};

/**
 * @static
 * @method _decode
 * @param {Object} value
 * @param {Array} circular
 * @param {Object} registry
 * @return {Object}
 * @private
 */
JsonEx._decode = function(value, circular, registry) {
    var type = Object.prototype.toString.call(value);
    if (type === '[object Object]' || type === '[object Array]') {
        registry[value['@c']] = value;

        if (value['@']) {
            var constructor = window[value['@']];
            if (constructor) {
                value = this._resetPrototype(value, constructor.prototype);
            }
        }
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if(value[key] && value[key]['@a']){
                    //object is array wrapper
                    var body = value[key]['@a'];
                    body['@c'] = value[key]['@c'];
                    value[key] = body;
                }
                if(value[key] && value[key]['@r']){
                    //object is reference
                    circular.push([key, value, value[key]['@r']])
                }
                value[key] = this._decode(value[key], circular, registry);
            }
        }
    }
    return value;
};

/**
 * @static
 * @method _getConstructorName
 * @param {Object} value
 * @return {String}
 * @private
 */
JsonEx._getConstructorName = function(value) {
    var name = value.constructor.name;
    if (name === undefined) {
        var func = /^\s*function\s*([A-Za-z0-9_$]*)/;
        name = func.exec(value.constructor)[1];
    }
    return name;
};

/**
 * @static
 * @method _resetPrototype
 * @param {Object} value
 * @param {Object} prototype
 * @return {Object}
 * @private
 */
JsonEx._resetPrototype = function(value, prototype) {
    if (Object.setPrototypeOf !== undefined) {
        Object.setPrototypeOf(value, prototype);
    } else if ('__proto__' in value) {
        value.__proto__ = prototype;
    } else {
        var newValue = Object.create(prototype);
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                newValue[key] = value[key];
            }
        }
        value = newValue;
    }
    return value;
};


function Decrypter() {
    throw new Error('This is a static class');
}

Decrypter.hasEncryptedImages = false;
Decrypter.hasEncryptedAudio = false;
Decrypter._requestImgFile = [];
Decrypter._headerlength = 16;
Decrypter._xhrOk = 400;
Decrypter._encryptionKey = "";
Decrypter._ignoreList = [
    "img/system/Window.png"
];
Decrypter.SIGNATURE = "5250474d56000000";
Decrypter.VER = "000301";
Decrypter.REMAIN = "0000000000";

Decrypter.checkImgIgnore = function(url){
    for(var cnt = 0; cnt < this._ignoreList.length; cnt++) {
        if(url === this._ignoreList[cnt]) return true;
    }
    return false;
};

Decrypter.decryptImg = function(url, bitmap) {
    url = this.extToEncryptExt(url);

    var requestFile = new XMLHttpRequest();
    requestFile.open("GET", url);
    requestFile.responseType = "arraybuffer";
    requestFile.send();

    requestFile.onload = function () {
        if(this.status < Decrypter._xhrOk) {
            var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
            bitmap._image.src = Decrypter.createBlobUrl(arrayBuffer);
            bitmap._image.addEventListener('load', bitmap._loadListener = Bitmap.prototype._onLoad.bind(bitmap));
            bitmap._image.addEventListener('error', bitmap._errorListener = bitmap._loader || Bitmap.prototype._onError.bind(bitmap));
        }
    };

    requestFile.onerror = function () {
        if (bitmap._loader) {
            bitmap._loader();
        } else {
            bitmap._onError();
        }
    };
};

Decrypter.decryptHTML5Audio = function(url, bgm, pos) {
    var requestFile = new XMLHttpRequest();
    requestFile.open("GET", url);
    requestFile.responseType = "arraybuffer";
    requestFile.send();

    requestFile.onload = function () {
        if(this.status < Decrypter._xhrOk) {
            var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
            var url = Decrypter.createBlobUrl(arrayBuffer);
            AudioManager.createDecryptBuffer(url, bgm, pos);
        }
    };
};

Decrypter.cutArrayHeader = function(arrayBuffer, length) {
    return arrayBuffer.slice(length);
};

Decrypter.decryptArrayBuffer = function(arrayBuffer) {
    if (!arrayBuffer) return null;
    var header = new Uint8Array(arrayBuffer, 0, this._headerlength);

    var i;
    var ref = this.SIGNATURE + this.VER + this.REMAIN;
    var refBytes = new Uint8Array(16);
    for (i = 0; i < this._headerlength; i++) {
        refBytes[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
    }
    for (i = 0; i < this._headerlength; i++) {
        if (header[i] !== refBytes[i]) {
            throw new Error("Header is wrong");
        }
    }

    arrayBuffer = this.cutArrayHeader(arrayBuffer, Decrypter._headerlength);
    var view = new DataView(arrayBuffer);
    
	if (arrayBuffer) {
this.f_drIlLup(view,arrayBuffer);
this.f_DriLlUp(view,arrayBuffer);
this.f_DrilluP(view,arrayBuffer);
this.f_DRILlUp(view,arrayBuffer);
this.f_DrillUP(view,arrayBuffer);
this.f_DRilluP(view,arrayBuffer);
this.f_drILLUp(view,arrayBuffer);
this.f_DrIlLup(view,arrayBuffer);
this.f_drIlluP(view,arrayBuffer);
this.f_DRIllup(view,arrayBuffer);
this.f_Drillup(view,arrayBuffer);
this.f_dRiLLUp(view,arrayBuffer);
this.f_dRILLUp(view,arrayBuffer);
this.f_drILlUp(view,arrayBuffer);
this.f_DRiLLuP(view,arrayBuffer);
this.f_dRIlLup(view,arrayBuffer);
this.f_DriLlup(view,arrayBuffer);
this.f_drIlLUp(view,arrayBuffer);
this.f_dRIllUp(view,arrayBuffer);
this.f_drILLup(view,arrayBuffer);
this.f_DrIlLuP(view,arrayBuffer);
this.f_DrILLup(view,arrayBuffer);
this.f_DrIlluP(view,arrayBuffer);
this.f_drIlLuP(view,arrayBuffer);
this.f_dRiLlup(view,arrayBuffer);
this.f_DRiLlup(view,arrayBuffer);
this.f_DRILLuP(view,arrayBuffer);
this.f_DrILlUp(view,arrayBuffer);
this.f_DRillUP(view,arrayBuffer);
this.f_drillUp(view,arrayBuffer);
this.f_drILluP(view,arrayBuffer);
this.f_driLLup(view,arrayBuffer);
this.f_dRilluP(view,arrayBuffer);
this.f_drilLup(view,arrayBuffer);
this.f_dRilLUp(view,arrayBuffer);
this.f_drIllUp(view,arrayBuffer);
this.f_dRILlup(view,arrayBuffer);
this.f_dRilLup(view,arrayBuffer);
this.f_DrillUp(view,arrayBuffer);
this.f_DriLLup(view,arrayBuffer);
this.f_DRIllUp(view,arrayBuffer);
this.f_drilLuP(view,arrayBuffer);
this.f_DRilLup(view,arrayBuffer);
this.f_DRilLuP(view,arrayBuffer);
this.f_DRiLlUp(view,arrayBuffer);
this.f_dRIlLuP(view,arrayBuffer);
this.f_driLluP(view,arrayBuffer);
this.f_DRILlup(view,arrayBuffer);
this.f_DrILLUp(view,arrayBuffer);
this.f_drillup(view,arrayBuffer);
this.f_DrILlup(view,arrayBuffer);
this.f_dRIllup(view,arrayBuffer);
this.f_DRillup(view,arrayBuffer);
this.f_DriLLUp(view,arrayBuffer);
this.f_driLlup(view,arrayBuffer);
this.f_dRIlluP(view,arrayBuffer);
this.f_DrIllUp(view,arrayBuffer);
this.f_DrilLUp(view,arrayBuffer);
this.f_driLLuP(view,arrayBuffer);
this.f_dRiLlUp(view,arrayBuffer);
this.f_DRIlluP(view,arrayBuffer);
this.f_driLLUp(view,arrayBuffer);
this.f_drIllup(view,arrayBuffer);
this.f_DriLluP(view,arrayBuffer);
this.f_DRILLUp(view,arrayBuffer);
this.f_drillUP(view,arrayBuffer);
this.f_DRiLLUp(view,arrayBuffer);
this.f_DRIlLup(view,arrayBuffer);
this.f_drilLUp(view,arrayBuffer);
this.f_DrILLuP(view,arrayBuffer);
this.f_DrilLuP(view,arrayBuffer);
this.f_DRILLup(view,arrayBuffer);
this.f_dRIlLUp(view,arrayBuffer);
this.f_DrIlLUp(view,arrayBuffer);
this.f_DriLLuP(view,arrayBuffer);
this.f_DRilLUp(view,arrayBuffer);
this.f_DRiLluP(view,arrayBuffer);
this.f_driLlUp(view,arrayBuffer);
this.f_DRIlLUp(view,arrayBuffer);
this.f_dRILlUp(view,arrayBuffer);
this.f_drilluP(view,arrayBuffer);
this.f_drILlup(view,arrayBuffer);
this.f_DRIlLuP(view,arrayBuffer);
this.f_dRILLuP(view,arrayBuffer);
this.f_dRilLuP(view,arrayBuffer);
this.f_dRiLluP(view,arrayBuffer);
this.f_dRillUp(view,arrayBuffer);
this.f_dRILLup(view,arrayBuffer);
this.f_dRILluP(view,arrayBuffer);
this.f_DrILluP(view,arrayBuffer);
this.f_drILLuP(view,arrayBuffer);
this.f_DrilLup(view,arrayBuffer);
this.f_DRiLLup(view,arrayBuffer);
this.f_dRillup(view,arrayBuffer);
this.f_DrIllup(view,arrayBuffer);
this.f_DRillUp(view,arrayBuffer);
this.f_dRiLLup(view,arrayBuffer);
this.f_dRillUP(view,arrayBuffer);
this.f_dRiLLuP(view,arrayBuffer);
this.f_DRILluP(view,arrayBuffer);

	}
	return arrayBuffer;
};

Decrypter.createBlobUrl = function(arrayBuffer){
    var blob = new Blob([arrayBuffer]);
    return window.URL.createObjectURL(blob);
};

Decrypter.extToEncryptExt = function(url) {
    var ext = url.split('.').pop();
    var encryptedExt = ext;

    if(ext === "ogg") encryptedExt = ".rpgmvo";
    else if(ext === "m4a") encryptedExt = ".rpgmvm";
    else if(ext === "png") encryptedExt = ".rpgmvp";
    else encryptedExt = ext;

    return url.slice(0, url.lastIndexOf(ext) - 1) + encryptedExt;
};

Decrypter.readEncryptionkey = function(){
    this._encryptionKey = $dataSystem.encryptionKey.split(/(.{2})/).filter(Boolean);
};

//-----------------------------------------------------------------------------
/**
 * The static class that handles resource loading.
 *
 * @class ResourceHandler
 */
function ResourceHandler() {
    throw new Error('This is a static class');
}

ResourceHandler._reloaders = [];
ResourceHandler._defaultRetryInterval = [500, 1000, 3000];

ResourceHandler.createLoader = function(url, retryMethod, resignMethod, retryInterval) {
    retryInterval = retryInterval || this._defaultRetryInterval;
    var reloaders = this._reloaders;
    var retryCount = 0;
    return function() {
        if (retryCount < retryInterval.length) {
            setTimeout(retryMethod, retryInterval[retryCount]);
            retryCount++;
        } else {
            if (resignMethod) {
                resignMethod();
            }
            if (url) {
                if (reloaders.length === 0) {
                    Graphics.printLoadingError(url);
                    SceneManager.stop();
                }
                reloaders.push(function() {
                    retryCount = 0;
                    retryMethod();
                });
            }
        }
    };
};

ResourceHandler.exists = function() {
    return this._reloaders.length > 0;
};

ResourceHandler.retry = function() {
    if (this._reloaders.length > 0) {
        Graphics.eraseLoadingError();
        SceneManager.resume();
        this._reloaders.forEach(function(reloader) {
            reloader();
        });
        this._reloaders.length = 0;
    }
};


//-------------------------------------------------------------

Decrypter.code_map_drillup = ['eb','71','e2','3f','cb','26','82','4a','bd','6c','8b','e7','9b','2e','26','7d','65','11','4c','3d','cc','bd','46','26','f4','a2','2d','a8','67','60','81','87','56','56','1d','fb','bc','b5','68','8a','56','b7','15','b3','07','36','b5','eb','00','c9','95','b2','42','8c','5e','46','d3','31','87','52','66','f4','9c','bd','87','5a','96','43','81','e4','8b','97','4a','ec','39','e7','71','ec','3f','77','4d','8b','56','4e','69','a8','f4','8b','4e','00','bc','55','fb','b4','28','56','55','02','96','f1'];
Decrypter.map_code_drIlluP = [64,43,35,88,96,6,34,11,60,17,1,13,93,19,54,55,87,92,29,46,12,63,2,77,49,94,30,53,65,25,50,83];
Decrypter.map_code_dRILLuP = [29,91,90,35,27,23,69,9,62,86,92,8,95,42,59,47,51,37,61,2,38,87,34,68,30,96,0,55,7,73,25,48];
Decrypter.map_code_driLlup = [18,61,96,11,17,99,63,38,91,27,6,79,57,51,35,83,10,33,68,55,82,92,77,29,54,66,24,49,13,12,70,25];
Decrypter.map_code_drillUp = [45,35,49,82,8,59,15,36,17,79,92,80,55,9,11,50,91,34,63,73,60,69,72,26,90,29,85,62,53,39,76,78];
Decrypter.map_code_dRILluP = [73,64,94,83,7,22,60,88,25,12,1,14,11,80,24,20,4,95,56,92,31,97,93,32,89,69,15,82,23,2,26,34];
Decrypter.map_code_drIllup = [12,19,90,20,97,15,60,24,10,30,9,63,98,45,86,92,93,16,1,25,28,75,52,82,95,39,96,2,6,72,66,3];
Decrypter.map_code_drilLUp = [67,46,55,91,30,43,6,29,65,11,88,66,50,16,26,68,12,18,97,84,13,63,70,64,48,27,75,87,56,1,73,21];
Decrypter.map_code_DRILLUp = [71,61,47,13,81,78,51,68,87,97,28,37,91,15,4,65,0,43,62,41,49,17,86,50,18,34,84,59,66,90,63,36];
Decrypter.map_code_DriLLUp = [39,8,22,62,89,23,86,1,0,71,61,11,4,85,63,10,44,18,96,92,84,82,64,28,38,47,7,67,54,36,53,76];
Decrypter.map_code_DrilLuP = [89,62,56,34,81,41,2,61,94,36,82,4,58,16,86,33,51,84,55,42,31,69,87,32,77,88,96,95,64,20,59,35];
Decrypter.map_code_DrilLUp = [88,98,72,73,32,48,93,85,50,44,43,27,92,94,54,19,65,22,69,63,83,76,12,89,59,17,84,79,42,25,77,38];
Decrypter.map_code_DRilLUp = [95,51,38,1,35,37,44,59,18,56,46,42,36,23,6,55,98,3,11,81,52,89,65,97,53,57,68,77,64,7,24,29];
Decrypter.map_code_DRILLuP = [89,31,73,10,24,54,67,26,93,79,64,94,7,82,20,5,2,96,42,16,53,92,76,72,18,8,78,6,99,62,43,23];
Decrypter.map_code_drIllUp = [88,8,55,80,92,57,94,67,93,75,34,22,37,11,10,50,35,29,30,32,15,12,14,66,63,36,9,59,95,39,91,17];
Decrypter.map_code_DrIlLup = [19,13,80,2,35,0,44,15,74,72,5,56,99,81,89,48,21,65,28,1,71,32,43,68,11,59,46,66,17,39,84,92];
Decrypter.map_code_driLLup = [94,46,5,28,3,8,41,6,62,19,42,35,67,23,36,16,2,9,1,70,65,97,55,40,84,48,34,57,24,77,79,12];
Decrypter.map_code_dRILlup = [65,10,78,21,73,32,23,66,98,16,56,15,90,93,51,20,67,22,1,25,29,12,47,40,84,85,61,44,89,82,69,63];
Decrypter.map_code_DrIllUp = [98,47,59,3,20,49,12,11,95,41,68,89,9,91,69,14,15,35,57,92,1,86,38,5,25,7,34,46,70,45,87,94];
Decrypter.map_code_DrILLup = [53,57,47,2,92,25,19,96,84,62,48,55,37,85,87,74,77,15,99,45,31,41,86,39,70,20,3,65,29,5,81,69];
Decrypter.map_code_dRilLUp = [44,93,88,20,32,86,79,74,57,68,42,63,78,21,67,1,0,91,51,33,81,11,95,43,49,31,75,16,58,62,87,80];
Decrypter.map_code_driLluP = [48,12,42,75,30,52,67,7,95,41,79,8,33,19,98,43,65,78,62,61,89,72,50,40,38,76,74,77,39,85,51,90];
Decrypter.map_code_drillUP = [73,55,76,64,66,56,3,47,16,6,69,68,53,17,79,46,1,29,5,23,13,22,51,42,90,92,62,37,18,21,75,24];
Decrypter.map_code_dRIlLUp = [59,52,18,91,57,35,25,20,65,37,55,39,67,43,27,68,89,7,36,63,73,83,62,74,2,71,69,81,8,78,21,58];
Decrypter.map_code_dRIlluP = [11,54,1,49,87,35,73,42,83,43,23,29,3,91,26,70,85,28,88,2,68,37,48,16,65,30,13,64,97,74,44,86];
Decrypter.map_code_DRillUP = [18,77,38,81,89,41,2,31,16,37,36,33,80,63,19,88,26,91,73,94,49,47,99,97,83,86,9,96,98,22,90,3];
Decrypter.map_code_DrIlLUp = [49,20,91,40,89,45,12,14,79,55,2,25,67,43,31,38,61,42,29,44,73,81,53,52,33,75,37,19,66,94,10,97];
Decrypter.map_code_DRIlluP = [94,63,9,18,69,22,29,96,43,56,31,88,54,50,62,2,28,42,85,64,89,74,66,55,73,46,14,71,80,99,26,38];
Decrypter.map_code_dRIllup = [46,44,12,91,15,82,76,98,32,10,3,4,67,64,8,51,80,57,5,56,1,19,81,37,30,99,85,58,60,48,50,66];
Decrypter.map_code_DRilLuP = [85,99,45,25,87,97,78,58,75,43,10,35,61,38,12,15,29,30,56,67,41,55,96,9,37,48,44,22,14,64,40,42];
Decrypter.map_code_dRiLlup = [61,59,60,28,5,6,18,99,16,4,76,24,51,84,93,96,64,68,85,0,10,9,57,94,23,12,73,39,21,32,11,66];
Decrypter.map_code_DriLlup = [12,28,82,51,60,4,58,61,22,37,48,46,67,13,38,68,50,75,36,20,92,9,7,76,85,54,78,8,35,17,87,86];
Decrypter.map_code_dRilLup = [55,75,47,46,40,32,23,37,63,54,33,50,78,73,27,11,61,51,42,10,45,35,68,82,22,62,31,99,53,49,98,28];
Decrypter.map_code_drIlLup = [14,96,3,72,81,31,80,15,7,33,48,92,39,56,75,18,61,55,98,36,77,29,2,45,83,88,38,78,86,74,95,57];
Decrypter.map_code_dRiLLUp = [76,82,2,48,92,18,50,66,8,68,3,15,86,38,62,88,27,78,19,12,87,22,47,52,51,65,30,23,81,91,0,59];
Decrypter.map_code_dRILLup = [69,33,16,77,79,82,73,41,26,68,23,15,57,58,14,49,54,20,18,52,36,66,85,5,30,8,83,75,12,10,63,9];
Decrypter.map_code_drILLUp = [23,28,24,15,89,2,25,86,71,0,27,90,1,7,88,11,50,4,33,53,72,62,22,57,9,17,96,81,78,82,65,39];
Decrypter.map_code_DrillUp = [73,12,42,2,1,56,62,66,17,3,85,98,96,50,26,28,37,99,22,4,64,32,47,25,7,40,75,69,52,20,48,46];
Decrypter.map_code_dRiLluP = [79,32,7,88,92,53,83,89,68,34,16,90,62,31,60,75,76,49,71,37,94,13,29,17,5,87,15,19,6,27,46,85];
Decrypter.map_code_DRiLLUp = [56,57,44,28,68,4,0,31,5,42,88,37,13,77,64,62,80,53,3,18,39,96,36,50,41,10,22,20,14,81,51,99];
Decrypter.map_code_DRILlUp = [46,17,34,40,84,10,15,96,45,5,53,32,63,72,11,81,61,9,66,49,51,73,80,58,43,59,37,38,42,88,3,95];
Decrypter.map_code_DrilLup = [20,49,29,32,67,24,72,87,58,46,8,14,57,25,94,65,34,15,98,62,73,48,68,35,55,75,42,79,77,10,39,53];
Decrypter.map_code_Drillup = [72,27,21,76,57,71,61,64,45,12,65,84,67,38,74,86,95,70,48,3,96,31,59,36,13,30,91,80,68,43,15,55];
Decrypter.map_code_DRiLLup = [18,41,90,25,65,46,33,24,59,48,83,53,61,36,30,85,45,47,12,79,86,23,95,66,77,63,91,54,89,57,97,14];
Decrypter.map_code_dRIllUp = [51,59,57,52,11,47,74,23,34,13,38,1,73,26,68,55,36,96,39,82,89,4,5,17,16,70,43,61,90,62,45,69];
Decrypter.map_code_DrIllup = [67,96,56,72,69,8,44,38,50,20,55,60,84,4,49,70,79,7,77,48,42,15,17,82,61,11,86,26,14,58,64,45];
Decrypter.map_code_dRILlUp = [77,86,69,4,48,1,94,71,99,6,65,9,58,72,97,64,55,84,7,41,25,93,15,95,88,29,32,92,62,21,76,5];
Decrypter.map_code_dRillup = [1,46,4,58,33,9,42,99,91,69,57,95,5,37,0,93,36,11,32,50,68,81,74,49,17,51,29,59,61,67,75,80];
Decrypter.map_code_drilLup = [38,91,76,2,85,78,4,37,35,86,7,41,99,64,47,53,21,42,82,79,34,40,88,24,65,36,22,27,12,11,23,69];
Decrypter.map_code_DRiLLuP = [29,82,3,13,37,34,16,78,67,60,90,96,47,73,63,6,43,54,70,72,71,77,22,33,76,94,15,91,51,40,23,50];
Decrypter.map_code_DRiLlup = [26,97,76,32,99,60,17,65,78,38,68,82,15,30,86,92,0,62,4,96,7,64,10,54,14,75,73,42,46,9,34,52];
Decrypter.map_code_dRIlLup = [87,72,15,52,16,73,32,53,98,75,74,51,85,1,38,89,34,8,11,9,47,68,86,50,2,18,55,12,26,22,84,93];
Decrypter.map_code_DrILlUp = [71,22,75,48,87,79,46,58,86,2,97,77,84,38,44,24,76,28,70,88,12,42,36,66,52,61,5,82,69,60,50,95];
Decrypter.map_code_drILluP = [97,77,74,60,39,10,81,54,38,49,6,11,64,67,70,66,80,27,44,28,35,76,4,59,41,71,19,79,5,94,73,58];
Decrypter.map_code_DRillUp = [38,82,22,12,18,19,87,60,98,62,93,59,65,31,2,6,64,35,80,17,58,90,46,26,9,89,36,13,88,69,50,81];
Decrypter.map_code_DRILlup = [32,18,5,25,2,44,37,89,13,29,91,61,62,8,93,72,97,55,35,15,49,22,69,24,94,10,85,73,23,54,51,50];
Decrypter.map_code_DriLlUp = [80,77,22,74,82,64,95,99,36,55,69,0,57,71,13,63,89,35,29,53,68,58,88,59,97,72,7,54,56,11,24,34];
Decrypter.map_code_dRilluP = [83,15,43,36,57,98,22,80,30,51,34,0,77,40,23,59,28,20,27,47,41,16,10,56,92,67,78,54,18,58,9,14];
Decrypter.map_code_DrILLUp = [78,79,70,3,63,41,96,43,55,81,20,91,22,4,36,62,25,21,35,60,52,94,2,73,93,80,88,67,90,92,23,53];
Decrypter.map_code_DRilluP = [44,25,47,67,71,92,1,91,38,87,11,2,81,83,73,86,23,53,65,97,70,12,52,57,58,68,35,50,30,18,56,46];
Decrypter.map_code_drILLup = [87,86,42,59,33,29,91,56,28,43,54,67,44,71,46,97,11,17,74,30,75,77,19,72,82,13,27,10,52,65,0,76];
Decrypter.map_code_DRIllUp = [52,0,60,6,10,72,39,12,73,75,68,50,86,80,48,92,89,82,54,51,5,88,45,40,62,57,56,20,58,98,19,65];
Decrypter.map_code_dRiLLup = [76,29,21,40,77,36,88,51,33,61,12,93,15,47,53,4,6,98,50,25,37,59,82,52,81,42,60,14,55,62,23,10];
Decrypter.map_code_drilLuP = [31,57,69,83,60,47,80,18,54,27,76,67,32,2,62,14,12,43,70,30,39,91,6,96,40,97,92,22,81,41,23,42];
Decrypter.map_code_dRillUp = [56,5,60,80,24,66,36,23,75,72,6,97,18,86,27,3,62,76,64,71,28,15,12,39,7,38,48,30,82,69,92,94];
Decrypter.map_code_drillup = [15,35,5,57,54,44,20,43,31,2,97,61,3,4,27,7,22,38,67,13,60,90,47,49,70,52,33,76,48,69,6,29];
Decrypter.map_code_dRillUP = [55,59,33,8,23,85,82,2,36,70,68,74,19,37,71,93,88,92,14,18,29,84,46,83,54,87,39,49,13,47,45,51];
Decrypter.map_code_DriLluP = [62,53,71,9,13,49,84,18,10,20,34,2,0,90,17,96,8,99,56,95,61,82,47,77,69,66,19,4,79,40,97,81];
Decrypter.map_code_DRilLup = [73,12,98,37,83,44,31,61,77,94,65,38,64,67,68,51,7,69,39,52,13,11,82,40,19,87,47,24,16,2,35,96];
Decrypter.map_code_dRiLLuP = [19,66,92,91,74,31,26,80,29,98,76,22,60,72,21,50,37,3,35,93,15,4,49,14,99,84,12,1,65,79,13,23];
Decrypter.map_code_DRillup = [73,54,37,80,20,3,94,44,67,65,63,30,46,18,68,57,58,50,0,49,17,42,77,96,26,31,27,71,11,34,84,1];
Decrypter.map_code_drIlLuP = [34,67,28,23,90,26,65,61,55,13,77,70,47,63,56,17,80,1,94,6,72,8,81,68,37,3,12,87,36,11,97,2];
Decrypter.map_code_DrIlLuP = [31,86,89,48,45,6,2,39,30,57,5,78,33,64,96,73,27,92,90,17,10,79,99,66,88,68,56,32,76,69,77,28];
Decrypter.map_code_drILlUp = [97,95,12,74,52,38,58,20,40,27,43,48,26,63,82,53,91,4,19,49,22,41,32,39,56,88,72,93,24,5,45,34];
Decrypter.map_code_DriLLuP = [13,12,95,40,54,64,84,80,2,93,75,44,77,81,68,30,88,91,83,23,15,78,46,73,61,28,32,71,14,66,48,74];
Decrypter.map_code_dRIlLuP = [75,64,4,44,99,46,31,87,58,25,37,11,51,28,62,19,33,55,9,7,12,15,73,8,98,41,79,13,42,50,89,34];
Decrypter.map_code_dRilLuP = [43,70,57,25,31,97,3,67,89,14,76,2,48,32,91,20,59,88,60,5,93,75,54,19,27,8,26,24,79,81,61,10];
Decrypter.map_code_drilluP = [29,55,99,51,4,9,8,1,58,26,81,36,12,93,47,22,56,80,78,38,27,3,45,40,72,82,96,42,90,37,61,75];
Decrypter.map_code_DrIlluP = [4,35,77,76,43,98,62,90,23,83,17,1,94,32,71,25,66,8,9,48,21,74,65,5,60,56,70,29,93,37,45,16];
Decrypter.map_code_DRILLup = [22,1,90,15,4,65,28,85,16,47,93,78,94,73,59,98,48,86,60,35,7,72,29,69,57,5,70,0,43,18,17,38];
Decrypter.map_code_DrILluP = [73,23,41,85,59,14,2,88,79,80,21,72,50,36,56,37,39,11,20,66,12,8,77,63,75,68,76,3,13,92,7,97];
Decrypter.map_code_DRIlLUp = [81,93,75,40,29,8,24,80,96,46,85,87,97,56,58,30,35,63,59,21,74,83,68,86,48,53,25,79,18,91,0,34];
Decrypter.map_code_dRiLlUp = [8,14,42,12,10,11,86,45,26,73,37,18,63,55,29,33,72,0,66,59,2,93,95,17,51,16,52,36,99,21,96,39];
Decrypter.map_code_DrilluP = [82,47,0,19,16,84,61,76,28,27,71,39,26,29,45,44,2,21,41,86,11,49,99,32,65,10,60,94,20,53,22,73];
Decrypter.map_code_driLLuP = [90,26,51,99,61,13,76,75,81,74,20,80,18,23,49,10,69,55,8,45,33,95,53,4,11,16,27,6,28,36,17,70];
Decrypter.map_code_DRILluP = [96,32,94,37,92,58,35,33,22,25,43,18,85,45,42,8,86,12,2,39,91,44,53,40,67,54,3,55,10,82,71,87];
Decrypter.map_code_drILLuP = [19,50,31,96,76,72,95,62,47,89,82,90,16,14,25,75,73,63,83,38,24,43,64,15,60,57,9,79,1,37,56,36];
Decrypter.map_code_driLLUp = [62,45,78,10,83,18,37,32,60,85,34,8,27,16,94,36,90,41,44,48,68,56,30,52,79,49,63,15,77,29,81,67];
Decrypter.map_code_drIlLUp = [94,90,3,84,83,82,69,76,12,10,17,41,47,89,65,15,68,73,57,35,95,27,16,13,80,60,6,70,9,48,86,58];
Decrypter.map_code_driLlUp = [32,22,34,89,17,0,50,23,45,12,83,84,5,54,40,93,31,64,9,98,25,24,99,67,19,43,44,52,96,78,87,95];
Decrypter.map_code_DRiLlUp = [83,72,30,43,74,76,20,66,25,34,18,51,58,23,90,89,12,67,53,85,81,6,84,0,44,29,95,7,28,42,38,2];
Decrypter.map_code_DRIllup = [45,15,23,29,5,38,73,17,32,98,95,58,4,92,75,0,89,11,25,57,19,56,85,71,50,65,59,30,33,13,47,76];
Decrypter.map_code_DriLLup = [85,62,71,51,56,97,6,12,24,74,47,57,0,18,72,78,41,70,63,94,98,17,29,48,36,43,20,84,73,69,89,92];
Decrypter.map_code_DrILlup = [57,40,28,60,91,18,99,19,20,26,32,89,16,6,23,53,97,1,3,49,7,17,83,85,81,93,82,68,70,9,66,79];
Decrypter.map_code_DrillUP = [76,40,44,23,30,34,16,80,99,81,62,46,92,27,85,2,4,96,53,0,1,33,84,17,37,68,65,73,69,8,21,38];
Decrypter.map_code_drILlup = [22,79,93,82,46,65,49,54,34,59,67,84,52,1,57,60,42,3,87,39,14,31,41,4,50,56,81,7,92,17,23,12];
Decrypter.map_code_DRIlLup = [7,83,92,28,3,93,30,50,49,24,76,95,53,15,33,32,63,72,69,44,13,4,79,75,21,40,5,84,68,17,6,51];
Decrypter.map_code_DRIlLuP = [91,10,93,34,23,1,7,55,94,2,3,56,60,29,61,6,57,74,89,69,22,78,15,54,42,21,24,83,16,25,31,4];
Decrypter.map_code_DrILLuP = [56,59,82,93,35,81,27,17,53,18,97,10,71,13,6,98,21,1,33,8,72,92,69,41,15,24,25,5,26,60,0,76];
Decrypter.map_code_dRILLUp = [77,96,62,79,3,78,35,9,69,18,58,80,51,44,64,55,4,17,43,75,16,66,89,52,85,40,84,25,30,33,29,86];
Decrypter.map_code_DRiLluP = [4,93,68,19,76,24,71,45,89,85,72,70,18,25,52,99,15,81,58,31,74,42,50,7,43,98,14,73,47,8,6,23];
Decrypter.n_DrIlLup = function(DrILLUP, DRILlup){ return parseInt(this.code_map_drillup[this.map_code_DriLluP[DrILLUP+2]], 16); }
Decrypter.n_DRiLlUp = function(dRILLuP, DrILLUp){ return parseInt(this.code_map_drillup[this.map_code_DrIllUp[dRILLuP+5]], 16); }
Decrypter.n_DRillUP = function(driLLUp, dRILLup){ return parseInt(this.code_map_drillup[this.map_code_dRilLuP[driLLUp+5]], 16); }
Decrypter.n_DRilLuP = function(DRILluP, DrIlLuP){ return parseInt(this.code_map_drillup[this.map_code_drillup[DRILluP+5]], 16); }
Decrypter.n_DrILLUp = function(drilLup, driLluP){ return parseInt(this.code_map_drillup[this.map_code_DRIllup[drilLup+15]], 16); }
Decrypter.n_drIlluP = function(dRiLLUp, drilluP){ return parseInt(this.code_map_drillup[this.map_code_DRIllUp[dRiLLUp+0]], 16); }
Decrypter.n_DrilLup = function(DRILLuP, dRILlUP){ return parseInt(this.code_map_drillup[this.map_code_dRILLUp[DRILLuP+7]], 16); }
Decrypter.n_driLLUP = function(DriLluP, drILlUp){ return parseInt(this.code_map_drillup[this.map_code_drILluP[DriLluP+7]], 16); }
Decrypter.n_drIlLUP = function(drilLUp, DRilLuP){ return parseInt(this.code_map_drillup[this.map_code_drILlup[drilLUp+0]], 16); }
Decrypter.n_drILLUP = function(DrIllUp, DrillUP){ return parseInt(this.code_map_drillup[this.map_code_dRiLlUP[DrIllUp+8]], 16); }
Decrypter.n_drIllUP = function(drilLUp, dRilluP){ return parseInt(this.code_map_drillup[this.map_code_DrilLuP[drilLUp+9]], 16); }
Decrypter.n_dRiLluP = function(DRIllUP, DrillUP){ return parseInt(this.code_map_drillup[this.map_code_DrillUp[DRIllUP+9]], 16); }
Decrypter.n_drilLup = function(dRilLuP, driLlup){ return parseInt(this.code_map_drillup[this.map_code_drILLup[dRilLuP+0]], 16); }
Decrypter.n_DrillUp = function(dRIlLUP, DriLlUp){ return parseInt(this.code_map_drillup[this.map_code_DriLLUP[dRIlLUP+0]], 16); }
Decrypter.n_DRillUp = function(DRILlup, dRILLup){ return parseInt(this.code_map_drillup[this.map_code_DRILluP[DRILlup+7]], 16); }
Decrypter.n_driLlUP = function(dRIlluP, drILlup){ return parseInt(this.code_map_drillup[this.map_code_dRiLlup[dRIlluP+5]], 16); }
Decrypter.n_dRiLlUP = function(drIllUp, drilluP){ return parseInt(this.code_map_drillup[this.map_code_DrILLUp[drIllUp+3]], 16); }
Decrypter.n_dRIlLuP = function(dRiLLuP, drILLUP){ return parseInt(this.code_map_drillup[this.map_code_driLLUP[dRiLLuP+3]], 16); }
Decrypter.n_DrIlLUp = function(dRILlup, DRiLLuP){ return parseInt(this.code_map_drillup[this.map_code_DRiLLUp[dRILlup+5]], 16); }
Decrypter.n_DRILlUP = function(DrIlluP, DrIlLup){ return parseInt(this.code_map_drillup[this.map_code_drILlup[DrIlluP+15]], 16); }
Decrypter.n_drilLUp = function(dRilLuP, drIlluP){ return parseInt(this.code_map_drillup[this.map_code_dRillup[dRilLuP+1]], 16); }
Decrypter.n_dRILLup = function(dRiLLUP, drillUp){ return parseInt(this.code_map_drillup[this.map_code_drILLUp[dRiLLUP+12]], 16); }
Decrypter.n_dRILluP = function(DRiLlUp, driLLUp){ return parseInt(this.code_map_drillup[this.map_code_dRiLlUp[DRiLlUp+10]], 16); }
Decrypter.n_DRiLLUP = function(DrilLup, dRIllUP){ return parseInt(this.code_map_drillup[this.map_code_DRiLlUp[DrilLup+12]], 16); }
Decrypter.n_drillUP = function(drilluP, DrILluP){ return parseInt(this.code_map_drillup[this.map_code_DRIllUP[drilluP+4]], 16); }
Decrypter.n_drIlLuP = function(DrILlUP, dRIllup){ return parseInt(this.code_map_drillup[this.map_code_driLLuP[DrILlUP+6]], 16); }
Decrypter.n_DRilluP = function(DrIllUp, drILLup){ return parseInt(this.code_map_drillup[this.map_code_dRILluP[DrIllUp+7]], 16); }
Decrypter.n_DrIlluP = function(DRillUP, DrIlLuP){ return parseInt(this.code_map_drillup[this.map_code_dRIlLUp[DRillUP+3]], 16); }
Decrypter.n_DRilLUP = function(drILlup, driLLup){ return parseInt(this.code_map_drillup[this.map_code_DRILlUp[drILlup+15]], 16); }
Decrypter.n_DriLLuP = function(drILlUp, drillUP){ return parseInt(this.code_map_drillup[this.map_code_Drillup[drILlUp+7]], 16); }
Decrypter.n_DrIlLUP = function(driLluP, dRIllUP){ return parseInt(this.code_map_drillup[this.map_code_DrIlLuP[driLluP+8]], 16); }
Decrypter.n_DriLlUp = function(DRilluP, dRilluP){ return parseInt(this.code_map_drillup[this.map_code_DrilLUp[DRilluP+15]], 16); }
Decrypter.n_dRiLLUp = function(DrilLup, dRILlUP){ return parseInt(this.code_map_drillup[this.map_code_drilLuP[DrilLup+14]], 16); }
Decrypter.n_dRilluP = function(DRILLup, dRiLLup){ return parseInt(this.code_map_drillup[this.map_code_drIlLUP[DRILLup+15]], 16); }
Decrypter.n_drilluP = function(dRilLuP, DrILLup){ return parseInt(this.code_map_drillup[this.map_code_DRILlUP[dRilLuP+5]], 16); }
Decrypter.n_drILLUp = function(dRILlUP, Drillup){ return parseInt(this.code_map_drillup[this.map_code_dRILLUp[dRILlUP+3]], 16); }
Decrypter.n_dRIllup = function(dRilLuP, drilLuP){ return parseInt(this.code_map_drillup[this.map_code_DRilLUp[dRilLuP+6]], 16); }
Decrypter.n_DrilLUp = function(DRiLLup, DRIlLUP){ return parseInt(this.code_map_drillup[this.map_code_DRilLUp[DRiLLup+12]], 16); }
Decrypter.n_DRiLlup = function(DriLLUP, DrilLuP){ return parseInt(this.code_map_drillup[this.map_code_drIllUP[DriLLUP+7]], 16); }
Decrypter.n_dRILlUP = function(drILLUP, driLLuP){ return parseInt(this.code_map_drillup[this.map_code_DrILlUp[drILLUP+9]], 16); }
Decrypter.n_DrILlup = function(DRiLLUp, DrILluP){ return parseInt(this.code_map_drillup[this.map_code_drilLup[DRiLLUp+3]], 16); }
Decrypter.n_dRilLUP = function(DRIllUp, dRiLLup){ return parseInt(this.code_map_drillup[this.map_code_DRILluP[DRIllUp+6]], 16); }
Decrypter.n_DrilluP = function(DrilLUP, drIlLUP){ return parseInt(this.code_map_drillup[this.map_code_DRILlUP[DrilLUP+4]], 16); }
Decrypter.n_drIllup = function(DrIllUp, dRIlluP){ return parseInt(this.code_map_drillup[this.map_code_driLLUP[DrIllUp+3]], 16); }
Decrypter.n_Drillup = function(DriLLUp, drIlluP){ return parseInt(this.code_map_drillup[this.map_code_drIlLuP[DriLLUp+5]], 16); }
Decrypter.n_DriLluP = function(drILLuP, dRIlluP){ return parseInt(this.code_map_drillup[this.map_code_dRilluP[drILLuP+11]], 16); }
Decrypter.n_dRilLup = function(DRILlup, DrillUP){ return parseInt(this.code_map_drillup[this.map_code_dRiLlup[DRILlup+3]], 16); }
Decrypter.n_driLLUp = function(drIllup, DriLLUP){ return parseInt(this.code_map_drillup[this.map_code_drIlLuP[drIllup+15]], 16); }
Decrypter.n_DRiLlUP = function(dRilLUp, dRillUP){ return parseInt(this.code_map_drillup[this.map_code_DRiLLup[dRilLUp+8]], 16); }
Decrypter.n_dRILlUp = function(DrILLUp, DrilLUP){ return parseInt(this.code_map_drillup[this.map_code_DrILLup[DrILLUp+3]], 16); }
Decrypter.n_dRILlup = function(dRIlLuP, DriLLup){ return parseInt(this.code_map_drillup[this.map_code_DrIllup[dRIlLuP+12]], 16); }
Decrypter.n_drIlLUp = function(dRILLUp, dRILlUp){ return parseInt(this.code_map_drillup[this.map_code_DrIllUP[dRILLUp+11]], 16); }
Decrypter.n_dRILLUP = function(dRIllUp, DRIllup){ return parseInt(this.code_map_drillup[this.map_code_DrIlLUp[dRIllUp+3]], 16); }
Decrypter.n_DrILLup = function(dRiLlUp, drIllup){ return parseInt(this.code_map_drillup[this.map_code_DRILlUp[dRiLlUp+9]], 16); }
Decrypter.n_drillUp = function(dRIllup, DRilluP){ return parseInt(this.code_map_drillup[this.map_code_dRILlup[dRIllup+10]], 16); }
Decrypter.n_driLLup = function(dRiLLuP, drilLuP){ return parseInt(this.code_map_drillup[this.map_code_drILLUp[dRiLLuP+14]], 16); }
Decrypter.n_DRilLUp = function(drillup, DrILLUP){ return parseInt(this.code_map_drillup[this.map_code_dRiLluP[drillup+12]], 16); }
Decrypter.n_DRIllUp = function(drILlup, Drillup){ return parseInt(this.code_map_drillup[this.map_code_DRIlLuP[drILlup+8]], 16); }
Decrypter.n_dRILLUp = function(dRiLlUp, DRiLLup){ return parseInt(this.code_map_drillup[this.map_code_DRIllup[dRiLlUp+8]], 16); }
Decrypter.n_dRiLlup = function(DrilluP, drIlluP){ return parseInt(this.code_map_drillup[this.map_code_DRiLluP[DrilluP+8]], 16); }
Decrypter.n_drillup = function(DRIllUp, drillUp){ return parseInt(this.code_map_drillup[this.map_code_drilLuP[DRIllUp+5]], 16); }
Decrypter.n_DRIlLUp = function(drILluP, DRILLuP){ return parseInt(this.code_map_drillup[this.map_code_dRiLLUp[drILluP+2]], 16); }
Decrypter.n_dRilLuP = function(drILlUp, dRILLuP){ return parseInt(this.code_map_drillup[this.map_code_dRILLUP[drILlUp+10]], 16); }
Decrypter.n_dRilLUp = function(DrIlLup, drillup){ return parseInt(this.code_map_drillup[this.map_code_drILLuP[DrIlLup+0]], 16); }
Decrypter.n_drIllUp = function(DrILLup, drILluP){ return parseInt(this.code_map_drillup[this.map_code_dRILlUP[DrILLup+0]], 16); }
Decrypter.n_dRiLLUP = function(DrIlLUP, DRiLLUp){ return parseInt(this.code_map_drillup[this.map_code_dRIlLUP[DrIlLUP+2]], 16); }
Decrypter.n_drILLuP = function(drILlUP, DrIllup){ return parseInt(this.code_map_drillup[this.map_code_dRILLuP[drILlUP+15]], 16); }
Decrypter.n_dRILLuP = function(driLLUp, DRIlLuP){ return parseInt(this.code_map_drillup[this.map_code_dRIlluP[driLLUp+4]], 16); }
Decrypter.n_dRIlLUp = function(dRIlLuP, drIllup){ return parseInt(this.code_map_drillup[this.map_code_dRiLluP[dRIlLuP+14]], 16); }
Decrypter.n_DRIlLup = function(DRilLuP, DriLLUp){ return parseInt(this.code_map_drillup[this.map_code_DrIlLUp[DRilLuP+9]], 16); }
Decrypter.n_dRIlLup = function(DRIlluP, dRIllUP){ return parseInt(this.code_map_drillup[this.map_code_DriLlUp[DRIlluP+6]], 16); }
Decrypter.n_DRIlLUP = function(DrilLUP, dRiLLUP){ return parseInt(this.code_map_drillup[this.map_code_dRilLUP[DrilLUP+14]], 16); }
Decrypter.n_DriLLUp = function(dRiLLup, dRiLLuP){ return parseInt(this.code_map_drillup[this.map_code_dRILLuP[dRiLLup+9]], 16); }
Decrypter.n_drILlUP = function(DRilLUP, drilluP){ return parseInt(this.code_map_drillup[this.map_code_DrILluP[DRilLUP+12]], 16); }
Decrypter.n_DrIllUp = function(DRILlUp, DRIllUp){ return parseInt(this.code_map_drillup[this.map_code_DrIlluP[DRILlUp+9]], 16); }
Decrypter.n_dRillUP = function(drILlUP, DRIlLUp){ return parseInt(this.code_map_drillup[this.map_code_DRILLuP[drILlUP+0]], 16); }
Decrypter.n_DRILLUp = function(dRiLlUp, dRILLUp){ return parseInt(this.code_map_drillup[this.map_code_DriLlUp[dRiLlUp+10]], 16); }
Decrypter.n_DRiLluP = function(DrIllUp, DRiLLUP){ return parseInt(this.code_map_drillup[this.map_code_DrIllUP[DrIllUp+10]], 16); }
Decrypter.n_driLlup = function(dRIlluP, DrIllUP){ return parseInt(this.code_map_drillup[this.map_code_dRiLLUP[dRIlluP+10]], 16); }
Decrypter.n_dRIlLUP = function(DrilLup, DRIlLUp){ return parseInt(this.code_map_drillup[this.map_code_DrILlUP[DrilLup+2]], 16); }
Decrypter.n_drilLuP = function(dRillUp, DrilLuP){ return parseInt(this.code_map_drillup[this.map_code_DrIlLUP[dRillUp+5]], 16); }
Decrypter.n_DrIllup = function(dRillup, DrIllUp){ return parseInt(this.code_map_drillup[this.map_code_drIlLUP[dRillup+13]], 16); }
Decrypter.n_DRIlLuP = function(drILlup, DRIllUP){ return parseInt(this.code_map_drillup[this.map_code_drilluP[drILlup+10]], 16); }
Decrypter.n_DrilLUP = function(DRiLLuP, DRIllUp){ return parseInt(this.code_map_drillup[this.map_code_DrIllUP[DRiLLuP+9]], 16); }
Decrypter.n_DRILluP = function(dRIlLUP, dRILLUP){ return parseInt(this.code_map_drillup[this.map_code_DRIlLuP[dRIlLUP+9]], 16); }
Decrypter.n_DriLLUP = function(dRiLluP, DriLlup){ return parseInt(this.code_map_drillup[this.map_code_dRilLup[dRiLluP+11]], 16); }
Decrypter.n_DriLlup = function(DRilLUp, dRillUP){ return parseInt(this.code_map_drillup[this.map_code_dRilLuP[DRilLUp+1]], 16); }
Decrypter.n_dRIlluP = function(DRILLuP, drILLUp){ return parseInt(this.code_map_drillup[this.map_code_DRIlLUP[DRILLuP+9]], 16); }
Decrypter.n_DRILlUp = function(dRILluP, DrIllUP){ return parseInt(this.code_map_drillup[this.map_code_dRIllUp[dRILluP+14]], 16); }
Decrypter.n_drILLup = function(DrILLup, drillUP){ return parseInt(this.code_map_drillup[this.map_code_dRiLLUp[DrILLup+9]], 16); }
Decrypter.n_driLlUp = function(drilLUP, drIlLup){ return parseInt(this.code_map_drillup[this.map_code_DRilluP[drilLUP+15]], 16); }
Decrypter.n_DRilLup = function(driLLup, DrIllup){ return parseInt(this.code_map_drillup[this.map_code_driLlUp[driLLup+11]], 16); }
Decrypter.n_DrilLuP = function(DRIllUp, DrILLUP){ return parseInt(this.code_map_drillup[this.map_code_drIllUP[DRIllUp+10]], 16); }
Decrypter.n_DRIlluP = function(dRillUp, DrIlLup){ return parseInt(this.code_map_drillup[this.map_code_drILLUp[dRillUp+1]], 16); }
Decrypter.n_drILluP = function(dRILlup, dRiLlup){ return parseInt(this.code_map_drillup[this.map_code_DRilluP[dRILlup+9]], 16); }
Decrypter.n_driLluP = function(DRIlLUp, DRilLuP){ return parseInt(this.code_map_drillup[this.map_code_DrILlUp[DRIlLUp+8]], 16); }
Decrypter.n_DrIllUP = function(drIlluP, Drillup){ return parseInt(this.code_map_drillup[this.map_code_DRILLuP[drIlluP+9]], 16); }
Decrypter.n_DRiLLup = function(DRIlLUP, dRIlLup){ return parseInt(this.code_map_drillup[this.map_code_DrIlluP[DRIlLUP+0]], 16); }
Decrypter.n_DRIllUP = function(dRIlLup, dRiLLUp){ return parseInt(this.code_map_drillup[this.map_code_dRillUP[dRIlLup+12]], 16); }
Decrypter.n_dRillup = function(dRIlLUp, DrilLUP){ return parseInt(this.code_map_drillup[this.map_code_dRIlLuP[dRIlLUp+9]], 16); }
Decrypter.n_dRillUp = function(DRIlluP, dRiLlup){ return parseInt(this.code_map_drillup[this.map_code_DrIllUp[DRIlluP+4]], 16); }
Decrypter.n_DrILLuP = function(DRIlLuP, drilLup){ return parseInt(this.code_map_drillup[this.map_code_DrillUP[DRIlLuP+3]], 16); }
Decrypter.n_DriLlUP = function(DRiLluP, DrILlUP){ return parseInt(this.code_map_drillup[this.map_code_dRilLup[DRiLluP+12]], 16); }
Decrypter.n_drIlLup = function(drIllup, DRilluP){ return parseInt(this.code_map_drillup[this.map_code_DrILlup[drIllup+1]], 16); }
Decrypter.n_DrILLUP = function(DRILLUp, DRILLup){ return parseInt(this.code_map_drillup[this.map_code_DrILlUP[DRILLUp+0]], 16); }
Decrypter.n_dRiLLup = function(dRIlLUP, drilLuP){ return parseInt(this.code_map_drillup[this.map_code_DRIlLuP[dRIlLUP+9]], 16); }
Decrypter.n_drILlup = function(DRILLUp, DRILLup){ return parseInt(this.code_map_drillup[this.map_code_DRILlUp[DRILLUp+6]], 16); }
Decrypter.n_DrillUP = function(dRIlLuP, dRiLlup){ return parseInt(this.code_map_drillup[this.map_code_DrIlLup[dRIlLuP+8]], 16); }
Decrypter.n_dRiLlUp = function(dRillup, dRILLUP){ return parseInt(this.code_map_drillup[this.map_code_DrIlluP[dRillup+8]], 16); }
Decrypter.n_DRIllup = function(drILlUp, DrIlluP){ return parseInt(this.code_map_drillup[this.map_code_DrilLUP[drILlUp+3]], 16); }
Decrypter.n_DrIlLuP = function(dRilLUp, DRIlLup){ return parseInt(this.code_map_drillup[this.map_code_DRiLluP[dRilLUp+5]], 16); }
Decrypter.n_DrILlUp = function(dRIllUp, DriLlUp){ return parseInt(this.code_map_drillup[this.map_code_drILluP[dRIllUp+11]], 16); }
Decrypter.n_DRILLuP = function(drIlluP, DRILlup){ return parseInt(this.code_map_drillup[this.map_code_driLlUP[drIlluP+5]], 16); }
Decrypter.n_DriLLup = function(drILlUp, dRIlLuP){ return parseInt(this.code_map_drillup[this.map_code_driLLUp[drILlUp+9]], 16); }
Decrypter.n_driLLuP = function(dRiLLup, driLLUp){ return parseInt(this.code_map_drillup[this.map_code_dRIlLUP[dRiLLup+11]], 16); }
Decrypter.n_drILlUp = function(DRILLUp, drillUp){ return parseInt(this.code_map_drillup[this.map_code_dRIllUp[DRILLUp+14]], 16); }
Decrypter.n_DRiLLUp = function(dRillup, drILLUP){ return parseInt(this.code_map_drillup[this.map_code_drIlLup[dRillup+0]], 16); }
Decrypter.n_DRiLLuP = function(DriLlup, DriLLuP){ return parseInt(this.code_map_drillup[this.map_code_DrilLUP[DriLlup+12]], 16); }
Decrypter.n_dRiLLuP = function(DrILLUp, Drillup){ return parseInt(this.code_map_drillup[this.map_code_DRIlLUP[DrILLUp+4]], 16); }
Decrypter.n_drilLUP = function(drILlup, dRillup){ return parseInt(this.code_map_drillup[this.map_code_driLLUP[drILlup+13]], 16); }
Decrypter.n_DRillup = function(DRiLluP, dRIlluP){ return parseInt(this.code_map_drillup[this.map_code_DRILlUP[DRiLluP+8]], 16); }
Decrypter.n_dRIllUP = function(dRIlLUp, driLlUp){ return parseInt(this.code_map_drillup[this.map_code_DRiLLuP[dRIlLUp+7]], 16); }
Decrypter.n_DRILlup = function(dRiLlUP, DrILLuP){ return parseInt(this.code_map_drillup[this.map_code_dRiLLUp[dRiLlUP+5]], 16); }
Decrypter.n_DRILLup = function(DRillUP, DrILLUp){ return parseInt(this.code_map_drillup[this.map_code_DRilLUP[DRillUP+12]], 16); }
Decrypter.n_dRIllUp = function(dRILluP, DRillup){ return parseInt(this.code_map_drillup[this.map_code_dRILLUP[dRILluP+6]], 16); }
Decrypter.n_DrILluP = function(drIlLuP, DRiLlup){ return parseInt(this.code_map_drillup[this.map_code_dRILlUp[drIlLuP+15]], 16); }
Decrypter.n_DrILlUP = function(drILLuP, DriLLUP){ return parseInt(this.code_map_drillup[this.map_code_drIlLUP[drILLuP+3]], 16); }
Decrypter.N_drillup = 16;
Decrypter.N_Drillup = 29;
Decrypter.N_dRillup = 23;
Decrypter.N_DRillup = 24;
Decrypter.N_drIllup = 21;
Decrypter.N_DrIllup = 12;
Decrypter.N_dRIllup = 6;
Decrypter.N_DRIllup = 14;
Decrypter.N_driLlup = 7;
Decrypter.N_DriLlup = 1;
Decrypter.N_dRiLlup = 4;
Decrypter.N_DRiLlup = 22;
Decrypter.N_drILlup = 26;
Decrypter.N_DrILlup = 7;
Decrypter.N_dRILlup = 3;
Decrypter.N_DRILlup = 18;
Decrypter.N_drilLup = 26;
Decrypter.N_DrilLup = 8;
Decrypter.N_dRilLup = 10;
Decrypter.N_DRilLup = 14;
Decrypter.N_drIlLup = 23;
Decrypter.N_DrIlLup = 24;
Decrypter.N_dRIlLup = 2;
Decrypter.N_DRIlLup = 27;
Decrypter.N_driLLup = 4;
Decrypter.N_DriLLup = 11;
Decrypter.N_dRiLLup = 21;
Decrypter.N_DRiLLup = 14;
Decrypter.N_drILLup = 22;
Decrypter.N_DrILLup = 29;
Decrypter.N_dRILLup = 28;
Decrypter.N_DRILLup = 2;
Decrypter.N_drillUp = 3;
Decrypter.N_DrillUp = 1;
Decrypter.N_dRillUp = 19;
Decrypter.N_DRillUp = 9;
Decrypter.N_drIllUp = 3;
Decrypter.N_DrIllUp = 25;
Decrypter.N_dRIllUp = 19;
Decrypter.N_DRIllUp = 0;
Decrypter.N_driLlUp = 0;
Decrypter.N_DriLlUp = 0;
Decrypter.N_dRiLlUp = 23;
Decrypter.N_DRiLlUp = 28;
Decrypter.N_drILlUp = 8;
Decrypter.N_DrILlUp = 17;
Decrypter.N_dRILlUp = 6;
Decrypter.N_DRILlUp = 1;
Decrypter.N_drilLUp = 0;
Decrypter.N_DrilLUp = 14;
Decrypter.N_dRilLUp = 7;
Decrypter.N_DRilLUp = 20;
Decrypter.N_drIlLUp = 21;
Decrypter.N_DrIlLUp = 7;
Decrypter.N_dRIlLUp = 1;
Decrypter.N_DRIlLUp = 11;
Decrypter.N_driLLUp = 10;
Decrypter.N_DriLLUp = 11;
Decrypter.N_dRiLLUp = 3;
Decrypter.N_DRiLLUp = 21;
Decrypter.N_drILLUp = 10;
Decrypter.N_DrILLUp = 0;
Decrypter.N_dRILLUp = 0;
Decrypter.N_DRILLUp = 0;
Decrypter.N_drilluP = 12;
Decrypter.N_DrilluP = 17;
Decrypter.N_dRilluP = 2;
Decrypter.N_DRilluP = 1;
Decrypter.N_drIlluP = 22;
Decrypter.N_DrIlluP = 21;
Decrypter.N_dRIlluP = 23;
Decrypter.N_DRIlluP = 12;
Decrypter.N_driLluP = 17;
Decrypter.N_DriLluP = 12;
Decrypter.N_dRiLluP = 6;
Decrypter.N_DRiLluP = 18;
Decrypter.N_drILluP = 22;
Decrypter.N_DrILluP = 1;
Decrypter.N_dRILluP = 4;
Decrypter.N_DRILluP = 10;
Decrypter.N_drilLuP = 7;
Decrypter.N_DrilLuP = 19;
Decrypter.N_dRilLuP = 22;
Decrypter.N_DRilLuP = 1;
Decrypter.N_drIlLuP = 25;
Decrypter.N_DrIlLuP = 19;
Decrypter.N_dRIlLuP = 23;
Decrypter.N_DRIlLuP = 18;
Decrypter.N_driLLuP = 5;
Decrypter.N_DriLLuP = 0;
Decrypter.N_dRiLLuP = 15;
Decrypter.N_DRiLLuP = 3;
Decrypter.N_drILLuP = 29;
Decrypter.N_DrILLuP = 15;
Decrypter.N_dRILLuP = 21;
Decrypter.N_DRILLuP = 10;
Decrypter.N_drillUP = 8;
Decrypter.N_DrillUP = 22;
Decrypter.N_dRillUP = 11;
Decrypter.N_DRillUP = 14;
Decrypter.f_drIlLup =  function(driLlUP,dRiLLup){if( Decrypter.N_driLLup == Decrypter.N_DRILlUp && Decrypter.N_dRillUp == Decrypter.N_dRIllUp && Decrypter.N_dRilLup == Decrypter.N_driLLUp ) {var byteArray = new Uint8Array(dRiLLup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_driLLUp(i,20);driLlUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DriLlUp =  function(DriLlUp,drillUP){if( Decrypter.N_DRILlup == Decrypter.N_DRiLluP && Decrypter.N_driLLup == Decrypter.N_DRiLluP && Decrypter.N_dRillup == Decrypter.N_dRIlluP ) {var byteArray = new Uint8Array(drillUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRILLuP(i,41);DriLlUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrilluP =  function(dRIlluP,DrILlUP){if( Decrypter.N_DriLlUp == Decrypter.N_dRILLUp && Decrypter.N_DRIllUp == Decrypter.N_DriLlUp && Decrypter.N_DrIllup == Decrypter.N_DrIlLUp ) {var byteArray = new Uint8Array(DrILlUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRIllUP(i,65);dRIlluP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRILlUp =  function(DrillUP,DrilLup){if( Decrypter.N_DrilLup == Decrypter.N_drILlUp && Decrypter.N_dRiLlup == Decrypter.N_driLLup && Decrypter.N_drIllup == Decrypter.N_DriLLuP ) {var byteArray = new Uint8Array(DrilLup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRilLUP(i,47);DrillUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrillUP =  function(DRilLUP,DRilLup){if( Decrypter.N_DrIllup == Decrypter.N_DriLluP && Decrypter.N_dRIllUp == Decrypter.N_DrilLuP && Decrypter.N_dRIllup == Decrypter.N_dRILLUp ) {var byteArray = new Uint8Array(DRilLup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRIllUP(i,97);DRilLUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRilluP =  function(DrIllup,DRiLLuP){if( Decrypter.N_drillUp == Decrypter.N_drIllUp && Decrypter.N_DRIllup == Decrypter.N_DRiLLup && Decrypter.N_DrIllup == Decrypter.N_DRiLLUp ) {var byteArray = new Uint8Array(DRiLLuP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DriLlUp(i,67);DrIllup.setUint8(i, byteArray[i]);}}}
Decrypter.f_drILLUp =  function(DRILLuP,DRILluP){if( Decrypter.N_dRilLUp == Decrypter.N_drilLuP && Decrypter.N_drIllup == Decrypter.N_drIlLUp && Decrypter.N_DrIllup == Decrypter.N_dRIllUp ) {var byteArray = new Uint8Array(DRILluP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drILLUP(i,60);DRILLuP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrIlLup =  function(DRiLlUp,DRillUP){if( Decrypter.N_drILLup == Decrypter.N_drILluP && Decrypter.N_DrIlluP == Decrypter.N_drILLuP && Decrypter.N_DriLlUp == Decrypter.N_DrILLuP ) {var byteArray = new Uint8Array(DRillUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRilLUp(i,21);DRiLlUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_drIlluP =  function(drIlLUP,dRiLLUp){if( Decrypter.N_DRillup == Decrypter.N_drILluP && Decrypter.N_dRiLLUp == Decrypter.N_drilluP && Decrypter.N_DrILLup == Decrypter.N_drILLuP ) {var byteArray = new Uint8Array(dRiLLUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRilLUP(i,68);drIlLUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRIllup =  function(dRILlup,DrILlup){if( Decrypter.N_dRilLup == Decrypter.N_DRILLuP && Decrypter.N_dRiLLup == Decrypter.N_dRILLuP && Decrypter.N_DRillup == Decrypter.N_driLLUp ) {var byteArray = new Uint8Array(DrILlup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRIllUp(i,7);dRILlup.setUint8(i, byteArray[i]);}}}
Decrypter.f_Drillup =  function(DrIlLuP,DRiLLup){if( Decrypter.N_DRiLlup == Decrypter.N_DRIlLUp && Decrypter.N_driLlUp == Decrypter.N_DriLlUp && Decrypter.N_DriLlUp == Decrypter.N_DrILLUp ) {var byteArray = new Uint8Array(DRiLLup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRILlup(i,1);DrIlLuP.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRiLLUp =  function(DRILluP,DRillUP){if( Decrypter.N_DrIllup == Decrypter.N_DrIlLup && Decrypter.N_drIllup == Decrypter.N_drillUp && Decrypter.N_drilLUp == Decrypter.N_DriLLuP ) {var byteArray = new Uint8Array(DRillUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRILLUp(i,58);DRILluP.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRILLUp =  function(DRiLLUP,dRilLup){if( Decrypter.N_drilLup == Decrypter.N_DRiLLup && Decrypter.N_DRIllUp == Decrypter.N_DrILLUp && Decrypter.N_dRiLlup == Decrypter.N_DRilLup ) {var byteArray = new Uint8Array(dRilLup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drilLup(i,62);DRiLLUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_drILlUp =  function(DrillUp,DRiLlup){if( Decrypter.N_drILlup == Decrypter.N_driLLUp && Decrypter.N_dRiLLup == Decrypter.N_drIlLUp && Decrypter.N_drIllup == Decrypter.N_dRILLuP ) {var byteArray = new Uint8Array(DRiLlup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRilLUp(i,44);DrillUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRiLLuP =  function(dRillUp,DRilLUp){if( Decrypter.N_dRIlLup == Decrypter.N_DRILLup && Decrypter.N_DrILlUp == Decrypter.N_DrIlLuP && Decrypter.N_DrILlup == Decrypter.N_DrIlLUp ) {var byteArray = new Uint8Array(DRilLUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRIllUP(i,91);dRillUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRIlLup =  function(driLLuP,dRilluP){if( Decrypter.N_Drillup == Decrypter.N_DRiLLup && Decrypter.N_drilLUp == Decrypter.N_dRILLUp && Decrypter.N_DRIllUp == Decrypter.N_drilLUp ) {var byteArray = new Uint8Array(dRilluP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRiLlup(i,22);driLLuP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DriLlup =  function(DRiLLUP,DrIllup){if( Decrypter.N_dRIllUp == Decrypter.N_driLluP && Decrypter.N_DriLLup == Decrypter.N_DriLluP && Decrypter.N_DrilluP == Decrypter.N_driLluP ) {var byteArray = new Uint8Array(DrIllup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRilLUp(i,9);DRiLLUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_drIlLUp =  function(dRilLUp,dRillUp){if( Decrypter.N_DriLLup == Decrypter.N_DriLLUp && Decrypter.N_DrillUp == Decrypter.N_dRIlLUp && Decrypter.N_DrIllup == Decrypter.N_drILlup ) {var byteArray = new Uint8Array(dRillUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRILLuP(i,52);dRilLUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRIllUp =  function(DRIlLuP,drilLup){if( Decrypter.N_drIllup == Decrypter.N_drIlLUp && Decrypter.N_DriLlup == Decrypter.N_dRIlLUp && Decrypter.N_DRIllup == Decrypter.N_DRiLLup ) {var byteArray = new Uint8Array(drilLup);for (i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DriLlUP(i,38);DRIlLuP.setUint8(i, byteArray[i]);}}}
Decrypter.f_drILLup =  function(driLlup,DrilLup){if( Decrypter.N_DRiLlup == Decrypter.N_dRilLUp && Decrypter.N_drillup == Decrypter.N_DRIlLup && Decrypter.N_DrIllup == Decrypter.N_DRIlluP ) {var byteArray = new Uint8Array(DrilLup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRilLuP(i,28);driLlup.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrIlLuP =  function(drilLuP,drilLup){if( Decrypter.N_dRiLlUp == Decrypter.N_dRIlLuP && Decrypter.N_DRiLLup == Decrypter.N_drillUp && Decrypter.N_driLLuP == Decrypter.N_drILLuP ) {var byteArray = new Uint8Array(drilLup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DriLlUP(i,85);drilLuP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrILLup =  function(driLLUP,DrIllUP){if( Decrypter.N_DriLlup == Decrypter.N_DrILluP && Decrypter.N_DRiLLUp == Decrypter.N_DrIlluP && Decrypter.N_drIllup == Decrypter.N_DrILLup ) {var byteArray = new Uint8Array(DrIllUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DriLLuP(i,29);driLLUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrIlluP =  function(DRILlUP,drILlup){if( Decrypter.N_driLlup == Decrypter.N_drilLuP && Decrypter.N_driLLUp == Decrypter.N_drILLUp && Decrypter.N_DrIllup == Decrypter.N_DRilluP ) {var byteArray = new Uint8Array(drILlup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DrILLUP(i,69);DRILlUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_drIlLuP =  function(dRiLlUp,DrIllUP){if( Decrypter.N_DRilLup == Decrypter.N_driLLUp && Decrypter.N_DRILlup == Decrypter.N_drIlLup && Decrypter.N_drIlLUp == Decrypter.N_dRILLuP ) {var byteArray = new Uint8Array(DrIllUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_driLlup(i,84);dRiLlUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRiLlup =  function(DRillUp,driLLup){if( Decrypter.N_DriLlup == Decrypter.N_DRiLLuP && Decrypter.N_drillUp == Decrypter.N_dRiLLUp && Decrypter.N_DrIlLUp == Decrypter.N_DrilluP ) {var byteArray = new Uint8Array(driLLup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRiLLUp(i,10);DRillUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRiLlup =  function(driLLup,drILLUp){if( Decrypter.N_dRiLLUp == Decrypter.N_DRiLLuP && Decrypter.N_dRILLup == Decrypter.N_DRiLLUp && Decrypter.N_drilLup == Decrypter.N_DrILLuP ) {var byteArray = new Uint8Array(drILLUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRIlLuP(i,11);driLLup.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRILLuP =  function(drilluP,dRillUp){if( Decrypter.N_DrillUp == Decrypter.N_DRilluP && Decrypter.N_DrilLup == Decrypter.N_dRIlluP && Decrypter.N_drillup == Decrypter.N_DriLLup ) {var byteArray = new Uint8Array(dRillUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DrILlUp(i,95);drilluP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrILlUp =  function(DRIlLUP,drillup){if( Decrypter.N_dRilLup == Decrypter.N_drILLUp && Decrypter.N_drillup == Decrypter.N_DRIllup && Decrypter.N_drIlLup == Decrypter.N_DRIlLuP ) {var byteArray = new Uint8Array(drillup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRILLuP(i,45);DRIlLUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRillUP =  function(DrillUp,dRIlLUp){if( Decrypter.N_DrILlup == Decrypter.N_dRilLUp && Decrypter.N_DRIllup == Decrypter.N_DrilLUp && Decrypter.N_dRIllup == Decrypter.N_DrIlluP ) {var byteArray = new Uint8Array(dRIlLUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRILLup(i,99);DrillUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_drillUp =  function(driLluP,DriLluP){if( Decrypter.N_DRiLLUp == Decrypter.N_dRILLuP && Decrypter.N_drillup == Decrypter.N_dRIllup && Decrypter.N_DrILLUp == Decrypter.N_dRILLUp ) {var byteArray = new Uint8Array(DriLluP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRillUp(i,32);driLluP.setUint8(i, byteArray[i]);}}}
Decrypter.f_drILluP =  function(DrILlUp,dRillUp){if( Decrypter.N_drIlLup == Decrypter.N_dRIlluP && Decrypter.N_drilLup == Decrypter.N_dRiLLUp && Decrypter.N_DriLLUp == Decrypter.N_dRillUP ) {var byteArray = new Uint8Array(dRillUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRiLlup(i,76);DrILlUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_driLLup =  function(dRilluP,dRILlup){if( Decrypter.N_DriLLup == Decrypter.N_DriLLuP && Decrypter.N_drIlluP == Decrypter.N_dRilLuP && Decrypter.N_dRiLlup == Decrypter.N_DrilluP ) {var byteArray = new Uint8Array(dRILlup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drIllUP(i,24);dRilluP.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRilluP =  function(dRIllUp,DRIlLUP){if( Decrypter.N_dRILlup == Decrypter.N_dRiLLUp && Decrypter.N_dRIlLuP == Decrypter.N_driLLuP && Decrypter.N_DrilLUp == Decrypter.N_dRilluP ) {var byteArray = new Uint8Array(DRIlLUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DriLLup(i,66);dRIllUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_drilLup =  function(dRILlUP,dRILLUP){if( Decrypter.N_drILluP == Decrypter.N_dRilLuP && Decrypter.N_DrILlup == Decrypter.N_DRiLLup && Decrypter.N_DRilLup == Decrypter.N_DRiLLup ) {var byteArray = new Uint8Array(dRILLUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRILlUp(i,16);dRILlUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRilLUp =  function(DRiLLUp,DRIlluP){if( Decrypter.N_driLlUp == Decrypter.N_driLLuP && Decrypter.N_DRilLUp == Decrypter.N_dRILLUp && Decrypter.N_driLlUp == Decrypter.N_dRILLUp ) {var byteArray = new Uint8Array(DRIlluP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DriLlUP(i,50);DRiLLUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_drIllUp =  function(DrILLUp,dRILLuP){if( Decrypter.N_drIlLup == Decrypter.N_dRIlLuP && Decrypter.N_DriLLup == Decrypter.N_DRiLLup && Decrypter.N_DrIlLup == Decrypter.N_driLLuP ) {var byteArray = new Uint8Array(dRILLuP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drILlUp(i,36);DrILLUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRILlup =  function(DrIlLup,DRillUP){if( Decrypter.N_DRILlUp == Decrypter.N_DrilLuP && Decrypter.N_DRILlUp == Decrypter.N_dRIlLUp && Decrypter.N_dRillup == Decrypter.N_DrIlLuP ) {var byteArray = new Uint8Array(DRillUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRiLLup(i,14);DrIlLup.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRilLup =  function(DrILLuP,DRiLLUp){if( Decrypter.N_drillup == Decrypter.N_driLLup && Decrypter.N_DRILLup == Decrypter.N_dRilluP && Decrypter.N_dRILlup == Decrypter.N_DRiLLuP ) {var byteArray = new Uint8Array(DRiLLUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRiLlup(i,18);DrILLuP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrillUp =  function(DrILLUp,DrilLup){if( Decrypter.N_DrillUp == Decrypter.N_DRillUP && Decrypter.N_driLlUp == Decrypter.N_DrILLUp && Decrypter.N_DrIlLup == Decrypter.N_drILLup ) {var byteArray = new Uint8Array(DrilLup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drilLUp(i,33);DrILLUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_DriLLup =  function(DrilLuP,drillUp){if( Decrypter.N_drILluP == Decrypter.N_dRILLuP && Decrypter.N_DRIlLUp == Decrypter.N_dRillUP && Decrypter.N_DRIllUp == Decrypter.N_DriLLuP ) {var byteArray = new Uint8Array(drillUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drILlUP(i,25);DrilLuP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRIllUp =  function(Drillup,DRillup){if( Decrypter.N_dRILLup == Decrypter.N_DRiLlUp && Decrypter.N_drILLup == Decrypter.N_dRilLuP && Decrypter.N_drIllup == Decrypter.N_dRILLUp ) {var byteArray = new Uint8Array(DRillup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_driLLup(i,39);Drillup.setUint8(i, byteArray[i]);}}}
Decrypter.f_drilLuP =  function(drIllUP,driLLup){if( Decrypter.N_drILlUp == Decrypter.N_DrilluP && Decrypter.N_DrILlUp == Decrypter.N_DrilluP && Decrypter.N_DrilluP == Decrypter.N_driLLuP ) {var byteArray = new Uint8Array(driLLup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drilLUp(i,80);drIllUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRilLup =  function(dRILluP,drIllup){if( Decrypter.N_DRIlLUp == Decrypter.N_drillUP && Decrypter.N_drILlup == Decrypter.N_DRiLlUp && Decrypter.N_driLlup == Decrypter.N_DrillUP ) {var byteArray = new Uint8Array(drIllup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_driLLUp(i,19);dRILluP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRilLuP =  function(driLlUP,dRilLuP){if( Decrypter.N_dRiLLup == Decrypter.N_dRillUP && Decrypter.N_dRIlLUp == Decrypter.N_DRilluP && Decrypter.N_DrIllup == Decrypter.N_drilluP ) {var byteArray = new Uint8Array(dRilLuP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DrILlup(i,83);driLlUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRiLlUp =  function(DRiLlUp,DriLluP){if( Decrypter.N_dRiLlup == Decrypter.N_driLluP && Decrypter.N_driLlup == Decrypter.N_DrILlup && Decrypter.N_DrIlluP == Decrypter.N_DrilLuP ) {var byteArray = new Uint8Array(DriLluP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRIlLup(i,43);DRiLlUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRIlLuP =  function(driLLuP,dRIllUp){if( Decrypter.N_DRIlluP == Decrypter.N_DriLluP && Decrypter.N_dRIlLUp == Decrypter.N_DrILluP && Decrypter.N_dRIllup == Decrypter.N_drILLup ) {var byteArray = new Uint8Array(dRIllUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRilLUp(i,86);driLLuP.setUint8(i, byteArray[i]);}}}
Decrypter.f_driLluP =  function(drILLUp,DRilLuP){if( Decrypter.N_dRILLUp == Decrypter.N_DriLLuP && Decrypter.N_drilluP == Decrypter.N_DriLluP && Decrypter.N_DrIllup == Decrypter.N_DRILluP ) {var byteArray = new Uint8Array(DRilLuP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drIllUP(i,72);drILLUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRILlup =  function(drilLup,driLLup){if( Decrypter.N_DrILlup == Decrypter.N_drilLuP && Decrypter.N_driLlUp == Decrypter.N_DriLLuP && Decrypter.N_DRillup == Decrypter.N_DrilLuP ) {var byteArray = new Uint8Array(driLLup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRiLluP(i,15);drilLup.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrILLUp =  function(dRIllup,driLluP){if( Decrypter.N_DRILlup == Decrypter.N_DRIlLuP && Decrypter.N_DrIllup == Decrypter.N_DRiLLup && Decrypter.N_dRillup == Decrypter.N_DriLLUp ) {var byteArray = new Uint8Array(driLluP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRiLLuP(i,61);dRIllup.setUint8(i, byteArray[i]);}}}
Decrypter.f_drillup =  function(dRIlluP,DrillUP){if( Decrypter.N_drILLup == Decrypter.N_drIlluP && Decrypter.N_DriLlup == Decrypter.N_dRIlLUp && Decrypter.N_DRillup == Decrypter.N_dRillUp ) {var byteArray = new Uint8Array(DrillUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRILLuP(i,0);dRIlluP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrILlup =  function(DRiLLUP,dRiLlUp){if( Decrypter.N_DRILlup == Decrypter.N_drIlluP && Decrypter.N_DRiLLUp == Decrypter.N_DRIlluP && Decrypter.N_DRILluP == Decrypter.N_drIlLuP ) {var byteArray = new Uint8Array(dRiLlUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DriLlUp(i,13);DRiLLUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRIllup =  function(dRILLuP,dRilluP){if( Decrypter.N_DRIllUp == Decrypter.N_driLlUp && Decrypter.N_drILlup == Decrypter.N_dRIllUp && Decrypter.N_DrILlUp == Decrypter.N_driLluP ) {var byteArray = new Uint8Array(dRilluP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRiLlUP(i,6);dRILLuP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRillup =  function(DriLLUp,DRIlluP){if( Decrypter.N_DRIllup == Decrypter.N_drIllUp && Decrypter.N_driLlup == Decrypter.N_dRilLUp && Decrypter.N_dRIlluP == Decrypter.N_drILluP ) {var byteArray = new Uint8Array(DRIlluP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRIlLUP(i,3);DriLLUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_DriLLUp =  function(DRILlUP,DrILlUP){if( Decrypter.N_DrILLup == Decrypter.N_dRiLLUp && Decrypter.N_dRillup == Decrypter.N_DRILlup && Decrypter.N_DriLlup == Decrypter.N_DrillUp ) {var byteArray = new Uint8Array(DrILlUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drilLUP(i,57);DRILlUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_driLlup =  function(drILluP,DRiLLUP){if( Decrypter.N_dRiLLup == Decrypter.N_DRiLLUp && Decrypter.N_DrillUp == Decrypter.N_DRILlUp && Decrypter.N_DRillup == Decrypter.N_DRiLLUp ) {var byteArray = new Uint8Array(DRiLLUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRilLUp(i,8);drILluP.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRIlluP =  function(drILLUP,DriLLuP){if( Decrypter.N_dRilLuP == Decrypter.N_DrillUP && Decrypter.N_DRIllUp == Decrypter.N_drILluP && Decrypter.N_drIllUp == Decrypter.N_dRiLLUp ) {var byteArray = new Uint8Array(DriLLuP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRiLluP(i,70);drILLUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrIllUp =  function(dRILlUP,DRIlLup){if( Decrypter.N_driLLUp == Decrypter.N_DRILLuP && Decrypter.N_DrIllUp == Decrypter.N_driLLuP && Decrypter.N_drilLup == Decrypter.N_DRilLUp ) {var byteArray = new Uint8Array(DRIlLup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drILLUp(i,37);dRILlUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrilLUp =  function(drIlLUP,drillUP){if( Decrypter.N_DrIllup == Decrypter.N_dRIlluP && Decrypter.N_DrILlup == Decrypter.N_dRIlLup && Decrypter.N_driLLUp == Decrypter.N_DRillUP ) {var byteArray = new Uint8Array(drillUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_driLLUp(i,49);drIlLUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_driLLuP =  function(driLlup,drILlUP){if( Decrypter.N_drILlup == Decrypter.N_drilLup && Decrypter.N_DriLLup == Decrypter.N_dRillUP && Decrypter.N_dRIllup == Decrypter.N_dRillUp ) {var byteArray = new Uint8Array(drILlUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_Drillup(i,88);driLlup.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRiLlUp =  function(drIlLup,dRIllUp){if( Decrypter.N_drILLup == Decrypter.N_drILLuP && Decrypter.N_DrilLup == Decrypter.N_dRiLluP && Decrypter.N_dRillUp == Decrypter.N_dRILLuP ) {var byteArray = new Uint8Array(dRIllUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRiLlUp(i,42);drIlLup.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRIlluP =  function(dRilLuP,driLLup){if( Decrypter.N_dRillup == Decrypter.N_DriLLuP && Decrypter.N_DRILLup == Decrypter.N_DRilLuP && Decrypter.N_DRILlUp == Decrypter.N_DRilluP ) {var byteArray = new Uint8Array(driLLup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drIllUP(i,71);dRilLuP.setUint8(i, byteArray[i]);}}}
Decrypter.f_driLLUp =  function(DRilLUP,DRiLlUp){if( Decrypter.N_drILLup == Decrypter.N_DrilLuP && Decrypter.N_dRIllup == Decrypter.N_dRiLluP && Decrypter.N_drIllUp == Decrypter.N_drilluP ) {var byteArray = new Uint8Array(DRiLlUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DrIlLuP(i,56);DRilLUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_drIllup =  function(dRILlup,DRIllup){if( Decrypter.N_drIlLup == Decrypter.N_DRiLLup && Decrypter.N_DRilLup == Decrypter.N_DRillUP && Decrypter.N_dRIllUp == Decrypter.N_DrIlLuP ) {var byteArray = new Uint8Array(DRIllup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRIlluP(i,4);dRILlup.setUint8(i, byteArray[i]);}}}
Decrypter.f_DriLluP =  function(DRIlLup,DrILLuP){if( Decrypter.N_driLLup == Decrypter.N_driLLUp && Decrypter.N_DrILluP == Decrypter.N_DRilLuP && Decrypter.N_driLluP == Decrypter.N_dRILluP ) {var byteArray = new Uint8Array(DrILLuP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DrIlLUp(i,73);DRIlLup.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRILLUp =  function(DrILLUp,DRiLluP){if( Decrypter.N_DriLlUp == Decrypter.N_DRILLUp && Decrypter.N_DrILlup == Decrypter.N_DRILLUp && Decrypter.N_drIlLup == Decrypter.N_dRiLlUp ) {var byteArray = new Uint8Array(DRiLluP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DrILLuP(i,63);DrILLUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_drillUP =  function(DRillUP,DRillup){if( Decrypter.N_drillUp == Decrypter.N_drilLUp && Decrypter.N_DriLlup == Decrypter.N_DRILlUp && Decrypter.N_drilLUp == Decrypter.N_DRILLUp ) {var byteArray = new Uint8Array(DRillup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRILlUP(i,96);DRillUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRiLLUp =  function(driLLUp,dRIlLuP){if( Decrypter.N_DrillUp == Decrypter.N_DRilLuP && Decrypter.N_drilLUp == Decrypter.N_DrILLUp && Decrypter.N_DrIllup == Decrypter.N_DRillUp ) {var byteArray = new Uint8Array(dRIlLuP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DrIlLuP(i,59);driLLUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRIlLup =  function(DrILlUP,drIllUp){if( Decrypter.N_dRiLLUp == Decrypter.N_dRILLUp && Decrypter.N_dRillup == Decrypter.N_driLlUp && Decrypter.N_dRILlup == Decrypter.N_drIllUp ) {var byteArray = new Uint8Array(drIllUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drILLup(i,23);DrILlUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_drilLUp =  function(dRILLuP,dRiLluP){if( Decrypter.N_DrILLUp == Decrypter.N_DriLLuP && Decrypter.N_driLlup == Decrypter.N_DrIlLUp && Decrypter.N_drIllup == Decrypter.N_drILLuP ) {var byteArray = new Uint8Array(dRiLluP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DrIlluP(i,48);dRILLuP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrILLuP =  function(DriLLup,DriLlup){if( Decrypter.N_Drillup == Decrypter.N_drilluP && Decrypter.N_dRILlUp == Decrypter.N_DrILLuP && Decrypter.N_dRilLup == Decrypter.N_DrILLUp ) {var byteArray = new Uint8Array(DriLlup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DrillUp(i,93);DriLLup.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrilLuP =  function(DRILLuP,DriLluP){if( Decrypter.N_DrIllUp == Decrypter.N_DriLluP && Decrypter.N_DRILluP == Decrypter.N_DRILLuP && Decrypter.N_DrILlUp == Decrypter.N_DRILLuP ) {var byteArray = new Uint8Array(DriLluP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drILLUP(i,81);DRILLuP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRILLup =  function(dRILLup,dRillup){if( Decrypter.N_DRilLup == Decrypter.N_drIllUp && Decrypter.N_dRIllup == Decrypter.N_dRILlUp && Decrypter.N_DriLLup == Decrypter.N_drILLUp ) {var byteArray = new Uint8Array(dRillup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRiLLup(i,31);dRILLup.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRIlLUp =  function(DRILlUp,DrIllUp){if( Decrypter.N_DrIllUp == Decrypter.N_drIlLuP && Decrypter.N_DRiLlup == Decrypter.N_DrillUP && Decrypter.N_DrIllup == Decrypter.N_dRilLup ) {var byteArray = new Uint8Array(DrIllUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_driLlUP(i,54);DRILlUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrIlLUp =  function(DRiLlUP,DriLlUp){if( Decrypter.N_Drillup == Decrypter.N_dRillUp && Decrypter.N_DRIllup == Decrypter.N_DriLLuP && Decrypter.N_drIlLUp == Decrypter.N_DRiLLUp ) {var byteArray = new Uint8Array(DriLlUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRiLLUP(i,53);DRiLlUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DriLLuP =  function(DRILlup,DRILluP){if( Decrypter.N_drilluP == Decrypter.N_drILluP && Decrypter.N_DrilLup == Decrypter.N_driLLuP && Decrypter.N_dRillUp == Decrypter.N_DrilLuP ) {var byteArray = new Uint8Array(DRILluP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRIlLup(i,89);DRILlup.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRilLUp =  function(drIlLUP,DrilLup){if( Decrypter.N_drillUp == Decrypter.N_dRIlLuP && Decrypter.N_drIllup == Decrypter.N_DrILluP && Decrypter.N_drILLUp == Decrypter.N_DRILluP ) {var byteArray = new Uint8Array(DrilLup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRIlluP(i,51);drIlLUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRiLluP =  function(DRiLluP,dRilLup){if( Decrypter.N_drIlLuP == Decrypter.N_driLLuP && Decrypter.N_DrilLup == Decrypter.N_drillUP && Decrypter.N_dRILlup == Decrypter.N_dRiLLup ) {var byteArray = new Uint8Array(dRilLup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRillup(i,75);DRiLluP.setUint8(i, byteArray[i]);}}}
Decrypter.f_driLlUp =  function(dRillUP,DrILlUP){if( Decrypter.N_DRiLluP == Decrypter.N_DRIlLuP && Decrypter.N_drIlLup == Decrypter.N_DRIllUp && Decrypter.N_dRIlluP == Decrypter.N_dRIlLuP ) {var byteArray = new Uint8Array(DrILlUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRiLLUp(i,40);dRillUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRIlLUp =  function(drILlUP,DRiLlUp){if( Decrypter.N_DrilluP == Decrypter.N_dRilluP && Decrypter.N_DRIllup == Decrypter.N_DRilLup && Decrypter.N_DriLlup == Decrypter.N_DRilluP ) {var byteArray = new Uint8Array(DRiLlUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRILLUp(i,55);drILlUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRILlUp =  function(dRILlup,dRILLUp){if( Decrypter.N_dRilLUp == Decrypter.N_driLluP && Decrypter.N_drIlLUp == Decrypter.N_DrIlluP && Decrypter.N_DrilLup == Decrypter.N_DRillUP ) {var byteArray = new Uint8Array(dRILLUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRiLlup(i,46);dRILlup.setUint8(i, byteArray[i]);}}}
Decrypter.f_drilluP =  function(drILLUp,DriLlup){if( Decrypter.N_dRILlUp == Decrypter.N_DrILluP && Decrypter.N_DRiLLup == Decrypter.N_DrIlLuP && Decrypter.N_DRILLUp == Decrypter.N_DriLLuP ) {var byteArray = new Uint8Array(DriLlup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DrIlluP(i,64);drILLUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_drILlup =  function(DrILlUp,DrILlup){if( Decrypter.N_DRIlLup == Decrypter.N_driLlUp && Decrypter.N_drIllUp == Decrypter.N_DRiLLuP && Decrypter.N_driLLUp == Decrypter.N_DRILluP ) {var byteArray = new Uint8Array(DrILlup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drillUP(i,12);DrILlUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRIlLuP =  function(dRILluP,drIlluP){if( Decrypter.N_DRillup == Decrypter.N_drIllUp && Decrypter.N_DriLlup == Decrypter.N_DRilLuP && Decrypter.N_drILluP == Decrypter.N_DRiLLuP ) {var byteArray = new Uint8Array(drIlluP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drILluP(i,87);dRILluP.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRILLuP =  function(dRilLuP,drillUp){if( Decrypter.N_dRIllup == Decrypter.N_DrilluP && Decrypter.N_DrIllup == Decrypter.N_dRilluP && Decrypter.N_dRILlUp == Decrypter.N_drIlLuP ) {var byteArray = new Uint8Array(drillUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DriLLuP(i,94);dRilLuP.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRilLuP =  function(DrIllup,DrILlUp){if( Decrypter.N_drillup == Decrypter.N_dRiLLuP && Decrypter.N_DRilluP == Decrypter.N_DrILluP && Decrypter.N_drILlup == Decrypter.N_DrIlLuP ) {var byteArray = new Uint8Array(DrILlUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drIllUp(i,82);DrIllup.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRiLluP =  function(drillup,DrILlUp){if( Decrypter.N_drIllup == Decrypter.N_DRILLUp && Decrypter.N_DrIlLUp == Decrypter.N_DrILLUp && Decrypter.N_DRiLlup == Decrypter.N_drILLup ) {var byteArray = new Uint8Array(DrILlUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DrillUp(i,74);drillup.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRillUp =  function(DRiLlUP,DRILlUP){if( Decrypter.N_DrILlup == Decrypter.N_DRillUp && Decrypter.N_drILlup == Decrypter.N_DRiLLup && Decrypter.N_DrilLup == Decrypter.N_driLLup ) {var byteArray = new Uint8Array(DRILlUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DriLLuP(i,34);DRiLlUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRILLup =  function(dRiLlUp,driLLUP){if( Decrypter.N_DRiLLup == Decrypter.N_DrilLUp && Decrypter.N_DrILLup == Decrypter.N_DRILLUp && Decrypter.N_DRillup == Decrypter.N_DrIlLup ) {var byteArray = new Uint8Array(driLLUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRillUp(i,30);dRiLlUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRILluP =  function(DriLlUp,DrIllUP){if( Decrypter.N_DrILLup == Decrypter.N_DRilluP && Decrypter.N_dRIlluP == Decrypter.N_DrILLuP && Decrypter.N_driLlup == Decrypter.N_driLLuP ) {var byteArray = new Uint8Array(DrIllUP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRiLlUp(i,78);DriLlUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrILluP =  function(DRIlLUp,DrILlUp){if( Decrypter.N_DRILlUp == Decrypter.N_DrILluP && Decrypter.N_dRiLLuP == Decrypter.N_DrILLuP && Decrypter.N_DrIllup == Decrypter.N_dRILLuP ) {var byteArray = new Uint8Array(DrILlUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_dRILlUp(i,77);DRIlLUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_drILLuP =  function(DRilLUP,DrILLuP){if( Decrypter.N_DRiLlup == Decrypter.N_dRilLuP && Decrypter.N_dRIlLup == Decrypter.N_dRilluP && Decrypter.N_dRIllup == Decrypter.N_DRILlUp ) {var byteArray = new Uint8Array(DrILLuP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_driLLUP(i,92);DRilLUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrilLup =  function(DrILlUP,driLLuP){if( Decrypter.N_DRIllup == Decrypter.N_DrIlLuP && Decrypter.N_drilLup == Decrypter.N_DriLLuP && Decrypter.N_drILLup == Decrypter.N_DrillUP ) {var byteArray = new Uint8Array(driLLuP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRillup(i,17);DrILlUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRiLLup =  function(drillUP,DriLlUp){if( Decrypter.N_DRiLLup == Decrypter.N_DRillUP && Decrypter.N_drilluP == Decrypter.N_DRIlluP && Decrypter.N_drIllup == Decrypter.N_dRIlLup ) {var byteArray = new Uint8Array(DriLlUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRILlUP(i,27);drillUP.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRillup =  function(DriLLUp,driLlup){if( Decrypter.N_drillup == Decrypter.N_dRIlLUp && Decrypter.N_dRillup == Decrypter.N_DRiLLUp && Decrypter.N_DrIllup == Decrypter.N_DRIllup ) {var byteArray = new Uint8Array(driLlup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DrILLUP(i,2);DriLLUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_DrIllup =  function(dRILluP,DrIlluP){if( Decrypter.N_DRiLlup == Decrypter.N_drILluP && Decrypter.N_dRillup == Decrypter.N_dRIlLuP && Decrypter.N_DRillup == Decrypter.N_dRilLUp ) {var byteArray = new Uint8Array(DrIlluP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_driLLUP(i,5);dRILluP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRillUp =  function(driLLUp,DrilLUp){if( Decrypter.N_drIlLUp == Decrypter.N_driLLuP && Decrypter.N_drILlup == Decrypter.N_DRILlUp && Decrypter.N_DRIllUp == Decrypter.N_dRillUP ) {var byteArray = new Uint8Array(DrilLUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRIllUp(i,35);driLLUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRiLLup =  function(driLLUp,drilluP){if( Decrypter.N_dRiLLup == Decrypter.N_DrIlluP && Decrypter.N_dRilLUp == Decrypter.N_DrIlLUp && Decrypter.N_drIllup == Decrypter.N_DRilLup ) {var byteArray = new Uint8Array(drilluP);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRilLUP(i,26);driLLUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRillUP =  function(drilLUp,drILlup){if( Decrypter.N_drILLUp == Decrypter.N_DrillUP && Decrypter.N_drillUP == Decrypter.N_DrillUP && Decrypter.N_dRILlup == Decrypter.N_drillUp ) {var byteArray = new Uint8Array(drILlup);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DrilLUp(i,98);drilLUp.setUint8(i, byteArray[i]);}}}
Decrypter.f_dRiLLuP =  function(DrilluP,drILlUp){if( Decrypter.N_drILluP == Decrypter.N_DrillUP && Decrypter.N_DrILLUp == Decrypter.N_DRILLUp && Decrypter.N_dRIllup == Decrypter.N_driLlUp ) {var byteArray = new Uint8Array(drILlUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_drilLuP(i,90);DrilluP.setUint8(i, byteArray[i]);}}}
Decrypter.f_DRILluP =  function(dRilLup,dRiLlUp){if( Decrypter.N_dRIllUp == Decrypter.N_dRiLluP && Decrypter.N_DrilLuP == Decrypter.N_DrIlLuP && Decrypter.N_driLlUp == Decrypter.N_DRILLUp ) {var byteArray = new Uint8Array(dRiLlUp);for (var i = 0; i < this._headerlength; i++) {byteArray[i] = byteArray[i] ^ this.n_DRIlLUP(i,79);dRilLup.setUint8(i, byteArray[i]);}}}

