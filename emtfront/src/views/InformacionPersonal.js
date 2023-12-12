import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';

const InformacionPersonal = () => {
  const { keycloak } = useKeycloak();
  const [informacionPersonal, setInformacionPersonal] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingInfo, setEditingInfo] = useState(null);
  const [formatoInfoPersonal, setFormatoInfoPersonal] = useState([]);

  const fetchInformacionPersonalData = async () => {
    try {
      const keycloakToken = keycloak.token;
      const response = await fetch('https://localhost:7208/api/PersonalInformation', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${keycloakToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener datos de información personal: ${response.statusText}`);
      }

      const data = await response.json();
      setInformacionPersonal(data);
    } catch (error) {
      console.error('Error al obtener la lista de información personal', error);
      message.error('Error al obtener la lista de información personal');
    }
  };

  const fetchInfoPersonalFormat = async () => {
    try {
      const keycloakToken = keycloak.token;
      const response = await fetch('https://localhost:7208/api/PersonalInformationFormat', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${keycloakToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener formato de información personal: ${response.statusText}`);
      }

      const data = await response.json();
      setFormatoInfoPersonal(data[0]?.validFields || []);
    } catch (error) {
      console.error('Error al obtener el formato de información personal', error);
      message.error('Error al obtener el formato de información personal');
    }
  };

  useEffect(() => {
    fetchInformacionPersonalData();
    fetchInfoPersonalFormat();
  }, [keycloak.token]);

  const handleCreate = () => {
    setEditingInfo(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = async (info) => {
    setEditingInfo(info);
  
    // Crear un objeto con los valores iniciales del formulario
    const initialValues = {};
    info.fieldList.forEach((field) => {
      initialValues[field.name] = field.value;
    });
  
    form.setFieldsValue({
      ...initialValues,
    });
  
    setModalVisible(true);
  };

  const handleDelete = async (infoId) => {
    Modal.confirm({
      title: 'Confirmar Eliminación',
      content: '¿Estás seguro de que deseas eliminar esta información personal?',
      onOk: async () => {
        try {
          const keycloakToken = keycloak.token;
          const response = await fetch(`https://localhost:7208/api/PersonalInformation/${infoId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${keycloakToken}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error al eliminar la información personal: ${response.statusText}`);
          }

          message.success('Información personal eliminada exitosamente');
          fetchInformacionPersonalData(); // Recargar la lista de información personal
        } catch (error) {
          console.error('Error al eliminar la información personal', error);
          message.error('Error al eliminar la información personal');
        }
      },
      onCancel: () => {
        console.log('Cancelado');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const fieldList = formatoInfoPersonal.map((field) => ({
        name: field.fieldName,
        value: values[field.fieldName],
      }));

      const infoData = {
        fieldList: fieldList,
      };

      if (editingInfo) {
        const keycloakToken = keycloak.token;

        const response = await fetch(`https://localhost:7208/api/PersonalInformation/${editingInfo.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloakToken}`,
          },
          body: JSON.stringify(infoData),
        });

        if (!response.ok) {
          throw new Error(`Error al actualizar la información personal: ${response.statusText}`);
        }

        message.success('Información personal actualizada exitosamente');
      } else {
        const keycloakToken = keycloak.token;

        const response = await fetch('https://localhost:7208/api/PersonalInformation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloakToken}`,
          },
          body: JSON.stringify(infoData),
        });

        if (!response.ok) {
          throw new Error(`Error al crear la información personal: ${response.statusText}`);
        }

        message.success('Información personal creada exitosamente');
      }

      setModalVisible(false);
      fetchInformacionPersonalData();
    } catch (error) {
      console.error('Error al guardar la información personal', error);
      message.error('Error al guardar la información personal');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Fecha de Creación', dataIndex: 'created', key: 'created' }, // Agregar esta línea
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Información Personal</h2>
      <Button type="primary" onClick={handleCreate} style={{ marginBottom: '16px' }}>
        Crear Información Personal
      </Button>
      <Table dataSource={informacionPersonal} columns={columns} rowKey="id" />

      <Modal
        title={editingInfo ? 'Editar Información Personal' : 'Crear Información Personal'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical" name="info_form">
          {formatoInfoPersonal.length > 0 && (
            <>
              {formatoInfoPersonal.map((field) => (
                <Form.Item
                  key={field.fieldName}
                  name={field.fieldName}
                  label={field.fieldName}
                  rules={[{ required: !field.isOptional, message: `Por favor ingrese ${field.fieldName}` }]}
                >
                  {field.fieldOptions.length > 0 ? (
                    <Select>
                      {field.fieldOptions.map((option) => (
                        <Select.Option key={option} value={option}>
                          {option}
                        </Select.Option>
                      ))}
                    </Select>
                  ) : field.fieldType === 'String' ? (
                    <Input />
                  ) : field.fieldType === 'Integer' ||  field.fieldType === 'Number'? (
                    <Input type="number" />
                  ) : field.fieldType === 'LocalDate' ? (
                    <Input type="date" />
                  ) : null}
                </Form.Item>
              ))}
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default InformacionPersonal;
