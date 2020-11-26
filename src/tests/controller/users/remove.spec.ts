import UsersService from '../../../services/users.service';
import { remove } from '../../../routers/handlers/users';
import { Container } from 'typedi';

jest.mock('../../../services/users.service');
jest.mock('typedi');

describe('User controller - remove tests', () => {
    const mockUsersService = new UsersService({} as any);
    const mockContainerGet = Container.get as jest.MockedFunction<typeof Container.get>;

    mockContainerGet.mockReturnValue(mockUsersService);

    const mockUsersServiceGetById= mockUsersService.getById as jest.MockedFunction<typeof mockUsersService.getById>;
    const mockUsersServiceDelete= mockUsersService.delete as jest.MockedFunction<typeof mockUsersService.delete>;

    const mockReq = { params: { id: 1 } } as any;
    const mockRes = {
        json: jest.fn(),
        send: jest.fn(),
        status: jest.fn().mockReturnThis()
    } as any;

    afterEach(() => {
        mockUsersServiceGetById.mockClear();
        mockUsersServiceDelete.mockClear();
        mockContainerGet.mockClear();
        mockRes.json.mockClear();
        mockRes.status.mockClear();
        mockRes.send.mockClear();
    });

    it('should return 204 status if user is deleted', async () => {
        mockUsersServiceGetById.mockResolvedValueOnce({} as any);

        await remove(mockReq, mockRes);

        expect(mockContainerGet).toHaveBeenCalledTimes(1);
        expect(mockContainerGet).toHaveBeenCalledWith(UsersService);
        expect(mockUsersServiceGetById).toHaveBeenCalledTimes(1);
        expect(mockUsersServiceGetById).toHaveBeenCalledWith(mockReq.params.id);
        expect(mockUsersServiceDelete).toHaveBeenCalledTimes(1);
        expect(mockUsersServiceDelete).toHaveBeenCalledWith(mockReq.params.id);
        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toHaveBeenCalledWith();
        expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should return 400 status and error if user does not exist', async () => {
        mockUsersServiceGetById.mockResolvedValueOnce(undefined);

        await remove(mockReq, mockRes);

        expect(mockContainerGet).toHaveBeenCalledTimes(1);
        expect(mockContainerGet).toHaveBeenCalledWith(UsersService);
        expect(mockUsersServiceGetById).toHaveBeenCalledTimes(1);
        expect(mockUsersServiceGetById).toHaveBeenCalledWith(mockReq.params.id);
        expect(mockUsersServiceDelete).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).not.toHaveBeenCalled();
        expect(mockRes.json).toHaveBeenCalledTimes(1);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "A user with that id does not exist." });
    });
});