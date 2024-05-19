import {Component, OnInit} from '@angular/core';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {PermissionsEnum} from '@enums/permissions.enum';
import {CountriesService} from '@api/countries/countries.service';
import {ICountryModel, ICountryResponseModel} from '@api/countries/res/country.interface';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss']
})
export class CountriesListComponent implements OnInit {
  visibleTitleFilter: boolean = false;
  visibleCodeFilter: boolean = false;
  countriesResponse: ICountryResponseModel = null;
  countriesList: ICountryModel[] = [];
  pageIndex = 1;
  pageSize = 15;
  ManageTypesEnum = ManageTypesEnum;
  PermissionsEnum = PermissionsEnum;

  constructor(public countriesService: CountriesService) {
  }

  ngOnInit() {
    this.initializeValues();
  }

  initializeValues() {
    this.countriesService.getCountriesList(this.pageIndex).subscribe((data: ICountryResponseModel) => {
      this.countriesResponse = data;
      this.countriesList = this.countriesResponse.data;
    });
  }
}
