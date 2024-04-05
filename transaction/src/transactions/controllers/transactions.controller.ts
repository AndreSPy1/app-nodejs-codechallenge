import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionsService } from '../services/transactions.service';

@Controller('api/transactions')
export class TransactionsController {

    constructor(
        private transactionsService: TransactionsService
    ) {}

    @Get(':id')
    async getTransactionById(@Param('id') id: string){
        const trasanctionReponse = await this.transactionsService.findOne(id);
        return trasanctionReponse;
    }

    @Post()
    async createTransaction(@Body() createTransactionDto: CreateTransactionDto){
        return await this.transactionsService.create(createTransactionDto);
    }
}
