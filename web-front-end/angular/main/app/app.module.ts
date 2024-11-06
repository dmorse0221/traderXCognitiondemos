import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TradeModule } from './trade/trade.module';
import { provideHttpClient, withInterceptorsFromDi, withJsonpSupport } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { HeaderComponent } from './header/header.component';
import { AccountsModule } from './accounts/accounts.module';
import { RouterModule, provideRouter, withNavigationErrorHandler } from '@angular/router';
import { routes } from './routing';
import { PageNotFoundComponent } from './page-not-found.component';
import { NavigationErrorService } from './services/navigation-error.service';

@NgModule({
    declarations: [AppComponent, HeaderComponent, PageNotFoundComponent],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        CommonModule,
        TradeModule,
        AccountsModule,
        AgGridModule,
        RouterModule
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi(), withJsonpSupport()),
        provideRouter(
            routes,
            withNavigationErrorHandler((error) => {
                const errorService = new NavigationErrorService();
                errorService.handleError(error);
            })
        )
    ]
})
export class AppModule { }
