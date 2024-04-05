import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionType } from 'src/enum/transaction-type.enum';
import { kafkaConsumer, kafkaProducer } from '../../config/kafka.config';
import { TransactionStatus } from 'src/enum/transaction-status.enum';
import { TransactionDto } from '../dtos/transaction.dto';
import { TransactionOutputDto } from '../dtos/transaction-output.dto';
import { TransactionTypeStatusDto } from '../dtos/transaction-type-status.dto';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction) private transactionsRepository: Repository<Transaction>
    ) {
        this.initializeKafkaConsumer();
    }

    private async initializeKafkaConsumer() {
        await kafkaConsumer.connect();
        await kafkaConsumer.subscribe({ topic: 'transaction-update-topic' });
    
        await kafkaConsumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            const transaction = JSON.parse(message.value.toString());
            console.log(`Received message: ${transaction.idTransaction}`);
    
            //Update Entity Registry
            await this.updateStatus(transaction.idTransaction, transaction.status);
    
          },
        });
    }

    async findOne(id: string): Promise<TransactionDto> {
        const found = await this.transactionsRepository.findOneBy({ accountExternalId: id });

        if (!found) {
            throw new NotFoundException(`Transaction with "${id}" does not exist!`);
        }

        let status: string = await this.setStatus(found);
        
        const transactionReponse = new TransactionDto();
        transactionReponse.transactionExternalId = found.accountExternalId;

        const transactionType = new TransactionTypeStatusDto();
        transactionType.name = found.type == TransactionType.CREDIT ? 'CREDIT' : 'DEBIT';
        transactionReponse.transactionType = transactionType;

        const transactionStatus = new TransactionTypeStatusDto();
        transactionStatus.name = status;
        transactionReponse.transactionStatus = transactionStatus;

        transactionReponse.value = found.value;
        transactionReponse.createdAt = found.createDateTime.toString();

        return transactionReponse;
    }

    async create(body: CreateTransactionDto): Promise<TransactionOutputDto> {
        const transaction = new Transaction();
        transaction.type = body.transferTypeId == 1 ? TransactionType.CREDIT : TransactionType.DEBIT;
        transaction.value = body.value;

        const transactionSaved = await this.transactionsRepository.save(transaction);
        
        const transactionResponse = new TransactionOutputDto();
        transactionResponse.idTransaction = transactionSaved.accountExternalId;

        this.kafkaProducerSend(transactionSaved);
         
        return transactionResponse;
    }

    async updateStatus(id: string, status: number): Promise<void>{
        const transaction = await this.transactionsRepository.findOneBy({ accountExternalId: id });
        transaction.status = status;
        await this.transactionsRepository.save(transaction);
    }

    async setStatus(body: Transaction){
        let status: string;

        if(body.status == TransactionStatus.PENDING){
            status = 'PENDING';
        }else if(body.status == TransactionStatus.REJECTED){
            status = 'REJECTED';
        }else if(body.status == TransactionStatus.APPROVED){
            status = 'APPROVED';
        }

        return status;
    }

    async kafkaProducerSend(transactionSaved: Transaction){
        await kafkaProducer.connect();
        await kafkaProducer.send({
            topic: 'transaction-create-topic',
            messages: [{ 
                value: JSON.stringify({
                    idTransaction: transactionSaved.accountExternalId,
                    value: transactionSaved.value
                })
            }],
            });
        await kafkaProducer.disconnect();
    }

}
