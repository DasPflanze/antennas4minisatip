const yaml = require('js-yaml');
const fs = require('fs');

function structureConfig(antennasUrl, tunerCount, deviceUuid, octopusNetUrl, satipXmlUrl, m3uUrl, minisatipIp, minisatipPort, useSatipXml) {
  return {
    antennas_url: antennasUrl,
    tuner_count: tunerCount,
    device_uuid: deviceUuid,
    octopus_net_url: octopusNetUrl,
    satip_xml_url: satipXmlUrl,
    m3u_url: m3uUrl,
    minisatip_ip: minisatipIp,
    minisatip_port: minisatipPort,
    use_satip_xml: useSatipXml,
  };
}

// eslint-disable-next-line consistent-return
function loadConfig(configFile = 'config/config.yml') {
  // Check if you even need to load the config file
  if (process.env.ANTENNAS_URL && process.env.TUNER_COUNT && process.env.DEVICE_UUID) {
    return structureConfig(
      process.env.ANTENNAS_URL, 
      parseInt(process.env.TUNER_COUNT, 10), 
      process.env.DEVICE_UUID,
      process.env.OCTOPUS_NET_URL || 'http://192.168.178.58',
      process.env.SATIP_XML_URL || `${process.env.OCTOPUS_NET_URL || 'http://192.168.178.58'}/description.xml`,
      process.env.M3U_URL || `${process.env.OCTOPUS_NET_URL || 'http://192.168.178.58'}/channellist.lua?select=m3u`,
      process.env.MINISATIP_IP || '192.168.1.100',
      parseInt(process.env.MINISATIP_PORT, 10) || 554,
      process.env.USE_SATIP_XML === 'true' || true
    );
  }

  // If you do, load it
  if (fs.existsSync(configFile)) {
    const config = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));
    const baseUrl = process.env.OCTOPUS_NET_URL || config.octopus_net_url || 'http://192.168.178.58';
    return structureConfig(
      process.env.ANTENNAS_URL || config.antennas_url,
      parseInt(process.env.TUNER_COUNT, 10) || config.tuner_count,
      process.env.DEVICE_UUID || config.device_uuid,
      baseUrl,
      process.env.SATIP_XML_URL || config.satip_xml_url || `${baseUrl}/description.xml`,
      process.env.M3U_URL || config.m3u_url || `${baseUrl}/channellist.lua?select=m3u`,
      process.env.MINISATIP_IP || config.minisatip_ip || '192.168.1.100',
      parseInt(process.env.MINISATIP_PORT, 10) || config.minisatip_port || 554,
      process.env.USE_SATIP_XML === 'true' || config.use_satip_xml !== false
    );
  }
  // eslint-disable-next-line no-console
  console.log(`❌ Config file ${configFile} could not be found; did you specify a config file and is it the right path?`);
  process.exit(1);
}

module.exports = { loadConfig, structureConfig };
