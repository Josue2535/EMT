import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Checkbox, Form, message, Table } from 'antd';
import { getPacientes, createPaciente, updatePaciente, deletePaciente } from '../api';

const FormatoPaciente = () => {
  const [pacientes, setPacientes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingPaciente, setEditingPaciente] = useState(null);

  const fetchPacientes = async () => {
    try {
      const data = await getPacientes();
      setPacientes(data);
    } catch (error) {
      console.error('Error al obtener la lista de pacientes', error);
      message.error('Error al obtener la lista de pacientes');
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleCreate = () => {
    setEditingPaciente(null);
    setModalVisible(true);
  };

  const handleEdit = (paciente) => {
    setEditingPaciente(paciente);
    form.setFieldsValue(paciente);
    setModalVisible(true);
  };

  const handleDelete = async (pacienteId) => {
    try {
      await deletePaciente(pacienteId);
      message.success('Paciente eliminado exitosamente');
      fetchPacientes();
    } catch (error) {
      console.error('Error al eliminar el paciente', error);
      message.error('Error al eliminar el paciente');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingPaciente) {
        await updatePaciente(editingPaciente.id, values);
        message.success('Paciente actualizado exitosamente');
      } else {
        await createPaciente(values);
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
    // Otros campos específicos del paciente
    // Puedes ajustar esto según tus necesidades
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
      <h2>Formato de Paciente</h2>
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
        {/* Agrega los campos específicos del paciente aquí */}
        <Form form={form} layout="vertical" name="paciente_form">
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre del paciente' }]}>
            <Input />
          </Form.Item>
          {/* Otros campos del paciente */}
        </Form>
      </Modal>
    </div>
  );
};

export default FormatoPaciente;
