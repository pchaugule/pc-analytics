// var axios_1 = require("axios");
import { hasCookies, getCookie, setCookie } from '@analytics/cookie-utils';
import { getItem } from '@analytics/storage-utils';
const PREFIX = '__';
const USER_ID = PREFIX + 'user_id'; // __user_id

var defaultConfig = {
    enabled: true,
    recordSessions: true,
    sessionsThreshold: 30,
    cookiesOnMainDomain: true
};
function indicative(pluginConfig) {
    var isInitialized = false;
    return {
        name: "indicative-analytics",
        config: {
            ...defaultConfig,
            ...pluginConfig
        },
        initialize: function (plugin) {
            var config = plugin.config, instance = plugin.instance;
            var apiKey = config.apiKey;
            var script = document.createElement("script");
            script.src = "//cdn.indicative.com/js/1.0.2/Indicative.min.js";
            script.type = "text/javascript";
            script.async = true;
            script.onload = script.onreadystatechange = function () {
                var rs = this.readyState;
                if (isInitialized || (rs && rs != "complete" && rs != "loaded"))
                    return;
                isInitialized = true;
                window.Indicative.initialize(apiKey, config);
            };
            document.body.appendChild(script);
        },
        loaded: function () {
            return Boolean(window["Indicative"]);
        },
        /* Sync id when ready */
        ready: ({ instance, config }) => {
            let userId;
            if (hasCookies()) {
                userId = getCookie(USER_ID);
                if (!userId) {
                    userId = getItem(USER_ID);
                    if (!userId) {
                        userId = instance.user('anonymousId');
                    }
                }
            }
            if (userId) {
                setCookie(USER_ID, userId);
                instance.identify(userId);
            }
        },
        identify: function ({ payload, config }) {
            // var payload = props.payload, config = props.config;
            setCookie(USER_ID, payload.userId);
            // Indicative has NO identify() call in their JS file. Bug reported, for now just make the call manually
            // axios_1["default"]
            //     .post("https://api.indicative.com/service/alias/" + config.apiKey, {
            //     previousId: payload.anonymousId,
            //     newId: payload.userId
            // })
            //     .then(function () {
            //     axios_1["default"]
            //         .post("https://api.indicative.com/service/identify/" + config.apiKey, {
            //         uniqueId: payload.userId,
            //         properties: payload.traits
            //     })["catch"](console.error);
            // })["catch"](console.error);
        },
        // page: ({ payload, config })
        page: function ({ payload, config, instance }) {
            // var payload = trackData.payload, config = trackData.config, instance = trackData.instance;
            var properties = payload.properties;
            window.Indicative.buildEvent("Page View", properties);
        },
        // Set parameter scope at event level with 'event' method
        track: function ({ payload, config }) {
            var event = payload.event, properties = payload.properties;
            window.Indicative.buildEvent(event, properties);
        },
        // setCooomProps()

    };
}
export default indicative;