import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Select, Table, Button, Modal, Form, Input, InputNumber, DatePicker, message } from 'antd';
import { useKeycloak } from '@react-keycloak/web';

const VerHistoriaClinica = () => {
  const location = useLocation();
  const pacienteId = location.state?.pacienteId;
  const { keycloak } = useKeycloak();
  const [historiaClinica, setHistoriaClinica] = useState(null);
  const [clinicalHistoryFormats, setClinicalHistoryFormats] = useState([]);
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      console.log('Valor de pacienteId:', pacienteId);
      if (pacienteId=== undefined) {
        // Si pacienteId no existe, navegar a la ruta clinicalhistory
        navigate('/clinicalhistory');
      }else{
      // Obtener datos de la historia clínica
      const responseHistoriaClinica = await fetch(`https://localhost:7208/api/ClinicalHistory/user/${pacienteId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
  
      if (!responseHistoriaClinica.ok) {
        // Si es un error 404, interpretamos que la historia clínica no existe y la creamos
        if (responseHistoriaClinica.status === 404) {
          await createClinicalHistory();
        } else {
          // En caso de otros errores, lanzamos una excepción
          throw new Error(`Error al obtener datos de la historia clínica: ${responseHistoriaClinica.statusText}`);
        }
      }
  
      const dataHistoriaClinica = await responseHistoriaClinica.json();
      console.log('Data recibida de la historia clínica:', dataHistoriaClinica);
  
      // Mapear datos de la historia clínica
      const formattedData = {
        id: dataHistoriaClinica.id,
        created: dataHistoriaClinica.created,
        patientId: dataHistoriaClinica.patientId,
        attachments: dataHistoriaClinica.attachments.map((attachment) => ({
          id: attachment.id,
          created: attachment.created,
          fields: attachment.fields,
          nameFormat: attachment.nameFormat,
        })),
      };
  
      setHistoriaClinica(formattedData);
  
      // Configurar opciones para el select (dropdown)
      const options = formattedData.attachments.map((attachment) => ({
        value: attachment.id,
        label: attachment.nameFormat,
      }));
      setSelectOptions(options);
    }
    } catch (error) {
      console.error('Error al obtener datos de la historia clínica:', error);
    }
  };

  const fetchClinicalHistoryFormats = async () => {
    try {
      // Obtener datos de los formatos de historia clínica
      const responseClinicalHistoryFormats = await fetch('https://localhost:7208/ClinicalHistoryFormat/GetByRole', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (!responseClinicalHistoryFormats.ok) {
        throw new Error(`Error al obtener datos de los formatos de historia clínica: ${responseClinicalHistoryFormats.statusText}`);
      }

      const dataClinicalHistoryFormats = await responseClinicalHistoryFormats.json();
      console.log('Data recibida de los formatos de historia clínica:', dataClinicalHistoryFormats);

      // Mapear datos de los formatos de historia clínica
      setClinicalHistoryFormats(dataClinicalHistoryFormats);
    } catch (error) {
      console.error('Error al obtener datos de los formatos de historia clínica:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchClinicalHistoryFormats();
  }, [pacienteId, keycloak.token]);

  const columns = [
    {
      title: 'Nombre del Adjunto',
      dataIndex: 'nameFormat',
      key: 'nameFormat',
    },
    {
      title: 'Fecha de Creación',
      dataIndex: 'created',
      key: 'created',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Button type="primary" size="large" onClick={() => handleViewAttachment(record)}>
          Ver Adjunto
        </Button>
      ),
    },
  ];

  const handleCreate = async () => {
    try {
      const selectedFormatId = form.getFieldValue('selectedFormat');
      const formatInfo = clinicalHistoryFormats.find((format) => format.id === selectedFormatId);
  
      // Configurar los valores iniciales del formulario
      const initialValues = {};
      formatInfo.validFields.forEach((field) => {
        initialValues[field.fieldName] = field.defaultValue || null;
      });
  
      form.setFieldsValue(initialValues);
  
      // Abre el modal de creación con el formato seleccionado
      setCreateModalVisible(true);
    } catch (error) {
      console.error('Error al crear la historia clínica:', error);
    }
  };
  

  const handleCreateOk = async () => {
    try {
      // Lógica para manejar la creación de la historia clínica con el formato seleccionado

      // Cerrar el modal después de la creación exitosa
      setCreateModalVisible(false);

      // Puedes realizar alguna lógica adicional si es necesario

    } catch (error) {
      console.error('Error while handling create ok action:', error);
    }
  };

  const handleCreateCancel = () => {
    // Cierra el modal si se cancela la creación
    setCreateModalVisible(false);
  };

  const createClinicalHistory = async () => {
    try {
      const response = await fetch('https://localhost:7208/api/ClinicalHistory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify({
          patientId: pacienteId,
          attachments: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al crear la historia clínica: ${response.statusText}`);
      }

      // Después de crear la historia clínica, volver a cargar la información
      fetchData();
    } catch (error) {
      console.error('Error al crear la historia clínica:', error);
    }
  };

  const handleViewAttachment = (attachment) => {
    setSelectedAttachment(attachment);
  };

  const renderFieldValue = (value) => {
    if (value instanceof Array) {
      return value.map((list, index) => (
        <div key={index}>
          {list.map(([name, val]) => (
            <div key={name}>
              <p style={{ marginLeft: '16px', fontSize: '16px' }}>{name}: {renderFieldValue(val)}</p>
            </div>
          ))}
        </div>
      ));
    } else if (typeof value === 'object' && value !== null) {
      return renderFieldValue(value.value);
    } else {
      return value;
    }
  };
  const renderFieldValueCreate = (field) => {
    switch (field.fieldType) {
      case 'String':
        return <Input />;
      case 'Number':
      case 'Integer':
        return <InputNumber />;
      case 'LocalDate':
        return <DatePicker />;
        case 'Attachment':
          if (field.fieldName === 'attachmentsList') {
            const attachmentsList = form.getFieldValue(field.fieldName) || [];
    
            return (
              <div>
                {attachmentsList.map((attachment, index) => (
                  <div key={index}>
                    {field.value.map((subfield) => (
                      <Form.Item
                        key={`${field.fieldName}-${index}-${subfield.name}`}
                        label={`${field.fieldName} - ${index + 1} - ${subfield.name}`}
                        name={`${field.fieldName}-${index}-${subfield.name}`}
                        rules={[
                          { required: !subfield.isOptional, message: `Por favor ingrese ${subfield.name}` },
                        ]}
                      >
                        {renderFieldValueCreate(subfield)}
                      </Form.Item>
                    ))}
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => {
                    form.setFieldsValue({
                      [field.fieldName]: [
                        ...attachmentsList,
                        field.value.reduce((acc, subfield) => {
                          acc[subfield.name] = subfield.defaultValue || null;
                          return acc;
                        }, {}),
                      ],
                    });
                  }}
                >
                  Agregar Conjunto
                </Button>
              </div>
            );
          } else {
            return (
              <Form.Item label={field.fieldName} name={field.fieldName}>
                <Input />
              </Form.Item>
            );
          }
      case 'List':
        return field.value.map((item, index) => (
          <Form.Item
            key={`${field.fieldName}-${index}`}
            label={`${field.fieldName} - ${index + 1}`}
            name={`${field.fieldName}-${index}`}
          >
            <Input />
          </Form.Item>
        ));
      // Añadir casos adicionales según sea necesario
      default:
        return null;
    }
  };
  
  
  

  if (!historiaClinica) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Historia Clínica</h2>
      <p style={{ fontSize: '18px' }}>ID del Paciente: {pacienteId}</p>
      <p style={{ fontSize: '18px' }}>Fecha de Creación: {historiaClinica.created}</p>

      <Form form={form} onFinish={handleCreate}>
        <Form.Item
          name="selectedFormat"
          label="Seleccione un formato"
          rules={[{ required: true, message: 'Seleccione un formato' }]}>
          <Select style={{ width: 300 }} placeholder="Seleccione un formato">
            {clinicalHistoryFormats.map((format) => (
              <Select.Option key={format.id} value={format.id}>
                {format.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Crear
        </Button>
      </Form>

      <Table dataSource={historiaClinica.attachments} columns={columns} rowKey="id" />

      {/* Modal para la creación */}
      <Modal
  title="Crear Historia Clínica"
  visible={createModalVisible}
  onOk={handleCreateOk}
  onCancel={handleCreateCancel}
>
  {/* Renderizar el formulario con el formato seleccionado */}
  {form.getFieldValue('selectedFormat') && (
    <>
      {clinicalHistoryFormats
        .find((format) => format.id === form.getFieldValue('selectedFormat'))
        .validFields.map((field) => (
          <div key={field.fieldName}>
            <h3>{field.fieldName}</h3>
            {renderFieldValueCreate(field)}

            {/* Agregar botón para agregar conjunto */}
            {field.fieldType === 'Attachment' && (
              <Button
                type="dashed"
                onClick={() => {
                  form.setFieldsValue({
                    [field.fieldName]: [
                      ...(form.getFieldValue(field.fieldName) || []),
                      [],
                    ],
                  });
                }}
              >
                Agregar Conjunto
              </Button>
            )}
          </div>
        ))}
    </>
  )}
</Modal>

      {selectedAttachment && (
        <Modal
          title="Detalles del Adjunto"
          visible={true}
          onOk={() => setSelectedAttachment(null)}
          onCancel={() => setSelectedAttachment(null)}
        >
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>ID: {selectedAttachment.id}</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Fecha de Creación: {selectedAttachment.created}</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Nombre del Formato: {selectedAttachment.nameFormat}</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Campos:</p>
          {selectedAttachment.fields.map((field) => (
            <div key={field.name}>
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{field.name}</p>
              <p style={{ fontSize: '16px' }}>{renderFieldValue(field.value)}</p>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
};

export default VerHistoriaClinica;