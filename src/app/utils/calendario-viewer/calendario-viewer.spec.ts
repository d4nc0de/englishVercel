import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioViewer } from './calendario-viewer';

describe('CalendarioViewer', () => {
  let component: CalendarioViewer;
  let fixture: ComponentFixture<CalendarioViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
