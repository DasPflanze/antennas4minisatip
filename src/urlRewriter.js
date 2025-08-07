function rewriteUrlForMinisatip(originalUrl, config) {
  if (!originalUrl || !config.minisatip_ip) {
    return originalUrl;
  }

  try {
    const url = new URL(originalUrl);
    const isRtsp = url.protocol === 'rtsp:';
    
    // Replace the hostname with the minisatip IP
    url.hostname = config.minisatip_ip;
    
    // Replace the port with the minisatip port
    if (config.minisatip_port) {
      url.port = config.minisatip_port.toString();
    }
    
    // Convert RTSP to HTTP for Plex compatibility
    if (config.use_http_streams && isRtsp) {
      // Build new HTTP URL manually to avoid URL class issues
      const query = url.search;
      const newUrl = `http://${config.minisatip_ip}:${config.minisatip_port}/${query}`;
      return newUrl;
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