import { Service } from 'typedi';
import UserGroupRepository from '../data-access/usergroup.repository';

@Service()
class UserGroupService {
    constructor(private _userGroupRepository: UserGroupRepository) { }

    async addUsersToGroup(groupId: number, userIds: number[]): Promise<void> {
        return await this._userGroupRepository.addUsersToGroup(groupId, userIds);
    }
}

export default UserGroupService;