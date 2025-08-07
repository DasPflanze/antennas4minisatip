const axios = require('axios');

async function getSatipXml(config) {
  const options = {
    responseType: 'text',
    timeout: 5000,
  };

  try {
    const response = await axios.get(config.satip_xml_url, options);
    return response;
  } catch (err) {
    return err;
  }
}

function extractM3uUrlFromSatipXml(xmlContent) {
  const m3uUrlRegex = /<satip:X_SATIPM3U[^>]*>(.*?)<\/satip:X_SATIPM3U>/i;
  const match = xmlContent.match(m3uUrlRegex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  return null;
}

async function getM3uPlaylist(config, m3uPath) {
  const options = {
    responseType: 'text',
    timeout: 10000,
  };

  try {
    const m3uUrl = m3uPath ? `${config.octopus_net_url}${m3uPath}` : config.m3u_url;
    const response = await axios.get(m3uUrl, options);
    return response;
  } catch (err) {
    return err;
  }
}

async function getChannelsFromOctopusNet(config) {
  let m3uContent = null;
  
  if (config.use_satip_xml) {
    const xmlResponse = await getSatipXml(config);
    
    if (xmlResponse && xmlResponse.data) {
      const m3uPath = extractM3uUrlFromSatipXml(xmlResponse.data);
      if (m3uPath) {
        const m3uResponse = await getM3uPlaylist(config, m3uPath);
        if (m3uResponse && m3uResponse.data) {
          m3uContent = m3uResponse.data;
        }
      }
    }
  } else {
    const m3uResponse = await getM3uPlaylist(config, null);
    if (m3uResponse && m3uResponse.data) {
      m3uContent = m3uResponse.data;
    }
  }
  
  return m3uContent;
}

module.exports = { 
  getSatipXml, 
  extractM3uUrlFromSatipXml, 
  getM3uPlaylist, 
  getChannelsFromOctopusNet 
};