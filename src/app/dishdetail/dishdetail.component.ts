import { Component, OnInit, ViewChild,Inject} from '@angular/core';
import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { baseURL } from '../shared/baseurl';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
@ViewChild('fform') commentFormDirective;
  baseURL=baseURL;
  errMess: string;

   formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Author is required.',
      'minlength':     'Author must be at least 2 characters long.',
      'maxlength':     'cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'The Comment is required.'
    }
    };

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  dishcopy: Dish;

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder) {
      this.createForm();
     }

  ngOnInit() {
     this.dishservice.getDishIds()
     .subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
    errmess => this.errMess = <any>errmess);
  }
  createForm() {
    this.commentForm = this.fb.group({
      rating: ['5', Validators.required ],
      comment: ['', Validators.required],
      author: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      date:''
      
    });
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }
  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  onSubmit() {
  this.commentForm.value.date=(new Date()).toISOString();
   this.dish.comments.push(this.commentForm.value);
    this.dishservice.putDish(this.dish)
      .subscribe(dish => {
        this.dish = dish;
      },
      errmess => { this.dish = null; this.errMess = <any>errmess; });
    this.commentFormDirective.resetForm();
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

}
