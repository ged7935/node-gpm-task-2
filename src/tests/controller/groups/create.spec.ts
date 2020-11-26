import GroupsService from '../../../services/groups.service';
import { create } from '../../../routers/handlers/groups';
import { Container } from 'typedi';

jest.mock('../../../services/groups.service');
jest.mock('typedi');

describe('Group controller - create tests', () => {
    const mockGroupsService = new GroupsService({} as any);
    const mockContainerGet = Container.get as jest.MockedFunction<typeof Container.get>;

    mockContainerGet.mockReturnValue(mockGroupsService);

    const mockGroupsServiceCreate = mockGroupsService.create as jest.MockedFunction<typeof mockGroupsService.create>;

    const mockReq = { body: {} } as any;
    const mockRes = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis()
    } as any;

    afterEach(() => {
        mockGroupsServiceCreate.mockClear();
        mockContainerGet.mockClear();
        mockRes.send.mockClear();
        mockRes.status.mockClear();
    });

    it('should return 204 status when group is created', async () => {
        await create(mockReq, mockRes);

        expect(mockContainerGet).toHaveBeenCalledTimes(1);
        expect(mockContainerGet).toHaveBeenCalledWith(GroupsService);
        expect(mockGroupsServiceCreate).toHaveBeenCalledTimes(1);
        expect(mockGroupsServiceCreate).toHaveBeenCalledWith(mockReq.body);
        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toHaveBeenCalledWith();
    });
});
