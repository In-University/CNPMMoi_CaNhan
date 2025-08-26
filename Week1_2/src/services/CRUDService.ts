import db from '..//models/index.ts'; 
import { User } from '../models/user.ts';

type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  phoneNumber?: string;
  gender?: string | number;
  roleid?: string | number;
};

export async function createNewUser(data: CreateUserInput): Promise<string> {
  await db.User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    address: data.address,
    phoneNumber: data.phoneNumber,
    gender: data.gender,
    roleid: data.roleid
  });
  return 'ok! create a new user succeed!';
}

export async function getAllUser(): Promise<any[]> {
  return db.User.findAll({ raw: true });
}

export async function getUserInfoById(userId: string | number): Promise<any> {
  const user = await db.User.findOne({ where: { id: userId }, raw: true });
  return user ?? {};
}

export async function updateUserData(data: any): Promise<any[]> {
  console.log('=== UPDATE USER DATA START ===');
  console.log('Input data:', data);
  
  // Sử dụng update method thay vì assignment
  const [updatedRowsCount] = await db.User.update(
    {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      address: data.address,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      roleid: data.roleid,
    },
    {
      where: { id: data.id }
    }
  );

  console.log(`=== UPDATE RESULT ===`);
  console.log(`Updated ${updatedRowsCount} row(s)`);

  if (updatedRowsCount === 0) {
    console.log('No rows were updated - user might not exist');
    return [];
  }

  // Lấy user đã update để kiểm tra
  const updatedUser = await db.User.findOne({ where: { id: data.id }, raw: true });
  console.log('=== UPDATED USER ===');
  console.log('Updated user:', updatedUser);

  const allUsers = await db.User.findAll({ raw: true });
  console.log('=== ALL USERS AFTER UPDATE ===');
  console.log('Total users count:', allUsers.length);
  console.log('=== UPDATE USER DATA END ===');
  
  return allUsers;
}

export async function deleteUserById(userId: string | number): Promise<string> {
  const user = await db.User.findOne({ where: { id: userId } });
  if (!user) return 'User not found!';
  await user.destroy();
  return 'Delete user succeed!';
}

const CRUDService = { createNewUser, getAllUser, getUserInfoById, updateUserData, deleteUserById };
export default CRUDService;
