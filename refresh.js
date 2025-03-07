/*!
 * pulltorefreshjs v0.1.18
 * (c) Rafael Soto
 * Released under the MIT License.
 */
!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : ((e = e || self).PullToRefresh = t());
})(this, function () {
  "use strict";
  var e = {
    pullStartY: null,
    pullMoveY: null,
    handlers: [],
    styleEl: null,
    events: null,
    dist: 0,
    state: "pending",
    timeout: null,
    distResisted: 0,
    supportsPassive: !1,
    supportsPointerEvents: !!window.PointerEvent,
  };
  try {
    window.addEventListener("test", null, {
      get passive() {
        e.supportsPassive = !0;
      },
    });
  } catch (e) {}
  var t = {
      setupDOM: function (t) {
        if (!t.ptrElement) {
          var n = document.createElement("div");
          t.mainElement !== document.body
            ? t.mainElement.parentNode.insertBefore(n, t.mainElement)
            : document.body.insertBefore(n, document.body.firstChild),
            n.classList.add(t.classPrefix + "ptr"),
            (n.innerHTML = t.getMarkup().replace(/__PREFIX__/g, t.classPrefix)),
            (t.ptrElement = n),
            "function" == typeof t.onInit && t.onInit(t),
            e.styleEl ||
              ((e.styleEl = document.createElement("style")),
              e.styleEl.setAttribute("id", "pull-to-refresh-js-style"),
              document.head.appendChild(e.styleEl)),
            (e.styleEl.textContent = t
              .getStyles()
              .replace(/__PREFIX__/g, t.classPrefix)
              .replace(/\s+/g, " "));
        }
        return t;
      },
      onReset: function (t) {
        t.ptrElement.classList.remove(t.classPrefix + "refresh"),
          (t.ptrElement.style[t.cssProp] = "0px"),
          setTimeout(function () {
            t.ptrElement &&
              t.ptrElement.parentNode &&
              (t.ptrElement.parentNode.removeChild(t.ptrElement),
              (t.ptrElement = null)),
              (e.state = "pending");
          }, t.refreshTimeout);
      },
      update: function (t) {
        var n = t.ptrElement.querySelector("." + t.classPrefix + "icon"),
          s = t.ptrElement.querySelector("." + t.classPrefix + "text");
        n &&
          ("refreshing" === e.state
            ? (n.innerHTML = t.iconRefreshing)
            : (n.innerHTML = t.iconArrow)),
          s &&
            ("releasing" === e.state &&
              (s.innerHTML = t.instructionsReleaseToRefresh),
            ("pulling" !== e.state && "pending" !== e.state) ||
              (s.innerHTML = t.instructionsPullToRefresh),
            "refreshing" === e.state &&
              (s.innerHTML = t.instructionsRefreshing));
      },
    },
    n = function (t) {
      return e.pointerEventsEnabled && e.supportsPointerEvents
        ? t.screenY
        : t.touches[0].screenY;
    },
    s = function () {
      var s;
      function r(r) {
        var i = e.handlers.filter(function (e) {
          return e.contains(r.target);
        })[0];
        (e.enable = !!i),
          i &&
            "pending" === e.state &&
            ((s = t.setupDOM(i)),
            i.shouldPullToRefresh() && (e.pullStartY = n(r)),
            clearTimeout(e.timeout),
            t.update(i));
      }
      function i(r) {
        s &&
          s.ptrElement &&
          e.enable &&
          (e.pullStartY
            ? (e.pullMoveY = n(r))
            : s.shouldPullToRefresh() && (e.pullStartY = n(r)),
          "refreshing" !== e.state
            ? ("pending" === e.state &&
                (s.ptrElement.classList.add(s.classPrefix + "pull"),
                (e.state = "pulling"),
                t.update(s)),
              e.pullStartY &&
                e.pullMoveY &&
                (e.dist = e.pullMoveY - e.pullStartY),
              (e.distExtra = e.dist - s.distIgnore),
              e.distExtra > 0 &&
                (r.cancelable && r.preventDefault(),
                (s.ptrElement.style[s.cssProp] = e.distResisted + "px"),
                (e.distResisted =
                  s.resistanceFunction(e.distExtra / s.distThreshold) *
                  Math.min(s.distMax, e.distExtra)),
                "pulling" === e.state &&
                  e.distResisted > s.distThreshold &&
                  (s.ptrElement.classList.add(s.classPrefix + "release"),
                  (e.state = "releasing"),
                  t.update(s)),
                "releasing" === e.state &&
                  e.distResisted < s.distThreshold &&
                  (s.ptrElement.classList.remove(s.classPrefix + "release"),
                  (e.state = "pulling"),
                  t.update(s))))
            : r.cancelable &&
              s.shouldPullToRefresh() &&
              e.pullStartY < e.pullMoveY &&
              r.preventDefault());
      }
      function o() {
        if (s && s.ptrElement && e.enable) {
          if ("releasing" === e.state && e.distResisted > s.distThreshold)
            (e.state = "refreshing"),
              (s.ptrElement.style[s.cssProp] = s.distReload + "px"),
              s.ptrElement.classList.add(s.classPrefix + "refresh"),
              (e.timeout = setTimeout(function () {
                var e = s.onRefresh(function () {
                  return t.onReset(s);
                });
                e &&
                  "function" == typeof e.then &&
                  e.then(function () {
                    return t.onReset(s);
                  }),
                  e || s.onRefresh.length || t.onReset(s);
              }, s.refreshTimeout));
          else {
            if ("refreshing" === e.state) return;
            (s.ptrElement.style[s.cssProp] = "0px"), (e.state = "pending");
          }
          t.update(s),
            s.ptrElement.classList.remove(s.classPrefix + "release"),
            s.ptrElement.classList.remove(s.classPrefix + "pull"),
            (e.pullStartY = e.pullMoveY = null),
            (e.dist = e.distResisted = 0);
        }
      }
      function l() {
        s &&
          s.mainElement.classList.toggle(
            s.classPrefix + "top",
            s.shouldPullToRefresh()
          );
      }
      var a = e.supportsPassive ? { passive: e.passive || !1 } : void 0;
      return (
        e.pointerEventsEnabled && e.supportsPointerEvents
          ? (window.addEventListener("pointerup", o),
            window.addEventListener("pointerdown", r),
            window.addEventListener("pointermove", i, a))
          : (window.addEventListener("touchend", o),
            window.addEventListener("touchstart", r),
            window.addEventListener("touchmove", i, a)),
        window.addEventListener("scroll", l),
        {
          onTouchEnd: o,
          onTouchStart: r,
          onTouchMove: i,
          onScroll: l,
          destroy: function () {
            e.pointerEventsEnabled && e.supportsPointerEvents
              ? (window.removeEventListener("pointerdown", r),
                window.removeEventListener("pointerup", o),
                window.removeEventListener("pointermove", i, a))
              : (window.removeEventListener("touchstart", r),
                window.removeEventListener("touchend", o),
                window.removeEventListener("touchmove", i, a)),
              window.removeEventListener("scroll", l);
          },
        }
      );
    },
    r = {
      distThreshold: 60,
      distMax: 80,
      distReload: 50,
      distIgnore: 0,
      mainElement: "body",
      triggerElement: "body",
      ptrElement: ".ptr",
      classPrefix: "ptr--",
      cssProp: "min-height",
      iconArrow:
        '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1080ce"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-70q0-17 11.5-28.5T760-800q17 0 28.5 11.5T800-760v200q0 17-11.5 28.5T760-520H560q-17 0-28.5-11.5T520-560q0-17 11.5-28.5T560-600h128q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q68 0 124.5-34.5T692-367q8-14 22.5-19.5t29.5-.5q16 5 23 21t-1 30q-41 80-117 128t-169 48Z"/></svg>',
      iconRefreshing: "&hellip;",
      instructionsPullToRefresh: "",
      instructionsReleaseToRefresh: "",
      instructionsRefreshing: "",
      refreshTimeout: 0,
      getMarkup: function () {
        return '\n<div class="__PREFIX__box">\n  <div class="__PREFIX__content">\n    <div class="__PREFIX__icon"></div>\n    <div class="__PREFIX__text"></div>\n  </div>\n</div>\n';
      },
      getStyles: function () {
        return "\n.__PREFIX__ptr {\n  box-shadow: inset 0 -3px 5px rgba(0, 0, 0, 0.12);\n  pointer-events: none;\n  font-size: 0.85em;\n  font-weight: bold;\n  top: 0;\n  height: 0;\n  transition: height 0.3s, min-height 0.3s;\n  text-align: center;\n  width: 100%;\n  overflow: hidden;\n  display: flex;\n  align-items: flex-end;\n  align-content: stretch;\n}\n\n.__PREFIX__box {\n  padding: 10px;\n  flex-basis: 100%;\n}\n\n.__PREFIX__pull {\n  transition: none;\n}\n\n.__PREFIX__text {\n  margin-top: .33em;\n  color: rgba(0, 0, 0, 0.3);\n}\n\n.__PREFIX__icon {\n  color: rgba(0, 0, 0, 0.3);\n  transition: transform .3s;\n}\n\n/*\nWhen at the top of the page, disable vertical overscroll so passive touch\nlisteners can take over.\n*/\n.__PREFIX__release {\n  .__PREFIX__icon {\n    transform: rotate(180deg);\n  }\n}\n";
      },
      onInit: function () {},
      onRefresh: function () {
        return location.reload();
      },
      resistanceFunction: function (e) {
        return Math.min(1, e / 2.5);
      },
      shouldPullToRefresh: function () {
        return !window.scrollY;
      },
    },
    i = ["mainElement", "ptrElement", "triggerElement"],
    o = function (t) {
      var n = {};
      return (
        Object.keys(r).forEach(function (e) {
          n[e] = t[e] || r[e];
        }),
        (n.refreshTimeout =
          "number" == typeof t.refreshTimeout
            ? t.refreshTimeout
            : r.refreshTimeout),
        i.forEach(function (e) {
          "string" == typeof n[e] && (n[e] = document.querySelector(n[e]));
        }),
        e.events || (e.events = s()),
        (n.contains = function (e) {
          return n.triggerElement.contains(e);
        }),
        (n.destroy = function () {
          clearTimeout(e.timeout);
          var t = e.handlers.indexOf(n);
          e.handlers.splice(t, 1);
        }),
        n
      );
    };
  return {
    setPassiveMode: function (t) {
      e.passive = t;
    },
    setPointerEventsMode: function (t) {
      e.pointerEventsEnabled = t;
    },
    destroyAll: function () {
      e.events && (e.events.destroy(), (e.events = null)),
        e.handlers.forEach(function (e) {
          e.destroy();
        });
    },
    init: function (t) {
      void 0 === t && (t = {});
      var n = o(t);
      return e.handlers.push(n), n;
    },
    _: {
      setupHandler: o,
      setupEvents: s,
      setupDOM: t.setupDOM,
      onReset: t.onReset,
      update: t.update,
    },
  };
});
//# sourceMappingURL=index.umd.min.js.map
