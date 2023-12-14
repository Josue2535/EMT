import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, message, Select } from 'antd';
import { useKeycloak } from '@react-keycloak/web';
import { Navigate, useNavigate } from 'react-router-dom';

const HistoriaClinica = () => {
  const [historiasClinicas, setHistoriasClinicas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingHistoria, setEditingHistoria] = useState(null);
  const [formatos, setFormatos] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const { keycloak } = useKeycloak();
  const initialValues = {
    Value: '',
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
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

  const navigate = useNavigate();

  const handleEditOld = (historia) => {
    setEditingHistoria(historia);
    form.setFieldsValue(historia);
    setModalVisible(true);
  };

  const handleEdit = (historia) => {
    navigate('/ver-historia-clinica', { state: { pacienteId: historia.id } });
  };

  

  const handleModalOk = () => {
    return <Navigate to="/home" />;
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleFieldChange = (value) => {
    const selectedField = formatos[0].validFields.find((field) => field.fieldName === value);
    setSelectedField(selectedField);
  };

  const getFieldValueInput = () => {
    if (!selectedField) {
      return <Input />;
    }

    if (selectedField.fieldOptions.length > 0) {
      return (
        <Select
          placeholder={`Seleccione ${selectedField.fieldName}`}
          onChange={(value) => form.setFieldsValue({ Value: value })}
        >
          {selectedField.fieldOptions.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
      );
    }

    return (
      <Input
        placeholder={`Ingrese ${selectedField.fieldName}`}
        onChange={(e) => form.setFieldsValue({ Value: e.target.value })}
      />
    );
  };

  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      const searchValue = form.getFieldValue('Value');
      const fieldName = selectedField ? selectedField.fieldName : 'Name';
      console.log('Values', initialValues.Value);
      console.log('Search Value:', searchValue);
      console.log('Field Name:', fieldName);
      const url = `https://localhost:7208/api/Pacient/GetByField`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: fieldName,
          value: searchValue,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al realizar la búsqueda: ${response.statusText}`);
      }

      const historiasData = await response.json();
      setHistoriasClinicas(historiasData);

      console.log('Resultado de la búsqueda:', historiasData);
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
    }
  };

  const handleSearchByRole = async () => {
    try {
      const url = `https://localhost:7208/api/Pacient/GetByRole`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al realizar la búsqueda: ${response.statusText}`);
      }

      const historiasData = await response.json();
      setHistoriasClinicas(historiasData);

      console.log('Resultado de la búsqueda:', historiasData);
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Rol', dataIndex: 'role', key: 'role' },
    {
      title: 'Nombre del Paciente',
      dataIndex: 'fieldsList',
      key: 'nombre',
      render: (fieldsList) => {
        const pacienteField = fieldsList.find((field) => field.name === 'firstName');
        return pacienteField ? pacienteField.value : null;
      },
    },{
      title: 'Apellido del Paciente',
      dataIndex: 'fieldsList',
      key: 'apellido',
      render: (fieldsList) => {
        const pacienteField = fieldsList.find((field) => field.name === 'lastName');
        return pacienteField ? pacienteField.value : null;
      },
    },
    {
      title: 'Tipo de documento',
      dataIndex: 'fieldsList',
      key: 'documentType',
      render: (fieldsList) => {
        const pacienteField = fieldsList.find((field) => field.name === 'idType');
        return pacienteField ? pacienteField.value : null;
      },
    },{
      title: 'Número de documento',
      dataIndex: 'fieldsList',
      key: 'documentType',
      render: (fieldsList) => {
        const pacienteField = fieldsList.find((field) => field.name === 'idNumber');
        return pacienteField ? pacienteField.value : null;
      },
    },
    {
      title: 'Edad del Paciente',
      dataIndex: 'fieldsList',
      key: 'edad',
      render: (fieldsList) => {
        const pacienteField = fieldsList.find((field) => field.name === 'age');
        return pacienteField ? pacienteField.value : null;
      },
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      key: 'acciones',
      render: (_, record) => (
        <>
          <Button type="primary" size="small" onClick={() => handleEdit(record)}>
            Ver Historia Clinica
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Historia Clínica</h2>

      <Form layout="inline">
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
        <Form.Item label="Valor" name="Value" placeholder="Ingrese $">
          {getFieldValueInput()}
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSearch}>
            Buscar
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSearchByRole}>
            Buscar por rol
          </Button>
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
