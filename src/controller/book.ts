import { BaseContext } from 'koa';
import { getManager, Repository, Not, Equal } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { Book } from '../entity/book';
import { User } from '../entity/user';

export default class BookController {
    public static async getBooks (ctx: BaseContext) {
        const userId = +ctx.params.userId;
        const userRepository: Repository<User> = getManager().getRepository(User);
        const user: User = await userRepository.findOne(userId);
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        const books: Book[] = await bookRepository.find({
            where: { user },
            relations: ['user']
        });

        ctx.status = 200;
        ctx.body = books;
    }

    public static async createBook (ctx: BaseContext) {
        const userId = +ctx.params.userId;
        const userRepository: Repository<User> = getManager().getRepository(User);
        const user: User = await userRepository.findOne(userId);
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        const bookToBeSaved: Book = new Book();
        bookToBeSaved.name = ctx.request.body.name;
        bookToBeSaved.description = ctx.request.body.description;
        bookToBeSaved.user = user;
        const errors: ValidationError[] = await validate(bookToBeSaved); // errors is an array of validation errors
        if (errors.length > 0) {
            ctx.status = 400;
            ctx.body = errors;
        }  else {
            const book = await bookRepository.save(bookToBeSaved);
            ctx.status = 201;
            ctx.body = book;
        }
    }

    public static async deleteBook (ctx: BaseContext) {
        const bookRepository = getManager().getRepository(Book);
        const bookToRemove: Book = await bookRepository.findOne({
            where: { id: +ctx.params.id },
            // where: { id: +ctx.params.id, userId: +ctx.params.userId },   // Can you explain how can I choose book with user id params??
            relations: ['user']
        });
        if (!bookToRemove) {
            ctx.status = 400;
            ctx.body = 'The book you are trying to delete doesn\'t exist in the db';
        } else if (+ctx.params.userId !== bookToRemove.user.id) {
            ctx.status = 403;
            ctx.body = 'This book doesn\'t belong to this user';
        } else {
            await bookRepository.remove(bookToRemove);
            ctx.status = 204;
        }
    }

    public static async updateBook (ctx: BaseContext) {
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        const bookToBeUpdated: Book = await bookRepository.findOne({
            where: { id: +ctx.params.id },
            relations: ['user']
        });
        bookToBeUpdated.id = +ctx.params.id || 0; // will always have a number, this will avoid errors
        bookToBeUpdated.name = ctx.request.body.name;
        bookToBeUpdated.description = ctx.request.body.description;
        const errors: ValidationError[] = await validate(bookToBeUpdated); // errors is an array of validation errors
        if (errors.length > 0) {
            ctx.status = 400;
            ctx.body = errors;
        } else if ( !await bookRepository.findOne(bookToBeUpdated.id) ) {
            // this validation doesn't work, server returns Internal server error
            ctx.status = 400;
            ctx.body = 'The book you are trying to update doesn\'t exist in the db';
        } else if (+ctx.params.userId !== bookToBeUpdated.user.id) {
            ctx.status = 403;
            ctx.body = 'This book doesn\'t belong to this user';
        } else {
            const book = await bookRepository.save(bookToBeUpdated);
            ctx.status = 201;
            ctx.body = book;
        }
    }
}
