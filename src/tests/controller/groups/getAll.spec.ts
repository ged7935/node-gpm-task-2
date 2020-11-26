import GroupsService from '../../../services/groups.service';
import { getAll } from '../../../routers/handlers/groups';
import { Group } from '../../../models/group';
import { Container } from 'typedi';

jest.mock('../../../services/groups.service');
jest.mock('typedi');

describe('Group controller - getAll tests', () => {
    const mockGroupsService = new GroupsService({} as any);
    const mockContainerGet = Container.get as jest.MockedFunction<typeof Container.get>;

    mockContainerGet.mockReturnValue(mockGroupsService);

    const mockGroupsServiceGetAll = mockGroupsService.getAll as jest.MockedFunction<typeof mockGroupsService.getAll>;

    const mockReq = {} as any;
    const mockRes = {
        json: jest.fn()
    } as any;

    afterEach(() => {
        mockGroupsServiceGetAll.mockClear();
        mockContainerGet.mockClear();
        mockRes.json.mockClear();
    });

    it('should return json response with groups', async () => {
        const mockGroups: Group[] = [{
            id: 1,
            name: 'Mock group 1',
            permissions: ['READ', 'WRITE']
        }, {
            id: 2,
            name: 'Mock group 2',
            permissions: ['DELETE']
        }];
        mockGroupsServiceGetAll.mockResolvedValueOnce(mockGroups);

        await getAll(mockReq, mockRes);

        expect(mockContainerGet).toHaveBeenCalledTimes(1);
        expect(mockContainerGet).toHaveBeenCalledWith(GroupsService);
        expect(mockGroupsServiceGetAll).toHaveBeenCalledTimes(1);
        expect(mockGroupsServiceGetAll).toHaveBeenCalledWith();
        expect(mockRes.json).toHaveBeenCalledTimes(1);
        expect(mockRes.json).toHaveBeenCalledWith(mockGroups);
    });
});
