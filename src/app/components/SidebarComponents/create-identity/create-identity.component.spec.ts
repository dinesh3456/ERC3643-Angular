import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIdentityComponent } from './create-identity.component';

describe('CreateIdentityComponent', () => {
  let component: CreateIdentityComponent;
  let fixture: ComponentFixture<CreateIdentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateIdentityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
