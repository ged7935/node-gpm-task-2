import UsersService from '../../../services/users.service';
import { create } from '../../../routers/handlers';
import { User } from '../../../models/user';
import { Container } from 'typedi';

jest.mock('../../../services/users.service');
jest.mock('typedi');

describe('User controller - create tests', () => {
    const mockUsersService = new UsersService({} as any);
    const mockContainerGet = Container.get as jest.MockedFunction<typeof Container.get>;

    mockContainerGet.mockReturnValue(mockUsersService);

    const mockUsersServiceCreate = mockUsersService.create as jest.MockedFunction<typeof mockUsersService.create>;
    const mockUsersServiceGetByLogin = mockUsersService.getByLogin as jest.MockedFunction<typeof mockUsersService.getByLogin>;

    const mockReq = { body: { login: 'mockUser@mock.com' } } as any;
    const mockRes = {
        json: jest.fn(),
        send: jest.fn(),
        status: jest.fn().mockReturnThis()
    } as any;

    afterEach(() => {
        mockUsersServiceCreate.mockClear();
        mockUsersServiceGetByLogin.mockClear();
        mockContainerGet.mockClear();
        mockRes.json.mockClear();
        mockRes.status.mockClear();
        mockRes.send.mockClear();
    });

    it('should return 204 status when user is created', async () => {
        mockUsersServiceGetByLogin.mockResolvedValueOnce(undefined);

        await create(mockReq, mockRes);

        expect(mockContainerGet).toHaveBeenCalledTimes(1);
        expect(mockContainerGet).toHaveBeenCalledWith(UsersService);
        expect(mockUsersServiceGetByLogin).toHaveBeenCalledTimes(1);
        expect(mockUsersServiceGetByLogin).toHaveBeenCalledWith(mockReq.body.login);
        expect(mockUsersServiceCreate).toHaveBeenCalledTimes(1);
        expect(mockUsersServiceCreate).toHaveBeenCalledWith(mockReq.body);
        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should return 400 status and error when user with same login already exists', async () => {
        const mockUser: Omit<User, 'isDeleted'> = {
            id: 1,
            login: 'mockUser@mock.com',
            password: 'mockPassword',
            age: 30,
        };
        mockUsersServiceGetByLogin.mockResolvedValueOnce(mockUser);

        await create(mockReq, mockRes);

        expect(mockContainerGet).toHaveBeenCalledTimes(1);
        expect(mockContainerGet).toHaveBeenCalledWith(UsersService);
        expect(mockUsersServiceGetByLogin).toHaveBeenCalledTimes(1);
        expect(mockUsersServiceGetByLogin).toHaveBeenCalledWith(mockReq.body.login);
        expect(mockUsersServiceCreate).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).not.toHaveBeenCalled();
        expect(mockRes.json).toHaveBeenCalledTimes(1);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "A user with the same login already exists." });
    });
});