import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrativoDashboard } from './administrativo-dashboard';

describe('AdministrativoDashboard', () => {
  let component: AdministrativoDashboard;
  let fixture: ComponentFixture<AdministrativoDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrativoDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrativoDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
