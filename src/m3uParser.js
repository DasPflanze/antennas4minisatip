function parseM3uContent(m3uContent) {
  if (!m3uContent || typeof m3uContent !== 'string') {
    return [];
  }

  const lines = m3uContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const channels = [];
  let channelNumber = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('#EXTINF:')) {
      const channelName = extractChannelName(line);
      const nextLine = lines[i + 1];
      
      if (nextLine && (nextLine.startsWith('rtsp://') || nextLine.startsWith('http://'))) {
        channels.push({
          number: channelNumber,
          name: channelName || `Channel ${channelNumber}`,
          url: nextLine,
        });
        channelNumber++;
        i++; // Skip the URL line
      }
    }
  }

  return channels;
}

function extractChannelName(extinfLine) {
  const nameMatch = extinfLine.match(/#EXTINF:[^,]*,\s*(.+)$/);
  if (nameMatch && nameMatch[1]) {
    return nameMatch[1].trim();
  }
  return null;
}

function validateM3uFormat(m3uContent) {
  if (!m3uContent || typeof m3uContent !== 'string') {
    return false;
  }

  const firstLine = m3uContent.split('\n')[0].trim();
  return firstLine === '#EXTM3U';
}

module.exports = { 
  parseM3uContent, 
  extractChannelName, 
  validateM3uFormat 
};