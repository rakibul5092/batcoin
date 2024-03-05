import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-empty-results-route',
  templateUrl: './empty-results-route.component.html',
  styleUrls: ['./empty-results-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyResultsRouteComponent {}
