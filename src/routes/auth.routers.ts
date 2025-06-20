import { Router } from "express";
import { createProduct, deleteOrder, deleteProduct, deleteUser, getAllOrders, getAllProducts, getAllUsers, getTimeToken, getUserByusername, login, saveOrder, saveUser, updateOrder, updateProduct, UpdateToken, updateUser } from "../controllers/auth.controllers";

const router = Router();
router.post('/login-user', login);
router.get('/getTime/:userId', getTimeToken);
router.patch('/update/:userId', UpdateToken);
router.get('/users',getAllUsers);
router.post('/users',saveUser);
router.get('/users/name/:userName',getUserByusername);
router.patch('/users/:id',updateUser);
router.delete('/users/:id',deleteUser)
router.post('/order',saveOrder);
router.patch('/orders/:orderId', updateOrder);
router.delete('/orders/:orderId', deleteOrder);
router.get('/orders', getAllOrders);
router.get('/products', getAllProducts);                  
router.post('/products', createProduct);                  
router.patch('/products/:productId', updateProduct);      
router.delete('/products/:productId', deleteProduct); 

export default router;

