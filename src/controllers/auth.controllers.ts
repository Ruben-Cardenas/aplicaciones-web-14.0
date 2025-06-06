import { Request, Response } from 'express';
import { generateAccessToken } from '../utils/generateToken';
import { cache } from '../utils/cache';
import dayjs from 'dayjs';
import { User } from '../models/user';
import { encryptionPassword } from '../utils/encryptionPassword';
import { userInfo } from 'os';
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
    user.role = role;
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




