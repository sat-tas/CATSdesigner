﻿using System;
using System.Data.Entity;
using System.Linq;

using LMPlatform.Data.Infrastructure;

namespace Application.Infrastructure.DPManagement
{
    public static class AuthorizationHelper
    {
        public static void ValidateLecturerAccess(IDpContext context, int userId)
        {
            if (!IsLecturer(context, userId))
            {
                throw new ApplicationException("Only lecturers have permissions for this operation!");
            }
        }

        public static bool IsLecturer(IDpContext context, int userId)
        {
            return context.Users.Include(x => x.Lecturer).Single(x => x.Id == userId).Lecturer != null;
        }

        public static bool IsStudent(IDpContext context, int userId)
        {
            return context.Users.Include(x => x.Student).Single(x => x.Id == userId).Student != null;
        }

        public static bool IsGraduateStudent(IDpContext context, int userId)
        {
            return context.Users.Where(x => x.Id == userId).Select(x => x.Student).Any(context.StudentIsGraduate);
        }
    }
}
