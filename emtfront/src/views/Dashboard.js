// src/views/Dashboard.js
import React from 'react';
import { Card, Row, Col } from 'antd';

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Sección 1" style={{ marginBottom: '16px' }}>
            Contenido de la sección 1
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Sección 2" style={{ marginBottom: '16px' }}>
            Contenido de la sección 2
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Sección 3" style={{ marginBottom: '16px' }}>
            Contenido de la sección 3
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
