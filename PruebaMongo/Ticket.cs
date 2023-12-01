using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace PruebaMongo
{
    public class Ticket
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("idTicket")]
        public string IdTicket { get; set; }

        [BsonElement("idEstacion")]
        public string IdEstacion { get; set; }

        [BsonElement("idVagon")]
        public string IdVagon { get; set; }

        [BsonElement("idPuerta")]
        public string IdPuerta { get; set; }

        [BsonElement("tipoComponente")]
        public string TipoComponente { get; set; }

        [BsonElement("idComponente")]
        public string IdComponente { get; set; }

        [BsonElement("identificacion")]
        public string Identificacion { get; set; }

        [BsonElement("tipoMantenimiento")]
        public string TipoMantenimiento { get; set; }

        [BsonElement("nivelFalla")]
        public string NivelFalla { get; set; }

        [BsonElement("codigoFalla")]
        public string CodigoFalla { get; set; }

        [BsonElement("fechaApertura")]
        public DateTime FechaApertura { get; set; }

        [BsonElement("fechaCierre")]
        public DateTime FechaCierre { get; set; }

        [BsonElement("fechaArriboLocacion")]
        public DateTime FechaArriboLocacion { get; set; }

        [BsonElement("componenteParte")]
        public string ComponenteParte { get; set; }

        [BsonElement("tipoReparacion")]
        public string TipoReparacion { get; set; }

        [BsonElement("tipoAjusteConfiguracion")]
        public string TipoAjusteConfiguracion { get; set; }

        [BsonElement("descripcionReparacion")]
        public string DescripcionReparacion { get; set; }

        [BsonElement("diagnosticoCausa")]
        public string DiagnosticoCausa { get; set; }

        [BsonElement("tipoCausa")]
        public string TipoCausa { get; set; }

        [BsonElement("estadoTicket")]
        public string EstadoTicket { get; set; }
    }

}
