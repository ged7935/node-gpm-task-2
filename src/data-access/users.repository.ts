import { Service } from 'typedi';
import Knex from 'knex';
import { User } from '../models/user';
import Database from '../db.loader';

@Service()
class UsersRepository {
    private _db: Knex;
    constructor(database: Database) {
        this._db = database.instance;
    }

    async getById(id: number): Promise<Omit<User, 'isDeleted'> | undefined> {
        return await this._db<User>('users').where('id', id).andWhere('is_deleted', false).first();
    }

    async getByLogin(login: string): Promise<Omit<User, 'isDeleted'> | undefined> {
        return await this._db<User>('users').where('login', login).andWhere('is_deleted', false).first();
    }

    async autoSuggest(login: string, limit: number | undefined = undefined): Promise<Omit<User, 'isDeleted'>[]> {
        const query = this._db<User>('users').where('login', 'like', `%${login}%`).andWhere('is_deleted', false).orderBy('login');
        return await (limit ? query.limit(limit) : query);
    }

    async create(user: Omit<User, 'id' | 'isDeleted'>): Promise<void> {
        await this._db<User>('users').insert(user);
    }

    async update(id: number, user: Omit<User, 'id' | 'isDeleted'>): Promise<void> {
        await this._db<User>('users').where('id', id).andWhere('is_deleted', false).update(user);
    }

    async delete(id: number): Promise<void> {
        await this._db<User>('users').where('id', id).update('is_deleted', true);
    }
}

export default UsersRepository;