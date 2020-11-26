import UsersService from '../../../services/users.service';
import { update } from '../../../routers/handlers/users';
import { User } from '../../../models/user';
import { Container } from 'typedi';

jest.mock('../../../services/users.service');
jest.mock('typedi');

describe('User controller - update tests', () => {
    const mockUsersService = new UsersService({} as any);
    const mockContainerGet = Container.get as jest.MockedFunction<typeof Container.get>;

    mockContainerGet.mockReturnValue(mockUsersService);

    const mockUsersServiceGetById = mockUsersService.getById as jest.MockedFunction<typeof mockUsersService.getById>;
    const mockUsersServiceUpdate = mockUsersService.update as jest.MockedFunction<typeof mockUsersService.update>;
    const mockUsersServiceGetByLogin = mockUsersService.getByLogin as jest.MockedFunction<typeof mockUsersService.getByLogin>;

    const mockReq = {
        params: { id: 1 },
        body: { login: 'mockUser@mock.com' }
    } as any;
    const mockRes = {
        json: jest.fn(),
        send: jest.fn(),
        status: jest.fn().mockReturnThis()
    } as any;

    afterEach(() => {
        mockUsersServiceGetById.mockClear();
        mockUsersServiceUpdate.mockClear();
        mockUsersServiceGetByLogin.mockClear();
        mockContainerGet.mockClear();
        mockRes.json.mockClear();
        mockRes.status.mockClear();
        mockRes.send.mockClear();
    });

    it('should return 400 status and error when user id does not exist', async () => {        
        mockUsersServiceGetById.mockResolvedValueOnce(undefined);

        await update(mockReq, mockRes);

        expect(mockContainerGet).toHaveBeenCalledTimes(1);
        expect(mockContainerGet).toHaveBeenCalledWith(UsersService);
        expect(mockUsersServiceGetById).toHaveBeenCalledTimes(1);
        expect(mockUsersServiceGetById).toHaveBeenCalledWith(mockReq.params.id);
        expect(mockUsersServiceGetByLogin).not.toHaveBeenCalled();
        expect(mockUsersServiceGetByLogin).not.toHaveBeenCalled();
        expect(mockUsersServiceUpdate).not.toHaveBeenCalled();
        expect(mockUsersServiceUpdate).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);        
        expect(mockRes.json).toHaveBeenCalledTimes(1);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "A user with that id does not exist." });
        expect(mockRes.send).not.toHaveBeenCalled();
    });

    it('should update user and return 204 status when another user with given login does not already exist', async () => {
        mockUsersServiceGetById.mockResolvedValueOnce({} as any);
        mockUsersServiceGetByLogin.mockResolvedValueOnce(undefined);

        await update(mockReq, mockRes);

        expect(mockContainerGet).toHaveBeenCalledTimes(1);
        expect(mockContainerGet).toHaveBeenCalledWith(UsersService);
        expect(mockUsersServiceGetById).toHaveBeenCalledTimes(1);
        expect(mockUsersServiceGetById).toHaveBeenCalledWith(mockReq.params.id);
        expect(mockUsersServiceGetByLogin).toHaveBeenCalledTimes(1);
        expect(mockUsersServiceGetByLogin).toHaveBeenCalledWith(mockReq.body.login);
        expect(mockUsersServiceUpdate).toHaveBeenCalledTimes(1);
        expect(mockUsersServiceUpdate).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(204);        
        expect(mockRes.json).not.toHaveBeenCalled();
        expect(mockRes.send).toHaveBeenCalledTimes(1);        
        expect(mockRes.send).toHaveBeenCalledWith();
    });

    xit('should update user and return 204 status when given login and id pertain to the same user', async () => {
        const mockUser: Omit<User, 'isDeleted'> = {
            id: 1,
            login: 'mockUser@mock.com',
            password: 'mockPassword',
            age: 30,
        };

        mockUsersServiceGetById.mockResolvedValueOnce({} as any);
        mockUsersServiceGetByLogin.mockResolvedValueOnce(mockUser);

        await update(mockReq, mockRes);

        expect(mockContainerGet).toHaveBeenCalledTimes(1);
        expect(mockContainerGet).toHaveBeenCalledWith(UsersService);
        expect(mockUsersServiceGetById).toHaveBeenCalledTimes(1);
        expect(mockUsersServiceGetById).toHaveBeenCalledWith(mockReq.params.id);
        expect(mockUsersServiceGetByLogin).toHaveBeenCalledTimes(1);
        expect(mockUsersServiceGetByLogin).toHaveBeenCalledWith(mockReq.body.login);
        expect(mockUsersServiceUpdate).toHaveBeenCalledTimes(1);
        expect(mockUsersServiceUpdate).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(204);        
        expect(mockRes.json).not.toHaveBeenCalled();
        expect(mockRes.send).toHaveBeenCalledTimes(1);        
        expect(mockRes.send).toHaveBeenCalledWith();
    });

    it('should return 400 status and error when attempting to update user login to the same login as another user', async () => {
        const mockUser: Omit<User, 'isDeleted'> = {
            id: 2,
            login: 'mockUser@mock.com',
            password: 'mockPassword',
            age: 30,
        };

        mockUsersServiceGetById.mockResolvedValueOnce({} as any);
        mockUsersServiceGetByLogin.mockResolvedValueOnce(mockUser);

        await update(mockReq, mockRes);

        expect(mockContainerGet).toHaveBeenCalledTimes(1);
        expect(mockContainerGet).toHaveBeenCalledWith(UsersService);
        expect(mockUsersServiceGetById).toHaveBeenCalledTimes(1);
        expect(mockUsersServiceGetById).toHaveBeenCalledWith(mockReq.params.id);
        expect(mockUsersServiceGetByLogin).toHaveBeenCalledTimes(1);
        expect(mockUsersServiceGetByLogin).toHaveBeenCalledWith(mockReq.body.login);
        expect(mockUsersServiceUpdate).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400); 
        expect(mockRes.json).toHaveBeenCalledTimes(1);         
        expect(mockRes.json).toHaveBeenCalledWith({ error: "A user with the same login already exists." });      
        expect(mockRes.send).not.toHaveBeenCalled();
    });
});