import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './services/transactions.service';
import { TransactionsController } from './controllers/transactions.controller';
import { Transaction } from '../entities/transaction.entity';
import { TransactionsResolver } from './resolver/transactions.resolver'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction])
  ],
  providers: [TransactionsService, TransactionsResolver],
  controllers: [TransactionsController]
})
export class TransactionsModule {}
