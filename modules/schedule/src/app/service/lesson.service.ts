import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DatePipe} from '@angular/common';
import {TranslatePipe} from '../../../../../container/src/app/pipe/translate.pipe';


@Injectable({
  providedIn: 'root'
})
export class LessonService {

  lessonTypes: string[][] = [['0',  this.translate.transform('text.schedule.lecture.cut', 'Лекция')],
    ['1', this.translate.transform('text.schedule.workshop.cut', 'Практ. зан.') ],
    ['2', this.translate.transform('text.schedule.lab.cut', 'Лаб. работа')],
    ['3', this.translate.transform('text.schedule.course.project.cut', 'КП')],
    ['4', this.translate.transform('text.schedule.graduation.project.cut', 'ДП')]];

  lessonTypesFull: string[][] = [['0', this.translate.transform('text.schedule.lecture', 'Лекция')],
    ['1', this.translate.transform('text.schedule.workshop', 'Практическое занятие') ],
    ['2', this.translate.transform('text.schedule.lab', 'Лабораторная работа') ],
    ['3', this.translate.transform('text.schedule.course.project', 'Консультация по курсовому проектированию') ],
    ['4', this.translate.transform('text.schedule.graduation.project', 'Консультация по дипломному проектированию')]];

  constructor(private http: HttpClient,
              private datePipe: DatePipe,
              private translate: TranslatePipe) {
  }
  getAllLessons(username: string): Observable<any> {
    return this.http.post<any>('/Profile/GetProfileInfoCalendar', {userLogin: username});
  }

  getGroupsBySubjectId(id: number): Observable<any> {
    return this.http.get<any>('/Services/CoreService.svc/GetGroupsV2/' + id);
  }

  getLessonsByDates(start: string, end: string): Observable<any> {
    return this.http.get<any>('/Services/Schedule/ScheduleService.svc/GetSchedule?dateStart=' + start + '&dateEnd=' + end);
  }

  saveLab(Lab: any, dateLab: string): Observable<any> {
    return this.http.post<any>('/Services/Schedule/ScheduleService.svc/SaveDateLab',
      {id: Lab.Id, subjectId: Lab.SubjectId, date: dateLab, startTime: Lab.Start,
            endTime: Lab.End, building: Lab.Building, audience: Lab.Audience, subGroupId: Lab.SubGroupId});
  }

  deleteLab(idLab: any, subjId: any): Observable<any> {
    return this.http.post<any>('/Services/Schedule/ScheduleService.svc/DeleteLabScheduleDate', {id: idLab, subjectId: subjId});
  }

  savePractical(pract: any, datePr: string): Observable<any> {
    return this.http.post<any>('/Services/Schedule/ScheduleService.svc/SaveDatePractical',
      {id: pract.Id, subjectId: pract.SubjectId, date: datePr, startTime: pract.Start,
            endTime: pract.End, building: pract.Building, audience: pract.Audience,  groupId: pract.GroupId });
  }

  deletePractical(idPract: any, subjId: any): Observable<any> {
    return this.http.post<any>('/Services/Schedule/ScheduleService.svc/DeleteLabScheduleDate', {id: idPract, subjectId: subjId});
  }

  saveLecture(lect: any, dateLes: string): Observable<any> {
    return this.http.post<any>('/Services/Schedule/ScheduleService.svc/SaveDateLectures',
      {id: lect.Id, subjectId: lect.SubjectId, date: dateLes, startTime: lect.Start,
        endTime: lect.End, building: lect.Building, audience: lect.Audience});
  }

  deleteLecture(lectId: any, subjId: any): Observable<any> {
    return this.http.post<any>('/Services/Schedule/ScheduleService.svc/DeleteLectureScheduleDate', {id: lectId, subjectId: subjId});
  }

  getLessonsByDateAndTimes(date: string, start: string, end: string): Observable<any> {
    return this.http.get<any>('/Services/Schedule/GetScheduleBetweenTime?date=' + date + '&startTime=' + start + '&endTime=' + end);

  }

  getSubjectOwner(subjId: any): Observable<any> {
    return this.http.get<any>('/Services/Subjects/SubjectsService.svc/GetSubjectOwner/' + subjId);
  }

  getAllSubjects(username: string): Observable<any> {
    return this.http.post<any>('/Profile/GetProfileInfoSubjects', {userLogin: username});
  }

  saveLessonNote(lessonId: number, message: string): Observable<any> {
    return this.http.post<any>('/Services/Notes/NotesService.svc/SaveNote', {subjectId: lessonId, text: message});
  }

  getSubject(title: string): any {
    const splitted = title.split('|', 9);
    return splitted[8];
  }

  getType(title: string): any {
    const splitted = title.split('|', 5);
    return ' ' + splitted[4] + ' ';
  }

  getColor(title: string): any {
    const splitted = title.split('|', 7);
    return splitted[6];
  }

  getTeacher(title: string): any {
    const splitted = title.split('|', 6);
    return splitted[5];
  }

  getAudience(title: string): any {
    const splitted = title.split('|', 3);
    return splitted[1];
  }

  getBuilding(title: string): any {
    const splitted = title.split('|', 3);
    return splitted[2];
  }

  getMemo(title: string): any {
    const splitted = title.split('|', 10);
    return splitted[9];
  }

  getThirdString(title: string): any {
    const splitted = title.split('|', 6);
    return splitted[5];
  }

  getColorLesson(event: any): any {
    if (this.isLesson(event)) {
      const splitted = event.title.split('|', 7);
      return splitted[6];
    } else {
      return 'white';
    }
  }

  getReferenceToSubject(title: string): any {
    const splitted = title.split('|', 8);
    return '/Subject?subjectId=' + splitted[7];
  }

  getLocation(title: string): any {
    const splitted = title.split('|', 3);
    let a = splitted[2];
    if (a.length != 0) {
      a = ' к. ' + a;
    }

    return 'а.' + splitted[1] + a;
  }

  getName(title: string): any {
    const splitted = title.split('|', 5);
    return splitted[3];
  }

  getTime(title: string): any {
    const splitted = title.split('|', 3);
    return splitted[0];
  }

  getGroupId(title: string): any {
    const splitted = title.split('|', 11);
    return +splitted[10];
  }

  getSubGroupId(title: string): any {
    const splitted = title.split('|', 12);
    return +splitted[12];
  }

  isLesson(event): boolean {
    return event.meta === 'lesson';
  }

  formatDate1(date: Date): string {
    return this.datePipe.transform(date, 'MM/dd/yyyy');
  }

  formatDate2(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  formatDate3(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy');
  }

  formatDate4(date: Date): string {
    return this.datePipe.transform(date, 'dd.MM.yyyy');
  }

  getLessonType(): any {
    return this.lessonTypes;
  }

  getLessonTypeFull(): any {
    return this.lessonTypesFull;
  }

  getLessonTypeById(id: string): any {
    return this.lessonTypes.find(type => type[0] == id)[1];
  }

  cutTeacherName(name: string): string {
    if (name != null) {
      const splitted = name.split(' ', 3);
      const a = ' ' + splitted[1][0] + '. ';
      const b = splitted[2][0] + '. ';

      return splitted[0] + a + b;
    }
    return name;
  }
}
