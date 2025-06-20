import { Request, Response } from 'express';
import { generateAccessToken } from '../utils/generateToken';
import { cache } from '../utils/cache';
import dayjs from 'dayjs';
import { User } from '../models/user';
import { encryptionPassword } from '../utils/encryptionPassword';
import { userInfo } from 'os';
import { Order } from '../models/Order';
import { Product } from '../models/product';





//Endpoint recibe un request, responde un response
export const login =async (req:Request, res:Response)=> {
    //asignar tipo de dato despues  de:
    //inicializar la variable despues del =
    let number:number = 1;

    /*dentro del body del request buscar las variables
    de username y password*/
    const { username , password } = req.body;

    const user = await User.findOne({ username});

    if (!user) {
        return res.status(404).json({
            message: 'Credenciales Incorrectas'
        });
    }

    if (password !== user.password) {
        return res.status(401).json({
            message: 'Credenciales Incorrectas'
        });
    }

    //const accessToken = generateAccessToken(user.id.toString());

    if (username !== 'admin' || password !== '12345') {
        return res.status(401).json({
            message: 'Credenciales Incorrectas'
        });
    }

    const userId = "123456789"
    const accessToken = generateAccessToken(userId);

    cache.set (userId,accessToken,60 * 15)
    return res.json ({
        message: "Login exitoso",
        accessToken

    })

}   

export const getTimeToken = (req: Request, res: Response) => {
    //const userId = "123456789";
    const {userId} = req.params;
    const ttl = cache.getTtl(userId);
    
    if (!ttl){
        return res.status(404).json({
            message: "Token no encontrado"});

    }

    const now = Date.now();
    const timeTolifeSeconds = Math.floor((ttl - now) / 1000);

    const expTime = dayjs(ttl).format('HH:mm:ss');
    return res.json({
        message: "Tiempo de vida del token",
        timeTolifeSeconds,
        expTime
    });
}


// La función dayjs ya no es necesaria porque se importa la librería dayjs


export const UpdateToken = (req: Request, res: Response) => {
    const {userId} = req.params;
    const ttl = cache.getTtl(userId);
    
    if (!ttl){
        return res.status(404).json({
            message: "Token no encontrado"});

    }
    const newTime : number = 60 * 15;
    cache.ttl(userId, newTime);//actualiza tiempo de vida del token;

    return res.json({message: "Actualizacion exitosa"});

}


export const getAllUsers =async (req:Request, res:Response)=>{
    const userList=await User.find(); //Para encontrar todos los registros
    return res.json({userList})
}


export const getUserByusername = async (req: Request , res:Response) => {
    const { userName } = req.params;
    console.log(userName)
    const UserByusername = await User.find ({username: userName});
    
    if (!UserByusername) {
        return res.status(404).json ({massege: "Usuario no encontrado"})
    }
    return res.json({UserByusername})
}



export const saveUser = async (req: Request, res: Response) => {
    try {
        const {fullname, userName, email, phone, password, role} = req.body;

        const newUser = new User ({
            name: fullname,
            username: userName,
            email,
            phone,
            password,
            role,
            status : true
        });

        const savedUser = await newUser.save();
        return res.json(savedUser);
    } catch (error) {
        return res.status(500).json({ message: "Error al guardar el usuario", error });
    }
}



export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { emailUser, phone, password, role, name } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "No existe este usuario" });
    }

    const userEmail = await User.find({ emailuser: emailUser }); //Buscamos si existe un usuario con el mismo email
    const newPassword = await encryptionPassword(password); //Mandamos a llamar la funcion para encriptar la contraseña y lo guardamos en una variable

    if (userEmail && userEmail.length > 0) {
      return res.status(426).json({ message: "El email debe ser unico" });
    }

    user.name = name;
    user.email = emailUser;
    user.password = password != null ? newPassword : user.password; //Estabamos evaluando directamente el registro en lugar de lo que mandabamos al body
    user.roles = role;
    user.phone = phone;
     

    const updateUser = await user.save();

    return res.json({ updateUser });
  } catch (e) {
    console.log(e);
  }
};


export const deleteUser = async (req: Request, res: Response) => {
   const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "No existe este usuario" });
    }
    user.status = false; //Deshabilitar el usuario
    user.deleteDate = new Date(); //Fecha de eliminacion
    const deletedUser = await user.save();

    return res.json({
        message: "Usuario eliminado correctamente",deletedUser
    });
} 

export const saveOrder = async (req: Request, res: Response) => {
  try {
    const {
      createdBy,
      total,
      subtotal,
      status,
      products
    } = req.body;

    const newOrder = new Order({
      createdBy,
      total,
      subtotal,
      status,
      products,
      creationDate: new Date(),
      updateDate: undefined
    });

    const savedOrder = await newOrder.save();
    return res.json(savedOrder);
  } catch (error) {
    return res.status(500).json({ message: "Error al guardar la orden", error });
  }
}; 




export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "No existe esta orden" });
    }

    order.status = "cancelada"; // Cambiar el estado
    order.updateDate = new Date(); // Fecha de actualización

    const deletedOrder = await order.save();

    return res.json({
      message: "Orden cancelada correctamente",
      deletedOrder
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al cancelar la orden", error });
  }
};


export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { total, subtotal, status, products } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "No existe esta orden" });
    }

    order.total = total ?? order.total;
    order.subtotal = subtotal ?? order.subtotal;
    order.status = status ?? order.status;
    order.products = products ?? order.products;
    order.updateDate = new Date();

    const updatedOrder = await order.save();

    return res.json({ message: "Orden actualizada correctamente", updatedOrder });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar la orden", error });
  }
};
  

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ status: { $ne: 'eliminado' } });
    return res.json(orders);
  } catch (error) {
    console.error("Error al obtener las órdenes activas:", error);
    return res.status(500).json({
      message: "Error al obtener las órdenes activas",
      error: error instanceof Error ? error.message : error
    });
  }
};



export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, quantity } = req.body;
    const newProduct = new Product({ name, price, description, quantity, status: true });
    const savedProduct = await newProduct.save();
    return res.json(savedProduct);
  } catch (error) {
    return res.status(500).json({ message: "Error al guardar el producto", error });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find(); 
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos", error });
  }
};


export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { name, price, description, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.quantity = quantity ?? product.quantity;

    const updatedProduct = await product.save();
    return res.json({ message: "Producto actualizado correctamente", updatedProduct });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar el producto", error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    product.status = false; 
    const deletedProduct = await product.save();

    return res.json({ message: "Producto dado de baja correctamente", deletedProduct });
  } catch (error) {
    return res.status(500).json({ message: "Error al dar de baja el producto", error });
  }
};


