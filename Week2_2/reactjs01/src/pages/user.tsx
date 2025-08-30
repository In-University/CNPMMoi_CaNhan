import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { getUserApi } from '../util/api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

const UserPage = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getUserApi();
            console.log("Res::::", res);
            if (res && Array.isArray(res)) {
                setUsers(res);
                console.log("set user in page success" + res);
            } else {
                setUsers([]); // Ensure users is always an array
            }
        };
        fetchUsers();
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>User List</h1>
            <Table dataSource={users} columns={columns} rowKey="_id" />
        </div>
    );
};

export default UserPage;
