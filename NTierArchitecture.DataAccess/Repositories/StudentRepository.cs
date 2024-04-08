using Microsoft.EntityFrameworkCore;
using NTierArchitecture.DataAccess.Context;
using NTierArchitecture.Entities.Models;
using System.Linq.Expressions;

namespace NTierArchitecture.DataAccess.Repositories;

public sealed class StudentRepository
    (ApplicationDbContext context) : IStudentRepository
{
    public void Create(Student student)
    {
        context.Add(student);
        context.SaveChanges();
    }

    public IQueryable<Student> GetAll()
    {
        return context.Students.AsNoTracking().AsQueryable();
    }

    public Student? GetStudentById(Guid studentId)
    {
        return context.Students.Find(studentId);
    }

    public void Update(Student student)
    {
        context.SaveChanges();
    }
    public void DeleteById(Guid Id)
    {
        Student? student = GetStudentById(Id);
        if (student is not null)
        {
            student.IsDeleted = true;
            context.SaveChanges();
        }
    }

    public int GetNewStudentNumber()
    {
        int lastStudentNumber = 0;
        if (context.Students.Any()) // Öğrenci koleksiyonunda herhangi bir öğe var mı kontrol et
        {
            lastStudentNumber = context.Students.Max(p => p.StudentNumber);
        }
        else
        {
            lastStudentNumber = 100; // Varsayılan bir başlangıç değeri
        }

        if (lastStudentNumber <= 100) lastStudentNumber = 100;
        lastStudentNumber++;


        return lastStudentNumber;
    }

    public bool Any(Expression<Func<Student, bool>> predicate)
    {
        return context.Students.AsNoTracking().Any(predicate);
    }
}