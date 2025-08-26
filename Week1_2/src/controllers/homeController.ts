import { Request, Response } from 'express';
import CRUDService from '../services/CRUDService';

const getHomePage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await CRUDService.getAllUser();
        console.log('Data fetched for homePage:', data);
        res.render('homePage.ejs', {
            data: JSON.stringify(data)
        });
        return res.status(200);
    } catch (e) {
        console.error(e);
        return res.status(500).send('Internal Server Error');
    }
};

const getCRUD = (req: Request, res: Response): Response => {
    res.render('crud.ejs');
    return res.status(200);
};

const postCRUD = async (req: Request, res: Response): Promise<Response> => {
    const message = await CRUDService.createNewUser(req.body);
    console.log('Post CRUD message:', message);
    return res.send('post crud from server');
};

const displayCRUD = async (req: Request, res: Response): Promise<Response> => {
    try {
        const dataTable = await CRUDService.getAllUser();
        res.render('displayCRUD.ejs', {
            dataTable: dataTable
        });
        return res.status(200);
    } catch (e) {
        console.error(e);
        return res.status(500).send('Internal Server Error');
    }
};

const getEditCRUD = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.query.id as string;
    if (userId) {
        const userData = await CRUDService.getUserInfoById(userId);
        console.log('Data fetched for editCRUD:', userData);
        res.render('editCRUD.ejs', {
            userData: userData || {}
        });
        return res.status(200);
    } else {
        return res.send('User not found!');
    }
};

const putCRUD = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = req.body;
        const allUsers = await CRUDService.updateUserData(data);
        console.log("data::::::::::", data);
        
        res.render('displayCRUD.ejs', {
            dataTable: allUsers
        });
        return res.status(200);
    } catch (e) {
        console.error(e);
        return res.status(500).send('Internal Server Error');
    }
};

const deleteCRUD = async (req: Request, res: Response): Promise<Response> => {
    const id = req.query.id as string;
    if (id) {
        const result = await CRUDService.deleteUserById(id);
        console.log('Delete result:', result);
        return res.send('Delete the user succeed!');
    } else {
        return res.send('User not found!');
    }
};

export {
    getHomePage,
    getCRUD,
    postCRUD,
    displayCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD
};