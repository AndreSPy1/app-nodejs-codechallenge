import { kafkaProducer } from '../config/kafka.config';

export class TransactionKafkaProducer{

    async sendMessage(idTransaction: string, status: number): Promise<void>{
        await kafkaProducer.connect();
        await kafkaProducer.send({
            topic: 'transaction-update-topic',
            messages: [{ 
                value: JSON.stringify({
                    idTransaction: idTransaction,
                    status
                })
            }],
            });
        await kafkaProducer.disconnect();
    }
}