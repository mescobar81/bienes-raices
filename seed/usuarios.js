import bcrypt from 'bcrypt';

const usuarios = [
    {
        nombre:'Miguel',
        email:'angel.me81@gmail.com',
        confirmado:1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios;