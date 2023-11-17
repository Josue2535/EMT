import React, { useState } from 'react';
import { Button, Table, Modal, Form, Input, Checkbox, message } from 'antd';

const HistoriaClinica = () => {
  const [historiasClinicas, setHistoriasClinicas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingHistoria, setEditingHistoria] = useState(null);

  const handleCreate = () => {
    setEditingHistoria(null);
    setModalVisible(true);
  };

  const handleEdit = (historia) => {
    setEditingHistoria(historia);
    form.setFieldsValue(historia);
    setModalVisible(true);
  };

  const handleDelete = (historiaId) => {
    setHistoriasClinicas((prevHistorias) => prevHistorias.filter((historia) => historia.id !== historiaId));
    message.success('Historia Clínica eliminada exitosamente');
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingHistoria) {
        // Editar Historia Clínica existente
        setHistoriasClinicas((prevHistorias) =>
          prevHistorias.map((historia) => (historia.id === editingHistoria.id ? { ...historia, ...values } : historia))
        );
        message.success('Historia Clínica actualizada exitosamente');
      } else {
        // Crear nueva Historia Clínica
        setHistoriasClinicas((prevHistorias) => [...prevHistorias, { id: Date.now().toString(), ...values }]);
        message.success('Historia Clínica creada exitosamente');
      }
      setModalVisible(false);
    });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Fecha de Creación', dataIndex: 'creationDate', key: 'creationDate' },
    { title: 'Descripción', dataIndex: 'description', key: 'description' },
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
      <h2>Historia Clínica</h2>
      <Button type="primary" onClick={handleCreate} style={{ marginBottom: '16px' }}>
        Crear Historia Clínica
      </Button>
      <Table dataSource={historiasClinicas} columns={columns} rowKey="id" />

      <Modal
        title={editingHistoria ? 'Editar Historia Clínica' : 'Crear Historia Clínica'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical" name="historiaclinica_form">
          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ required: true, message: 'Por favor ingrese la descripción' }]}
          >
            <Input />
          </Form.Item>
          {/* Agrega lógica para manejar los campos válidos */}
        </Form>
      </Modal>
    </div>
  );
};

export default HistoriaClinica;
