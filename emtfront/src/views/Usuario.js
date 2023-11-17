// src/views/UsuarioCrud.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Select } from 'antd';
import { getUsers, createUser, updateUser, deleteUser } from '../api'; // Ajusta las funciones de la API según sea necesario

const { Option } = Select;

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsuarios = async () => {
    try {
      const data = await getUsers();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al obtener la lista de usuarios', error);
      message.error('Error al obtener la lista de usuarios');
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

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
      await deleteUser(userId);
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
      if (editingUser) {
        await updateUser(editingUser.id, values);
        message.success('Usuario actualizado exitosamente');
      } else {
        await createUser(values);
        message.success('Usuario creado exitosamente');
      }
      setModalVisible(false);
      fetchUsuarios();
    } catch (error) {
      console.error('Error al guardar el usuario', error);
      message.error('Error al guardar el usuario');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre de Usuario', dataIndex: 'username', key: 'username' },
    { title: 'Roles', dataIndex: 'roles', key: 'roles', render: (roles) => roles.join(', ') },
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
          <Form.Item name="username" label="Nombre de Usuario" rules={[{ required: true, message: 'Por favor ingrese el nombre de usuario' }]}>
            <Input />
          </Form.Item>
          
          <Form.Item name="roles" label="Roles">
            <Select mode="multiple" placeholder="Seleccione roles">
              {/* Agrega las opciones de roles según sea necesario */}
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
              {/* ... otras opciones de roles */}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Usuario;
