import { Component } from '@angular/core';
import { ThemeService } from './service/theme.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        HeaderComponent
    ]
})
export class AppComponent {

    constructor(public themeService: ThemeService) { }

}
