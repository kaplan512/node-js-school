import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Length } from 'class-validator';
import { User } from './user';

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 80
    })
    @Length(1, 80)
    name: string;

    @Column({
        length: 200
    })
    @Length(10, 200)
    description: string;

    @ManyToOne(type => User, user => user.books)
    user: User;
}