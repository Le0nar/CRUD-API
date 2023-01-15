import request from 'supertest';
import { API_USERS_URL, server } from '../index';
import { IUser } from '../users/users.interface';
import { testUserData } from './constants';
import { v4 as uuidv4 } from "uuid";

const CHANGED_USERNAME = "Vasya"
const WRONG_URL = "/users"

describe('Check crud methods: first case', () => {
    let testUserId: string = ''
    test('Create user', async () => {
        const res = await request(server)
            .post(API_USERS_URL)
            .send(testUserData)
            .set('Content-Type', 'application/json')
            .expect(201)

        const { user } = res.body

        expect(typeof user.id).toBe('string')
        expect(user.username).toBe(testUserData.username)
        expect(user.age).toBe(testUserData.age)
        expect(user.hobbies).toEqual(testUserData.hobbies)

        testUserId = user.id
    });

    test('Get all users after create user', async () => {
        const res = await request(server)
            .get(API_USERS_URL)
            .expect(200)

        const { users } = res.body

        expect(users.length).toBe(1)
    });

    test("Change name of user", async () => {
        const changedUserData: IUser = JSON.parse(JSON.stringify(testUserData))
        changedUserData.username = CHANGED_USERNAME

        const res = await request(server)
            .put(`${API_USERS_URL}/${testUserId}`)
            .send(changedUserData)
            .set('Content-Type', 'application/json')
            .expect(200)

        const user = res.body

        expect(user.username).not.toBe(testUserData.username)
    })

    test("Get user by id", async () => {
        const res = await request(server)
            .get(`${API_USERS_URL}/${testUserId}`)
            .expect(200)


        const { user } = res.body

        expect(typeof user.id).toBe('string')
        expect(user.username).toBe(CHANGED_USERNAME)
        expect(user.age).toBe(testUserData.age)
        expect(user.hobbies).toEqual(testUserData.hobbies)
    })

    test("Delete user by id", async () => {
        await request(server)
            .delete(`${API_USERS_URL}/${testUserId}`)
            .expect(204)
    })

    test('Get all users after delete user', async () => {
        const res = await request(server)
            .get(API_USERS_URL)
            .expect(200)

        const { users } = res.body

        expect(users.length).toBe(0)
    })

    afterAll(done => {
        server.close()
        done()
    })
})

describe('Check crud methods: second case', () => {
    const randomId = uuidv4()

    test('Create user with wrong url', async () => {
        await request(server)
            .post(WRONG_URL)
            .send(testUserData)
            .set('Content-Type', 'application/json')
            .expect(404)
    });

    test("Change user with not existed id", async () => {
        const changedUserData: IUser = JSON.parse(JSON.stringify(testUserData))
        changedUserData.username = CHANGED_USERNAME

        await request(server)
            .put(`${API_USERS_URL}/${randomId}`)
            .send(changedUserData)
            .set('Content-Type', 'application/json')
            .expect(404)
    })

    test("Delete user by not existed id", async () => {
        await request(server)
            .delete(`${API_USERS_URL}/${randomId}`)
            .expect(404)
    })

    test("Get user by not existed id", async () => {
        await request(server)
            .get(`${API_USERS_URL}/${randomId}`)
            .expect(404)
    })

    test("Get data from not existed url", async () => {
        await request(server)
            .get(WRONG_URL)
            .expect(404)
    })

    test("Get all users", async () => {
        const res = await request(server)
            .get(API_USERS_URL)
            .expect(200)

        const { users } = res.body

        expect(users.length).toBe(0)
    })

    afterAll(done => {
        server.close()
        done()
    })
})

describe("Check crud methods: third case", () => {
    const LAST_CREATED_USERNAME = "Egor"

    test("Create 3 users", async () => {
        await request(server)
            .post(API_USERS_URL)
            .send(testUserData)
            .set('Content-Type', 'application/json')
            .expect(201)

        await request(server)
            .post(API_USERS_URL)
            .send({ ...testUserData, username: "Kate" })
            .set('Content-Type', 'application/json')
            .expect(201)

        await request(server)
            .post(API_USERS_URL)
            .send({ ...testUserData, username: "Stepan" })
            .set('Content-Type', 'application/json')
            .expect(201)
    })

    test("Get 3 users", async () => {
        const res = await request(server)
            .get(API_USERS_URL)
            .expect(200)

        const { users } = res.body

        expect(users.length).toBe(3)
    })

    test("Create 2 users", async () => {
        await request(server)
            .post(API_USERS_URL)
            .send({ ...testUserData, username: "Roma" })
            .set('Content-Type', 'application/json')
            .expect(201)

        await request(server)
            .post(API_USERS_URL)
            .send({ ...testUserData, username: LAST_CREATED_USERNAME })
            .set('Content-Type', 'application/json')
            .expect(201)
    })

    test("Delete last user", async () => {
        const res = await request(server)
            .get(API_USERS_URL)
            .expect(200)

        const { users } = res.body
        const lastUserId = users[users.length - 1].id

        await request(server)
            .delete(`${API_USERS_URL}/${lastUserId}`)
            .expect(204)
    })

    test("Check is last user deleted", async () => {
        const res = await request(server)
            .get(API_USERS_URL)
            .expect(200)

        const { users } = res.body
        const lastCreatedUser = users.find(({ username }: IUser) => username === LAST_CREATED_USERNAME)

        expect(users.length).toBe(4)
        expect(lastCreatedUser).toBe(undefined)
    })

    test("Get user data of first created user", async () => {
        const res = await request(server)
            .get(API_USERS_URL)
            .expect(200)

        const { users } = res.body
        const firstUserId = users[0].id

        const userRes = await request(server)
            .get(`${API_USERS_URL}/${firstUserId}`)
            .expect(200)

        const { user } = userRes.body

        expect(typeof user.id).toBe('string')
        expect(user.username).toBe(testUserData.username)
        expect(user.age).toBe(testUserData.age)
        expect(user.hobbies).toEqual(testUserData.hobbies)
    })
})