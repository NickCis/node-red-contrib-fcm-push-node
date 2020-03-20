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
        if (msg.payload.registration_ids)
          message.registration_ids = msg.payload.registration_ids;
        if (msg.payload.condition)
          message.condition = msg.payload.condition;
        if (msg.payload.priority)
          message.priority = msg.payload.priority;
        if ('content_available' in msg.payload)
          message.content_available = msg.payload.content_available;
        if ('mutable_content' in msg.payload)
          message.mutable_content = msg.payload.mutable_content;
        if (msg.payload.time_to_live)
          message.time_to_live = msg.payload.time_to_live;
        if (msg.payload.restricted_package_name)
          message.restricted_package_name = msg.payload.restricted_package_name;   
        if ('dry_run' in msg.payload)
          message.dry_run = msg.payload.dry_run;

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
