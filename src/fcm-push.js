const FCM = require('fcm-push');

module.exports = RED => {
  RED.nodes.registerType('fcm-push', function(config) {
    RED.nodes.createNode(this, config);
    const serverKey = process.env.FCM_SERVER_KEY;
    try {
      const fcm = new FCM(serverKey);

      this.on('input', msg => {
        var message = {
          to: msg.payload.to,
          collapse_key: msg.payload.collapseKey,
          notification: msg.payload.notification
        };

        if (msg.payload.data)
          message.data = msg.payload.data;

        fcm.send(message)
          .then(response => {
            msg.payload = response;
            this.send(msg);
          })
          .catch(err => {
            msg.error = err;
            this.error("Couldnt send message", msg);
          });
      });
    } catch(err) {
      this.status({fill:"red", shape:"ring", text:err.description});
    }
  });
};
