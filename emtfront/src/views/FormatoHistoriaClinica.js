import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Checkbox, Table, Space, Form } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';

const FormatoHistoriaClinica = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formatos, setFormatos] = useState([]);
  const { keycloak } = useKeycloak();

  const [form] = Form.useForm();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7208/ClinicalHistoryFormat', {
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

  const showModal = (formato = null) => {
    if (formato) {
      const validFields = Array.isArray(formato.validFields) ? [...formato.validFields] : [];
      setFormatoData({
        id: formato.id,
        creationDate: formato.creationDate,
        name: formato.name,
        description: formato.description,
        validFields: validFields,
      });
      form.setFieldsValue({
        name: formato.name,
        description: formato.description,
        validFields: validFields,
      });
    } else {
      // Si es una creación, restablecer el estado formatoData a un objeto vacío
      setFormatoData({
        id: '',
        creationDate: '',
        name: '',  // Asegurémonos de que estos campos estén inicializados correctamente
        description: '',  // Asegurémonos de que estos campos estén inicializados correctamente
        validFields: [],
      });
      form.setFieldsValue({
        name: '',
        description: '',
        validFields: '',
      }); // Solo restablecemos los campos, sin afectar los valores iniciales
    }

    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    try {
      const url = 'https://localhost:7208/ClinicalHistoryFormat';
      const method = formatoData.id ? 'PUT' : 'POST';
  
      const requestBody = {
        validFields: formatoData.validFields,
        name: values.name,
        description: values.description,
      };
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(
          `Error al ${formatoData.id ? 'editar' : 'crear'} el formato: ${response.statusText}`
        );
      }
  
      const updatedFormatos = await response.json();
      setFormatos(updatedFormatos);
  
      form.resetFields();
  
      if (!formatoData.id) {
        setFormatoData({
          id: '',
          creationDate: '',
          name: '',
          description: '',
          validFields: [],
        });
      }
  
      setIsModalVisible(false);
    } catch (error) {
      console.error(`Error al ${formatoData.id ? 'editar' : 'crear'} el formato:`, error);
    }
  };
  
  

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();

    if (!formatoData.id) {
      setFormatoData({
        id: '',
        creationDate: '',
        name: '',
        description: '',
        validFields: [],
      });
    }
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

  const handleChangeField = (e, index, field) => {
    const { value } = e.target;
    const updatedFields = [...formatoData.validFields];
    updatedFields[index][field] = value;
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
    setFormatoData({
      id: editedFormato.id,
      creationDate: editedFormato.creationDate,
      name: editedFormato.name,
      description: editedFormato.description,
      validFields: [...editedFormato.validFields],
    });
    showModal(editedFormato);
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
      <Button type="primary" onClick={() => showModal()}>
        Crear
      </Button>

      <Table dataSource={formatos} columns={columns} rowKey={(record, index) => index} />

      <Modal
        title="Crear/Editar Formato"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleOk}
          initialValues={formatoData.id ? formatoData : undefined}
        >
          <Form.Item
            label="Nombre del Formato"
            name="name"
            rules={[{ required: true, message: 'Ingresa el nombre del formato' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Descripción"
            name="description"
            rules={[{ required: true, message: 'Ingresa la descripción del formato' }]}
          >
            <Input.TextArea />
          </Form.Item>

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
                    <Button onClick={() => handleDeleteOption(index, optionIndex)}>
                      Eliminar Opción
                    </Button>
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
