import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Select, Table, Button, Modal, Form, Input, InputNumber, DatePicker, message } from 'antd';
import { useKeycloak } from '@react-keycloak/web';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const date = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'full',
  timeStyle: 'short',
})

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
  const [attachmentsList, setAttachmentsList] = useState([{ campos: [] }]);
  const [fieldValues, setFieldValues] = useState({});
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      console.log('Valor de pacienteId:', pacienteId);
      if (pacienteId === undefined) {
        // Si pacienteId no existe, navegar a la ruta clinicalhistory
        navigate('/clinicalhistory');
      } else {
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

  const handleDownloadPDF = async () => {
    try {
      const attachmentDetails = selectedAttachment;
  
      // Crear un contenedor para el HTML que deseas convertir a PDF
      const container = document.createElement('div');
  
      // Agregar la información del JSON al contenedor
      container.innerHTML = `
        <h2>${attachmentDetails.nameFormat}</h2>
        <p>ID: ${attachmentDetails.id}</p>
        <p>Fecha de Creación: ${attachmentDetails.created}</p>
        <p>Campos:</p>
        <ul>
          ${attachmentDetails.fields.map((field) => `<li>${field.name}: ${field.value}</li>`).join('')}
        </ul>
      `;
  
      // Esperar a que el contenedor esté en el DOM antes de utilizar html2canvas
      document.body.appendChild(container);
  
      // Utilizar html2canvas para capturar el contenido del contenedor como una imagen
      const canvas = await html2canvas(container, { scale: 15 });
  
      // Crear un objeto jsPDF y agregar la imagen como una página
      const pdf = new jsPDF({ unit: 'mm', format: 'A4' }); // Ajusta el formato según tus necesidades
      pdf.setFontSize(18);
      pdf.setTextColor(0, 18, 13);
      pdf.text('HISTORIA CLINICA', 105, 15, { align: 'center' }); // Ajusta la posición según tus necesidades
  
      // Iterar sobre los campos y agregarlos al PDF
      let currentY = 40; // Ajusta la posición inicial según tus necesidades
      attachmentDetails.fields.forEach((field) => {
        pdf.text(`${field.name}: ${field.value}`, 10, currentY);
        currentY += 10; // Ajusta el espaciado vertical según tus necesidades
      });
  
      // Descargar el PDF con el nombre deseado
      pdf.save('formulario.pdf');
  
      setSelectedAttachment(null);
  
      // Remover el contenedor del DOM después de usarlo si es necesario
      document.body.removeChild(container);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
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
  const handleRemoveAttachmentSet = (setIndex) => {
    // Crear una copia del estado actual
    const currentAttachmentsList = [...attachmentsList];

    // Eliminar el conjunto seleccionado
    currentAttachmentsList.splice(setIndex, 1);

    // Actualizar el estado local y el valor del campo en el formulario
    setAttachmentsList(currentAttachmentsList);
    form.setFieldsValue({
      'Adjuntos': currentAttachmentsList,
    });
  };
  const [attachmentSets, setAttachmentSets] = useState(1);
  const handleAddAttachmentField = () => {

    console.log(attachmentSets);
    // Incrementar el número de conjuntos
    setAttachmentSets((prevSets) => prevSets + 1);

    // Añadir un nuevo conjunto vacío al estado local del formulario
    setAttachmentsList((prevList) => [...prevList, { campos: [] }]);

    // Actualizar el valor del campo en el formulario
    form.setFieldsValue({
      'Adjuntos': [...attachmentsList, { campos: [] }],
    });
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

      // Agregar un conjunto vacío para el campo Attachment
      initialValues['attachmentsList'] = [{}];

      form.setFieldsValue(initialValues);

      // Abre el modal de creación con el formato seleccionado
      setCreateModalVisible(true);
    } catch (error) {
      console.error('Error al crear la historia clínica:', error);
    }
  };


  const handleFieldChange = (value, fieldName) => {
    // Almacena el valor en el estado local (fieldValues)
    setFieldValues((prevValues) => ({
      ...prevValues,
      [`${fieldName}value`]: value,
    }));
  };
  const handleDeleteAttachmentSet = (field) => {
    const attachmentsList = form.getFieldValue(field.fieldName) || [];

    // Eliminar el último conjunto
    attachmentsList.pop();

    // Actualizar el campo de adjuntos en el formulario
    form.setFieldsValue({
      [field.fieldName]: attachmentsList,
    });
  };

  const handleCreateOk = async () => {
    try {
      // Validar los campos del formulario antes de obtener sus valores
      await form.validateFields();
      const values = await form.validateFields();
      // Obtener el valor del campo 'selectedFormat'
      const selectedFormatId = form.getFieldValue('selectedFormat');
      const formValues = form.getFieldsValue();
      const combinedValues = { ...formValues, ...fieldValues };
      // Encontrar los detalles del formato seleccionado
      const selectedFormat = clinicalHistoryFormats.find((format) => format.id === selectedFormatId);

      // Verificar si selectedFormat es indefinido
      if (!selectedFormat) {
        throw new Error('Selected format is undefined');
      }

      // Inicializar la estructura JSON
      const jsonPayload = {
        nameFormat: selectedFormat.name,
        fields: [],
      };

      // Iterar a través de los campos válidos del formato seleccionado
      for (const field of selectedFormat.validFields) {
        const fieldName = field.fieldName;

        // Obtener el valor del campo del objeto formValues
        let fieldValue;

        if (field.fieldType === 'Attachment' && fieldName === 'Adjuntos') {
          fieldValue = form.getFieldValue(fieldName) || [];
        } else {
          fieldValue = combinedValues[fieldName + 'value'];
        }
        console.log(`Processing field ${fieldName}, value:`, fieldValue); // Log field values for debugging

        // Verificar si fieldValue es indefinido o nulo
        if (fieldValue !== undefined && fieldValue !== null) {
          // Determinar el tipo de campo y formatear según sea necesario
          if (field.fieldType === 'Attachment' && fieldName === 'Adjuntos') {
            // Manejar el campo Adjuntos
            const attachmentsList = form.getFieldValue(field.fieldName) || [];
            const attachmentList = attachmentsList.map((set) => {
              return set.campos.map((campo) => ({
                name: campo.nombreCampo,
                value: campo.valorCampo,
              }));
            });
            jsonPayload.fields.push({ name: field.fieldName, value: attachmentList });
          } else {
            // Manejar otros tipos de campos (String, Number, Integer, etc.)
            jsonPayload.fields.push({ name: fieldName, value: fieldValue });
          }
        }
      }

      // Esperar a que fetchData se complete antes de continuar
      await fetchData();
      console.log('JSON Payload:', jsonPayload);
      // Enviar los datos al servidor
      const response = await fetch(`https://localhost:7208/api/ClinicalHistory/${pacienteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify(jsonPayload),
      });

      if (!response.ok) {
        throw new Error(`Error while creating clinical history: ${response.statusText}`);
      }

      // Después de la creación exitosa, recargar la información (fetchData se llama nuevamente para obtener datos actualizados)
      await fetchData();

      // Limpiar los campos del formulario
      form.resetFields();

      // Cerrar el modal después de la creación exitosa
      setCreateModalVisible(false);

      // Lógica adicional si es necesario

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

  const handleAddCampo = (setIndex) => {
    // Crear una copia del estado actual
    const currentAttachmentsList = [...attachmentsList];

    // Asegurar que el campo "campos" esté inicializado
    currentAttachmentsList[setIndex].campos = currentAttachmentsList[setIndex].campos || [];

    // Añadir un nuevo campo al conjunto seleccionado
    currentAttachmentsList[setIndex].campos.push({ nombreCampo: '', valorCampo: '' });

    // Actualizar el estado local y el valor del campo en el formulario
    setAttachmentsList(currentAttachmentsList);
    form.setFieldsValue({
      'Adjuntos': currentAttachmentsList,
    });
  };



  const handleRemoveCampo = (setIndex, campoIndex) => {
    // Crear una copia del estado actual
    const currentAttachmentsList = [...attachmentsList];

    // Eliminar el campo del conjunto seleccionado
    currentAttachmentsList[setIndex].campos.splice(campoIndex, 1);

    // Actualizar el estado local y el valor del campo en el formulario
    setAttachmentsList(currentAttachmentsList);
    form.setFieldsValue({
      'Adjuntos': currentAttachmentsList,
    });
  };


  const renderFieldValueCreate = (field) => {
    switch (field.fieldType) {
      case 'String':
        return (
          <Form.Item
            label={field.fieldName}
            name={field.fieldName + 'value'}
            key={field.fieldName + 'value'}
            rules={[{ required: true, message: `Please input ${field.fieldName}!` }]}
          >
            <Input onChange={(e) => handleFieldChange(e.target.value, field.fieldName)} />
          </Form.Item>
        );
      case 'Number':
      case 'Integer':
        return (
          <Form.Item
            label={field.fieldName}
            name={field.fieldName + 'value'}
            key={field.fieldName + 'value'}
            rules={[{ required: true, message: `Please input ${field.fieldName}!` }]}
          >
            <InputNumber onChange={(value) => handleFieldChange(value, field.fieldName)} />
          </Form.Item>
        );
      case 'LocalDate':
        return (
          <Form.Item label={field.fieldName}
            name={field.fieldName + 'value'}
            key={field.fieldName + 'value'}
            rules={[{ required: true, message: `Please input ${field.fieldName}!` }]}>
            <DatePicker onChange={(e) => handleFieldChange(e, field.fieldName)} />
          </Form.Item>
        );
      case 'Attachment':
        if (field.fieldName === 'Adjuntos') {
          const attachmentsList = form.getFieldValue(field.fieldName) || [];

          return (
            <div>
              <Button
                type="primary"
                onClick={() => handleAddAttachmentField(field)}
                style={{ marginBottom: '8px' }}
              >
                Añadir Adjunto
              </Button>

              {attachmentsList.map((set, currentSetIndex) => (
                <div key={currentSetIndex} style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}>
                  <Button
                    type="danger"
                    onClick={() => handleRemoveAttachmentSet(currentSetIndex)}
                    style={{ marginBottom: '8px' }}
                  >
                    Eliminar Adjunto
                  </Button>

                  <Button
                    type="primary"
                    onClick={() => handleAddCampo(currentSetIndex)}
                    style={{ marginRight: '8px' }}
                  >
                    Añadir Campo
                  </Button>

                  {set.campos && set.campos.map((campo, campoIndex) => (
                    <div key={campoIndex} style={{ display: 'flex', marginBottom: '8px' }}>
                      <Form.Item
                        label="Nombre del Campo"
                        name={`campoNombre-${currentSetIndex}-${campoIndex}`}
                        style={{ marginRight: '8px', flex: 1 }}
                      >
                        <Input
                          onChange={(e) => {
                            // Manejar el cambio de valor y actualizar el estado local
                            const newValues = [...attachmentsList];
                            newValues[currentSetIndex].campos[campoIndex].nombreCampo = e.target.value;
                            setAttachmentsList(newValues);
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Valor del Campo"
                        name={`campoValor-${currentSetIndex}-${campoIndex}`}
                        style={{ marginRight: '8px', flex: 1 }}
                      >
                        <Input
                          onChange={(e) => {
                            // Manejar el cambio de valor y actualizar el estado local
                            const newValues = [...attachmentsList];
                            newValues[currentSetIndex].campos[campoIndex].valorCampo = e.target.value;
                            setAttachmentsList(newValues);
                          }}
                        />
                      </Form.Item>
                      <Button
                        type="danger"
                        onClick={() => handleRemoveCampo(currentSetIndex, campoIndex)}
                      >
                        Eliminar Campo
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        } else {
          return (
            <Form.Item label={field.fieldName}>
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



  // Agrega esta función en tu componente
  const handleAddAttachment = () => {
    const attachmentsList = form.getFieldValue('Adjuntos') || [];

    // Añadir un nuevo conjunto vacío
    attachmentsList.push({ campos: [] });

    // Actualizar el valor del campo en el formulario
    form.setFieldsValue({
      'Adjuntos': attachmentsList,
    });
  };






  if (!historiaClinica) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Historia Clínica</h2>
      <p style={{ fontSize: '18px' }}>ID del Paciente: {pacienteId}</p>
      <p style={{ fontSize: '18px' }}>Fecha de Creación: {date.format(new Date(historiaClinica.created))}</p>

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

        <Button type="primary" onClick={handleCreate} style={{ marginBottom: '16px' }}>
          Crear Historia Clinica
        </Button>
      </Form>

      <Table dataSource={historiaClinica.attachments} columns={columns} rowKey="id" />

      {/* Modal para la creación */}
      <Modal
        title="Crear Historia Clínica"
        visible={createModalVisible}
        onOk={handleCreateOk} 
        okText="Guardar"
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
                </div>
              ))}
          </>
        )}
      </Modal>

      {selectedAttachment && (
        <Modal
          title="Detalles del Adjunto"
          visible={true}
          onOk={() => handleDownloadPDF()}
          okText = "Descargar PDF"
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