import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Table, Space, Select, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';
import { Select as AntSelect } from 'antd';
import FabActionButton from '../components/FabActionButton';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../components/Header';
const { Option: AntOption } = AntSelect;
const { Option } = Select;
const Rol = () => {
  const { keycloak } = useKeycloak();
  const [roles, setRoles] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRole, setEditingRole] = useState(null);
  const [formatOptions, setFormatOptions] = useState([]);
  useEffect(() => {
    const fetchFormats = async () => {
      try {
        const response = await fetch('https://localhost:7208/ClinicalHistoryFormat', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener formatos: ${response.statusText}`);
        }

        const data = await response.json();
        setFormatOptions(data.map((format) => format.name));
      } catch (error) {
        console.error('Error al obtener formatos:', error);
      }
    };
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
    fetchFormats();
    fetchRoles();
  }, [keycloak.token]);


  const showModal = (role) => {
    setEditingRole(role);
    form.setFieldsValue(role);
    setVisible(true);
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: 'Confirmar Eliminación',
      content: '¿Estás seguro de que deseas eliminar este rol?',
      okText: 'Sí',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const url = editingRole
        ? `https://localhost:7208/api/Role/${editingRole.id}`
        : 'https://localhost:7208/api/Role'; // Cambiar la URL según sea necesario
      const method = editingRole ? 'PUT' : 'POST';

      const roleData = {
        Name: form.getFieldValue('name'),
        ValidFields: form.getFieldValue('validFields').map((field) => ({
          Name: field.name,
          Value: field.value,
        })),
      };

      // Si estás creando un nuevo rol, omite id y creationDate
      if (!editingRole) {
        delete roleData.id;
        delete roleData.creationDate;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        throw new Error(`Error al ${editingRole ? 'editar' : 'crear'} el rol: ${response.statusText}`);
      }

      // Obtener la lista actualizada después de la operación exitosa
      const updatedRolesResponse = await fetch('https://localhost:7208/api/Role', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (!updatedRolesResponse.ok) {
        throw new Error(`Error al obtener roles después de la operación: ${updatedRolesResponse.statusText}`);
      }

      const updatedRoles = await updatedRolesResponse.json();
      setRoles(updatedRoles);

      form.resetFields();
      setEditingRole(null);
      setVisible(false);
    } catch (error) {
      console.error(`Error al ${editingRole ? 'editar' : 'crear'} el rol:`, error);
    }
  };



  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este formato?');

      if (!confirmDelete) {
        return; // If the user cancels the deletion, do nothing
      }
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
      message.success('Rol eliminado correctamente');
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
          <FabActionButton icon={<EditIcon />} handleClick={() => showModal(record)} color={"info"} />

          <FabActionButton icon={<DeleteIcon />} color={"error"} handleClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Header title={"Rol"}/>
      <div>
        <FabActionButton
          handleClick={() => showModal(null)}
          icon={<AddIcon></AddIcon>}
          color={"secondary"}
        />
      </div>
      <Table dataSource={roles} columns={columns} rowKey="id" />

      <Modal
        title={editingRole ? 'Editar Rol' : 'Crear Rol'}
        visible={visible}
        footer={null}
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
                        rules={[{ required: true, message: 'Seleccione al menos una acción' }]}
                        style={{ display: 'inline-block', marginLeft: '8px', width: '200px' }}
                      >
                        <Select placeholder="Seleccione acciones" style={{ width: '100%', overflow: 'auto' }}>
                          <Option value="ClinicalHistoryFormat">Formato Historia Clinica</Option>
                          <Option value="ClinicalHistory">Historia Clinica</Option>
                          <Option value="PatientFormat">Formato Paciente</Option>
                          <Option value="Patient">Paciente</Option>
                          <Option value="Role">Role</Option>
                          <Option value="formats">Formatos</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        fieldKey={[fieldKey, 'value']}
                        rules={[{ required: true, message: 'Seleccione al menos una acción' }]}
                        style={{ display: 'inline-block', marginLeft: '8px', width: '200px' }}
                      >
                        <Select mode="multiple" placeholder="Seleccione acciones" style={{ width: '100%', overflow: 'auto' }}>
                          <Option value="get">get</Option>
                          <Option value="post">post</Option>
                          <Option value="put">put</Option>
                          <Option value="delete">delete</Option>
                          {formatOptions.map((format) => (
                            <Option key={format} value={format}>
                              {format}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <FabActionButton  handleClick={() => remove(name)} icon={<DeleteIcon />} color={"error"} />
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
        {/* Botones personalizados */}
        <div style={{ textAlign: 'right' }}>

          <FabActionButton
            color="error" // O ajusta el color deseado
            handleClick={() => {
              form.resetFields();
              setEditingRole(null);
              setVisible(false);
            }}
            icon={<CancelIcon />} // Ajusta el ícono deseado
          />
          <FabActionButton
            color="info" // O ajusta el color deseado
            handleClick={handleSubmit}
            icon={<SaveIcon />} // Ajusta el ícono deseado
          />
        </div>
      </Modal>
    </div>
  );
};

export default Rol;
