module.exports = function UISupportsDocumentBrowser(config, _) {
  if (!config.ios) config.ios = {};
  if (!config.ios.infoPlist) config.ios.infoPlist = {};
  config.ios.infoPlist["UISupportsDocumentBrowser"] = true;
  return config;
};
