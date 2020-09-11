import { Service } from 'typedi';
import UsersRepository from '../data-access/users.repository.ts';
import { User } from '../models/user';

@Service()
class UsersService {
    constructor(private _usersRepository: UsersRepository) { }

    async getById(id: number): Promise<Omit<User, 'isDeleted'> | undefined> {
        return await this._usersRepository.getById(id);
    }

    async autoSuggest(login: string, limit: number | undefined = undefined): Promise<Omit<User, 'isDeleted'>[]> {
        return await this._usersRepository.autoSuggest(login, limit);
    }

    async getByLogin(login: string): Promise<Omit<User, 'isDeleted'> | undefined> {
        return await this._usersRepository.getByLogin(login);
    }

    async create(user: Omit<User, 'id' | 'isDeleted'>): Promise<void> {
        return await this._usersRepository.create(user);
    }

    async update(id: number, user: Omit<User, 'id' | 'isDeleted'>): Promise<void> {
        return await this._usersRepository.update(id, user);
    }

    async delete(id: number): Promise<void> {
        return await this._usersRepository.delete(id);
    }
}

export default UsersService;