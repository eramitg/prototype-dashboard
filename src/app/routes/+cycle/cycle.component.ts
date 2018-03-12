// ng dependencies
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

// custom services
import { NetworksService } from './networks.service';

@Component({
  selector: 'app-cycle',
  templateUrl: './cycle.component.html'
})
export class CycleComponent implements AfterViewInit, OnInit {
  @ViewChild('cycleDrawing') cycleDrawing: any;

  constructor(private networksService: NetworksService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.networksService.createNetwork(this.cycleDrawing.nativeElement);
  }
}
