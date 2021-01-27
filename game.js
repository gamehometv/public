/*! game-api - v0.44.0 - 2019-02-28 */
!
function (a) {
    "use strict";
    function b(a) {

    }
    function c() {

    }
    function d(a) {
        if (a = a || {}, this.IS_MASTER = a.isMaster || !1, !this.IS_MASTER) throw new Error("The DataStore can only be instantiated by the Master");
        this.dataStore = {}
    }
    function e(a, b) {
        a = a || {}, this.IS_MASTER = a.isMaster, this.IS_SLAVE = !this.IS_MASTER, this.IS_STANDALONE = a.isStandalone, this.messenger = a.messenger, this.moduleReady = b || !1, this.appTimer = null, this.appDelayMin = 1e4, this.appDelayMax = 24e4, this.appError = !1, this.appTimerDelay = this.appDelayMax, this.appToken = null, this.token = null
    }
    function f(a, b) {
        a = a || {}, this.IS_MASTER = a.isMaster, this.IS_SLAVE = !this.IS_MASTER, this.IS_STANDALONE = a.isStandalone, this.messenger = a.messenger, this.eventTracking = a.eventTracking, this.appToken = a.appToken, this.moduleReady = b || !1, this.isGamestate = !1, this.endpoint = null, this.spilStorageId = null, this.flushTimer = null, this.flushDelayMin = 500, this.flushDelayMax = 3e4, this.flushTimerDelay = this.flushDelayMin, this.gameState = {
            started: !1,
            userId: null,
            appId: null,
            dirtyKeys: []
        }
    }
    function g(a, b) {
        if (this.IS_MASTER = !(!a || !a.isMaster) && a.isMaster, this.IS_SLAVE = !this.IS_MASTER, this.messenger = null, this.subscribers = {}, this.moduleReady = !! b && b, this.data = a.data || null, this.gameState = "resume", !a || !a.messenger) throw new Error("No messenger passed to the Game module instance");
        this.messenger = a.messenger, window.addEventListener ? window.addEventListener("message", this._performAction.bind(this), !1) : window.attachEvent && window.attachEvent("onmessage", this._performAction.bind(this)), this.IS_MASTER && this.messenger.subscribe("gameapi.game.adjustHeight", this.adjustHeight, this)
    }
    function h(a, b) {
        a = a || {}, this.isMaster = a.isMaster, this.isStandalone = a.isStandalone, this.messenger = a.messenger, this.moduleReady = !! b && b, this.activeLanguage = "en"
    }
    function i(a, b) {
        a = a || {}, this.IS_MASTER = a.isMaster, this.IS_STANDALONE = a.isStandalone, this.messenger = a.messenger, this.eventTracking = a.eventTracking, this.moduleReady = !! b && b, this.isAvailable = !1, this.locale = "", this.loggedIn = !1
    }
    function j(a, b) {
        a = a || {}, this.IS_MASTER = a.isMaster, this.IS_STANDALONE = a.isStandalone, this.messenger = a.messenger, this.eventTracking = a.eventTracking, this.moduleReady = !! b && b, this.isAvailable = !1
    }
    function k(a, b) {
        a = a || {}, this.IS_MASTER = a.isMaster, this.IS_SLAVE = !this.IS_MASTER, this.moduleReady = !! b && b, this.messenger = a.messenger, this.data = a.data || null, this.eventTracking = a.eventTracking, this.initialHeight = a.initialHeight, this.appToken = a.appToken, this.state = {
            userId: null
        }, this._setupMasterEvent()
    }
    function l(a, b) {
        a = a || {}, this.IS_MASTER = a.isMaster, this.IS_SLAVE = !this.IS_MASTER, this.moduleReady = !! b && b, this.messenger = a.messenger, this.data = a.data || null, this.eventTracking = a.eventTracking, this.initialHeight = a.initialHeight, this.appToken = a.appToken, this._setupMasterEvent(), this.appToken = a.appToken, this.state = {
            userId: null
        }
    }
    function m(a, b) {
        a = a || {}, this.IS_MASTER = a.isMaster, this.IS_SLAVE = !this.IS_MASTER, this.moduleReady = !! b && b, this.messenger = a.messenger, this.data = a.data || {
            mapping: {}
        }, this.eventTracking = a.eventTracking, this._setupMasterEvent()
    }
    function n(a, b) {
        a = a || {}, this.isMaster = a.isMaster, this.isStandalone = a.isStandalone, this.messenger = a.messenger, this.eventTracking = a.eventTracking, this.moduleReady = !! b && b, this.timeoutAfter = 500, this.timeout = !1, this.adRequested = !1, this.adAvailable = !1, this.gamebreakType = "unkown", this.TIMEOUT_REWARD_AVAILABILITY_CONCLUSIVE = 2e4, this.isRewardAvailableCallbacks = {}, this.isRewardAvailableCallbacks.reject = function () {}, this.isRewardAvailableCallbacks.accept = function () {}, this._callbacks = {
            pause: !1,
            resume: !1
        }
    }
    function o(a, b) {
        a = a || {}, this.IS_MASTER = a.isMaster, this.isStandalone = a.isStandalone, this.messenger = a.messenger, this.eventTracking = a.eventTracking, this.moduleReady = !! b && b, this.events = {
            GAME_START: "GAME_START",
            GAME_END: "GAME_END",
            GAME_PAUSE: "GAME_PAUSE",
            GAME_CONTINUE: "GAME_CONTINUE",
            GAME_MUTE: "GAME_MUTE",
            LEVEL_FAIL: "LEVEL_FAIL",
            LEVEL_COMPLETE: "LEVEL_COMPLETE"
        }, this._setupEvents()
    }
    function p(a, b) {
        a = a || {}, this.IS_MASTER = a.isMaster, this.IS_SLAVE = !this.IS_MASTER, this.IS_STANDALONE = a.isStandalone, this.data = a.data, this.messenger = a.messenger, this.moduleReady = !! b && b, this.gamePlayTracking = {
            started: !1,
            appid: null,
            host: null,
            timestamp: null
        }, this.timeInGameTracking = {
            started: !1,
            appid: null,
            timestamp: null
        }, this.isGamestate = !1
    }
    function q(a, b) {
        a = a || {}, this.IS_MASTER = a.isMaster, this.IS_SLAVE = !this.IS_MASTER, this.IS_STANDALONE = a.isStandalone, this.eventTracking = a.eventTracking, this.moduleReady = !! b && b, this.messenger = a.messenger, this.components = a.components, this.data = a.data || null
    }
    function r(a) {
        var b = "string" == typeof a ? s(a) : a;
        b && (this.type = b.type, this.callbackId = b.callbackId, this.data = b.data)
    }
    function s(a) {
        var b, c, d, e = !1,
            f = [];
        if ("string" == typeof a && (f = a.split("|"), "gameapi" === f[0])) {
            f.shift(), b = f.shift(), d = parseInt(f.shift(), 10), c = f.join("|");
            try {
                e = {
                    type: b,
                    callbackId: d,
                    data: "" !== c ? JSON.parse(c) : ""
                }
            } catch (g) {}
        }
        return e
    }
    function t(a) {
        a = a || {}, this.IS_MASTER = "boolean" == typeof a.isMaster && a.isMaster, this.IS_SLAVE = !this.IS_MASTER, this.api = a.api ? a.api : {}, this._targets = a.targets ? a.targets : [], this._callbacks = [], this._channels = [], this.IS_MASTER && a.dataStore && (this.dataStore = a.dataStore), this._setupEventListener()
    }
    function u(a, d, n, p, q) {
        window.outerHeight - window.innerHeight;
        this.version = "0.44.0", this.isReady = !1, this._setRole(), this.__ = {}, this.__.dataStore = this.IS_MASTER ? new a({
            isMaster: !0
        }) : null, this.__.messenger = new d({
            isMaster: this.IS_MASTER,
            api: this,
            targets: this._getTargets(),
            dataStore: this.__.dataStore
        }), this.Advertisement = new c, this.__.components = new b({
            advertisement: this.Advertisement
        });
        var r = this._addBasic({});
        this.__.EventTracking = new p(r, (!1));
        var s = this._addComponents(r),
            t = this._addEventTracking(s),
            u = this._addInitialHeight(t);
        this.AppToken = new e(t, (!1)), this.GameState = new f(this._addAppToken(t), (!1)), this.Branding = new n(t, (!1)), this.GameBreak = new q(t, (!1)), this.Game = new g(r, (!1)), this.Award = new l(this._addAppToken(u), (!1)), this.Secondscreen = new m(u, (!1)), this.User = new i(t, (!1)), this.Score = new k(this._addAppToken(u), (!1)), this.Friends = new j(t, (!1)), this.GameEvent = new o(t, (!1)), this.Localization = new h(t, (!1))
    }
    "bind" in Function.prototype || (Function.prototype.bind = function (a) {
        var b = this;
        if (arguments.length <= 1) return function () {
            return b.apply(a, arguments)
        };
        var c = Array.prototype.slice.call(arguments, 1);
        return function () {
            return b.apply(a, 0 === arguments.length ? c : c.concat(Array.prototype.slice.call(arguments)))
        }
    }), "trim" in String.prototype || (String.prototype.trim = function () {
        return this.replace(/^\s+/, "").replace(/\s+$/, "")
    }), "indexOf" in Array.prototype || (Array.prototype.indexOf = function (a, b) {
        void 0 === b && (b = 0), b < 0 && (b += this.length), b < 0 && (b = 0);
        for (var c = this.length; b < c; b++) if (b in this && this[b] === a) return b;
        return -1
    }), "lastIndexOf" in Array.prototype || (Array.prototype.lastIndexOf = function (a, b) {
        for (void 0 === b && (b = this.length - 1), b < 0 && (b += this.length), b > this.length - 1 && (b = this.length - 1), b++; b-- > 0;) if (b in this && this[b] === a) return b;
        return -1
    }), "forEach" in Array.prototype || (Array.prototype.forEach = function (a, b) {
        for (var c = 0, d = this.length; c < d; c++) c in this && a.call(b, this[c], c, this)
    }), "map" in Array.prototype || (Array.prototype.map = function (a, b) {
        for (var c = new Array(this.length), d = 0, e = this.length; d < e; d++) d in this && (c[d] = a.call(b, this[d], d, this));
        return c
    }), "filter" in Array.prototype || (Array.prototype.filter = function (a, b) {
        for (var c, d = [], e = 0, f = this.length; e < f; e++) e in this && a.call(b, c = this[e], e, this) && d.push(c);
        return d
    }), "every" in Array.prototype || (Array.prototype.every = function (a, b) {
        for (var c = 0, d = this.length; c < d; c++) if (c in this && !a.call(b, this[c], c, this)) return !1;
        return !0
    }), "some" in Array.prototype || (Array.prototype.some = function (a, b) {
        for (var c = 0, d = this.length; c < d; c++) if (c in this && a.call(b, this[c], c, this)) return !0;
        return !1
    });
    var v = {
        timeout: 3e3
    };
    v.getGameConfig = function (a) {

    }, v.getBrandingConfig = function (a, b) {

    };
    var w = {};
    w.argsToArray = function (a) {
        return a ? Array.prototype.slice.apply(a) : []
    }, w.isA10 = function () {
   
    }, w.disableKeys = function (a) {
        var b = a.keyCode;
        (8 === b || 9 === b || b >= 32 && b <= 40 || 46 === b) && a.preventDefault()
    }, w.trackGA = function () {

    }, w.getRole = function (a) {
        var b = "function" == typeof a.SpilGames,
            c = a.self !== a.top,
            d = null;
        if (b) {
            var e = document.getElementById("#iframegame");
            switch (e) {
            case "null":
                d = {
                    IS_MASTER: !0,
                    IS_SLAVE: !0,
                    IS_STANDALONE: !1
                };
                break;
            default:
                d = {
                    IS_MASTER: !0,
                    IS_SLAVE: !1,
                    IS_STANDALONE: !1
                }
            }
        } else c ? (a.onkeydown = this.disableKeys, this.trackGA(), d = {
            IS_MASTER: !1,
            IS_SLAVE: !0,
            IS_STANDALONE: !1
        }) : (a.onkeydown = this.disableKeys, this.trackGA(), d = {
            IS_MASTER: !0,
            IS_SLAVE: !0,
            IS_STANDALONE: !0
        });
        return d
    }, w.callConfigar = function (a, b) {
        var c, d, e = a.site || 500,
            f = a.channel || 100,
            g = a.id || null;
        if (window.XDomainRequest ? (c = new XDomainRequest, c.onload = function () {
            b(200, c.responseText)
        }, c.onerror = function () {
            b(404, null)
        }, c.onprogress = function () {}) : window.XMLHttpRequest ? (c = new XMLHttpRequest, c.onreadystatechange = function (a) {
            4 === c.readyState && b(c.status, c.responseText)
        }) : window.ActiveXObject && (c = new ActiveXObject("Microsoft.XMLHTTP"), c.onreadystatechange = function (a) {
            4 === c.readyState && b(c.status, c.responseText)
        }), g) {
            var h;
            h = "" === g ? "" : "//", d = [h, f, e, g].join("/"), c.open("GET", d, !0), c.timeout = 3e3, c.ontimeout = function () {
                b(404, null)
            }, c.send()
        }
    }, w.submitData = function (a, b, c) {

    }, w.getJSONP = function () {

    }, w.xdr = function (a, b) {

    }, w.log = function () {

    }, w.addToken = function (a, b) {

    }, w.getServiceEndpoint = function (a) {

    }, w.isWrapped = function () {
        return void 0 !== (window.PhoneGap || window.cordova || window.Cordova)
    }, w.isArray = Array.isArray ||
    function (a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    }, w._getQueryString = function () {
        return window.location.search
    }, w._getPortalHost = function () {

    }, w._getDomainFromLocation = function () {

    }, w._getDomainFromReferrer = function () {

    }, w.extractDomain = function (a) {

    }, w.getVariablesFromUrl = function (a) {

    }, w.validateSchema = function (a, b) {

    };
    var x = {};
    x.__ = {}, x.__.user = function () {
        var a = "gui";
        return {
            getUserId: function (b) {
                var c;
                if (localStorage) return c = localStorage.getItem(a), c || (c = "op_" + String(Math.floor(999999999 * Math.random()))), this.setUserId(c), c
            },
            setUserId: function (b) {
                if (!localStorage) return !1;
                try {
                    localStorage.setItem(a, b)
                } catch (c) {
                    return !1
                }
                return !0
            }
        }
    }(), x.getGameConfig = function (a) {
        var b = this;
        v.getGameConfig(function (c) {
            a(c ? c : b.getLocalConfig())
        })
    }, x.getBrandingConfig = function (a, b) {
        v.getBrandingConfig(a, b)
    }, x.getLocalConfig = function (a) {
        var b = this;
        a = a && Object.keys(a).length ? a : {
            portal: {},
            apiData: {},
            game: {},
            branding: {},
            user: {},
            localization: {},
            distributable: 0
        };
        var c = b.__.user.getUserId(a),
            d = {
                isLocal: a.isLocal || !1,
                apiData: {
                    gameAPIUserId: c
                },
                game: {
                    applicationId: a.portal.applicationId || "0",
                    contentarId: a.portal.contentarId || "0",
                    info: a.game.info || {},
                    settings: a.game.objectSettings || {},
                    properties: a.game.properties || {},
                    features: {
                        achievements: a.game.achievements || !1,
                        gameSidePanel: a.game.gameSidePanel || !1,
                        highscores: a.game.highscores || !1,
                        recommendedGames: a.game.recommendedGames || !1
                    }
                },
                user: {
                    authenticated: a.user.authenticated || !1,
                    username: a.user.username || "",
                    appToken: a.user.appToken || "",
                    userId: a.user.userId || "",
                    token: a.user.token || ""
                },
                portal: {
                    host: w._getPortalHost(),
                    siteId: a.portal.siteId || 0,
                    channelId: a.portal.channelId || 0,
                    applicationId: a.portal.applicationId || "0",
                    gamestate: a.portal.gamestate || !1,
                    env: "stg" === a.portal.env ? "stg" : "prd",
                    spilStorageId: a.portal.spilStorageId || ""
                },
                branding: a.branding || {},
                localization: a.localization || {},
                distributable: a.distributable || 0
            };
        return d.branding.logo = d.branding.logo || {}, d.branding.logo.url = d.branding.logo.url || !1, d.branding.logo.image = d.branding.logo.image || !1, d
    }, x.configFromData = function (a) {
        var b = {
            game: {
                applicationId: a.id
            },
            user: {
                userId: a.userid ? a.userid : void 0,
                appToken: a.appToken ? a.appToken : void 0
            },
            portal: {
                applicationId: a.id,
                siteId: a.site ? a.site : -1,
                channelId: a.channel ? a.channel : 100,
                gamestate: !! a.gamestate && a.gamestate,
                env: "stg" === a.env ? "stg" : "prd",
                spilStorageId: a.spilStorageId
            },
            distributable: a.distributable
        };
        return b
    }, x.setupStandaloneMode = function (a, b) {
        var c = {},
            d = {
                configar: {
                    branding: {
                        main: {
                            label: "main",
                            image: "",
                            url: "//www.gamehome.us",
                            style: "",
                            width: "202",
                            height: "50",
                            mime: "image/png",
                            type: "png",
                            handler: "newTab",
                            blacklisted: !0
                        },
                        logo: {
                            label: "logo",
                            image: "",
                            url: "//www.gamehome.us",
                            style: "",
                            width: "202",
                            height: "50",
                            mime: "image/png",
                            type: "png",
                            handler: "newTab",
                            blacklisted: !1
                        },
                        more_games: {
                            label: "more_games",
                            image: "",
                            url: "//www.gamehome.us",
                            style: "",
                            width: null,
                            height: null,
                            mime: null,
                            type: null,
                            handler: "newTab",
                            blacklisted: !1
                        },
                        splash_screen: {
                            label: "splash_screen",
                            image: "place_holder_string",
                            url: "//www.gamehome.us",
                            style: "",
                            width: "0",
                            height: "0",
                            mime: "image/png",
                            type: "png",
                            handler: "newTab",
                            blacklisted: !1
                        }
                    }
                }
            };
        c.JSLib = {
            memory: {},
            _channels: {},
            get: function (a) {
                return !!this.memory[a] && this.memory[a]
            },
            set: function (a, b) {
                return this.memory[a] = b, b
            },
            publish: function (a, b) {
                this._channels[a] && this._channels[a].forEach(function (a) {
                    try {
                        a.fn.call(this, b)
                    } catch (c) {}
                })
            },
            subscribe: function (a, b) {
                if ("function" != typeof b) throw new Error("Callback has to be a function");
                if ("string" != typeof a) throw new Error("Channel name has to be a string");
                this._channels[a] || (this._channels[a] = []), this._channels[a].push({
                    fn: b
                })
            }
        }, c.Net = {
            send: function (a, b) {
                b.call(this, {})
            }
        }, window.SpilGamesBootstrap = [], window.SpilGames = function () {

        }, a && a.id ? w.callConfigar(a, function (c, e) {
            if (200 === c && "string" == typeof e && JSON.parse(e)) {
                var f = JSON.parse(e),
                    g = x.configFromData(a);
                g.branding = f.configar && f.configar.branding ? f.configar.branding : d.configar.branding, g.distributable = f.configar && f.configar.distributable ? f.configar.distributable : 0, b.call(this, g)
            } else b.call(this, {
                isLocal: !0,
                branding: d.configar.branding
            })
        }) : b.call(this, {
            isLocal: !0,
            branding: d.configar.branding
        })
    }, x.getCachedConfig = function () {}, b.prototype.newTab = function (a) {
        if (!this.newTabCap) {
            var b = this,
                c = "_blank",
                d = a.url,
                e = window.open(d, c);
            return b.newTabCap = !0, setTimeout(function () {
                b.newTabCap = !1
            }, b.NEW_TAB_CAP_TIME), e && e.focus(), e
        }
    }, b.prototype.moreGames = function (a) {
        var b = a.brandName || "a10";
        a.isStandalone ? this.newTab(a) : a.messenger && a.messenger.post && a.messenger.post("game.moregames", {
            branding: b
        })
    }, b.prototype.displayOnTop = function (a) {

    }, b.prototype.displayBanner = function (a, b, c) {

    }, b.prototype.displayDFPBanner = function (a) {

        this.displayBanner(a, '<div id="div-gpt-ad-1461916237597-0"></div>', b)
    }, b.prototype.getDisplayBannerCss = function () {

    }, b.prototype.getDisplayBannerHTML = function () {

    }, c.prototype.init = function (a) {
        a = a || {}, this.data = a.data || this.data, this.onportal = a.data.portal.siteId > 0, this.defaultAdUnitId = "59392726", this.defaultAdUnitPath = "Ingame"
    }, c.prototype.getDefaultAdUnitPath = function () {

    }, c.prototype.getOptSize = function (a) {
        var b = ["320x50", "320x100", "300x250", "468x60", "728x90", "336x280", "728x90", "160x600"],
            c = a.getAttribute("data-size"),
            d = !0;
        return b.indexOf(c) === -1 && (c = "300x250", d = !1), c = c.split("x"), c[0] = +c[0], c[1] = +c[1], {
            isValid: d,
            size: c
        }
    }, c.prototype.createDFP = function (a) {

    }, c.prototype.refreshAdSlot = function (a) {

    }, c.prototype.addAdToElement = function (a) {

    }, c.prototype.parseDOMForAds = function () {

    }, c.prototype.refreshAds = function () {

    }, c.prototype.removeAd = function (a) {

    }, d.prototype.get = function (a) {
        for (var b = this.dataStore, c = a.split("."), d = c.length, e = 0; e < d - 1; e++) {
            if (!b[c[e]]) return null;
            b = b[c[e]]
        }
        return b[c[d - 1]] || null
    }, d.prototype.put = function (a, b) {
        for (var c = this.dataStore, d = a.split("."), e = d.length, f = 0; f < e - 1; f++) {
            var g = d[f];
            c[g] || (c[g] = {}), c = c[g]
        }
        c[d[e - 1]] = b
    }, d.prototype.set = function (a, b) {
        this.put(a, b);
        var c = Date.parse(new Date);
        return this.notify({
            type: "new",
            key: a,
            current: b,
            previous: null,
            timestamp: c
        }), b
    }, d.prototype.update = function (a, b) {
        var c, d, e = null;
        return this.get(a) ? (c = "update", e = this.get(a)) : c = "new", this.put(a, b), d = Date.parse(new Date), this.notify({
            type: c,
            key: a,
            current: b,
            previous: e,
            timestamp: d
        }), b
    }, d.prototype.remove = function (a) {
        if (this.get(a)) {
            var b, c = this.get(a);
            return this.put(a, null), b = Date.parse(new Date), this.notify({
                type: "remove",
                key: a,
                current: null,
                previous: c,
                timestamp: b
            }), !0
        }
        return !1
    }, d.prototype._setCache = function (a) {
        this.dataStore = a
    }, d.prototype._getCache = function () {
        return this.dataStore
    }, d.prototype.notify = function (a) {
        if (this.IS_MASTER) {
            var b = new r({
                type: "datachange",
                callbackId: null,
                data: a
            }).encode();
            return window.postMessage(b, "*"), b
        }
    }, e.prototype.init = function (a) {

    }, e.prototype.getAppToken = function () {
        return this.appToken
    }, e.prototype._setupEvents = function () {

    }, e.prototype._retryAppToken = function (a) {

    }, e.prototype._scheduleRefresh = function () {

    }, e.prototype._unschedule = function () {

    }, e.prototype._increaseDelay = function () {

    }, e.prototype._resetDelay = function () {

    }, e.prototype._getAppToken = function () {

    }, e.prototype._getAppTokenResponse = function (a) {

    }, f.prototype.init = function (a) {

    }, f.prototype.listenStorageEvents = function () {
        var a = function (a) {
                this.onStorageEvent(a)
            }.bind(this);
        window.addEventListener("storage", a, !1)
    }, f.prototype.flagDirtyKey = function (a) {
        this.gameState.dirtyKeys.indexOf(a) === -1 && (this.gameState.dirtyKeys.push(a), this.scheduleSyncState())
    }, f.prototype.unschedule = function () {
        this.flushTimer && clearTimeout(this.flushTimer), this.flushTimer = null
    }, f.prototype.scheduleSyncState = function () {
        var a = this;
        null === this.flushTimer && (this.flushTimer = setInterval(function () {
            a.syncState()
        }, this.flushTimerDelay))
    }, f.prototype.increaseDelaySyncState = function () {
        this.flushTimerDelay = Math.min(2 * this.flushTimerDelay, this.flushDelayMax)
    }, f.prototype.resetDelaySyncState = function () {
        this.flushTimerDelay = this.flushDelayMin
    }, f.prototype.onStorageEvent = function (a) {
        a && a.url && a.url.indexOf("spilStorageId=" + this.spilStorageId) > 0 && this.flagDirtyKey(a.key)
    }, f.prototype.preloadGameState = function () {

    }, f.prototype.retrySyncState = function (a) {
        w.log(a), this.increaseDelaySyncState(), this.scheduleSyncState()
    }, f.prototype.syncState = function () {

    }, g.prototype.init = function (a) {
        this.data = a.data || null
    }, g.prototype._performAction = function (a) {

    }, g.prototype.on = function (a, b) {
        this.IS_SLAVE && (this.subscribers[a] || (this.subscribers[a] = []), this.subscribers[a].push(b))
    }, g.prototype.emit = function (a) {

    }, g.prototype.isSiteLock = function () {

    }, g.prototype.adjustHeight = function (a) {
        if (!this.moduleReady) throw new Error("This method cannot be called before the API is loaded");
        this.IS_MASTER ? "function" == typeof SpilGames && "undefined" != typeof SpilGames.Events && "function" == typeof SpilGames.Events.publish && SpilGames.Events.publish("portal.adjustheight", {
            height: a,
            onsuccess: function () {}
        }) : (this.messenger._postMessage(a, void 0, "gameapi.game.adjustHeight"), this.messenger._postMessage(["log.gameapi.game.adjustHeight",
        {
            origin: "slave",
            height: a
        },
        null], null, "log"))
    }, h.prototype.init = function (a) {
        a = a || {}, this.data = a.data || this.data, this._setupEvents()
    }, h.prototype._setupEvents = function () {
        this.isMaster || this.messenger.subscribe("gameapi.locale.change", this._localeChange, this)
    }, h.prototype._localeChange = function (a) {
        this.activeLanguage = a
    }, h.prototype.changeLocale = function (a) {
        this.isMaster && this.messenger._postMessage(a, void 0, "gameapi.locale.change")
    }, h.prototype.getLocalizedText = function (a, b) {
        if (!this.moduleReady) throw new Error("This method cannot be called before the API is loaded");
        var c = a;
        return this.data && this.data.localization[this.activeLanguage] && this.data.localization[this.activeLanguage][a] && this.data.localization[this.activeLanguage][a].id && this.data.localization[this.activeLanguage][a].id === b && (c = this.data.localization[this.activeLanguage][a].text), c
    }, i.prototype.init = function (a) {
        this._setLocale(a), this._setupEvents(), a && a.data && a.data.portal && a.data.portal.siteId && a.data.portal.siteId < 500 && "0" !== a.data.portal.siteId && (this.isAvailable = !0)
    }, i.prototype._setupEvents = function () {

    }, i.prototype.login = function (a, b) {

    }, i.prototype._loginResponse = function (a) {

    }, i.prototype.forceAuthentication = function () {

    }, i.prototype.getUser = function (a, b) {

    }, i.prototype._getUserLegacy = function () {

    }, i.prototype._getUserLegacyResponse = function (a) {
        this.usercallback(a)
    }, i.prototype._getUserResponse = function (a) {

    }, i.prototype._validateData = function (a) {

    }, i.prototype.getAvatar = function (a, b, c) {

    }, i.prototype._getAvatarResponse = function (a) {

    }, i.prototype._setLocale = function (a) {

    }, i.prototype._getLang = function (a) {

    }, j.prototype.init = function (a) {
        this._setupEvents(), a && a.data && a.data.portal && a.data.portal.siteId && a.data.portal.siteId < 500 && "0" !== a.data.portal.siteId && (this.isAvailable = !0)
    }, j.prototype._setupEvents = function () {
        this.IS_MASTER ? (this.messenger.subscribe("gameapi.friends.showInvite", this.showInvite, this), this.messenger.subscribe("gameapi.friends.getFriends", this.getFriends, this), this.messenger.subscribe("gameapi.friends.getFriendsLegacy", this._getFriendsLegacy, this)) : (this.messenger.subscribe("gameapi.friends.getFriendsResponse", this._getFriendsResponse, this), this.messenger.subscribe("gameapi.friends.getFriendsLegacyResponse", this._getFriendsLegacyResponse, this))
    }, j.prototype.showInvite = function (a) {
        if (!this.moduleReady) throw new Error("This method cannot be called before the API is loaded");
        this.IS_MASTER ? "function" == typeof SpilGames && "undefined" != typeof SpilGames.Events && "function" == typeof SpilGames.Events.publish && SpilGames.Events.publish("invitefriends.request") : (this.messenger._postMessage({}, void 0, "gameapi.friends.showInvite"), this.messenger._postMessage(["log.gameapi.friends.showInvite",
        {
            origin: "slave"
        },
        null], null, "log"), this.eventTracking.trackGameAPIEvent("friendsInvite", {
            guid: this.guid || ""
        }))
    }, j.prototype.getFriends = function (a, b) {

    }, j.prototype._getFriendsLegacy = function () {

    }, j.prototype._getFriendsLegacyResponse = function (a) {
        this.friendscallback(a)
    }, j.prototype._getFriendsFromPortal = function () {

    }, j.prototype._getFriendsResponse = function (a) {

    }, j.prototype._validateData = function (a) {

    }, k.prototype.init = function (a) {

    }, k.prototype._setupMasterEvent = function () {
        this.IS_MASTER && this.messenger.subscribe("gameapi.score", this.submit, this)
    }, k.prototype._obfuscateScore = function (a) {
        var b = 2166136261,
            c = a.length,
            d = 0;
        if (!c) return b;
        for (; d < c; ++d) b ^= a.charCodeAt(d), b += (b << 1) + (b << 4) + (b << 7) + (b << 8) + (b << 24);
        return b >>> 0
    }, k.prototype.submit = function (a) {
        if (!this.moduleReady) throw new Error("This method cannot be called before the API is loaded");
        if (this.IS_MASTER) {
            if (this.data && this.data.portal && this.data.portal.siteId && this.data.portal.siteId < 500 && this.data.portal.siteId > 0) {
                var b = !1,
                    c = window.outerHeight - window.innerHeight,
                    d = "";
                this.appToken && (d = this.appToken.getAppToken()), c === this.initialHeight && (b = !0), this.eventTracking.trackGameAPIEvent("scoreSubmit", {
                    score: a,
                    initialheight: this.initialHeight,
                    submitheight: c,
                    equals: b,
                    os: this._obfuscateScore("" + a),
                    guid: this.state.userId,
                    apptoken: d
                }), "function" == typeof SWFtoJS && SWFtoJS({
                    call: "UPDATE_HIGHSCORE",
                    params: {
                        score: a
                    }
                })
            }
        } else this.messenger._postMessage(a, void 0, "gameapi.score"), this.messenger._postMessage(["log.gameapi.score.submit",
        {
            origin: "slave",
            score: a
        },
        null], null, "log");
        return {
            success: !0,
            value: a
        }
    }, l.prototype.init = function (a) {
        a = a || {}, this.data = a.data || this.data, this.data && this.data.user && (this.state.userId = this.data.user.userId || null)
    }, l.prototype._setupMasterEvent = function () {
        this.IS_MASTER && this.messenger.subscribe("gameapi.award", this.submit, this)
    }, l.prototype.submit = function (a) {
        var b = a.award || "";
        if (!this.moduleReady) throw new Error("This method cannot be called before the API is loaded");
        if (this.IS_MASTER) {
            if (this.data && this.data.portal && this.data.portal.siteId && this.data.portal.siteId < 500 && this.data.portal.siteId > 0) {
                var c = !1,
                    d = "";
                this.appToken && (d = this.appToken.getAppToken()), window.outerHeight - window.innerHeight === this.initialHeight && (c = !0), this.eventTracking.trackGameAPIEvent("awardSubmit", {
                    award: b,
                    initialheight: this.initialHeight,
                    submitheight: window.outerHeight - window.innerHeight,
                    equals: c,
                    guid: this.state.userId,
                    apptoken: d
                })
            }
        } else this.messenger._postMessage(a, void 0, "gameapi.award"), this.messenger._postMessage(["log.gameapi.award.submit",
        {
            origin: "slave",
            award: b
        },
        null], null, "log");
        return {
            success: !0,
            value: a.award
        }
    }, m.prototype.init = function (a) {
        a = a || {}, this.data = a.data || this.data
    }, m.prototype._setupMasterEvent = function () {
        var a = this.IS_MASTER ? this._masterHandler : this._slaveHandler;
        this.messenger.subscribe("gameapi.secondscreen", a, this)
    }, m.prototype._masterHandler = function (a) {
        window.SpilGames && SpilGames(["SWPEvent"], function (b) {
            b.emit("system.game.secondscreen", a)
        })
    }, m.prototype._slaveHandler = function (a) {
        a.event && this._handleClientEvent(a.event)
    }, m.prototype._dispatchEvent = function (a) {
        var b = document.createEvent("Event");
        b.initEvent(a.name, !0, !0);
        for (var c in a.properties) a.properties.hasOwnProperty(c) && (b[c] = a.properties[c]);
        document.body.dispatchEvent(b)
    }, m.prototype._handleClientEvent = function (a) {
        var b = this.data.mapping;
        if (b[a.id] && b[a.id][a.type]) {
            var c = b[a.id][a.type];
            c.properties || (c.properties = {}), c["function"] && (c = c["function"](c)), c && c.name && this._dispatchEvent(c)
        }
    }, m.prototype.relayClientEvents = function (a) {
        this.IS_MASTER && this.messenger._postMessage({
            event: a
        }, void 0, "gameapi.secondscreen")
    }, m.prototype.updateControls = function (a, b) {
        this.IS_MASTER || (this.data.mapping = b || {}, this.messenger._postMessage({
            controls: a
        }, void 0, "gameapi.secondscreen"))
    }, n.prototype.init = function (a) {
        a = a || {}, this.data = a.data || this.data, this._setupEvents(), this.messenger._postMessage(!0, void 0, "gameapi.gamebreak.checkavailable")
    }, n.prototype._setupEvents = function () {
        if (this.isMaster) {
            var a = this;
            SpilGames(["JSLib"], function (b) {
                a._setupJSLibGameBreakFlow(b, "midroll", "ad.request.accepted", "game.ad.accepted"), a._setupJSLibGameBreakFlow(b, "reward", "adreward.request.accepted", "game.adreward.accepted"), b.subscribe("ad.complete", function (b) {
                    a.messenger._postMessage(b, void 0, "ad.complete")
                })
            }), this.messenger.subscribe("gameapi.ad.request", this._setupAd, this), this.messenger.subscribe("game.ad.request", this._triggerAd, this), this.messenger.subscribe("gameapi.adreward.request", this._setupAd, this), this.messenger.subscribe("gameapi.adreward.request", this._triggerAdreward, this), this.messenger.subscribe("game.force.break", this._forceGamebreak, this), this.messenger.subscribe("gameapi.gamebreak.checkavailable", this._checkAvailable, this), this.messenger.subscribe("gameapi.gamebreak.checkrewardavailable", this._checkRewardAvailable, this)
        } else this.messenger.subscribe("ad.request.accepted", this._onAdAccepted, this), this.messenger.subscribe("adreward.request.accepted", this._onRewardAccepted, this), this.messenger.subscribe("ad.complete", this._onAdCompleted, this), this.messenger.subscribe("gameapi.gamebreak.checkavailableresponse", this._checkAvailableResponse, this)
    }, n.prototype._setupJSLibGameBreakFlow = function (a, b, c, d) {
        var e = this;
        a.subscribe(c, function (a) {
            e.eventTracking.trackGameAPIEvent("gamebreakAccepted", {
                gamebreakType: b,
                response: a
            }), !0 === a && e.adRequested && (e.adRequested = !1, SpilGames(d, !0), e.messenger._postMessage(!0, void 0, c))
        })
    }, n.prototype._setupAd = function () {
        this.adRequested = !0
    }, n.prototype._checkAvailable = function () {
        this.isMaster && document.getElementById("sgAdOgGp300x250") ? this.messenger._postMessage(!0, void 0, "gameapi.gamebreak.checkavailableresponse") : this.messenger._postMessage(!1, void 0, "gameapi.gamebreak.checkavailableresponse")
    }, n.prototype._checkAvailableResponse = function (a) {
        this.isMaster || this.isStandalone || (this.adAvailable = a)
    }, n.prototype._triggerAd = function () {
        SpilGames("game.ad.request")
    }, n.prototype._triggerAdreward = function () {
        SpilGames("game.adreward.request")
    }, n.prototype._forceGamebreak = function () {
        SpilGames("game.ad.accepted", !0)
    }, n.prototype._runCallback = function (a, b) {
        this._callbacks[a] && (this._callbacks[a](b), this._callbacks[a] = !1)
    }, n.prototype.isAvailable = function () {
        return !1
    }, n.prototype._checkRewardAvailable = function () {
        var a, b = this,
            c = "adreward.requestavailability.conclusive",
            d = "game.adreward.requestavailability",
            e = function (d) {
                SpilGames && SpilGames(["JSLib"], function (a) {
                    a.unsubscribe(c, e)
                }), a && (clearTimeout(a), a = null), b.messenger._postMessage(d, void 0, "gameapi.gamebreak.checkrewardavailableresponse")
            };
        b.isMaster || b.messenger._postMessage({
            available: !1
        }, void 0, "gameapi.gamebreak.checkrewardavailableresponse"), a = setTimeout(function () {
            e({
                available: !1
            })
        }, b.TIMEOUT_REWARD_AVAILABILITY_CONCLUSIVE), SpilGames && (SpilGames(["JSLib"], function (a) {
            a.subscribe(c, e)
        }), SpilGames(d))
    }, n.prototype._checkRewardAvailableResponse = function (a) {
        this.isRewardAvailableCallbacks.timeoutHandle && (clearTimeout(this.isRewardAvailableCallbacks.timeoutHandle), this.isRewardAvailableCallbacks.timeoutHandle = null), this.messenger.unsubscribe("gameapi.gamebreak.checkrewardavailableresponse", this._checkRewardAvailableResponse, this), a.available ? this.isRewardAvailableCallbacks.accept() : this.isRewardAvailableCallbacks.reject(), this.isRewardAvailableCallbacks.reject = function () {}, this.isRewardAvailableCallbacks.accept = function () {}
    }, n.prototype.isRewardAvailable = function () {
        var a = this,
            b = new Promise(function (b, c) {
                return a.isRewardAvailableCallbacks.accept = b, a.isRewardAvailableCallbacks.reject = c, !a.adAvailable || a.isMaster ? void c() : void(a.isRewardAvailableCallbacks.timeoutHandle = setTimeout(function () {
                    a._checkRewardAvailableResponse({
                        available: !1
                    })
                }, a.TIMEOUT_REWARD_AVAILABILITY_CONCLUSIVE))
            });
        return a.messenger.subscribe("gameapi.gamebreak.checkrewardavailableresponse", a._checkRewardAvailableResponse, a), a.messenger._postMessage(void 0, void 0, "gameapi.gamebreak.checkrewardavailable"), b
    }, n.prototype.reward = function (a, b) {
        var c = this;
        if ("function" != typeof a) throw new Error("pauseGame argument should be a function");
        if ("function" != typeof b) throw new Error("resumeGame argument should be a function");
        if (!c.moduleReady) throw new Error("This method cannot be called before the API is loaded");
        return c._callbacks.pause = a, c._callbacks.resume = b, this.gamebreakType = "reward", this.isMaster ? void c._runCallback("resume", {
            completed: !1
        }) : (c.messenger._postMessage(void 0, void 0, "gameapi.adreward.request"), c.messenger._postMessage(["log.gameapi.adreward.requested",
        {
            origin: "slave"
        },
        null], null, "log"), this.eventTracking.trackGameAPIEvent("gamebreakRequest", {
            gamebreakType: "reward"
        }), void(this.timeout = setTimeout(function () {
            c._requestTimeout(), c.eventTracking.trackGameAPIEvent("gamebreakTimeout", {
                gamebreakType: "reward"
            })
        }, this.timeoutAfter)))
    }, n.prototype.request = function (a, b) {
        var c = this;
        if ("function" != typeof a) throw new Error("pauseGame argument should be a function");
        if ("function" != typeof b) throw new Error("resumeGame argument should be a function");
        if (!this.moduleReady) throw new Error("This method cannot be called before the API is loaded");
        this._callbacks.pause = a, this._callbacks.resume = b, this.gamebreakType = "midroll", this.isMaster || (this.messenger._postMessage(void 0, void 0, "gameapi.ad.request"), this.messenger._postMessage(["log.gameapi.ad.requested",
        {
            origin: "slave"
        },
        null], null, "log"), this.eventTracking.trackGameAPIEvent("gamebreakRequest", {
            gamebreakType: "midroll"
        })), this.messenger._postMessage(void 0, void 0, "game.ad.request"), this.timeout = setTimeout(function () {
            c._requestTimeout(), c.eventTracking.trackGameAPIEvent("gamebreakTimeout", {
                gamebreakType: "midroll"
            })
        }, this.timeoutAfter)
    }, n.prototype._onAdAccepted = function (a) {
        var b = this.messenger;
        this.timeout && clearTimeout(this.timeout), !this.isMaster && a && (b._postMessage(["log.gameapi.ad.start",
        {
            origin: "slave"
        },
        null], null, "log"), this._runCallback("pause"))
    }, n.prototype._onRewardAccepted = function (a) {
        var b = this.messenger;
        this.timeout && clearTimeout(this.timeout), !this.isMaster && a && (b._postMessage(["log.gameapi.adreward.start",
        {
            origin: "slave"
        },
        null], null, "log"), this._runCallback("pause"))
    }, n.prototype._onAdCompleted = function (a) {
        var b = this.messenger,
            c = !(!a || !a.completed) && a.completed;
        this.isMaster || b._postMessage(["log.gameapi.ad.complete",
        {
            origin: "slave",
            completed: c
        },
        null], null, "log"), this.eventTracking.trackGameAPIEvent("gamebreakComplete", {
            gamebreakType: this.gamebreakType,
            adSuccess: c
        }), this.gamebreakType = "unknown", this._runCallback("resume", {
            completed: c
        })
    }, n.prototype._requestTimeout = function (a) {
        this._onAdCompleted({
            completed: !1
        })
    }, o.prototype._setupEvents = function () {
        this.IS_MASTER && this.messenger.subscribe("gameapi.gameevent", this.emit, this)
    }, o.prototype._validateEvent = function (a) {
        var b = !1;
        return this.events[a] && "undefined" != typeof this.events[a] && (b = !0), b
    }, o.prototype.emit = function (a, b) {
        if (!this.moduleReady) throw new Error("This method cannot be called before the API is loaded");
        this._validateEvent(a) ? this.IS_MASTER ? "function" == typeof SWFtoJS && SWFtoJS({
            call: a
        }) : (this.messenger._postMessage(a, void 0, "gameapi.gameevent"), this.messenger._postMessage(["log.gameapi.gameevent.emit",
        {
            origin: "slave",
            evt: a
        },
        null], null, "log")) : this.IS_MASTER || this.messenger._postMessage(["log.gameapi.gameevent.emit",
        {
            origin: "slave"
        },
        null], null, "log")
    }, p.prototype.init = function (a) {
        a = a || {}, this.data = a.data || this.data;
        var b = this.data && this.data.game && this.data.game.applicationId ? this.data.game.applicationId : null,
            c = new Date,
            d = window.location.hostname;
        this.data && this.data.portal ? (this.isGamestate = this.data.portal.gamestate || !1, this.data.portal.siteId ? this.siteId = this.data.portal.siteId : this.siteId = null, this.data.portal.channelId ? this.channelId = this.data.portal.channelId : this.channelId = null) : (this.siteId = null, this.channelId = null), this.data && this.data.apiData && this.data.apiData.gameAPIUserId ? this.gameAPIUserId = this.data.apiData.gameAPIUserId : this.gameAPIUserId = null, this.sessionId = Math.floor(999999 * Math.random()), this.configureInternalTracking(b, c, d), this.isGamestate || (this.IS_SLAVE || this.IS_STANDALONE || w.isWrapped()) && this.startInternalTracking()
    }, p.prototype._createEventObject = function (a, b, c) {
        return {
            eventCategory: a,
            eventAction: b,
            properties: c
        }
    }, p.prototype._sendSETEvent = function (a, b, c) {

    }, p.prototype.trackGamePlay = function (a) {

    }, p.prototype.trackTimeInGame = function (a) {

    }, p.prototype.trackGameAPIEvent = function (a, b) {

    }, p.prototype.configureInternalTracking = function (a, b, c) {

    }, p.prototype.startInternalTracking = function () {

    }, q.prototype.init = function (a) {

    }, q.prototype.getLogo = function (a) {
        if (!this.moduleReady) return {
            error: "This method cannot be called before the API is loaded"
        };
        var b = this.IS_MASTER ? "master" : "slave";
        this.messenger._postMessage(["log.branding.getlogo",
        {
            origin: b
        },
        null], null, "log");
        var c, d, e = {
            type: {
                type: "String",
                values: ["png"]
            },
            width: "Number",
            height: "Number"
        };
        return c = this._getLink("logo"), a && "object" == typeof a && (d = w.validateSchema(e, a), d.error && (c.error = d.error)), c
    }, q.prototype.getLink = function (a) {
        if (!a) return {
            error: "No link identifier provided"
        };
        var b = this.listLinks();
        if (b.indexOf(a) !== -1) {
            var c = this.IS_MASTER ? "master" : "slave";
            return this.messenger._postMessage(["log.branding.getlink",
            {
                origin: c,
                linkName: a
            },
            null], null, "log"), this._getLink(a)
        }
        return {
            error: "Invalid option: '" + a + "'",
            action: function () {}
        }
    }, q.prototype._getLink = function (a) {
        if (!a) return {
            error: "No link identifier provided"
        };
        var b = this.data && this.data.branding ? this.data.branding : {};
        return b && b[a] ? {
            linkName: a,
            image: b[a].image || !1,
            action: this._executeHandler.bind(this, a)
        } : {
            error: "Invalid option: '" + a + "'",
            action: function () {}
        }
    }, q.prototype._getGMLink = function (a) {
        var b = null;
        if (!a) return {
            error: "No link identifier provided"
        };
        var c = this.data && this.data.branding ? this.data.branding : {};
        return c && c[a] ? (b = this._tagUrl(c[a].url, a), {
            linkName: a,
            url: b
        }) : {
            error: "Invalid option: '" + a + "'",
            url: null
        }
    }, q.prototype.getLinks = function () {
        var a = {},
            b = this.listLinks();
        if (0 === b.length) a = {
            more_games: {
                action: function () {}
            }
        };
        else for (var c = 0; c < b.length; c++) {
            var d = b[c];
            a[d] = this._getLink(d)
        }
        return a
    }, q.prototype._executeHandler = function (a) {

    }, q.prototype._getBrandName = function (a) {

    }, q.prototype.listLinks = function () {

    }, q.prototype.getSplashScreen = function () {

    }, q.prototype.displaySplashScreen = function (a) {
        if ("function" != typeof a) throw new Error("argument  passed to displaySplashScreen method should be a function");
        var b = this.IS_MASTER ? "master" : "slave",
            c = this._getLink("logo").image;
        c && this.getSplashScreen().show ? ("master" !== b && this.messenger._postMessage(["log.branding.displaySplashScreen",
        {
            origin: b
        },
        null], null, "log"), this.components.displayOnTop({
            url: c,
            action: this.getSplashScreen().action,
            callback: a
        })) : a()
    }, q.prototype._displaySpilBanner = function (a) {

    }, q.prototype._tagUrl = function (a, b) {

    }, r.prototype.encode = function () {
        var a = ["gameapi", this.type, this.callbackId, this.data ? JSON.stringify(this.data) : ""].join("|");
        return a
    }, t.prototype._postMessage = function (a, b, c) {

    }, t.prototype._callJSLib = function () {
        SpilGames.apply(SpilGames, w.argsToArray(arguments))
    }, t.prototype._setupEventListener = function () {
        window.addEventListener ? window.addEventListener("message", this._handleMessage.bind(this), !1) : window.attachEvent && window.attachEvent("onmessage", this._handleMessage.bind(this))
    }, t.prototype._handleMessage = function (a) {
        var b, c, d, e, f = this,
            g = new r(a.data);
        if (g) if (b = g.type, c = g.callbackId, d = g.data, e = this._callbacks[c] || !1, this.IS_MASTER) switch (b) {
        case "jslib":
            "Array" === d.constructor.name ? d.push(function (a) {
                f._postMessage(a, c)
            }) : "string" == typeof d && (d = JSON.parse(d)), this._callJSLib.apply(this, d);
            break;
        case "ugapi":
            this._handleUGARequest(a);
            break;
        case "datachange":
            this._postMessage(d, null, "datachange");
            break;
        default:
            this.publish(b, d)
        } else this.IS_SLAVE && ("function" == typeof e ? (delete this._callbacks[c], e(d)) : "datachange" === b || "jslib" !== b && this.publish(b, d));
        return !1
    }, t.prototype._handleUGARequest = function (a) {
        var b, c, d, e = this,
            f = new r(a.data);
        if (f) switch (b = f.data[0], c = f.callbackId, d = f.data[1] ? f.data[1] : null, b) {
        case "GameAPI.data":
            e._postMessage(this.dataStore._getCache(), c, "ugapi");
            break;
        case "GameAPI.isReady":
            e._postMessage({
                isready: this.api.isReady
            }, c, "ugapi")
        }
    }, t.prototype.post = function () {
        var a = w.argsToArray(arguments);
        return this.IS_SLAVE ? this._postMessage(a) : this._callJSLib.apply(this, a), this
    }, t.prototype.publish = function (a, b) {
        return this._channels[a] && this._channels[a].forEach(function (a) {
            try {
                a.fn.call(a.ctx, b)
            } catch (c) {}
        }), this
    }, t.prototype.subscribe = function (a, b, c) {
        if ("function" != typeof b) throw new Error("Callback has to be a function");
        if ("string" != typeof a) throw new Error("Channel name has to be a string");
        return this._channels[a] || (this._channels[a] = []), this._channels[a].push({
            fn: b,
            ctx: c
        }), this
    }, t.prototype.unsubscribe = function (a, b) {
        return this._channels[a] && "function" == typeof b && (this._channels[a] = this._channels[a].filter(function (a) {
            return a.fn !== b
        })), this
    }, t.prototype.subscribeOnce = function (a, b, c) {
        function d(c) {
            e.unsubscribe(a, d), b.call(this, c)
        }
        var e = this;
        return this.subscribe(a, d, c)
    }, t.prototype.requestFromParent = function (a, b, c) {
        if (!this.IS_SLAVE) throw "You are the parent, stop talking to yourself";
        b = b || {}, this._postMessage([a, b, c], null, "ugapi")
    }, u.prototype._addBasic = function (a, b) {
        var c = b || {};
        return c.isMaster = this.IS_MASTER, c.isStandalone = this.IS_STANDALONE, c.messenger = this.__.messenger, c.data = null, c
    }, u.prototype._addEventTracking = function (a) {
        var b = a || {};
        return b.eventTracking = this.__.EventTracking, b
    }, u.prototype._addComponents = function (a) {
        var b = a || {};
        return b.components = this.__.components, b
    }, u.prototype._addInitialHeight = function (a) {
        var b = a || {};
        return b.initialHeight = window.outerHeight - window.innerHeight, b
    }, u.prototype._addAppToken = function (a) {
        var b = a || {};
        return b.appToken = this.AppToken, b
    }, u.prototype._forceGamePlayer = function (a) {

    }, u.prototype._setRole = function () {
        var a = w.getRole(window);
        this.IS_MASTER = a.IS_MASTER, this.IS_SLAVE = a.IS_SLAVE, this.IS_STANDALONE = a.IS_STANDALONE
    }, u.prototype._getTargets = function () {
        if (this.IS_STANDALONE) return [window];
        if (this.IS_MASTER) {
            for (var a = ["iframegame", "iframeGameState"], b = null, c = [], d = 0; d < a.length; d++) b = document.getElementById(a[d]), b && b.contentWindow && c.push(b.contentWindow);
            return c
        }
        return [window.parent]
    }, u.prototype.loadAPI = function (a, b) {
        function c(b) {
            l.IS_MASTER ? b = e(b) : b && b.user && b.user.userId && x.__.user.setUserId(b.user.userId), l._forceGamePlayer(b);
            var c = b.portal && b.portal.gamestate || !1,
                d = b.game && b.game.properties && b.game.properties.highscore || !1,
                f = b.game && b.game.properties && b.game.properties.award || !1;
            return l.isReady = !0, l.Branding.moduleReady = !0, l.__.EventTracking.moduleReady = !0, l.GameState.moduleReady = !0, l.GameBreak.moduleReady = !0, l.Game.moduleReady = !0, l.Score.moduleReady = !0, l.Award.moduleReady = !0, l.Secondscreen.moduleReady = !0, l.User.moduleReady = !0, l.Friends.moduleReady = !0, l.GameEvent.moduleReady = !0, l.Localization.moduleReady = !0, l.AppToken.moduleReady = !0, (c || d || f) && l.AppToken.init({
                data: b
            }), l.__.EventTracking.init({
                data: b
            }), l.Advertisement.init({
                data: b,
                isMaster: l.IS_MASTER,
                isSlave: l.IS_SLAVE,
                isStandAlone: l.IS_STANDALONE
            }), c && l.GameState.init({
                data: b
            }), c || (l.Branding.init({
                data: b
            }), l.Game.init({
                data: b
            }), l.Score.init({
                data: b
            }), l.Award.init({
                data: b
            }), l.GameBreak.init({
                data: b
            }), l.Friends.init({
                data: b
            }), l.User.init({
                data: b
            }), l.Localization.init({
                data: b
            })), l.__.messenger._postMessage(["log.gameapi.loadapi.finish",
            {
                origin: m,
                version: l.version
            },
            null], null, "log"), a(l)
        }
        function e(a) {
            var b = a.game || {},
                c = a.apiData || {},
                d = a.user || {},
                e = a.portal || {},
                f = a.branding || {},
                g = a.localization || {},
                h = a.distributable || 0;
            return x.getLocalConfig({
                game: b,
                apiData: c,
                user: d,
                portal: e,
                branding: f,
                localization: g,
                distributable: h
            })
        }
        function f() {
            l.__.messenger.requestFromParent("GameAPI.data", {}, function (a) {
                c(a)
            })
        }
        function g() {
            l.IS_STANDALONE = !0, l.IS_MASTER = !0, l.IS_SLAVE = !0, l.__.dataStore = new d({
                isMaster: !0
            }), b = b || null, x.setupStandaloneMode(b, function (a) {
                l.__.dataStore._setCache(e(a)), c(a)
            })
        }
        function h() {
            l.__.messenger.requestFromParent("GameAPI.isReady", {}, function (a) {
                k && clearTimeout(k), a.isready ? f() : n < 5 ? (n++, setTimeout(h, 500)) : (w.log("GameAPI:checkMasterReady not ready but reached max wait"), f())
            })
        }
        function i(a) {
            a && !a.isError ? l.__.dataStore._setCache(e(a)) : w.log("GameAPI gameConfig error: ", a.isError), c(a)
        }
        function j(a) {
            x.getBrandingConfig(a, i)
        }
        var k, l = this,
            m = this.IS_MASTER ? "master" : "slave",
            n = 0;
        if ("undefined" != typeof b && "undefined" != typeof b.id && "576742227280293562" === b.id && (window.onkeydown = null), "function" != typeof a) throw new Error("argument passed to loadAPI method should be a function");
        return !0 === this.isReady ? (w.log("WARNING: Detected multiple executions of GameAPI.loadAPI(). This method should only be executed once per page load!"), a(l)) : (this.__.messenger._postMessage(["log.gameapi.loadapi.start",
        {
            origin: m,
            version: l.version,
            spildata: b
        },
        null], null, "log"), void(this.IS_STANDALONE ? g() : this.IS_MASTER ? x.getGameConfig(j) : b && b.gamestate ? c(x.configFromData(b)) : (k = setTimeout(g, 600), h())))
    };
    var y = new u(d, t, q, p, n);
    "function" == typeof define && define.amd && define("GameAPI", y), a.GameAPI = y
}(window), function () {
    "use strict";
    function a(a) {
        a && (a.setTargetValueAtTime || (a.setTargetValueAtTime = a.setTargetAtTime))
    }
    var b = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    b && window.hasOwnProperty && window.hasOwnProperty("AudioContext") && (window.webkitAudioContext = AudioContext, AudioContext.prototype.hasOwnProperty("internal_createGain") || (AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain, AudioContext.prototype.createGain = function () {
        var b = this.internal_createGain();
        return a(b.gain), b
    }), AudioContext.prototype.hasOwnProperty("internal_createDelay") || (AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay, AudioContext.prototype.createDelay = function () {
        var b = this.internal_createDelay();
        return a(b.delayTime), b
    }), AudioContext.prototype.hasOwnProperty("internal_createBufferSource") || (AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource, AudioContext.prototype.createBufferSource = function () {
        var b = this.internal_createBufferSource();
        return b.noteOn || (b.noteOn = b.start), b.noteGrainOn || (b.noteGrainOn = b.start), b.noteOff || (b.noteOff = b.stop), a(b.playbackRate), b
    }), AudioContext.prototype.hasOwnProperty("internal_createDynamicsCompressor") || (AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor, AudioContext.prototype.createDynamicsCompressor = function () {
        var b = this.internal_createDynamicsCompressor();
        return a(b.threshold), a(b.knee), a(b.ratio), a(b.reduction), a(b.attack), a(b.release), b
    }), AudioContext.prototype.hasOwnProperty("internal_createBiquadFilter") || (AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter, AudioContext.prototype.createBiquadFilter = function () {
        var b = this.internal_createBiquadFilter();
        a(b.frequency), a(b.detune), a(b.Q), a(b.gain);
        for (var c = ["LOWPASS", "HIGHPASS", "BANDPASS", "LOWSHELF", "HIGHSHELF", "PEAKING", "NOTCH", "ALLPASS"], d = 0; d < c.length; ++d) {
            var e = c[d],
                f = e.toLowerCase();
            b.hasOwnProperty(e) || (b[e] = f)
        }
        return b
    }), AudioContext.prototype.hasOwnProperty("internal_createOscillator") || AudioContext.prototype.hasOwnProperty("createOscillator") && (AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator, AudioContext.prototype.createOscillator = function () {
        var b = this.internal_createOscillator();
        b.noteOn || (b.noteOn = b.start), b.noteOff || (b.noteOff = b.stop), a(b.frequency), a(b.detune);
        for (var c = ["SINE", "SQUARE", "SAWTOOTH", "TRIANGLE", "CUSTOM"], d = 0; d < c.length; ++d) {
            var e = c[d],
                f = e.toLowerCase();
            b.hasOwnProperty(e) || (b[e] = f)
        }
        return b.hasOwnProperty("setWaveTable") || (b.setWaveTable = b.setPeriodicTable), b
    }), AudioContext.prototype.hasOwnProperty("internal_createPanner") || (AudioContext.prototype.internal_createPanner = AudioContext.prototype.createPanner, AudioContext.prototype.createPanner = function () {
        var a = this.internal_createPanner(),
            b = {
                EQUALPOWER: "equalpower",
                HRTF: "HRTF",
                LINEAR_DISTANCE: "linear",
                INVERSE_DISTANCE: "inverse",
                EXPONENTIAL_DISTANCE: "exponential"
            };
        for (var c in b) {
            var d = b[c];
            a.hasOwnProperty(c) || (a[c] = d)
        }
        return a
    }), AudioContext.prototype.hasOwnProperty("createGainNode") || (AudioContext.prototype.createGainNode = AudioContext.prototype.createGain), AudioContext.prototype.hasOwnProperty("createDelayNode") || (AudioContext.prototype.createDelayNode = AudioContext.prototype.createDelay), AudioContext.prototype.hasOwnProperty("createJavaScriptNode") || (AudioContext.prototype.createJavaScriptNode = AudioContext.prototype.createScriptProcessor), AudioContext.prototype.hasOwnProperty("createWaveTable") || (AudioContext.prototype.createWaveTable = AudioContext.prototype.createPeriodicWave))
}();
