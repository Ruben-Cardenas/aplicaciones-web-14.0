import React from 'react';
import { Form, Input, Button } from 'antd';

const App: React.FC = () => {
  const onFinish = (values: unknown) => {
    console.log('Login exitoso con:', values);
  };

  return (
    <Form
      name="login-form"
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400, margin: '0 auto', paddingTop: '100px' }}
    >
      <Form.Item
        label="Nombre"
        name="horizontal1"
        rules={[{ required: true, message: 'Este campo es requerido' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Correo Electrónico"
        name="vertical1"
        rules={[{ required: true, message: 'Este campo es requerido' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Contraseña"
        name="vertical2"
        rules={[{ required: true, message: 'Este campo es requerido' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Confirmar Contraseña"
        name="horizontal2"
        rules={[{ required: true, message: 'Este campo es requerido' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Iniciar sesión
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
