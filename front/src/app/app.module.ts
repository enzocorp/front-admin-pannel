import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import { PairsComponent } from './components/pages/pairs/pairs.component';
import { PairComponent } from './components/pages/pairs/pair/pair.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { fr_FR } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
import {
  NzBadgeModule,
  NzButtonModule,
  NzCardModule, NzCheckboxModule,
  NzDividerModule,
  NzDrawerModule,
  NzEmptyModule,
  NzFormModule,
  NzIconModule,
  NzInputModule,
  NzLayoutModule,
  NzListModule,
  NzMenuModule,
  NzModalModule, NzNotificationModule,
  NzPaginationModule,
  NzPopconfirmModule,
  NzPopoverModule,
  NzRadioModule,
  NzSelectModule,
  NzSpinModule,
  NzStatisticModule,
  NzSwitchModule, NzTableModule,
  NzTagModule,
  NzTransferModule,
  NzTypographyModule
} from "ng-zorro-antd";
import { ReplaceByPipe } from './services/pipes/replace-by.pipe';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AccountComponent } from './components/auth/account/account.component';
import { SiderComponent } from './components/structure/sider/sider.component';
import { HeaderComponent } from './components/structure/header/header.component';
import { FooterComponent } from './components/structure/footer/footer.component';
import { BodyComponent } from './components/structure/body/body.component';
import { Error404Component } from './components/pages/error404/error404.component';
import {BestsComponent} from "./components/pages/bests/bests.component";
import { MarketsComponent } from './components/pages/markets/markets.component';
import {BestsHistoricComponent} from "./components/pages/bests-historic/bests-historic.component";
import { ShowBestComponent } from './components/pages/bests/show-best/show-best.component';
import {BtnBanSymboleComponent} from "./components/modules/btn-ban-symbole/btn-ban-symbole.component";
import { BtnBanMarketComponent } from './components/modules/btn-ban-market/btn-ban-market.component';
import { FormComponent } from './components/modules/btn-ban-symbole/form/form.component';
import { FormBanMarketComponent } from './components/modules/btn-ban-market/form-ban-market/form-ban-market.component';
import { PaginationComponent } from './components/modules/pagination/pagination.component';
import { FiltersBestsComponent } from './components/pages/bests/filters-bests/filters-bests.component';
import {FiltersPairsComponent} from "./components/pages/pairs/filters-pairs/filters-pairs.component";
import { MarketComponent } from './components/pages/markets/market/market.component';
import { FiltersMarketsComponent } from './components/pages/markets/filters-markets/filters-markets.component';
import {NgxPaginationModule} from "ngx-pagination";
import { ExponentielPipe } from './services/pipes/exponentiel.pipe';
import {CoinapiInterceptorProvider} from "./services/interceptors/coinapi.interceptor";
import {MessageInterceptorProvider} from "./services/interceptors/message.interceptor";
import { BanGroupMarketsComponent } from './components/pages/markets/ban-group-markets/ban-group-markets.component';
import { BanGroupPairsComponent } from './components/pages/pairs/ban-group-pairs/ban-group-pairs.component';

registerLocaleData(fr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PairsComponent,
    PairComponent,
    BestsComponent,
    ReplaceByPipe,
    RegisterComponent,
    LoginComponent,
    AccountComponent,
    SiderComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent,
    Error404Component,
    MarketsComponent,
    BestsHistoricComponent,
    ShowBestComponent,
    BtnBanSymboleComponent,
    BtnBanMarketComponent,
    FormComponent,
    FormBanMarketComponent,
    PaginationComponent,
    FiltersBestsComponent,
    FiltersPairsComponent,
    MarketComponent,
    FiltersMarketsComponent,
    ExponentielPipe,
    BanGroupMarketsComponent,
    BanGroupPairsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    NgxPaginationModule,

    //Import antDesgin
    NzModalModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzSwitchModule,
    NzDrawerModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzStatisticModule,
    NzCardModule,
    NzDividerModule,
    NzListModule,
    NzTypographyModule,
    NzButtonModule,
    NzTransferModule,
    NzSpinModule,
    NzPopconfirmModule,
    NzPopoverModule,
    NzBadgeModule,
    NzTagModule,
    NzEmptyModule,
    NzPaginationModule,
    NzCheckboxModule,
    NzRadioModule,
    NzNotificationModule,
    NzTableModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: fr_FR },
    CoinapiInterceptorProvider,
    MessageInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
