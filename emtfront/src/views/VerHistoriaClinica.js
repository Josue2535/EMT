import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Select, Table, Button, Modal } from 'antd';
import { useKeycloak } from '@react-keycloak/web';

const VerHistoriaClinica = () => {
  const location = useLocation();
  const pacienteId = location.state?.pacienteId;
  const { keycloak } = useKeycloak();
  const [historiaClinica, setHistoriaClinica] = useState(null);
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://localhost:7208/api/ClinicalHistory/user/${pacienteId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener datos: ${response.statusText}`);
        }

        const data = await response.json();
        setHistoriaClinica(data);

        const options = data.attachments.map((attachment) => ({
          value: attachment.id,
          label: attachment.nameFormat,
        }));
        setSelectOptions(options);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchData();
  }, [pacienteId, keycloak.token]);

  const columns = [
    // Definición de tus columnas
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
        <Button type="primary" size="small" onClick={() => handleViewAttachment(record)}>
          Ver Adjunto
        </Button>
      ),
    },
  ];

  const handleCreate = (value) => {
    console.log('Crear nueva entrada con ID:', value);
    // Lógica para crear una nueva entrada (puedes redirigir a una nueva pantalla o mostrar un modal, etc.)
  };

  const handleViewAttachment = (attachment) => {
    setSelectedAttachment(attachment);
    Modal.info({
      title: 'Detalles del Adjunto',
      content: (
        <div>
          <p>ID: {attachment.id}</p>
          <p>Fecha de Creación: {attachment.created}</p>
          {/* Agrega aquí la lógica para mostrar los campos del attachment */}
        </div>
      ),
      onOk() {
        setSelectedAttachment(null);
      },
    });
  };

  if (!historiaClinica) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2>Historia Clínica</h2>
      <p>ID del Paciente: {pacienteId}</p>
      <p>Fecha de Creación: {historiaClinica.created}</p>

      <Select
        style={{ width: 120 }}
        options={selectOptions}
        placeholder="Seleccionar"
        onChange={handleCreate}
      >
        Crear
      </Select>

      <Table dataSource={historiaClinica.attachments} columns={columns} rowKey="id" />

      {selectedAttachment && (
        <Modal
          title="Detalles del Adjunto"
          visible={true}
          onOk={() => setSelectedAttachment(null)}
          onCancel={() => setSelectedAttachment(null)}
        >
          <p>ID: {selectedAttachment.id}</p>
          <p>Fecha de Creación: {selectedAttachment.created}</p>
          {/* Agrega aquí la lógica para mostrar los campos del attachment */}
        </Modal>
      )}
    </div>
  );
};

export default VerHistoriaClinica;
