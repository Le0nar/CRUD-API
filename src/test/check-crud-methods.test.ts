import request from 'supertest';
import { API_USERS_URL, server } from '../index';
import { IUser } from '../users/users.interface';
import { testUserData } from './constants';

const CHANGED_USERNAME = "Vasya"

describe('Check CRUD methods', () => {
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
        const res = await request(server)
            .delete(`${API_USERS_URL}/${testUserId}`)

        expect(res.statusCode).toBe(204)
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
