import { IUser } from "./users.interface"

const firstUser: IUser = {
    username: 'Kate',
    age: 22,
    hobbies: ['chill'],
    id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
}
class UsersController {
    private _users: IUser[] = [firstUser]

    private _setUsers(updatedUserList: IUser[]): void {
        this._users = updatedUserList
    }

    get users(): IUser[] {
        return this._users
    }

    getUser(id: string): IUser | null {
        const user = this.users.find((user) => user.id === id)
        return user ?? null
    }
}

export const usersController = new UsersController()