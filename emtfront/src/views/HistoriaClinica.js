import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, message, Select } from 'antd';
import { useKeycloak } from '@react-keycloak/web';

const HistoriaClinica = () => {
  const [historiasClinicas, setHistoriasClinicas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingHistoria, setEditingHistoria] = useState(null);
  const [formFilter] = Form.useForm();
  const { keycloak } = useKeycloak();
  const [formatos, setFormatos] = useState([]);
  const [selectedField, setSelectedField] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7208/api/PacientFormat', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener datos: ${response.statusText}`);
        }

        const data = await response.json();
        setFormatos(data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchData();
  }, [keycloak.token]);

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
        setHistoriasClinicas((prevHistorias) =>
          prevHistorias.map((historia) => (historia.id === editingHistoria.id ? { ...historia, ...values } : historia))
        );
        message.success('Historia Clínica actualizada exitosamente');
      } else {
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

  const handleFieldChange = (value) => {
    const selectedField = formatos[0].validFields.find((field) => field.fieldName === value);
    setSelectedField(selectedField);
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

      <Form form={formFilter} layout="inline">
        <Form.Item label="Filtrar por">
          <Select style={{ width: 200 }} placeholder="Seleccione un campo" onChange={handleFieldChange}>
            {formatos.length > 0 &&
              formatos[0].validFields.map((field) => (
                <Select.Option key={field.fieldName} value={field.fieldName}>
                  {field.fieldName}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        {selectedField && selectedField.fieldOptions.length > 0 && (
          <Form.Item label="Valor">
            <Select placeholder={`Seleccione ${selectedField.fieldName}`}>
              {selectedField.fieldOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {!selectedField && (
          <Form.Item label="Valor">
            <Input />
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary">Buscar</Button>
        </Form.Item>
      </Form>

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
        </Form>
      </Modal>
    </div>
  );
};

export default HistoriaClinica;
