import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RestService } from 'src/app/services/rest.service';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { COUNTRIES } from 'src/assets/countries';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { fade } from 'src/assets/animations';


export interface University {
  alpha_two_code: string;
  country: string;
  domains: string[];
  name: string;
  web_pages: string[];
}

@Component({
  selector: 'app-universities',
  templateUrl: './universities.component.html',
  styleUrls: ['./universities.component.scss'],
  animations: [fade]
})

export class UniversitiesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  loading: boolean = false;

  form: FormGroup;

  countries: string[] = COUNTRIES.map(m => m.name);

  displayedColumns: string[] = ['name', 'domains'];

  universities: MatTableDataSource<University> = new MatTableDataSource([]);

  filteredCountries: Observable<string[]>

  filteredUniversities: Observable<string[]>;

  constructor(private _restServise: RestService, private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.generateForm();

    this.getUniversitiesByCountry(this.form.controls.countryName.value);

    this.filteredCountries = this.form.controls.countryName.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      map(value =>
        this._filter(value, this.countries)
      )
    )

    this.filteredUniversities = this.form.controls.universityName.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      map(value =>
        this._filter(value, this.form.controls.countryUniversities?.value?.map(m => m.name))
      )
    )
  }

  ngAfterViewInit() {
    this.universities.paginator = this.paginator;
    this.universities.sort = this.sort;
  }

  generateForm(): FormGroup {
    return this._fb.group({
      countryName: this._fb.control('Ukraine', [this.nameValidator(this.countries)]),
      universityName: this._fb.control(''),
      countryUniversities: this._fb.control([])
    })
  }

  getUniversitiesByName(universityName: string) {

    if (!this.form.valid) return;

    this.loading = true;

    const country = this.form.controls.countryName.value;

    this._restServise.getUniversities(country, universityName).subscribe(universities => {
      this.universities.data = universities;
    }, error => { }, () => this.loading = false)
  }

  getUniversitiesByCountry(country: string) {

    if (!this.form.valid) return;

    this.loading = true;

    this._restServise.getUniversities(country, '').subscribe(universities => {
      this.universities.data = universities;
      this.form.controls.countryUniversities.setValue(universities);
      this.form.controls.universityName.setValue('')
    }, error => { }, () => this.loading = false)
  }

  private _filter(value: string, data: string[]): string[] {
    return data?.filter(item => item.toLowerCase().includes(value.toLowerCase()));
  }

  nameValidator(nameArr: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !nameArr.find(f => f === control.value) ? control : null;
    };
  }

}
