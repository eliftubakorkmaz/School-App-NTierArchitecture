using AutoMapper;
using NTierArchitecture.Entities.DTOs;
using NTierArchitecture.Entities.Models;

namespace NTierArchitecture.Business.Mapping;
public sealed class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<UpdateStudentDto, Student>();
        CreateMap<CreateStudentDto, Student>();

        CreateMap<CreateClassRoomDto, ClassRoom>();
        CreateMap<UpdateClassRoomDto, ClassRoom>();
    }
}
