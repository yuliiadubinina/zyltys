import { Component, OnInit } from '@angular/core';
import { fade } from 'src/assets/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fade]
})
export class AppComponent implements OnInit {
  title = 'zyltys-test-task';

  loading = true;

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
}
