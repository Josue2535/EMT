import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Checkbox, Table, Space, Form } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';
import { Select } from 'antd';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
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
const FormatoPaciente = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formatos, setFormatos] = useState([]);
  const { keycloak } = useKeycloak();
  const { Option } = Select;
  const [form] = Form.useForm();

  const [formatoData, setFormatoData] = useState({
    id: '',
    creationDate: '',
    name: '',
    description: '',
    validFields: [],
  });
  const date = new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'full',
    timeStyle: 'short',
  })
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

      formatoData.validFields.forEach(validField => {
        validField.fieldOptions = validField.fieldOptions.filter(option => option !== '');
      });

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
    const { value, checked } = e.target;
    const updatedFields = [...formatoData.validFields];

    if (field === 'isOptional') {
      updatedFields[index][field] = checked;
    } else {
      updatedFields[index][field] = value;
    }

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
      render: (text) => (
        <span>
          {date.format((new Date(text)))}
        </span>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record, index) => (
        <Space size="middle">
          <FabActionButton icon={<EditIcon />} handleClick={() => handleEdit(index)} color={"info"} />
          <FabActionButton icon={<DeleteIcon />} handleClick={() => handleDelete(index)} color={"error"} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Header title={"Formato de Paciente"}/>
      <FabActionButton
        color={"secondary"}
        handleClick={() => showModal()}
        disabled={formatos.length > 0}
        icon={<AddIcon />}
      />

      <Table dataSource={formatos} columns={columns} rowKey={(record, index) => index} />

      <Modal
        title="Crear/Editar Formato"
        visible={isModalVisible}
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
                <Select
                  value={field.fieldType}
                  onChange={(value) => handleChangeField({ target: { value } }, index, 'fieldType')}
                  placeholder="Seleccionar Tipo de Campo"
                >
                  <Option value="String">Texto</Option>
                  <Option value="LocalDate">Fecha</Option>
                  <Option value="Number">Números</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Opcional">
                <Checkbox
                  checked={field.isOptional}
                  onChange={(e) => handleChangeField(e, index, 'isOptional')}
                  name={`isOptional-${index}`} // Use a unique name for each checkbox
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
                    <FabActionButton handleClick={() => handleDeleteOption(index, optionIndex)} icon={<DeleteIcon></DeleteIcon>} color={"error"}/>
                  </div>
                ))}
                <FabActionButton handleClick={() => handleAddOption(index)} icon={<AddIcon></AddIcon>} color={"secondary"}/>
              </Form.Item>
              <FabActionButton handleClick={() => handleDeleteField(index)}icon={<DeleteIcon></DeleteIcon>} color={"error"}/>
            </div>
          ))}
          <FabActionButton handleClick={handleAddField}icon={<AddIcon></AddIcon>} color={"secondary"}/>

          {/* Botones personalizados */}
          <div style={{ textAlign: 'right' }}>

            <FabActionButton
              color="error" // O ajusta el color deseado
              handleClick={handleCancel}
              icon={<CancelIcon />} // Ajusta el ícono deseado
            />
            <FabActionButton
              color="info" // O ajusta el color deseado
              handleClick={handleOk}
              icon={<SaveIcon />} // Ajusta el ícono deseado
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
};


export default FormatoPaciente;
