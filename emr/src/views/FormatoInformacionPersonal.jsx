import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Checkbox, Table, Space, Form } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';

const FormatoInformacionPersonal = () => {
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
        const response = await fetch('https://localhost:7208/api/PersonalInformationFormat', {
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
        ? `https://localhost:7208/api/PersonalInformationFormat/${formatoData.id}`
        : 'https://localhost:7208/api/PersonalInformationFormat';
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
  
      // Si la edición o creación es exitosa, recargamos la lista de formatos
      const updatedFormatosResponse = await fetch('https://localhost:7208/api/PersonalInformationFormat', {
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
  
      // Cerramos el modal de creación y restablecemos los campos del formulario
      setIsModalVisible(false);
      form.resetFields();
  
      // Restablecemos el estado formatoData para nuevas creaciones
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
    setFormatoData((prevData) => ({
      ...prevData,
      validFields: [
        ...prevData.validFields,
        {
          fieldType: 'String', // Asignar fieldType 'String' para el nuevo campo de texto
          fieldName: '',
          isOptional: false,
          fieldOptions: [''],
        },
      ],
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
  
      // Mostrar un cuadro de diálogo de confirmación antes de la eliminación
      const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este formato?');
  
      if (!confirmDelete) {
        return; // Si el usuario cancela la eliminación, no hacer nada
      }
  
      // Enviar una solicitud para eliminar el formato usando el ID del formato y el token de Keycloak
      const deleteResponse = await fetch(`https://localhost:7208/api/PersonalInformationFormat/${formatToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
  
      if (!deleteResponse.ok) {
        throw new Error(`Error al eliminar el formato: ${deleteResponse.statusText}`);
      }
  
      // Si la eliminación es exitosa, actualizar la lista de formatos
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
      <h2>Formato de Información Personal</h2>
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
                {field.fieldType === 'String' ? (
                  // Si el tipo de campo es 'String', renderizar un campo de texto en lugar de opciones
                  <Input
                    value={field.fieldOptions[0]} // Usar fieldOptions[0] para 'String'
                    onChange={(e) => handleChangeOption(index, 0, e.target.value)}
                  />
                ) : (
                  // Renderizar opciones para otros tipos de campo
                  <>
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
                  </>
                )}
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

export default FormatoInformacionPersonal;
