import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',

  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  userInfos:any
   message=""
   alert=""

  
  ngOnInit() {
  this.userInfos = { userId:localStorage.getItem("userId"),username: localStorage.getItem("username"), email:localStorage.getItem("email") };
}



  constructor(private http: HttpClient) {}

async save(username: string, email: string) {
  try {
    const res: any = await this.http.post('http://localhost:3000/api/auth/editprofile', {
      userid: this.userInfos.userId,
      username,
      email
    }).toPromise();
    if (res.message=="success"){
      this.alert="success"
      localStorage.setItem("email",res.newUser.email)
      localStorage.setItem("username",res.newUser.username)
      this.message ="you successfully updated your user infos"

    }
    else if (res.message=="duplication"){
      this.alert="duplication"
            this.message ="email or userame already used"
    }
    
  } catch (err: any) {
    console.log("error bad")
    
  }
}

  @Output() dataEvent = new EventEmitter<boolean>();

 

 hideTheEditUi(): void {
   const show = false
    this.dataEvent.emit(show);
    // TODO: Navigate to application form or open dialog
  }
}
