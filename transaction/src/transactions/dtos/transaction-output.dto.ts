import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TransactionOutputDto {
    
    @Field()
    idTransaction: string;
}