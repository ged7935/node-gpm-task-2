import { Service } from 'typedi';
import UserGroupRepository from '../data-access/usergroup.repository';
import elapsed from '../decorators/elapsed';
import log from '../decorators/log';

@Service()
class UserGroupService {
    constructor(private _userGroupRepository: UserGroupRepository) { }
    
    @elapsed
    @log
    async addUsersToGroup(groupId: number, userIds: number[]): Promise<void> {
        return await this._userGroupRepository.addUsersToGroup(groupId, userIds);
    }
}

export default UserGroupService;