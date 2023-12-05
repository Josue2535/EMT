import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Checkbox, Table, Space, Form } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';

const FormatoPaciente = () => {
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

  const showModal = (formato = null) => {
    if (formato) {
      const validFields = Array.isArray(formato.validFields) ? [...formato.validFields] : [];
      setFormatoData({
        id: formato.id,
        creationDate: formato.creationDate,
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
        validFields: [],
      });
      form.setFieldsValue({
        validFields: '',
      }); // Solo restablecemos los campos, sin afectar los valores iniciales
    }

    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    try {
      const url = formatoData.id
        ? `https://localhost:7208/api/PacientFormat/${formatoData.id}`
        : 'https://localhost:7208/api/PacientFormat';
      const method = formatoData.id ? 'PUT' : 'POST';
  
      const requestBody = {
        validFields: formatoData.validFields,
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
  
      // If editing or creating is successful, reload the list of formats
      const updatedFormatosResponse = await fetch('https://localhost:7208/api/PacientFormat', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
  
      if (!updatedFormatosResponse.ok) {
        throw new Error(`Error al obtener datos: ${updatedFormatosResponse.statusText}`);
      }
  
      const updatedFormatosData = await updatedFormatosResponse.json();
      setFormatos(updatedFormatosData);
  
      // Close the creation modal and reset form fields
      setIsModalVisible(false);
      form.resetFields();
  
      // Reset formatoData state for new creations
      if (!formatoData.id) {
        setFormatoData({
          id: '',
          creationDate: '',
          validFields: [],
        });
      }
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
      validFields: [...editedFormato.validFields],
    });
    showModal(editedFormato);
  };

  const handleDelete = async (index) => {
    try {
      const formatToDelete = formatos[index];

      // Show confirmation dialog before deletion
      const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este formato?');

      if (!confirmDelete) {
        return; // If the user cancels the deletion, do nothing
      }

      // Send a request to delete the format using the format ID and Keycloak token
      const deleteResponse = await fetch(`https://localhost:7208/api/PacientFormat/${formatToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (!deleteResponse.ok) {
        throw new Error(`Error al eliminar el formato: ${deleteResponse.statusText}`);
      }

      // If deletion is successful, update the list of formats
      setFormatos(formatos.filter((formato, i) => i !== index));
    } catch (error) {
      console.error('Error al eliminar el formato:', error);
    }
  };
  

  const columns = [
    {
      title: 'Fecha de Creación',
      dataIndex: 'creationDate',
      key: 'creationDate',
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
      <h2>Formato de Paciente</h2>
      <Button
        type="primary"
        onClick={() => showModal()}
        disabled={formatos.length > 0}
      >
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


export default FormatoPaciente;
