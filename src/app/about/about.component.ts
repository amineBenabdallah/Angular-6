import { Component, OnInit } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animation';
import { baseURL } from '../shared/baseurl';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
    // tslint:disable-next-line:use-host-property-decorator
  host: {
  '[@flyInOut]': 'true',
  'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class AboutComponent implements OnInit {

  leaders: Leader[];
  leaderErrMess: string;
  baseURL=baseURL;
  constructor(private leaderService: LeaderService) { }

  ngOnInit() {
      this.leaderService.getLeaders()
      .subscribe(leaders => this.leaders = leaders,
      leaderErrMess => this.leaderErrMess = <any>leaderErrMess);
  }

}
