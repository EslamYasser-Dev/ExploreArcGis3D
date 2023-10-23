import mqtt from 'mqtt';

let client = null;


export function connectMqtt(url, topic, onMessageReceived) {
  var client = mqtt.connect(url);

  client.on('connect', () => {
    client.subscribe(topic, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });

  client.on('message', (topic, message) => {
    onMessageReceived(message.toString());
  });
}

export function disconnectMqtt() {
  if (client) {
    client.end();
  }
}

export const options = {
  host: '*********************.**.eu.hivemq.cl#ud',
  port: 8883,
  protocol: 'mqtts',
  username: '',
  password: '@'
}