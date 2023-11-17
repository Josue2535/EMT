import React, { useState } from 'react';
import { Modal, Button, Input, Checkbox, Table, Space, Form } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const FormatoHistoriaClinica = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formatos, setFormatos] = useState([]);
  const [formatoData, setFormatoData] = useState({
    id: '', // Puedes mantener esta propiedad si es necesaria
    creationDate: '', // Puedes mantener esta propiedad si es necesaria
    name: '',
    description: '',
    validFields: [],
  });

  const [newField, setNewField] = useState({
    fieldType: '',
    fieldName: '',
    isOptional: false,
    fieldOptions: [''],
  });

  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // Lógica para manejar el evento "Crear"
    // Puedes enviar la información a la API o realizar otras acciones
    setFormatos([...formatos, formatoData]);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddField = () => {
    setFormatoData((prevData) => ({
      ...prevData,
      validFields: [...prevData.validFields, newField],
    }));

    setNewField({
      fieldType: '',
      fieldName: '',
      isOptional: false,
      fieldOptions: [''],
    });
  };

  const handleChangeField = (e) => {
    const { name, value } = e.target;
    setNewField((prevField) => ({ ...prevField, [name]: value }));
  };

  const handleAddOption = () => {
    setNewField((prevField) => ({
      ...prevField,
      fieldOptions: [...prevField.fieldOptions, ''],
    }));
  };

  const handleChangeOption = (index, value) => {
    setNewField((prevField) => {
      const updatedOptions = [...prevField.fieldOptions];
      updatedOptions[index] = value;
      return { ...prevField, fieldOptions: updatedOptions };
    });
  };

  const handleEdit = (index) => {
    const editedFormato = formatos[index];
    setFormatoData(editedFormato);
    setFormatos(formatos.filter((formato, i) => i !== index));
    setIsModalVisible(true);
  };

  const handleDelete = (index) => {
    setFormatos(formatos.filter((formato, i) => i !== index));
  };

  const columns = [
    {
      title: 'Nombre del Formato',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record, index) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(index)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(index)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Formato de Historia Clínica</h2>
      <Button type="primary" onClick={showModal}>
        Crear
      </Button>

      {/* Tabla para mostrar la lista de formatos */}
      <Table dataSource={formatos} columns={columns} rowKey={(record, index) => index} />

      {/* Modal para mostrar la información antes de crear/editar */}
      <Modal title="Crear/Editar Formato" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <Form form={form} onFinish={handleOk} initialValues={formatoData}>
          <Form.Item label="Nombre del Formato" name="name" rules={[{ required: true, message: 'Ingresa el nombre del formato' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Descripción" name="description" rules={[{ required: true, message: 'Ingresa la descripción del formato' }]}>
            <Input.TextArea />
          </Form.Item>

          {/* Campos Válidos */}
          <h3>Añadir Campo</h3>
          <Form.Item label="Tipo de Campo" name="fieldType">
            <Input />
          </Form.Item>
          <Form.Item label="Nombre del Campo" name="fieldName">
            <Input />
          </Form.Item>
          <Form.Item label="Opcional" name="isOptional" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item label="Opciones" name="fieldOptions">
            {newField.fieldOptions.map((option, index) => (
              <div key={index}>
                <Input
                  type="text"
                  value={option}
                  onChange={(e) => handleChangeOption(index, e.target.value)}
                />
              </div>
            ))}
            <Button onClick={handleAddOption}>Añadir Opción</Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FormatoHistoriaClinica;
