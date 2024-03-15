import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClaimIssuerComponent } from './create-claim-issuer.component';

describe('CreateClaimIssuerComponent', () => {
  let component: CreateClaimIssuerComponent;
  let fixture: ComponentFixture<CreateClaimIssuerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateClaimIssuerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateClaimIssuerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
