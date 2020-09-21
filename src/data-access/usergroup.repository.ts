import { Service, Inject } from 'typedi';
import Knex from 'knex';

@Service()
class UserGroupRepository {
    constructor(@Inject('db') private _db: Knex) { }

    async addUsersToGroup(groupId: number, userIds: number[]): Promise<void> {        
        await this._db.transaction(async (trx) => {
            const userGroups = userIds.map(u => ({ user_id: u, group_id: groupId }));
            await trx('user_group').insert(userGroups);
        });
    }
}

export default UserGroupRepository;