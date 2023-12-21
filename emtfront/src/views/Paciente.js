import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';
import { getPacientes, createPaciente, updatePaciente, deletePaciente, getPacientFormat } from '../api';
import FabActionButton from '../components/FabActionButton';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../components/Header';
const date = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'full',
  timeStyle: 'short',
})
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
    const fieldsValue = {
      id: paciente.id,
      created: paciente.created ? new Date(paciente.created).toISOString().split('T')[0] : null,
      role: paciente.role,
      isEnabled: paciente.isEnabled,
      ...paciente.fieldsList.reduce((acc, field) => {
        acc[field.name] = field.value;
        if (field.fieldType === 'LocalDate') {
          acc[field.name] = field.value ? new Date(field.value).toISOString().split('T')[0] : null;
        }
        return acc;
      }, {}),
    };
    form.setFieldsValue(fieldsValue);
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
        Role: values.role,  // Asegúrate de que 'role' esté presente en formatoPaciente
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
    {
      title: 'Fecha de Creación', dataIndex: 'created', key: 'created', render: (text) => (
        <span>
          {date.format((new Date(text)))}
        </span>
      ),
    },
    { title: 'Rol', dataIndex: 'role', key: 'role' },
    { title: 'Habilitado', dataIndex: 'isEnabled', key: 'isEnabled', render: (isEnabled) => isEnabled ? 'Sí' : 'No' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <FabActionButton icon={<EditIcon />} handleClick={() => handleEdit(record)} color={"info"}/>
          <FabActionButton icon={<DeleteIcon />} handleClick={() => handleDelete(record.id)} color={"error"} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Header title={"Paciente"}/>
      <FabActionButton icon={<AddIcon></AddIcon>} handleClick={handleCreate} color={"secondary"}/>
        
      <Table dataSource={pacientes} columns={columns} rowKey="id" />

      <Modal
        title={editingPaciente ? 'Editar Paciente' : 'Crear Paciente'}
        visible={modalVisible}
        footer={null}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical" name="paciente_form">
          {formatoPaciente.length > 0 && (
            <>

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
                  ) : field.fieldType === 'Integer' || field.fieldType === 'Number' ? (
                    <Input type="number" />
                  ) : field.fieldType === 'LocalDate' ? (
                    <Input
                      type="date"
                      
                    />
                  ) : null}
                </Form.Item>
              ))}
            </>
          )}
        </Form>
        {/* Botones personalizados */}
        <div style={{ textAlign: 'right' }}>

          <FabActionButton
            color="error" // O ajusta el color deseado
            handleClick={
              handleModalCancel
            }
            icon={<CancelIcon />} // Ajusta el ícono deseado
          />
          <FabActionButton
            color="info" // O ajusta el color deseado
            handleClick={handleModalOk}
            icon={<SaveIcon />} // Ajusta el ícono deseado
          />
        </div>
      </Modal>
    </div>
  );
};

export default Paciente;
