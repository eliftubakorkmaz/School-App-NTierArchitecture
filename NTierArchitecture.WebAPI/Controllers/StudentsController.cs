using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NTierArchitecture.Business;
using NTierArchitecture.Entities.DTOs;

namespace NTierArchitecture.WebAPI.Controllers;
[Route("api/[controller]/[action]")]
[ApiController]
[Authorize(AuthenticationSchemes = "Bearer")]
public sealed class StudentsController(IStudentService studentService) : ControllerBase
{
    [HttpPost]
    public IActionResult Create(CreateStudentDto request)
    {
        string message = studentService.Create(request);
        return Ok(new { message = message });
    }

    [HttpPost]
    public IActionResult Update(UpdateStudentDto request)
    {
        string message = studentService.Update(request);
        return Ok(new { message = message });
    }

    [HttpGet("{id}")]
    public IActionResult DeleteById(Guid id)
    {
        string message = studentService.DeleteById(id);
        return Ok(new { message = message });
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = studentService.GetAll();
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> GetAllByClassRoomId(PaginationRequestDto request)
    {
        var response = await studentService.GetAllByClassRoomIdAsync(request);
        return Ok(response);
    }
}
