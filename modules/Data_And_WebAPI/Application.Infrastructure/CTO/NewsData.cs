﻿using LMP.Models;
using System.Collections.Generic;

namespace Application.Infrastructure.CTO
{
    public class NewsData
    {
        public int Id { get; set; }

        public int SubjectId { get; set; }

        public string Title { get; set; }

        public string Body { get; set; }

        public string DateCreate { get; set; }

        public bool Disabled { get; set; }

        public string PathFile { get; set; }

        public IList<Attachment> Attachments
        {
            get;
            set;
        }
    }
}