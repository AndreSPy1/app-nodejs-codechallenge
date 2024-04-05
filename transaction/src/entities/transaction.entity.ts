import { Field, Int, ObjectType } from "@nestjs/graphql";
import { TransactionStatus } from "src/enum/transaction-status.enum";
import { TransactionType } from "src/enum/transaction-type.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'transaction' })
@ObjectType()
export class Transaction {

    @PrimaryGeneratedColumn('uuid')
    @Field()
    accountExternalId: string;

    @Column( {
        type: 'enum',
        enum: TransactionType
    } )
    @Field((type) => Int)
    type: TransactionType;

    @Column( {
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.PENDING
    } )
    @Field((type) => Int)
    status: TransactionStatus;

    @CreateDateColumn( { name: "createDateTime", type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'} )
    @Field()
    createDateTime: Date;

    @UpdateDateColumn( { name: "lastChangedDateTime", type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'} )
    @Field({nullable: true})
    lastChangedDateTime?: Date;

    @Column( {type: 'numeric'} )
    @Field((type) => Int)
    value: number;
}