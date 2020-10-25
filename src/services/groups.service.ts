import { Service } from 'typedi';
import GroupsRepository from '../data-access/groups.repository';
import { Group } from '../models/group';
import log from '../decorators/log';
import elapsed from '../decorators/elapsed';

@Service()
class GroupsService {
    constructor(private _groupsRepository: GroupsRepository) { }
    
    @elapsed
    @log
    async getAll(): Promise<Group[]> {
        return await this._groupsRepository.getAll();
    }

    @elapsed
    @log
    async getById(id: number): Promise<Group | undefined> {
        return await this._groupsRepository.getById(id);
    }

    @elapsed
    @log
    async create(group: Omit<Group, 'id'>): Promise<void> {
        return await this._groupsRepository.create(group);
    }

    @elapsed
    @log
    async update(id: number, group: Omit<Group, 'id'>): Promise<void> {
        return await this._groupsRepository.update(id, group);
    }

    @elapsed
    @log
    async delete(id: number): Promise<void> {
        return await this._groupsRepository.delete(id);
    }
}

export default GroupsService;