import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Checkbox, Table, Space, Form } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const FormatoHistoriaClinica = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formatos, setFormatos] = useState([]);
  const [formatoData, setFormatoData] = useState({
    id: '',
    creationDate: '',
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

  // useEffect para obtener la información de la API al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7208/ClinicalHistoryFormat');
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
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const url = 'https://localhost:7208/ClinicalHistoryFormat';
      const method = formatoData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          validFields: formatoData.validFields,
          name: formatoData.name,
          Description: formatoData.description,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Error al ${formatoData.id ? 'editar' : 'crear'} el formato: ${response.statusText}`
        );
      }

      const updatedFormatos = await response.json();
      setFormatos(updatedFormatos);

      form.resetFields();
      setFormatoData({
        id: '',
        creationDate: '',
        name: '',
        description: '',
        validFields: [],
      });
      setIsModalVisible(false);
    } catch (error) {
      console.error(
        `Error al ${formatoData.id ? 'editar' : 'crear'} el formato:`,
        error
      );
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddField = () => {
    setFormatoData((prevData) => ({
      ...prevData,
      validFields: [...prevData.validFields, { ...newField }],
    }));

    setNewField({
      fieldType: '',
      fieldName: '',
      isOptional: false,
      fieldOptions: [''],
    });
  };

  const handleChangeField = (e, index) => {
    const { name, value } = e.target;
    const updatedFields = [...formatoData.validFields];
    updatedFields[index][name] = value;
    setFormatoData((prevData) => ({
      ...prevData,
      validFields: updatedFields,
    }));
  };

  const handleAddOption = (index) => {
    const updatedFields = [...formatoData.validFields];
    updatedFields[index].fieldOptions.push('');
    setFormatoData((prevData) => ({
      ...prevData,
      validFields: updatedFields,
    }));
  };

  const handleChangeOption = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...formatoData.validFields];
    updatedFields[fieldIndex].fieldOptions[optionIndex] = value;
    setFormatoData((prevData) => ({
      ...prevData,
      validFields: updatedFields,
    }));
  };

  const handleDeleteOption = (fieldIndex, optionIndex) => {
    const updatedFields = [...formatoData.validFields];
    updatedFields[fieldIndex].fieldOptions.splice(optionIndex, 1);
    setFormatoData((prevData) => ({
      ...prevData,
      validFields: updatedFields,
    }));
  };

  const handleDeleteField = (index) => {
    const updatedFields = [...formatoData.validFields];
    updatedFields.splice(index, 1);
    setFormatoData((prevData) => ({
      ...prevData,
      validFields: updatedFields,
    }));
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
      <Modal
        title="Crear/Editar Formato"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleOk} initialValues={formatoData}>
          <Form.Item label="Nombre del Formato" name="name" rules={[{ required: true, message: 'Ingresa el nombre del formato' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Descripción" name="description" rules={[{ required: true, message: 'Ingresa la descripción del formato' }]}>
            <Input.TextArea />
          </Form.Item>

          {/* Campos Válidos */}
          <h3>Añadir Campos</h3>
          {formatoData.validFields.map((field, index) => (
            <div key={index}>
              <Form.Item label={`Campo ${index + 1}`} required>
                <Input
                  value={field.fieldName}
                  onChange={(e) => handleChangeField(e, index, 'fieldName')}
                  placeholder="Nombre del Campo"
                />
              </Form.Item>
              <Form.Item label="Tipo de Campo" required>
                <Input
                  value={field.fieldType}
                  onChange={(e) => handleChangeField(e, index, 'fieldType')}
                  placeholder="Tipo de Campo"
                />
              </Form.Item>
              <Form.Item label="Opcional" name="isOptional" valuePropName="checked">
                <Checkbox
                  checked={field.isOptional}
                  onChange={(e) => handleChangeField(e, index, 'isOptional')}
                />
              </Form.Item>
              <Form.Item label="Opciones" name="fieldOptions">
                {field.fieldOptions.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <Input
                      type="text"
                      value={option}
                      onChange={(e) => handleChangeOption(index, optionIndex, e.target.value)}
                    />
                    <Button onClick={() => handleDeleteOption(index, optionIndex)}>Eliminar Opción</Button>
                  </div>
                ))}
                <Button onClick={() => handleAddOption(index)}>Añadir Opción</Button>
              </Form.Item>
              <Button onClick={() => handleDeleteField(index)}>Eliminar Campo</Button>
            </div>
          ))}
          <Button onClick={handleAddField}>Añadir Campo</Button>

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
