import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';
import { getPacientes, createPaciente, updatePaciente, deletePaciente, getPacientFormat } from '../api';

const Paciente = () => {
  const { keycloak } = useKeycloak();
  const [pacientes, setPacientes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingPaciente, setEditingPaciente] = useState(null);
  const [formatoPaciente, setFormatoPaciente] = useState([]);

  const fetchPacientes = async () => {
    try {
      const keycloakToken = keycloak.token;

      const response = await fetch('https://localhost:7208/api/Pacient', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${keycloakToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }

      const data = await response.json();
      setPacientes(data);
    } catch (error) {
      console.error('Error al obtener la lista de pacientes', error);
      message.error('Error al obtener la lista de pacientes');
    }
  };

  const fetchPacientFormat = async () => {
    try {
      const keycloakToken = keycloak.token;

      const response = await fetch('https://localhost:7208/api/PacientFormat', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${keycloakToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener formato de paciente: ${response.statusText}`);
      }

      const data = await response.json();
      setFormatoPaciente(data[0]?.validFields || []);
    } catch (error) {
      console.error('Error al obtener el formato de paciente', error);
      message.error('Error al obtener el formato de paciente');
    }
  };

  useEffect(() => {
    fetchPacientes();
    fetchPacientFormat();
  }, [keycloak.token]);

  const handleCreate = () => {
    setEditingPaciente(null);
    setModalVisible(true);
  };

  const handleEdit = async (paciente) => {
    setEditingPaciente(paciente);
    form.setFieldsValue({
      id: paciente.id,
      created: paciente.created,
      role: paciente.role,
      isEnabled: paciente.isEnabled,
      ...paciente.fieldsList.reduce((acc, field) => {
        acc[field.name] = field.value;
        return acc;
      }, {}),
    });
    setModalVisible(true);
  };

  const handleDelete = async (pacienteId) => {
    Modal.confirm({
      title: 'Confirmar Eliminación',
      content: '¿Estás seguro de que deseas eliminar este paciente?',
      onOk: async () => {
        try {
          const keycloakToken = keycloak.token;

          const response = await fetch(`https://localhost:7208/api/Pacient/${pacienteId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${keycloakToken}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error al eliminar el paciente: ${response.statusText}`);
          }

          message.success('Paciente eliminado exitosamente');
          fetchPacientes(); // Recargar la lista de pacientes
        } catch (error) {
          console.error('Error al eliminar el paciente', error);
          message.error('Error al eliminar el paciente');
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
      const fieldsList = formatoPaciente.map((field) => ({
        Name: field.fieldName,
        Value: values[field.fieldName],
      }));

      const pacienteData = {
        Role: values.role,
        FieldsList: fieldsList,
        PersonalInformationId: "someId",  // Cambia "someId" según sea necesario
        IsEnabled: values.isEnabled,
      };

      if (editingPaciente) {
        const keycloakToken = keycloak.token;

        const response = await fetch(`https://localhost:7208/api/Pacient/${editingPaciente.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloakToken}`,
          },
          body: JSON.stringify(pacienteData),
        });

        if (!response.ok) {
          throw new Error(`Error al actualizar el paciente: ${response.statusText}`);
        }

        message.success('Paciente actualizado exitosamente');
      } else {
        const keycloakToken = keycloak.token;

        const response = await fetch('https://localhost:7208/api/Pacient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloakToken}`,
          },
          body: JSON.stringify(pacienteData),
        });

        if (!response.ok) {
          throw new Error(`Error al crear el paciente: ${response.statusText}`);
        }

        message.success('Paciente creado exitosamente');
      }

      setModalVisible(false);
      fetchPacientes();
    } catch (error) {
      console.error('Error al guardar el paciente', error);
      message.error('Error al guardar el paciente');
    }
  };


  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Fecha de Creación', dataIndex: 'created', key: 'created' },
    { title: 'Rol', dataIndex: 'role', key: 'role' },
    { title: 'Habilitado', dataIndex: 'isEnabled', key: 'isEnabled', render: (isEnabled) => isEnabled ? 'Sí' : 'No' },
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
      <h2>Pacientes</h2>
      <Button type="primary" onClick={handleCreate} style={{ marginBottom: '16px' }}>
        Crear Paciente
      </Button>
      <Table dataSource={pacientes} columns={columns} rowKey="id" />

      <Modal
        title={editingPaciente ? 'Editar Paciente' : 'Crear Paciente'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical" name="paciente_form">
          {formatoPaciente.length > 0 && (
            <>
              {!editingPaciente && (
                <>
                  <Form.Item name="role" label="Rol">
                    <Input />
                  </Form.Item>
                  <Form.Item name="isEnabled" label="Habilitado">
                    <Select>
                      <Select.Option value={true}>Sí</Select.Option>
                      <Select.Option value={false}>No</Select.Option>
                    </Select>
                  </Form.Item>
                </>
              )}
              {formatoPaciente.map((field) => (
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
                  ) : field.fieldType === 'Integer' ? (
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

export default Paciente;
