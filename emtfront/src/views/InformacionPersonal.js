import React, { useState } from 'react';
import { Button, Table, Modal, Form, Input, message } from 'antd';

const InformacionPersonal = () => {
  const [informacionPersonal, setInformacionPersonal] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingInfo, setEditingInfo] = useState(null);

  const handleCreate = () => {
    setEditingInfo(null);
    setModalVisible(true);
  };

  const handleEdit = (info) => {
    setEditingInfo(info);
    form.setFieldsValue(info);
    setModalVisible(true);
  };

  const handleDelete = (infoId) => {
    setInformacionPersonal((prevInfo) => prevInfo.filter((info) => info.id !== infoId));
    message.success('Información personal eliminada exitosamente');
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingInfo) {
        // Editar información personal existente
        setInformacionPersonal((prevInfo) =>
          prevInfo.map((info) => (info.id === editingInfo.id ? { ...info, ...values } : info))
        );
        message.success('Información personal actualizada exitosamente');
      } else {
        // Crear nueva información personal
        setInformacionPersonal((prevInfo) => [...prevInfo, { id: Date.now().toString(), ...values }]);
        message.success('Información personal creada exitosamente');
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
    { title: 'Nombre', dataIndex: 'name', key: 'name' },
    { title: 'Valor', dataIndex: 'value', key: 'value' },
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
        <Form form={form} layout="vertical" name="informacionpersonal_form">
          <Form.Item name="name" label="Nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="value" label="Valor" rules={[{ required: true, message: 'Por favor ingrese el valor' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InformacionPersonal;
