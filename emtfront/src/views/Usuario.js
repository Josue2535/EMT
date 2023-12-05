// src/views/UsuarioCrud.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Select, Checkbox } from 'antd';
import { useKeycloak } from '@react-keycloak/web';

const { Option } = Select;

const Usuario = () => {
  const { keycloak } = useKeycloak();
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('https://localhost:7208/api/User', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener usuarios: ${response.statusText}`);
      }

      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al obtener la lista de usuarios', error);
      message.error('Error al obtener la lista de usuarios');
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [keycloak.token]); // Agrega keycloak.token como dependencia para que se vuelva a cargar cuando cambie el token

  const handleCreate = () => {
    setEditingUser(null);
    setModalVisible(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`https://localhost:7208/api/User/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar usuario: ${response.statusText}`);
      }

      message.success('Usuario eliminado exitosamente');
      fetchUsuarios();
    } catch (error) {
      console.error('Error al eliminar el usuario', error);
      message.error('Error al eliminar el usuario');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const url = editingUser ? `https://localhost:7208/api/User/${editingUser.id}` : 'https://localhost:7208/api/User';
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Error al ${editingUser ? 'actualizar' : 'crear'} usuario: ${response.statusText}`);
      }

      message.success(`Usuario ${editingUser ? 'actualizado' : 'creado'} exitosamente`);
      setModalVisible(false);
      fetchUsuarios();
    } catch (error) {
      console.error(`Error al ${editingUser ? 'actualizar' : 'crear'} el usuario`, error);
      message.error(`Error al ${editingUser ? 'actualizar' : 'crear'} el usuario`);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre de Usuario', dataIndex: 'userName', key: 'userName' },
    { title: 'Fecha de Creación', dataIndex: 'created', key: 'created' },
    { title: 'Habilitado', dataIndex: 'isEnabled', key: 'isEnabled', render: (isEnabled) => isEnabled ? 'Sí' : 'No' },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      key: 'acciones',
      render: (_, record) => (
        <>
          <Button type="primary" size="small" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Button type="danger" size="small" onClick={() => handleDelete(record.id)} style={{ marginLeft: '8px' }}>
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Usuarios</h2>
      <Button type="primary" onClick={handleCreate} style={{ marginBottom: '16px' }}>
        Crear Usuario
      </Button>
      <Table dataSource={usuarios} columns={columns} rowKey="id" />

      <Modal
        title={editingUser ? 'Editar Usuario' : 'Crear Usuario'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical" name="usuario_form">
          <Form.Item name="userName" label="Nombre de Usuario" rules={[{ required: true, message: 'Por favor ingrese el nombre de usuario' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="isEnabled" label="Habilitado" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          {/* Otras propiedades como "created" y "id" se asignan automáticamente en el backend */}
        </Form>
      </Modal>
    </div>
  );
};

export default Usuario;
