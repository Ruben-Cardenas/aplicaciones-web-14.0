import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import MenuDynamic from './menuDynamic';

const { Sider, Content } = Layout;

const Dashboard: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <MenuDynamic />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px', background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
