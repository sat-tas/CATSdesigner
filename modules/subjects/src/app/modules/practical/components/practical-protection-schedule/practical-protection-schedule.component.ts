import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';

import { Practical } from 'src/app/models/practical.model';
import { ScheduleProtectionPractical } from 'src/app/models/schedule-protection/schedule-protection-practical.model';
import { IAppState } from 'src/app/store/state/app.state';
import * as practicalsSelectors from '../../../../store/selectors/practicals.selectors';
import * as practicalsActions from '../../../../store/actions/practicals.actions';
import { map } from 'rxjs/operators';
import { DialogService } from 'src/app/services/dialog.service';
import { DialogData } from 'src/app/models/dialog-data.model';
import { VisitDatePracticalsPopoverComponent } from './visit-date-practicals-popover/visit-date-practicals-popover.component';
import { TranslatePipe } from '../../../../../../../../container/src/app/pipe/translate.pipe';

@Component({
  selector: 'app-practical-protection-schedule',
  templateUrl: './practical-protection-schedule.component.html',
  styleUrls: ['./practical-protection-schedule.component.less']
})
export class PracticalProtectionScheduleComponent implements OnInit, OnChanges {

  @Input() isTeacher: boolean;
  @Input() groupId: number;
  public displayedColumns: string[] = ['position', 'theme'];

  constructor(
    private store: Store<IAppState>,
    private dialogService: DialogService,
    private translate: TranslatePipe
  ) { }

  state$: Observable<{
    practicals: Practical[],
    schedule: ScheduleProtectionPractical[],
  }>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groupId && changes.groupId.currentValue) {
      this.store.dispatch(practicalsActions.loadSchedule());
    }
  }

  ngOnInit() {
    this.state$ = combineLatest([
      this.store.select(practicalsSelectors.selectPracticals),
      this.store.select(practicalsSelectors.selectSchedule)
    ]).pipe(
      map(([practicals, schedule]) => ({ practicals, schedule }))
    );
  }

  getDisplayedColumns(schedule: ScheduleProtectionPractical[]): string[] {
    return [...this.displayedColumns, ...schedule.map(res => res.Date + res.ScheduleProtectionPracticalId)];
  }

  settingVisitDate() {
    const dialogData: DialogData = {
      title: this.translate.transform('text.schedule.dates', 'Даты занятий'),
      buttonText: this.translate.transform('button.add', 'Добавить')
    };

    this.dialogService.openDialog(VisitDatePracticalsPopoverComponent, dialogData);
  }

}
