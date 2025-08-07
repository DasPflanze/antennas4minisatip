function rewriteUrlForMinisatip(originalUrl, config) {
  if (!originalUrl || !config.minisatip_ip) {
    return originalUrl;
  }

  try {
    const url = new URL(originalUrl);
    
    // Replace the hostname with the minisatip IP
    url.hostname = config.minisatip_ip;
    
    // Replace the port with the minisatip port
    if (config.minisatip_port) {
      url.port = config.minisatip_port.toString();
    }
    
    return url.toString();
  } catch (error) {
    console.error(`Error rewriting URL ${originalUrl}:`, error);
    return originalUrl;
  }
}

function rewriteChannelUrls(channels, config) {
  if (!channels || !Array.isArray(channels)) {
    return [];
  }

  return channels.map(channel => ({
    ...channel,
    url: rewriteUrlForMinisatip(channel.url, config)
  }));
}

module.exports = { 
  rewriteUrlForMinisatip, 
  rewriteChannelUrls 
};