function fetch(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

function replace(elementId) {
  return function(content) {
    document.querySelector(elementId).innerHTML = content;
  }
}

function urlReplace(elementId) {
  return function(content) {
    document.querySelector(elementId).href = content;
    document.querySelector(elementId).innerHTML = content;
  }
}

fetch('/antennas_config.json').then((result) => {
  let config = JSON.parse(result);
  urlReplace('#octopusNetUrl')(config.octopus_net_url);
  replace('#minisatipIp')(config.minisatip_ip);
  replace('#minisatipPort')(config.minisatip_port);
  urlReplace('#antennasUrl')(config.antennas_url);
  replace('#useSatipXml')(config.use_satip_xml ? 'Yes' : 'No');
  replace('#tunerCount')(config.tuner_count);
  replace('#channelCount')(config.channel_count);
  replace('#status')(config.status);
});

