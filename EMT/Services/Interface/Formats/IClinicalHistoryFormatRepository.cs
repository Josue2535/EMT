﻿using EMT.Models.Formats;

namespace EMT.Services.Interface.Formats
{
    public interface IClinicalHistoryFormatRepository : IRepository<ClinicalHistoryFormat>
    {
        IEnumerable<ClinicalHistoryFormat> GetAll(List<string> list);
        ClinicalHistoryFormat GetByName(string name);

        // Valida si el formato de historia clínica es válido según el rol
        bool IsClinicalHistoryFormatValid(string json);
    }
}
