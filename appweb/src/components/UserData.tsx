import { useState, useEffect } from 'react';
import { Table, Input, Button, Modal, Form, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UserData() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const initialData: User[] = [
        { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
        { id: 2, name: 'María López', email: 'maria@example.com' },
        { id: 3, name: 'Carlos Ruiz', email: 'carlos@example.com' },
      ];
      setUsers(initialData);
      localStorage.setItem('users', JSON.stringify(initialData));
    }
  }, []);

  const saveToLocalStorage = (data: User[]) => {
    setUsers(data);
    localStorage.setItem('users', JSON.stringify(data));
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsCreating(false);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setIsCreating(true);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const duplicateName = users.find(
        (u) =>
          u.name.trim().toLowerCase() === values.name.trim().toLowerCase() &&
          u.id !== selectedUser?.id
      );
      if (duplicateName) {
        message.error('Ya existe un usuario con ese nombre');
        return;
      }

      const duplicateEmail = users.find(
        (u) =>
          u.email.trim().toLowerCase() === values.email.trim().toLowerCase() &&
          u.id !== selectedUser?.id
      );
      if (duplicateEmail) {
        message.error('Ya existe un usuario con ese correo');
        return;
      }

      if (isCreating) {
        const newUser: User = {
          id: Date.now(),
          ...values,
        };
        const updatedUsers = [...users, newUser];
        saveToLocalStorage(updatedUsers);
        message.success('Usuario creado exitosamente');
      } else if (selectedUser) {
        const updatedUsers = users.map((u) =>
          u.id === selectedUser.id ? { ...u, ...values } : u
        );
        saveToLocalStorage(updatedUsers);
        message.success('Usuario actualizado');
      }

      setIsModalVisible(false);
    } catch {
      // Errores ya son manejados por las reglas del formulario
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '¿Seguro que quieres borrar este usuario?',
      onOk: () => {
        const filtered = users.filter((u) => u.id !== id);
        saveToLocalStorage(filtered);
        message.success('Usuario eliminado');
      },
    });
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns: ColumnsType<User> = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            size="small"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            Editar
          </Button>
          <Button danger size="small" onClick={() => handleDelete(record.id)}>
            Borrar
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar por nombre"
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>
          Crear Usuario
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        pagination={{ pageSize: 5 }}
        rowKey="id"
      />

      <Modal
        title={isCreating ? 'Crear Usuario' : 'Editar Usuario'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre"
            rules={[
              { required: true, message: 'Nombre requerido' },
              { whitespace: true, message: 'El nombre no puede estar vacío' },
              { min: 3, message: 'El nombre debe tener al menos 3 caracteres' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Correo"
            rules={[
              { required: true, message: 'Correo requerido' },
              { type: 'email', message: 'Correo inválido' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
