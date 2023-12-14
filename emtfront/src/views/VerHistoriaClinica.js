import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Select, Table, Button, Modal, Input } from 'antd';
import { useKeycloak } from '@react-keycloak/web';

const VerHistoriaClinica = () => {
  const location = useLocation();
  const pacienteId = location.state?.pacienteId;
  const { keycloak } = useKeycloak();
  const [historiaClinica, setHistoriaClinica] = useState(null);
  const [clinicalHistoryFormats, setClinicalHistoryFormats] = useState([]);
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  const fetchData = async () => {
    try {
      // Obtener datos de la historia clínica
      const responseHistoriaClinica = await fetch(`https://localhost:7208/api/ClinicalHistory/user/${pacienteId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (!responseHistoriaClinica.ok) {
        throw new Error(`Error al obtener datos de la historia clínica: ${responseHistoriaClinica.statusText}`);
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

  const handleCreate = async (value) => {
    console.log('Crear nueva entrada con ID:', value);
    await createClinicalHistory();
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

  if (!historiaClinica) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Historia Clínica</h2>
      <p style={{ fontSize: '18px' }}>ID del Paciente: {pacienteId}</p>
      <p style={{ fontSize: '18px' }}>Fecha de Creación: {historiaClinica.created}</p>

      <Select style={{ width: 300 }} placeholder="Seleccione un formato">
        {clinicalHistoryFormats.map((format) => (
          <Select.Option key={format.id} value={format.id}>
            {format.name}
          </Select.Option>
        ))}
      </Select>

      <Button type="primary" onClick={() => handleCreate()}>Crear</Button>

      <Table dataSource={historiaClinica.attachments} columns={columns} rowKey="id" />

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
