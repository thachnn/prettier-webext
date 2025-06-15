/* globals chrome */
if (typeof browser == 'undefined') globalThis.browser = chrome;

(browser.action || browser.browserAction).onClicked.addListener(() => {
  return browser.runtime.openOptionsPage();
});
