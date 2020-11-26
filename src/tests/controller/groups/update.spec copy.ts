import GroupsService from '../../../services/groups.service';
import { update } from '../../../routers/handlers/groups';
import { Container } from 'typedi';

jest.mock('../../../services/groups.service');
jest.mock('typedi');

describe('Group controller - update tests', () => {
    const mockGroupsService = new GroupsService({} as any);
    const mockContainerGet = Container.get as jest.MockedFunction<typeof Container.get>;

    mockContainerGet.mockReturnValue(mockGroupsService);

    const mockGroupsServiceUpdate = mockGroupsService.update as jest.MockedFunction<typeof mockGroupsService.update>;

    const mockReq = {
        params: { id: 1 },
        body: {}
    } as any;
    const mockRes = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis()
    } as any;

    afterEach(() => {
        mockGroupsServiceUpdate.mockClear();
        mockContainerGet.mockClear();
        mockRes.send.mockClear();
        mockRes.status.mockClear();
    });

    it('should return 204 status when group is updated', async () => {
        await update(mockReq, mockRes);

        expect(mockContainerGet).toHaveBeenCalledTimes(1);
        expect(mockContainerGet).toHaveBeenCalledWith(GroupsService);
        expect(mockGroupsServiceUpdate).toHaveBeenCalledTimes(1);
        expect(mockGroupsServiceUpdate).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toHaveBeenCalledWith();
    });
});
