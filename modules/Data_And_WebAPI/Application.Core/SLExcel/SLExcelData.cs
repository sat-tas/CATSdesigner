﻿using System.Collections.Generic;
using DocumentFormat.OpenXml.Spreadsheet;

namespace Application.Core.SLExcel
{
    public class SLExcelStatus
    {
        public string Message { get; set; }

        public bool Success => string.IsNullOrWhiteSpace(Message);
    }

    public class SLExcelData
    {
        public SLExcelData()
        {
            Status = new SLExcelStatus();
            Headers = new List<string>();
            DataRows = new List<List<string>>();
        }

        public SLExcelStatus Status { get; set; }

        public Columns ColumnConfigurations { get; set; }

        public List<string> Headers { get; set; }

        public List<List<string>> DataRows { get; set; }

        public string SheetName { get; set; }
    }
}