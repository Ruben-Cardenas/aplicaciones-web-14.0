import React from 'react';
import { Button, Checkbox, Form, Input, Select, message } from 'antd';
import type { FormProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Login.css';

const { Option } = Select;

interface FieldType {
  userName: string;
  password: string;
  remember: boolean;
  role: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.userName, // <-- aquí el cambio importante
          password: values.password,
          role: values.role,
        }),
      });

      if (!response.ok) throw new Error('Error en la autenticación');

      const data = await response.json();
      console.log('✅ Login correcto:', data);

      login(data.accessToken, data.selectedRole);
      message.success('Inicio de sesión exitoso');

      // Redirigir según rol
      if (data.selectedRole === 'administrador') {
        navigate('/users');
      } else {
        navigate('/dashboard');
      }

      form.resetFields();
    } catch (error) {
      console.error('❌ Error al iniciar sesión:', error);
      message.error('⚠️ Usuario, contraseña o rol incorrectos');
    }
  };

  return (
    <div className="login-container">
      <Form
        form={form}
        name="login-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, margin: '100px auto' }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <h2 className="login-title">Bienvenido</h2>
        <p className="login-subtitle">Inicia sesión para continuar</p>

        <Form.Item<FieldType>
          label="Usuario"
          name="userName"
          rules={[{ required: true, message: 'Por favor ingrese su usuario' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          label="Rol"
          name="role"
          rules={[{ required: true, message: 'Por favor seleccione su rol' }]}
        >
          <Select placeholder="Selecciona tu rol">
            <Option value="administrador">Administrador</Option>
            <Option value="user">Cliente</Option>
            <Option value="usuario">Usuario</Option>
          </Select>
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Recordarme</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" block>
            Iniciar Sesión
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
