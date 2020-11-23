import UsersService from '../../../services/users.service';
import { getById } from '../../../routers/handlers';
import { User } from '../../../models/user';
import { Container } from 'typedi';

jest.mock('../../../services/users.service');
jest.mock('typedi');

describe('User controller - getById tests', () => {
    const mockUsersService = new UsersService({} as any);
    const mockContainerGet = Container.get as jest.MockedFunction<typeof Container.get>;

    describe('getById', () => {
        mockContainerGet.mockReturnValue(mockUsersService);

        const mockUsersServiceGetById = mockUsersService.getById as jest.MockedFunction<typeof mockUsersService.getById>;

        const mockReq = { params: { id: 1 } } as any;
        const mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        } as any;

        afterEach(() => {
            mockUsersServiceGetById.mockClear();
            mockContainerGet.mockClear();
            mockRes.json.mockClear();
            mockRes.status.mockClear();
        });

        it('should return json response with user', async () => {
            const mockUser: Omit<User, 'isDeleted'> = {
                id: 1,
                login: 'mock@test.com',
                password: 'mockPassword',
                age: 30,
            };
            mockUsersServiceGetById.mockResolvedValueOnce(mockUser);

            await getById(mockReq, mockRes);

            expect(mockContainerGet).toHaveBeenCalledTimes(1);
            expect(mockContainerGet).toHaveBeenCalledWith(UsersService);
            expect(mockUsersServiceGetById).toHaveBeenCalledTimes(1);
            expect(mockUsersServiceGetById).toHaveBeenCalledWith(mockReq.params.id);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith(mockUser);
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it('should return json response with 400 error and error object', async () => {
            mockUsersServiceGetById.mockResolvedValueOnce(undefined);

            await getById(mockReq, mockRes);

            expect(mockContainerGet).toHaveBeenCalledTimes(1);
            expect(mockContainerGet).toHaveBeenCalledWith(UsersService);
            expect(mockUsersServiceGetById).toHaveBeenCalledTimes(1);
            expect(mockUsersServiceGetById).toHaveBeenCalledWith(mockReq.params.id);
            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "A user with that id does not exist." });
        });
    });
});