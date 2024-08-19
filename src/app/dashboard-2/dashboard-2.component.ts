import { DatePipe, CommonModule } from '@angular/common';
import {
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from '../services/dashboard.service';
import { NgFor, NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-dashboard-1',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgFor,
    NgIf,
    NgClass,
  ],
  templateUrl: './dashboard-2.component.html',
  styleUrl: './dashboard-2.component.css',
  providers: [DatePipe],
})
export class Dashboard2Component {
  scheduleData: any = [];
  intervalSchedule: any;
  intervalDateTime: any;
  rxTime = new Date();
  subscription: Subscription = new Subscription();
  timer: Date = new Date();
  totalCount: any = 0;
  waitCount: any = 0;
  waitCCount: any = 0;
  delayCount: any = 0;
  completeCount: any = 0;
  cancelCount: any = 0;

  constructor(
    private apiService: DashboardService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.callApi();
    this.ngZone.runOutsideAngular(() => {
      this.intervalSchedule = setInterval(async () => {
        await this.callApi();
        await this.cdr.detectChanges();
      }, 60000);

      this.intervalDateTime = setInterval(async () => {
        this.timer = new Date();
        await this.cdr.detectChanges();
      }, 1000);
    });
  }

  callApi = async () => {
    const apiSubscription = this.apiService.getEmployee().subscribe({
      next: (data) => {
        console.log('API Data:', data);
        this.scheduleData = data.rows.filter((item: any) => {
          return item[0] == 'VD->SDT';
        });
        this.totalCount = this.scheduleData.length;

        const wait = this.scheduleData.filter((item: any) => {
          return item[10] == 1;
        });
        this.waitCount = wait.length ? wait.length : 0;

        const waitC = this.scheduleData.filter((item: any) => {
          return item[10] == 2;
        });
        this.waitCCount = waitC.length ? waitC.length : 0;

        const complete = this.scheduleData.filter((item: any) => {
          return item[10] == 3;
        });
        this.completeCount = complete.length ? complete.length : 0;

        const delayCount = this.scheduleData.filter((item: any) => {
          return item[10] == 4;
        });
        this.delayCount = delayCount.length ? delayCount.length : 0;

        const cancel = this.scheduleData.filter((item: any) => {
          return item[10] == 5;
        });
        this.cancelCount = cancel.length ? cancel.length : 0;
      },
      error: (error) => {
        console.error('API Error:', error);
      },
    });
    this.subscription.add(apiSubscription);
  };

  ngOnDestroy(): void {
    if (this.intervalSchedule) {
      clearInterval(this.intervalSchedule);
    }

    if (this.intervalDateTime) {
      clearInterval(this.intervalDateTime);
    }
    this.subscription.unsubscribe();
  }
}
