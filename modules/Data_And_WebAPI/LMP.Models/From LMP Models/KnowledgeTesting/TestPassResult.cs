﻿using System;
using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models.KnowledgeTesting
{
    public class TestPassResult : ModelBase
    {
        public int StudentId { get; set; }

        public int TestId { get; set; }

        public int? Points { get; set; }

        public int? Percent { get; set; }

        public DateTime StartTime { get; set; }

        public User User { get; set; }

        public string Comment { get; set; }

        public int? CalculationType { get; set; }

        public string TestName { get; set; }
    }
}