import { Service } from 'typedi';
import GroupsRepository from '../data-access/groups.repository';
import { Group } from '../models/group';

@Service()
class GroupsService {
    constructor(private _groupsRepository: GroupsRepository) { }

    async getAll(): Promise<Group[]> {
        return await this._groupsRepository.getAll();
    }

    async getById(id: number): Promise<Group | undefined> {
        return await this._groupsRepository.getById(id);
    }

    async create(group: Omit<Group, 'id'>): Promise<void> {
        return await this._groupsRepository.create(group);
    }

    async update(id: number, group: Omit<Group, 'id'>): Promise<void> {
        return await this._groupsRepository.update(id, group);
    }

    async delete(id: number): Promise<void> {
        return await this._groupsRepository.delete(id);
    }
}

export default GroupsService;