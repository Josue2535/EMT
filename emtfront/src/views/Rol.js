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
  const [editingRole, setEditingRole] = useState(null); // Nuevo estado para el rol en edición

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
    setEditingRole(role); // Establece el rol en edición al abrir el modal
    form.setFieldsValue(role); // Rellena el formulario con los datos del rol en edición
    setVisible(true);
  };

  const handleCreateEdit = () => {
    const editedRole = form.getFieldsValue();

    if (editingRole) {
      // Si está editando un rol, actualiza el estado con la versión editada
      const updatedRoles = roles.map((role) =>
        role.id === editingRole.id ? { ...role, ...editedRole } : role
      );
      setRoles(updatedRoles);
    } else {
      // Si no está editando, agrega el nuevo rol al estado
      setRoles([...roles, editedRole]);
    }

    setEditingRole(null); // Limpia el rol en edición
    setVisible(false);
  };

  const handleDelete = (id) => {
    const updatedRoles = roles.filter((role) => role.id !== id);
    setRoles(updatedRoles);
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
        onOk={handleCreateEdit}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Nombre" name="name" rules={[{ required: true, message: 'Por favor, ingresa el nombre del rol' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Campos Válidos" name="validFields">
            <Form.List name="validFields">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
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
                      >
                        <Select mode="multiple" placeholder="Seleccione acciones">
                          <Option value="post">post</Option>
                          <Option value="put">put</Option>
                          <Option value="delete">delete</Option>
                          <Option value="get">get</Option>
                        </Select>
                      </Form.Item>
                      <Button type="link" onClick={() => remove(name)} icon={<DeleteOutlined />} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} icon={<EditOutlined />}>
                      Agregar Campo Válido
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Rol;
