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
        // get a user repository to perform operations with user
        const bookRepository: Repository<Book> = getManager().getRepository(Book);

        // load all users
        const books: Book[] = await bookRepository.find({
            where: { user },
            relations: ['user']
        });

        // return OK status code and loaded users array
        ctx.status = 200;
        ctx.body = books;

        // ctx.body = 'Hello World!';
    }

    public static async createBook (ctx: BaseContext) {
        const userId = +ctx.params.userId;
        const userRepository: Repository<User> = getManager().getRepository(User);
        const user: User = await userRepository.findOne(userId);
        // get a user repository to perform operations with user
        const bookRepository: Repository<Book> = getManager().getRepository(Book);

        // build up entity user to be saved
        const bookToBeSaved: Book = new Book();
        bookToBeSaved.name = ctx.request.body.name;
        bookToBeSaved.description = ctx.request.body.description;
        bookToBeSaved.user = user;

        // validate user entity
        const errors: ValidationError[] = await validate(bookToBeSaved); // errors is an array of validation errors

        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        }  else {
            // save the user contained in the POST body
            const book = await bookRepository.save(bookToBeSaved);
            // return CREATED status code and updated user
            ctx.status = 201;
            ctx.body = book;
        }
    }
}
