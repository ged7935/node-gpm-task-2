import GroupsService from '../../../services/groups.service';
import { remove } from '../../../routers/handlers/groups';
import { Container } from 'typedi';

jest.mock('../../../services/groups.service');
jest.mock('typedi');

describe('Group controller - remove tests', () => {
    const mockGroupsService = new GroupsService({} as any);
    const mockContainerGet = Container.get as jest.MockedFunction<typeof Container.get>;

    mockContainerGet.mockReturnValue(mockGroupsService);

    const mockGroupsServiceDelete = mockGroupsService.delete as jest.MockedFunction<typeof mockGroupsService.delete>;

    const mockReq = {
        params: { id: 1 }
    } as any;
    const mockRes = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis()
    } as any;

    afterEach(() => {
        mockGroupsServiceDelete.mockClear();
        mockContainerGet.mockClear();
        mockRes.send.mockClear();
        mockRes.status.mockClear();
    });

    it('should return 204 status when group is deleted', async () => {
        await remove(mockReq, mockRes);

        expect(mockContainerGet).toHaveBeenCalledTimes(1);
        expect(mockContainerGet).toHaveBeenCalledWith(GroupsService);
        expect(mockGroupsServiceDelete).toHaveBeenCalledTimes(1);
        expect(mockGroupsServiceDelete).toHaveBeenCalledWith(mockReq.params.id);
        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toHaveBeenCalledWith();
    });
});
