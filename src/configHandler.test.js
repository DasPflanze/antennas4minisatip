const test = require('ava');
const sinon = require('sinon');
const fs = require('fs');

const configHandler = require('./configHandler');

const testConfig = `
antennas_url: http://127.0.0.1:5004
tuner_count: 6
device_uuid: 2f70c0d7-90a3-4429-8275-cbeeee9cd605
octopus_net_url: http://192.168.178.58
minisatip_ip: 192.168.1.100
minisatip_port: 554
use_satip_xml: true
`.trim();

let sandbox;
let fsStub;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();
  fsStub = sandbox.stub(fs);
});

test.afterEach.always(() => {
  sandbox.restore();
});

test.serial('loads the specified config', (t) => {
  fsStub.existsSync.returns(true);
  fs.readFileSync.returns(testConfig);
  const results = configHandler.loadConfig('test.yml');

  t.is(results.antennas_url, 'http://127.0.0.1:5004');
  t.is(results.tuner_count, 6);
  t.is(results.device_uuid, '2f70c0d7-90a3-4429-8275-cbeeee9cd605');
  t.is(results.octopus_net_url, 'http://192.168.178.58');
  t.is(results.minisatip_ip, '192.168.1.100');
  t.is(results.minisatip_port, 554);
  t.is(results.use_satip_xml, true);

  t.assert(fsStub.existsSync.calledWith('test.yml'));
  t.assert(fsStub.existsSync.calledOnce);

  t.assert(fsStub.readFileSync.calledWith('test.yml', 'utf8'));
  t.assert(fsStub.readFileSync.calledOnce);
});

test.serial('load the config from the default path', (t) => {
  fsStub.existsSync.returns(true);
  fs.readFileSync.returns(testConfig);
  const results = configHandler.loadConfig();

  t.is(results.antennas_url, 'http://127.0.0.1:5004');
  t.is(results.tuner_count, 6);
  t.is(results.device_uuid, '2f70c0d7-90a3-4429-8275-cbeeee9cd605');
  t.is(results.octopus_net_url, 'http://192.168.178.58');
  t.is(results.minisatip_ip, '192.168.1.100');
  t.is(results.minisatip_port, 554);
  t.is(results.use_satip_xml, true);

  t.assert(fsStub.existsSync.calledWith('config/config.yml'));
  t.assert(fsStub.existsSync.calledOnce);

  t.assert(fsStub.readFileSync.calledWith('config/config.yml', 'utf8'));
  t.assert(fsStub.readFileSync.calledOnce);
});

test.serial('quits if it cannot find the file', (t) => {
  sandbox.stub(console);
  const processStub = sandbox.stub(process);
  fsStub.existsSync.returns(false);

  configHandler.loadConfig();
  t.assert(processStub.exit.calledWith(1));
  t.assert(processStub.exit.calledOnce);
});

test.serial('load the config from env variables entirely', (t) => {
  const envStub = sandbox.stub(process, 'env');

  envStub.value({
    NODE_ENV: 'test',
    ANTENNAS_URL: 'https://antennas.test',
    TUNER_COUNT: '10',
    DEVICE_UUID: '1234-4567',
    OCTOPUS_NET_URL: 'https://octopus.test',
    MINISATIP_IP: '192.168.1.200',
    MINISATIP_PORT: '8554',
    USE_SATIP_XML: 'false'
  });

  const results = configHandler.loadConfig();
  t.is(results.antennas_url, 'https://antennas.test');
  t.is(results.tuner_count, 10);
  t.is(results.device_uuid, '1234-4567');
  t.is(results.octopus_net_url, 'https://octopus.test');
  t.is(results.minisatip_ip, '192.168.1.200');
  t.is(results.minisatip_port, 8554);
  t.is(results.use_satip_xml, false);
});

test('structureConfig formats the results', (t) => {
  const results = configHandler.structureConfig(
    'https://antennas.test',
    2,
    '123456789',
    'https://octopus.test',
    '192.168.1.200',
    8554,
    false
  );

  t.is(results.antennas_url, 'https://antennas.test');
  t.is(results.tuner_count, 2);
  t.is(results.device_uuid, '123456789');
  t.is(results.octopus_net_url, 'https://octopus.test');
  t.is(results.minisatip_ip, '192.168.1.200');
  t.is(results.minisatip_port, 8554);
  t.is(results.use_satip_xml, false);
});