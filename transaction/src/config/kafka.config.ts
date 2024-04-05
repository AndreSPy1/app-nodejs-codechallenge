import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'transaction-app',
    brokers: ['localhost:9092'],
    logLevel: logLevel.ERROR,
   });

export const kafkaProducer = kafka.producer();
export const kafkaConsumer = kafka.consumer({ groupId: 'transaction-update-group' });