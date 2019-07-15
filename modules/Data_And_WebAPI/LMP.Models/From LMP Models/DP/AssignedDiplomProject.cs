using System;

namespace LMP.Models.From_LMP_Models.DP
{
    public class AssignedDiplomProject
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public int DiplomProjectId { get; set; }

        public DateTime? ApproveDate { get; set; }

        public int? Mark { get; set; }

        public virtual DiplomProject DiplomProject { get; set; }

        public virtual Student Student { get; set; }
    }
}