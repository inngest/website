(function () {
  var CACHE_KEY = "inngest_user";
  var VERSION = "0.2.0";

  var defaults = {
    host: "inn.gs",
    await: true,
  };

  // store the key locally so as not to expose it to other JS code.
  var key = "";

  // user stores user data after a call to identify().  this is mixed
  // in with events with calls to track().
  var user = {};

  var pageview = {};
  var lastUrl;

  var Inngest = function () {};
  window.Inngest = Inngest;

  Inngest.options = defaults;

  /**
   * init initializes Inngest given an ingest key.  Any options provided override
   * the defaults above.
   *
   */
  Inngest.init = function (k, options) {
    var self = this;
    key = k;
    assign(self.options, options || {});
    user = get(CACHE_KEY) || {};

    _startHistoryTracking();
  };

  function _startHistoryTracking() {
    // monkey patch pushState
    var originalPushState = history.pushState;
    history.pushState = function () {
      originalPushState.apply(this, arguments);
      _capturePageView();
    };

    var originalReplaceState = history.replaceState;
    history.replaceState = function () {
      originalReplaceState.apply(this, arguments);
      _capturePageView();
    };

    window.addEventListener("popstate", () => _capturePageView());
  }

  function _capturePageView(isFirstTouch) {
    if (lastUrl === window.location.href) {
      return;
    }
    lastUrl = window.location.href;

    var previousPageviewId = pageview.id;
    pageview.id =
      "pv-" +
      new Date().getTime() +
      "-" +
      Math.random().toString(36).substr(2, 9);
    var event = {
      name: "website/page.viewed",
      data: {
        first_touch: !!isFirstTouch,
      },
    };
    if (previousPageviewId) {
      event.data["$previous_pageview_id"] = previousPageviewId;
    }
    Inngest.event(event);
  }

  Inngest.page = function (isFirstTouch) {
    _capturePageView(isFirstTouch);
  };

  Inngest.event = async function (event, options) {
    var errors = validate(event, options);
    if (errors.length > 0) {
      console.warn("inngest event is invalid: ", errors.join(", "));
      return false;
    }
    event.data = event.data || {};
    assign(event.data, context(event.data));

    if (pageview.id) {
      event.data["$pageview_id"] = pageview.id;
    }

    // The event.user object should take precedence over the identify() attributes
    // called.  Copy the event user attributes into a new variable so that we can
    // merge this into `user` from identify, then replace the original event.user.
    var overwritten = {};
    assign(overwritten, user);
    assign(overwritten, event.user || {});
    event.user = overwritten;

    var usedKey = key;
    if (options && options.key) {
      usedKey = options.key;
    }

    var body = JSON.stringify(event);
    var scheme = this.options.host === "inn.gs" ? "https://" : "//";
    var url = scheme + this.options.host + "/e/" + usedKey;

    if ((options && options.await) || this.options.await) {
      const res = await reqAsync(
        url,
        { "content-type": "application/json" },
        body
      );
      return res;
    } else {
      req(url, { "content-type": "application/json" }, body);
      return true;
    }
  };

  Inngest.track = function (eventName, data) {
    evt = {
      name: eventName,
      data: assign(data || {}, context(data)),
      user: user,
    };
    Inngest.event(evt);
  };

  Inngest.identify = function (externalID, data) {
    var map = {};
    if (typeof externalID === "string") {
      map.external_id = externalID;
    }
    if (typeof externalID === "object") {
      data = externalID;
    }

    // TODO: Should we merge previous identify values?
    assign(map, data);
    set(CACHE_KEY, map);

    // update local memory so that we don't have to wait on localStorage
    // and JSON serialization for each call.
    user = map;

    // XXX: We could send an "identified" event here to _guarantee_ that the
    // contact is upserted.
  };

  function set(key, val) {
    try {
      window.localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn(e);
    }
  }

  function get(key) {
    try {
      return JSON.parse(window.localStorage.getItem(key) || "null");
    } catch (e) {
      return null;
    }
  }

  function assign(to, from) {
    iter(from, function (key, val) {
      to[key] = val;
    });
  }

  function iter(obj, callback) {
    if (typeof obj !== "object" || obj === null || obj === undefined) {
      return;
    }
    for (var o in obj) {
      if (obj.hasOwnProperty(o)) {
        callback(o, obj[o]);
      }
    }
  }

  function validate(event, options) {
    var errors = [];

    if (!key && options && !options.key) {
      errors.push(
        "init() has not been called with an ingest key, or a key was not provided"
      );
    }

    if (!event.name) {
      errors.push("event must have a name");
    }
    return errors;
  }

  const utmKeys = [
    "utm_source",
    "utm_campaign",
    "utm_content",
    "utm_medium",
    "utm_term",
    "ref",
  ];

  function context(eventData) {
    const utmProps = {};
    const isFirstTouch = eventData.first_touch;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      // we track both first touch UTMs props and all touchpoints UTMs
      for (let utmKey of utmKeys) {
        utmProps[utmKey] = urlParams.get(utmKey);
        if (isFirstTouch) {
          utmProps[`first_${utmKey}`] = urlParams.get(utmKey);
        }
      }
    } catch (e) {}

    var data = {
      context: {
        path: window.location.pathname,
        url: window && window.location.href,
        title: document && document.title,
        search: window && window.location.search,
        referrer: document && document.referrer,
        user_agent: navigator && navigator.userAgent,
        library: "js",
        library_version: VERSION,
        ...utmProps,
      },
    };
    return data;
  }

  function req(url, headers, body) {
    var r = new XMLHttpRequest();
    r.open("POST", url);
    r.withCredentials = false;

    headers = headers || {};
    for (var header in headers) {
      if (headers.hasOwnProperty(header)) {
        r.setRequestHeader(header, headers[header]);
      }
    }

    r.send(body);
  }

  function reqAsync(url, headers, body) {
    return new Promise(function (resolve, _reject) {
      var r = new XMLHttpRequest();
      r.open("POST", url);
      r.withCredentials = false;

      headers = headers || {};
      for (var header in headers) {
        if (headers.hasOwnProperty(header)) {
          r.setRequestHeader(header, headers[header]);
        }
      }

      r.onreadystatechange = function () {
        if (r.readyState === XMLHttpRequest.DONE) {
          const status = r.status;
          const error =
            status >= 200 && status < 400
              ? null
              : "There was an error with this request.";
          resolve({
            status,
            response: r.response,
            error,
          });
        }
      };

      r.send(body);
    });
  }
})();
