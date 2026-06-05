const MILLENNIUM_IS_CLIENT_MODULE=!1,pluginName="profile-bg-cache";
function InitializePlugins(){var e,n;(e=window.PLUGIN_LIST||(window.PLUGIN_LIST={}))[pluginName]||(e[pluginName]={}),(n=window.MILLENNIUM_PLUGIN_SETTINGS_STORE||(window.MILLENNIUM_PLUGIN_SETTINGS_STORE={}))[pluginName]||(n[pluginName]={}),window.MILLENNIUM_SIDEBAR_NAVIGATION_PANELS||(window.MILLENNIUM_SIDEBAR_NAVIGATION_PANELS={})}
InitializePlugins();

const STORAGE_KEY = "millennium_profile_bg";

let PluginEntryPointMain = function() {
    return function(exports) {
        "use strict";

        function saveBackground() {
            // body also has has_profile_background but no inline style — target the div
            const el = document.querySelector("div.has_profile_background[style*='background-image']");
            if (!el) return false;
            const bg = el.style.backgroundImage;
            if (bg && bg !== "none" && bg !== "") {
                localStorage.setItem(STORAGE_KEY, bg);
                return true;
            }
            return false;
        }

        function applyBackground() {
            const bg = localStorage.getItem(STORAGE_KEY);
            if (!bg) return;
            // Apply to body so image layers on top of body's existing background-color
            document.body.style.setProperty("background-image", bg, "important");
            document.body.style.setProperty("background-size", "cover", "important");
            document.body.style.setProperty("background-position", "center top", "important");
            document.body.style.setProperty("background-attachment", "fixed", "important");
        }

        exports.default = async function() {
            applyBackground();

            // Reapply whenever React mutates body's style (e.g. overrides background-image)
            new MutationObserver(() => {
                if (localStorage.getItem(STORAGE_KEY) && document.body.style.backgroundImage !== localStorage.getItem(STORAGE_KEY)) {
                    applyBackground();
                }
            }).observe(document.body, { attributes: true, attributeFilter: ["style"] });

            // Poll for .has_profile_background — React may render it after script runs
            let attempts = 0;
            const poll = setInterval(() => {
                if (saveBackground() || ++attempts >= 20) {
                    clearInterval(poll);
                    applyBackground();
                }
            }, 500);
        };

        Object.defineProperty(exports, "__esModule", { value: true });
        return exports;
    }({}, window.MILLENNIUM_API);
};

function ExecutePluginModule() {
    let t = PluginEntryPointMain();
    Object.assign(window.PLUGIN_LIST[pluginName], {
        ...t,
        __millennium_internal_plugin_name_do_not_use_or_change__: pluginName
    });
    t.default();
}

ExecutePluginModule();
