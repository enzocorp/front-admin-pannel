import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./components/pages/home/home.component";
import {Error404Component} from "./components/pages/error404/error404.component";
import {LoginComponent} from "./components/auth/login/login.component";
import {RegisterComponent} from "./components/auth/register/register.component";
import {AccountComponent} from "./components/auth/account/account.component";
import {PairsComponent} from "./components/pages/pairs/pairs.component";
import {MarketsComponent} from "./components/pages/markets/markets.component";
import {BestsComponent} from "./components/pages/bests/bests.component";
import {BestsHistoricComponent} from "./components/pages/bests-historic/bests-historic.component";
import {BestComponent} from "./components/pages/bests/best/best.component";
import {PairComponent} from "./components/pages/pairs/pair/pair.component";
import {MarketComponent} from "./components/pages/markets/market/market.component";
import {AssetComponent} from "./components/pages/assets/asset/asset.component";
import {AssetsComponent} from "./components/pages/assets/assets.component";
import {SettingsComponent} from "./components/pages/settings/settings.component";

const routes: Routes = [
  {path : 'home', component : HomeComponent},
  {path : 'pairs', component : PairsComponent,children : [
       {path : ':id', component : PairComponent},
    ]},
  {path : 'markets', component : MarketsComponent, children : [
      {path : ':id', component : MarketComponent}
    ]},
  {path : 'assets', component : AssetsComponent, children : [
      {path : ':id', component : AssetComponent}
    ]},
  {path : 'bests',children : [
      {path : 'calculer', component : BestsComponent, children : [
          {path : ':id', component : BestComponent},
        ]},
      {path : 'historique', component : BestsHistoricComponent},
    ]},
  {path : 'authentification',children : [
      {path : 'connexion', component : LoginComponent},
      {path : 'inscription', component : RegisterComponent},
    ]},
  {path : 'utilisateur',children : [
      {path : 'compte', component : AccountComponent},
    ]},
  {path : 'parametres', component : SettingsComponent},
  {path: '', pathMatch : 'full', redirectTo : "/home" },
  {path : '**', component : Error404Component}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
