const octopusApi = require('./octopusApi');
const m3uParser = require('./m3uParser');
const urlRewriter = require('./urlRewriter');

module.exports = async (config) => {
  const lineup = [];
  
  try {
    const m3uContent = await octopusApi.getChannelsFromOctopusNet(config);
    
    if (!m3uContent) {
      console.error('Failed to retrieve M3U content from Octopus Net');
      return lineup;
    }
    
    if (!m3uParser.validateM3uFormat(m3uContent)) {
      console.error('Invalid M3U format received from Octopus Net');
      return lineup;
    }
    
    const channels = m3uParser.parseM3uContent(m3uContent);
    const rewrittenChannels = urlRewriter.rewriteChannelUrls(channels, config);
    
    for (const channel of rewrittenChannels) {
      lineup.push({
        GuideNumber: String(channel.number),
        GuideName: channel.name,
        URL: channel.url,
      });
    }
    
    console.log(`Successfully loaded ${lineup.length} channels from Octopus Net`);
    
  } catch (error) {
    console.error('Error creating Octopus Net lineup:', error);
  }
  
  return lineup;
};
