import { Service } from 'typedi';
import UsersRepository from '../data-access/users.repository';
import elapsed from '../decorators/elapsed';
import log from '../decorators/log';
import { User } from '../models/user';

@Service()
class UsersService {
    constructor(private _usersRepository: UsersRepository) { }

    @elapsed
    @log
    async getById(id: number): Promise<Omit<User, 'isDeleted'> | undefined> {
        return await this._usersRepository.getById(id);
    }

    @elapsed
    @log
    async autoSuggest(login: string, limit: number | undefined = undefined): Promise<Omit<User, 'isDeleted'>[]> {
        return await this._usersRepository.autoSuggest(login, limit);
    }

    @elapsed
    @log
    async getByLogin(login: string): Promise<Omit<User, 'isDeleted'> | undefined> {
        return await this._usersRepository.getByLogin(login);
    }

    @elapsed
    @log
    async create(user: Omit<User, 'id' | 'isDeleted'>): Promise<void> {
        return await this._usersRepository.create(user);
    }

    @elapsed
    @log
    async update(id: number, user: Omit<User, 'id' | 'isDeleted'>): Promise<void> {
        return await this._usersRepository.update(id, user);
    }

    @elapsed
    @log
    async delete(id: number): Promise<void> {
        return await this._usersRepository.delete(id);
    }
}

export default UsersService;