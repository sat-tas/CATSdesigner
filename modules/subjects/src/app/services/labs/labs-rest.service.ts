import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";

import { CreateLessonEntity } from './../../models/form/create-lesson-entity.model';
import { StudentMark } from './../../models/student-mark.model';
import { Lab } from "../../models/lab.model";
import { UpdateLab } from 'src/app/models/form/update-lab.model';
import { UserLabFile } from 'src/app/models/user-lab-file.model';
import { CorrectDoc } from 'src/app/models/plagiarism-result.model';
import { PlagiarismResultSubject } from 'src/app/models/plagiarism-result-subject.model';
import { ScheduleProtectionLab } from 'src/app/models/schedule-protection/schedule-protection-lab.model';
import { HasGroupJobProtection } from 'src/app/models/job-protection/has-group-job-protection.model';
import { StudentJobProtection } from 'src/app/models/job-protection/student-job-protection.mode';
import { GroupJobProtection } from 'src/app/models/job-protection/group-job-protection.model';

@Injectable({
  providedIn: 'root'
})

export class LabsRestService {

  constructor(private http: HttpClient) {}

  public getLabWork(subjectId: number): Observable<Lab[]> {
    return this.http.get('/Services/Labs/LabsService.svc/GetLabs/' + subjectId).pipe(
      map(res => res['Labs'])
    );
  }

  public getProtectionSchedule(subjectId: number, groupId: number): Observable<{ labs: Lab[], scheduleProtectionLabs: ScheduleProtectionLab[]}> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId.toString());
    return this.http.get('Services/Labs/LabsService.svc/GetLabsV2', {params}).pipe(
      map(res => {
        return {labs: res['Labs'],
          scheduleProtectionLabs: res['ScheduleProtectionLabs']}
      })
    )
  }

  public getMarksV2(subjectId: number, groupId: number): Observable<StudentMark[]> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId.toString());
    return this.http.get('Services/Labs/LabsService.svc/GetMarksV3', {params}).pipe(
      map(res => res['Students']))
  }

  public saveLab(lab: CreateLessonEntity) {
    return this.http.post('Services/Labs/LabsService.svc/Save', lab);
  }
  public updateLabsOrder(subjectId: number, prevIndex: number, curIndex: number) {
    return this.http.post('Services/Labs/LabsService.svc/UpdateLabsOrder', { subjectId, prevIndex, curIndex });
  }

  public updateLabs(labs: UpdateLab[]) {
    return this.http.post('Services/Labs/LabsService.svc/UpdateLabs', { labs });
  }

  public deleteLab(lab: { id: number, subjectId: number }) {
    return this.http.post('Services/Labs/LabsService.svc/Delete', lab);
  }

  public setLabsVisitingDate(body: { Id: number[], comments: string[], dateId: number, marks: string[], showForStudents: boolean[], students: StudentMark[] }): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/SaveLabsVisitingData', body);
  }

  public setLabsMark(body: { studentId: number, labId: number, mark: string, comment: string, date: string, id: number, showForStudent: boolean } ): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/SaveStudentLabsMark', body);
  }

  public getFilesLab(subjectId: number, userId: number): Observable<UserLabFile[]> {
    return this.http.post('Services/Labs/LabsService.svc/GetFilesLab', { subjectId, userId }).pipe(
      map(res => res['UserLabFiles']));
  }

  public getUserLabFiles(userId: number, subjectId: number): Observable<UserLabFile[]> {
    const params = new HttpParams()
    .append('userId', userId.toString())
    .append('subjectId', subjectId.toString());
    return this.http.get('Services/Labs/LabsService.svc/GetUserLabFiles', { params }).pipe(
      map(res => res['UserLabFiles'])
    );
  }

  public deleteUserFile(id: number): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/DeleteUserFile', { id });
  }

  public sendUserFile(body: { subjectId: number, userId: number, id: number, comments: string, pathFile: string, attachments: string, labId: number }): Observable<UserLabFile> {
    return this.http.post<UserLabFile>('Services/Labs/LabsService.svc/SendFile', body);
  }

  public getAllStudentFilesLab(subjectId: number, groupId: number): Observable<StudentMark[]> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId.toString());
    return this.http.get('Services/Labs/LabsService.svc/GetFilesV2', {params}).pipe(
      map(res => res['Students']));
  }

  public receiveLabFile(userFileId: number): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/ReceivedLabFile', { userFileId });
  }

  public cancelLabFile(userFileId: number): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/CancelReceivedLabFile', { userFileId });
  }

  public returnLabFile(userFileId: number): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/ReturnLabFile', { userFileId });
  }

  public checkPlagiarism(subjectId: number, userFileId: number ): Observable<CorrectDoc[]> {
    return this.http.post('Services/Labs/LabsService.svc/CheckPlagiarism', { userFileId, subjectId, isCp: false }).pipe(
      map(res => res['DataD'])
    );
  }

  public checkPlagiarismSubjects(body: { subjectId: number, type: string, threshold: string, isCp: false }): Observable<PlagiarismResultSubject[]> {
   console.log(body)
    return this.http.post('Services/Labs/LabsService.svc/CheckPlagiarismSubjects', body).pipe(
      map(res => res['DataD'])
    );
  }

  public getLabsMarksExcel(subjectId: number, groupId: number): Observable<Blob> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId.toString());
      const headers = new HttpHeaders()
    return this.http.get(`Statistic/GetLabsMarks`, { params, responseType: 'blob' });
  }

  public getVisitLabsExcel(subjetId: number, groupId: number): Observable<Blob> {
    const params = new HttpParams()
      .set('subjectId', subjetId.toString())
      .set('groupId', groupId.toString());
    return this.http.get('Statistic/GetVisitLabs', { params, responseType: 'blob' });
  }

  public getLabsZip(subjectId: number, groupId: number): Observable<ArrayBuffer> {
    const params = new HttpParams()
      .set('id', groupId.toString())
      .set('subjectId', subjectId.toString());
    return this.http.get('Subject/GetZipLabs', { params, responseType: 'arraybuffer' });
  }

  public hasJobProtections(subjectId: number, isActive: boolean): Observable<HasGroupJobProtection[]> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('isActive', String(isActive));
    
    return this.http.get('Services/Labs/LabsService.svc/HasSubjectLabsJobProtection', { params }).pipe(
      map(response => response['HasGroupsJobProtection'])
    );
  }

  public hasGroupsJobProtections(subjectId: number, groupsIds: number[]): Observable<HasGroupJobProtection[]> {
    return this.http.post('Services/Labs/LabsService.svc/HasGroupsLabsJobProtections', { subjectId, groupsIds }).pipe(
      map(response => response['HasGroupsJobProtection'])
    );
  }


  public getGroupJobProtection(subjectId: number, groupId: number): Observable<GroupJobProtection> {
    const params = new HttpParams()
      .append('subjectId', subjectId.toString())
      .append('groupId', groupId.toString());
    return this.http.get<GroupJobProtection>('Services/Labs/LabsService.svc/GroupJobProtection', { params });
  }

}
