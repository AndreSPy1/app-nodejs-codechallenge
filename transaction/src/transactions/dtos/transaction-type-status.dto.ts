import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TransactionTypeStatusDto {
    
    @Field()
    name: string;
}