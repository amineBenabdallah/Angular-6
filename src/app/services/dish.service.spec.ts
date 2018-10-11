import { TestBed } from '@angular/core/testing';

import { DishService } from './dish.service';

describe('DishService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DishService = TestBed.get(DishService);
    expect(service).toBeTruthy();
  });
});
