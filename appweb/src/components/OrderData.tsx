import { useState, useEffect } from 'react';
import { Table, Input, Button, Modal, Form, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface OrderProduct {
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  createdBy: string;
  subtotal: number;
  total: number;
  status: string;
  products: OrderProduct[];
}

export default function OrderData() {
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    } else {
      const initialOrders: Order[] = [
        {
          id: 1,
          createdBy: 'admin',
          subtotal: 100,
          total: 120,
          status: 'pendiente',
          products: [
            { productId: '1', quantity: 2, price: 50 },
          ],
        },
        {
          id: 2,
          createdBy: 'juan',
          subtotal: 200,
          total: 230,
          status: 'completado',
          products: [
            { productId: '2', quantity: 4, price: 50 },
          ],
        },
      ];
      setOrders(initialOrders);
      localStorage.setItem('orders', JSON.stringify(initialOrders));
    }
  }, []);

  const saveToLocalStorage = (data: Order[]) => {
    setOrders(data);
    localStorage.setItem('orders', JSON.stringify(data));
  };

  const handleAdd = () => {
    setSelectedOrder(null);
    setIsCreating(true);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsCreating(false);
    form.setFieldsValue(order);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '¿Eliminar esta orden?',
      onOk: () => {
        const updated = orders.filter((o) => o.id !== id);
        saveToLocalStorage(updated);
        message.success('Orden eliminada');
      },
    });
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const newOrder: Order = {
        id: isCreating ? Date.now() : (selectedOrder?.id ?? Date.now()),
        products: [],
        ...values,
      };

      if (isCreating) {
        const updatedOrders = [...orders, newOrder];
        saveToLocalStorage(updatedOrders);
        message.success('Orden creada');
      } else {
        const updatedOrders = orders.map((o) =>
          o.id === newOrder.id ? newOrder : o
        );
        saveToLocalStorage(updatedOrders);
        message.success('Orden actualizada');
      }

      setIsModalVisible(false);
    });
  };

  const filtered = orders.filter((o) =>
    o.createdBy.toLowerCase().includes(search.toLowerCase())
  );

  const columns: ColumnsType<Order> = [
    { title: 'Creado por', dataIndex: 'createdBy', key: 'createdBy' },
    { title: 'Subtotal', dataIndex: 'subtotal', key: 'subtotal' },
    { title: 'Total', dataIndex: 'total', key: 'total' },
    { title: 'Estado', dataIndex: 'status', key: 'status' },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
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
          placeholder="Buscar por creador"
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>Crear Orden</Button>
      </div>

      <Table columns={columns} dataSource={filtered} pagination={{ pageSize: 5 }} rowKey="id" />

      <Modal
        title={isCreating ? 'Crear Orden' : 'Editar Orden'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="createdBy"
            label="Creado por"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="subtotal"
            label="Subtotal"
            rules={[{ required: true, message: 'Subtotal requerido' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="total"
            label="Total"
            rules={[{ required: true, message: 'Total requerido' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Estado"
            rules={[{ required: true, message: 'Estado requerido' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
