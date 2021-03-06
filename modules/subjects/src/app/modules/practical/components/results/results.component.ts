import { LabMark } from './../../../../models/mark/lab-mark.model';
import { DialogService } from 'src/app/services/dialog.service';
import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {Store} from '@ngrx/store';
import {IAppState} from '../../../../store/state/app.state';
import {DialogData} from '../../../../models/dialog-data.model';
import {MarkForm} from '../../../../models/mark-form.model';
import { filter, map} from 'rxjs/operators';
import {SubSink} from 'subsink';
import { StudentMark } from 'src/app/models/student-mark.model';
import { Observable, combineLatest } from 'rxjs';
import * as moment from 'moment';

import * as practicalsActions from '../../../../store/actions/practicals.actions';
import * as practicalsSelectors from '../../../../store/selectors/practicals.selectors';
import * as subjectSelectors from '../../../../store/selectors/subject.selector';
import { ScheduleProtectionPractical } from 'src/app/models/schedule-protection/schedule-protection-practical.model';
import { Practical } from 'src/app/models/practical.model';
import { PracticalMark } from 'src/app/models/mark/practical-mark.model';
import { MarkPopoverComponent } from 'src/app/shared/mark-popover/mark-popover.component';
import { TranslatePipe } from '../../../../../../../../container/src/app/pipe/translate.pipe';
import { PracticalVisitingMark } from 'src/app/models/visiting-mark/practical-visiting-mark.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.less']
})
export class ResultsComponent implements OnInit, OnChanges, OnDestroy {
  private subs = new SubSink();
  @Input() isTeacher: boolean;
  @Input() groupId: number;

  state$: Observable<{ practicals: Practical[], schedule: ScheduleProtectionPractical[], students: StudentMark[], userId: number }>;

  constructor(
    private store: Store<IAppState>,
    private translate: TranslatePipe,
    private dialogService: DialogService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groupId && changes.groupId.currentValue) {
      this.store.dispatch(practicalsActions.loadSchedule());
      this.store.dispatch(practicalsActions.loadMarks());
    }
  }

  ngOnInit(): void {
    this.state$ = combineLatest(
      this.store.select(practicalsSelectors.selectSchedule),
      this.store.select(practicalsSelectors.selectPracticals),
      this.store.select(practicalsSelectors.selectMarks),
      this.store.select(subjectSelectors.getUserId)
    ).pipe(
      map(([schedule, practicals, students, userId]) => ({ schedule, practicals, students, userId }))
    );
  }

  getHeaders(practicals: Practical[]): { head: string, text: string, tooltip: string }[] {
    return practicals.map((p, index) => ({ head: p.PracticalId.toString(), text: p.ShortName, tooltip: p.Theme }));
  }

  getDisplayColumns(practicals: Practical[]): string[] {
    return ['position', 'name', ...practicals.map(l => l.PracticalId.toString()), 'total-practical', 'total-test', 'total'];
  }

  getTotal(student: StudentMark): number {
    return ((Number(student.LabsMarkTotal) + Number(student.TestMark)) / 2);
  }

  setMark(student: StudentMark, practicalId: number, recommendedMark: string) {
    if (!this.isTeacher) {
      return;
    }
    const mark = student.PracticalsMarks.find(mark => mark.PracticalId === +practicalId);
    if (mark) {
      const practicalMark = this.getPracticalMark(mark, student.StudentId);
      const dialogData: DialogData = {
        title: this.translate.transform('text.subjects.grading', 'Выставление оценки'),
        buttonText: this.translate.transform('button.save', 'Сохранить'),
        body: practicalMark,
        model: {
          recommendedMark,
          lecturerId: mark.LecturerId
        }
      };
      const dialogRef = this.dialogService.openDialog(MarkPopoverComponent, dialogData);

      this.subs.add(dialogRef.afterClosed().pipe(
        filter(r => r),
        map((result: MarkForm) => ({
          ...practicalMark,
          comment: result.comment,
          date: moment(result.date).format('DD.MM.YYYY'),
          mark: result.mark,
          showForStudent: result.showForStudent
        })),
      ).subscribe((practicalMark) => {
        this.store.dispatch(practicalsActions.setPracticalMark({ body: practicalMark }));
      }));

    }
  }

  getMissingTooltip(marks: PracticalVisitingMark[], schedule: ScheduleProtectionPractical[]) {
    return marks.map(sc => `${this.translate.transform('text.subjects.missed', 'Пропустил(a)')} ${sc.Mark} ${this.translate.transform('text.subjects.missed/hours', 'часа(ов)')}.${schedule.find(s => s.ScheduleProtectionPracticalId === sc.ScheduleProtectionPracticalId).Date}`).join('\n');

  }

  private getPracticalMark(mark: PracticalMark, studentId: number) {
    const dateValues = mark.Date.split('.');
    return {
      id: mark.StudentPracticalMarkId ? mark.StudentPracticalMarkId : 0,
      comment: mark.Comment,
      mark: mark.Mark,
      date: mark.Date ? new Date(+dateValues[2], +dateValues[1], +dateValues[1]) : new Date(),
      practicalId: mark.PracticalId,
      studentId: studentId,
      showForStudent: mark.ShowForStudent
    }
  };

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.store.dispatch(practicalsActions.resetPracticals());
  }
}
