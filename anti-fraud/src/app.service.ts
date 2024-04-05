import { Injectable } from '@nestjs/common';
import { kafkaConsumer } from './config/kafka.config';
import { TransactionKafkaProducer } from './kafka/kafka-producer';
import { TransactionStatus } from './enum/transaction-status.enum';

@Injectable()
export class AppService {

  constructor() {
    this.initializeKafkaConsumer();
  }

  private async initializeKafkaConsumer() {
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({ topic: 'transaction-create-topic' });

    await kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const transaction = JSON.parse(message.value.toString());
        console.log(`Received message: ${transaction.idTransaction}`);

        const transactionKafkaProducer = new TransactionKafkaProducer();

        if(transaction.value > 1000){
          //REJECTED
          transactionKafkaProducer.sendMessage(transaction.idTransaction, TransactionStatus.REJECTED);
        }else{
          //APPROVED
          transactionKafkaProducer.sendMessage(transaction.idTransaction, TransactionStatus.APPROVED);
        }

      },
    });
  }
}
