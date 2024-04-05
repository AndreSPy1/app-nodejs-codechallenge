import { Field, Int, ObjectType } from "@nestjs/graphql";
import { TransactionTypeStatusDto } from "./transaction-type-status.dto"; 

@ObjectType()
export class TransactionDto {
    
    @Field()
    transactionExternalId: string;

    @Field()
    transactionType: TransactionTypeStatusDto;

    @Field()
    transactionStatus: TransactionTypeStatusDto;

    @Field((type) => Int)
    value: number;

    @Field()
    createdAt: string;
}