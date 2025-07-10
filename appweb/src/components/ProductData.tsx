import { useState, useEffect } from 'react';
import { Table, Input, Button, Modal, Form, message, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export default function ProductData() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      const initialProducts: Product[] = [
        {
          id: 1,
          name: 'Teclado inalámbrico',
          description: 'Teclado mecánico bluetooth',
          price: 599.99,
          quantity: 10,
        },
        {
          id: 2,
          name: 'Mouse óptico',
          description: 'Mouse ergonómico con cable',
          price: 299.99,
          quantity: 25,
        },
      ];
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  const saveToLocalStorage = (data: Product[]) => {
    setProducts(data);
    localStorage.setItem('products', JSON.stringify(data));
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsCreating(true);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsCreating(false);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '¿Eliminar este producto?',
      onOk: () => {
        const updated = products.filter((p) => p.id !== id);
        saveToLocalStorage(updated);
        message.success('Producto eliminado');
      },
    });
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const newProduct: Product = {
        id: isCreating ? Date.now() : (selectedProduct?.id ?? Date.now()),
        ...values,
      };

      if (isCreating) {
        saveToLocalStorage([...products, newProduct]);
        message.success('Producto creado');
      } else {
        const updated = products.map((p) =>
          p.id === newProduct.id ? newProduct : p
        );
        saveToLocalStorage(updated);
        message.success('Producto actualizado');
      }

      setIsModalVisible(false);
    });
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns: ColumnsType<Product> = [
    { title: 'Nombre', dataIndex: 'name', key: 'name' },
    { title: 'Descripción', dataIndex: 'description', key: 'description' },
    { title: 'Precio', dataIndex: 'price', key: 'price' },
    { title: 'Cantidad', dataIndex: 'quantity', key: 'quantity' },
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
          placeholder="Buscar producto"
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>
          Crear Producto
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 5 }}
        rowKey="id"
      />

      <Modal
        title={isCreating ? 'Crear Producto' : 'Editar Producto'}
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
            rules={[{ required: true, message: 'Nombre requerido' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ required: true, message: 'Descripción requerida' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Precio"
            rules={[{ required: true, type: 'number', message: 'Precio requerido' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder="Ingresa el precio"
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Cantidad"
            rules={[{ required: true, type: 'number', message: 'Cantidad requerida' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder="Ingresa la cantidad"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
