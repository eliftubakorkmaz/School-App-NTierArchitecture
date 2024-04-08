import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { ClassRoomModel } from '../../models/class-room.model';
import { CommonModule } from '@angular/common';
import { StudentModel } from '../../models/student.model';
import { HttpService } from '../../services/http.service';
import { FormsModule, NgForm } from '@angular/forms';
import { StudentPipe } from '../../pipes/student.pipe';
import { FormValidateDirective } from 'form-validate-angular';
import { SwalService } from '../../services/swal.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { DxDataGridModule } from 'devextreme-angular';
import { PaginationRequestModel } from '../../models/pagination-request.model';
import { PaginationResponseModel } from '../../models/pagination.response.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentPipe, FormValidateDirective, NgxPaginationModule, DxDataGridModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  classRooms: ClassRoomModel[] = [];
  response: PaginationResponseModel<StudentModel[]> = new PaginationResponseModel<StudentModel[]>();

  request: PaginationRequestModel = new PaginationRequestModel();

  p: number = 1;

  @ViewChild("addStudentModalCloseBtn") addStudentModalCloseBtn : ElementRef<HTMLButtonElement> | undefined;
  @ViewChild("addClassRoomModalCloseBtn") addClassRoomModalCloseBtn : ElementRef<HTMLButtonElement> | undefined;

  addStudentModel: StudentModel = new StudentModel();
  updateStudentModel: StudentModel = new StudentModel();

  addClassRoomModel: ClassRoomModel = new ClassRoomModel();

  pageNumbers: number[] = [1,2,3,4];

  search: string = "";

  isLoading: boolean = false;

  constructor(public http: HttpService, private swal: SwalService){
    this.getAllClassRooms();
  }

  changePage(pageNumber: number){
    if(pageNumber < 1){
      this.request.pageNumber = 1;
    } else {
      this.request.pageNumber = pageNumber;
    }
    
    this.getAllStudentsByClassRoomId(this.request.id);
  }

  getAllClassRooms()
  {
    this.http.get("ClassRooms/GetAll", (res) => {
      this.classRooms = res;

        if(this.classRooms.length >0){
          this.getAllStudentsByClassRoomId(this.classRooms[0].id);
        }
    })
  }

  getAllStudentsByClassRoomId(roomId: string | null){
    this.request.id = roomId;

    this.response.datas = [];

    this.isLoading = true;
    this.http.post("Students/GetAllByClassRoomId", this.request, res => {
      this.response = res;

      if(this.response.datas != null){
        this.calculatePageNumbers();

        this.response.datas = this.response.datas?.map((val, index) => {
          const indetityNumberPart1 = val.identityNumber.substring(0,2);
            const indetityNumberPart2 = val.identityNumber.substring(val.identityNumber.length -6,3);
    
            const newHashedIdentityNumber = indetityNumberPart1 + "******" +indetityNumberPart2;
    
            val.identityNumber = newHashedIdentityNumber;
            val.index = index + 1;
  
            return val;
        });
      }

      this.isLoading = false;
    },() => {
      this.isLoading = false;
    });
  }

  createStudent(form: NgForm){
    if(form.valid){
      if(this.addStudentModel.classRoomId === "0"){
        alert("You have choose a valid classroom");
        return;
      }

      this.http.post("Students/Create", this.addStudentModel, (res) => {
        console.log(res);

        this.addStudentModalCloseBtn?.nativeElement.click();
        this.swal.callToast(res.message);
        this.getAllStudentsByClassRoomId(this.addStudentModel.classRoomId);
        this.addStudentModel = new StudentModel();
      })
    }
  }

  clearAddStudentModel(){
    this.addStudentModel = new StudentModel();
    this.clearInputInvalidClass();
  }

  clearInputInvalidClass(){
    const inputs = document.querySelectorAll(".form-control.is-invalid");
    for(let i in inputs){
      const el = inputs[i];
      el.classList.remove("is-invalid");
    }
  }

  clearAddClassRoomModel(){
    this.addClassRoomModel = new ClassRoomModel();
    this.clearInputInvalidClass();
  }

  createClassRoom(form: NgForm){
    if(form.valid){
      this.http.post("ClassRooms/Create", this.addClassRoomModel, (res) => {
        this.swal.callToast(res.Message);
        this.addClassRoomModalCloseBtn?.nativeElement.click();
        this.getAllClassRooms();
      })
    }
  }

  calculatePageNumbers(){
    this.pageNumbers = [];

    const startNumber = this.response.pageNumber -2 <= 1 ? 1 : this.response.pageNumber -2;
    const endNumber = this.response.totalPages <= this.response.pageNumber + 4 ? this.response.totalPages : this.response.pageNumber + 4;

    for(let i = startNumber; i <= endNumber; i++) {
      this.pageNumbers.push(i);      
    }
  }
}
