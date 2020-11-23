import UsersService from '../../../services/users.service';
import { limit } from '../../../routers/handlers';
import { User } from '../../../models/user';
import { Container } from 'typedi';

jest.mock('../../../services/users.service');
jest.mock('typedi');

describe('User controller - limit tests', () => {
    const mockUsersService = new UsersService({} as any);
    const mockContainerGet = Container.get as jest.MockedFunction<typeof Container.get>;

    mockContainerGet.mockReturnValue(mockUsersService);

    const mockUsersServiceAutoSuggest = mockUsersService.autoSuggest as jest.MockedFunction<typeof mockUsersService.autoSuggest>;

    const mockRes = { json: jest.fn() } as any;
    const mockUsers = [
        {
            id: 1,
            login: 'mock@test.com',
            password: 'mockPassword',
            age: 30,
        },
        {
            id: 2,
            login: 'mock2@test.com',
            password: 'mockPassword',
            age: 21,
        }
    ];

    afterEach(() => {
        mockUsersServiceAutoSuggest.mockClear();
        mockContainerGet.mockClear();
        mockRes.json.mockClear();
    });

    [
        { params: { login: 1 }, query: { limit: 3 } },
        { params: { login: 1 }, query: {} }
    ].forEach((mockReq: any) => {
        it('should return 204 status if user is deleted', async () => {
            mockUsersServiceAutoSuggest.mockResolvedValueOnce(mockUsers);

            await limit(mockReq, mockRes);

            expect(mockContainerGet).toHaveBeenCalledTimes(1);
            expect(mockContainerGet).toHaveBeenCalledWith(UsersService);
            expect(mockUsersServiceAutoSuggest).toHaveBeenCalledTimes(1);
            expect(mockUsersServiceAutoSuggest).toHaveBeenCalledWith(mockReq.params.login, mockReq.query.limit);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
        });
    });
});