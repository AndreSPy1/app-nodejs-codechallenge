import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TransactionsService } from '../services/transactions.service';
import { Query } from '@nestjs/graphql';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionDto } from '../dtos/transaction.dto';
import { TransactionOutputDto } from '../dtos/transaction-output.dto';

@Resolver()
export class TransactionsResolver {

    constructor(private transactionsService: TransactionsService) {}

    @Query((returns) => TransactionDto)
    transaction(@Args('id', { type: () => String }) id: string){
        return this.transactionsService.findOne(id);
    }

    @Mutation((returns) => TransactionOutputDto)
    createTransaction(@Args('transactionInput') transactionInput: CreateTransactionDto): Promise<TransactionOutputDto> {
        return this.transactionsService.create(transactionInput);
    }
}
