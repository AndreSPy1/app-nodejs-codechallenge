import { Field, InputType, Int } from "@nestjs/graphql";
import { Max, Min } from "class-validator";

@InputType()
export class CreateTransactionDto {
    
    @Field((type) => Int)
    "transferTypeId": number;

    @Field((type) => Int)
    "value": number;
}