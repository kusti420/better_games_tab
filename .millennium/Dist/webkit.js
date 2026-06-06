const MILLENNIUM_IS_CLIENT_MODULE=!1,pluginName="profile-bg-cache";
function InitializePlugins(){var e,n;(e=window.PLUGIN_LIST||(window.PLUGIN_LIST={}))[pluginName]||(e[pluginName]={}),(n=window.MILLENNIUM_PLUGIN_SETTINGS_STORE||(window.MILLENNIUM_PLUGIN_SETTINGS_STORE={}))[pluginName]||(n[pluginName]={}),window.MILLENNIUM_SIDEBAR_NAVIGATION_PANELS||(window.MILLENNIUM_SIDEBAR_NAVIGATION_PANELS={})}
InitializePlugins();

const STORAGE_KEY = "millennium_profile_bg";

let PluginEntryPointMain = function() {
    return function(exports) {
        "use strict";

        function saveBackground() {
            const el = document.querySelector("div.has_profile_background[style*='background-image']");
            if (!el) return false;
            const bg = el.style.backgroundImage;
            if (bg && bg !== "none" && bg !== "") {
                localStorage.setItem(STORAGE_KEY, bg);
                return true;
            }
            return false;
        }

        function getOrCreateStyle() {
            let el = document.getElementById("bg-cache-style");
            if (!el) {
                el = document.createElement("style");
                el.id = "bg-cache-style";
                document.head.appendChild(el);
            }
            return el;
        }

        function applyBackground() {
            const bg = localStorage.getItem(STORAGE_KEY);
            const style = getOrCreateStyle();
            if (bg) {
                style.textContent = `
                    html {
                        background-image: ${bg} !important;
                        background-size: cover !important;
                        background-position: center top !important;
                        background-attachment: fixed !important;
                        background-color: #1b2838 !important;
                    }
                    body, body > div, .Panel { background-color: transparent !important; }
                `;
            } else {
                style.textContent = "";
            }
        }

        exports.default = async function() {
            applyBackground();

            new MutationObserver(() => {
                if (!document.getElementById("bg-cache-style")) applyBackground();
            }).observe(document.head, { childList: true });

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

async function ExecutePluginModule() {
    let t = PluginEntryPointMain();
    Object.assign(window.PLUGIN_LIST[pluginName], {
        ...t,
        __millennium_internal_plugin_name_do_not_use_or_change__: pluginName
    });
    await t.default();
}

ExecutePluginModule();
