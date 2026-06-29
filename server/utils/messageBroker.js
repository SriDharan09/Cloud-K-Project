const amqp = require("amqplib");

let connection = null;
let channels = {};

const QUEUES = {
  ORDER_PLACED: "order.placed",
  ORDER_STATUS_CHANGED: "order.status_changed",
  ORDER_COMPLETED: "order.completed",
  PROMOTION_SEND: "promotion.send",
  EMAIL_SEND: "email.send",
};

const DLQ_CONFIG = {
  "x-dead-letter-exchange": "dlx",
  "x-dead-letter-routing-key": "dead",
  "x-message-ttl": 86400000,
};

const connect = async () => {
  return new Promise((resolve) => {
    const tryConnect = async (retries = 5) => {
      try {
        connection = await amqp.connect(
          process.env.RABBITMQ_URL || "amqp://localhost",
        );

        connection.on("error", (err) => {
          console.error("❌ RabbitMQ error:", err.message);
          setTimeout(() => tryConnect(), 5000);
        });

        connection.on("close", () => {
          console.warn("⚠️ RabbitMQ closed — reconnecting...");
          channels = {};
          setTimeout(() => tryConnect(), 5000);
        });

        const dlxChannel = await connection.createChannel();
        await dlxChannel.assertExchange("dlx", "direct", { durable: true });
        await dlxChannel.assertQueue("dead.letter.queue", { durable: true });
        await dlxChannel.bindQueue("dead.letter.queue", "dlx", "dead");
        await dlxChannel.close();
        console.log("✅ Dead letter exchange ready");

        for (const queue of Object.values(QUEUES)) {
          const ch = await connection.createChannel();
          await ch.assertQueue(queue, {
            durable: true,
            arguments: DLQ_CONFIG,
          });
          await ch.prefetch(1);
          channels[queue] = ch;
          console.log(`📬 Channel ready: ${queue}`);
        }

        console.log("✅ RabbitMQ connected — all channels ready");
        resolve();
      } catch (err) {
        console.error("❌ RabbitMQ connect error:", err.message);
        if (retries > 0) {
          console.warn(`⚠️ Retrying (${retries} left)...`);
          setTimeout(() => tryConnect(retries - 1), 5000);
        } else {
          console.error("❌ RabbitMQ failed after all retries");
          resolve();
        }
      }
    };

    tryConnect();
  });
};

const publish = (queue, data) => {
  const ch = channels[queue];
  if (!ch) {
    console.error(`❌ No channel for queue '${queue}' — message dropped`);
    return;
  }
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
    persistent: true,
    timestamp: Date.now(),
    contentType: "application/json",
  });
};

const consume = async (queue, handler) => {
  const ch = channels[queue];
  if (!ch) throw new Error(`No channel for queue: ${queue}`);

  await ch.consume(queue, async (msg) => {
    if (!msg) return;

    const retryCount = msg.properties.headers?.["x-retry-count"] || 0;

    try {
      const data = JSON.parse(msg.content.toString());
      await handler(data);
      ch.ack(msg);
    } catch (err) {
      console.error(
        `❌ [${queue}] attempt ${retryCount + 1} failed:`,
        err.message,
      );

      if (retryCount < 3) {
        setTimeout(
          () => {
            ch.sendToQueue(queue, msg.content, {
              persistent: true,
              headers: { "x-retry-count": retryCount + 1 },
            });
            ch.ack(msg);
          },
          2000 * (retryCount + 1),
        ); // backoff: 2s, 4s, 6s
      } else {
        console.error(`❌ [${queue}] moving to DLQ after 3 failures`);
        ch.nack(msg, false, false);
      }
    }
  });
};

module.exports = { connect, publish, consume, QUEUES };
