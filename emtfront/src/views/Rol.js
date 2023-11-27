import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Table, Space, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';

const { Option } = Select;

const Rol = () => {
  const { keycloak } = useKeycloak();
  const [roles, setRoles] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('https://localhost:7208/api/Role', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener roles: ${response.statusText}`);
        }

        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error al obtener roles:', error);
      }
    };

    fetchRoles();
  }, [keycloak.token]);

  const showModal = (role) => {
    setEditingRole(role);
    form.setFieldsValue(role);
    setVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const url = 'https://localhost:7208/api/Role';
      const method = editingRole ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify({
          Name: form.getFieldValue('name'),
          ValidFields: form.getFieldValue('validFields').map((field) => ({
            Name: field.name,
            Value: JSON.stringify({ key: 'value' }),  // Modificar esta línea según tus necesidades
          })),
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error al ${editingRole ? 'editar' : 'crear'} el rol: ${response.statusText}`);
      }
  
      const updatedRoles = await response.json();
      setRoles(updatedRoles);
  
      form.resetFields();
      setEditingRole(null);
      setVisible(false);
    } catch (error) {
      console.error(`Error al ${editingRole ? 'editar' : 'crear'} el rol:`, error);
    }
  };
  
  

  const handleDelete = async (id) => {
    try {
      const url = `https://localhost:7208/api/Role/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el rol: ${response.statusText}`);
      }

      const updatedRoles = roles.filter((role) => role.id !== id);
      setRoles(updatedRoles);
    } catch (error) {
      console.error('Error al eliminar el rol:', error);
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Roles</h2>
      <Button type="primary" onClick={() => showModal(null)}>
        Crear Rol
      </Button>
      <Table dataSource={roles} columns={columns} rowKey="id" />

      <Modal
        title={editingRole ? 'Editar Rol' : 'Crear Rol'}
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => {
          form.resetFields();
          setEditingRole(null);
          setVisible(false);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Nombre" name="name" rules={[{ required: true, message: 'Por favor, ingresa el nombre del rol' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Campos Válidos"
            name="validFields"
            style={{ maxHeight: '200px', overflow: 'auto' }}
          >
            <Form.List name="validFields">
              {(fields, { add, remove }) => (
                <div>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <div key={key} style={{ marginBottom: '8px' }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        fieldKey={[fieldKey, 'name']}
                        rules={[{ required: true, message: 'Ingrese el nombre del campo válido' }]}
                      >
                        <Input placeholder="Nombre del Campo" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        fieldKey={[fieldKey, 'value']}
                        rules={[{ required: true, message: 'Seleccione al menos una acción' }]}
                        style={{ display: 'inline-block', marginLeft: '8px', width: '200px' }}
                      >
                        <Select mode="multiple" placeholder="Seleccione acciones" style={{ width: '100%', overflow: 'auto' }}>
                          <Option value="post">post</Option>
                          <Option value="put">put</Option>
                          <Option value="delete">delete</Option>
                          <Option value="get">get</Option>
                        </Select>
                      </Form.Item>
                      <Button type="link" onClick={() => remove(name)} icon={<DeleteOutlined />} />
                    </div>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} icon={<EditOutlined />}>
                      Agregar Campo Válido
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Rol;
