import { ColDef, GridApi, GridReadyEvent, Module } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountService } from '../service/account.service';
import { Account } from '../model/account.model';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { ButtonCellRendererComponent } from './button-renderer.component';
import { AccountUser, User } from '../model/user.model';
import { UserService } from '../service/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditAccountComponent } from './edit/edit.component';
import { AssignUserToAccountComponent } from './user/assign-user.component';

@Component({
    selector: 'app-account',
    templateUrl: 'account.component.html',
    styleUrls: ['account.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AgGridModule,
        ButtonCellRendererComponent,
        EditAccountComponent,
        AssignUserToAccountComponent
    ]
})
export class AccountComponent implements OnInit {
    private gridApi!: GridApi;

    accounts$: Observable<Account[]>;
    users$: Observable<AccountUser[]>;
    accountBehaviorSubject = new BehaviorSubject<number>(0);
    accountAddAction$ = this.accountBehaviorSubject.asObservable();
    selectedAccount?: Account;
    accountToBeUpdate?: Account;
    columnDefs: ColDef[] = [
        {
            field: 'id',
            flex: 1
        },
        {
            field: 'displayName',
            flex: 2
        },
        {
            headerName: 'Update',
            cellRenderer: 'btnCellRenderer',
            cellRendererParams: {
                clicked: (account: Account) => this.accountToBeUpdate = account
            },
            flex: 1
        }
    ];

    columnDefsUser: ColDef[] = [
        {
            field: 'accountId',
            flex: 1
        },
        {
            field: 'username',
            flex: 1
        }
    ];

    frameworkComponents = {
        btnCellRenderer: ButtonCellRendererComponent
    };

    constructor(private accountService: AccountService) { }

    ngOnInit(): void {
        this.accounts$ = this.accountAddAction$.pipe(
            debounceTime(200),
            switchMap(() => this.accountService.getAccounts())
        );

        this.users$ = this.accountAddAction$.pipe(
            debounceTime(200),
            switchMap((accountId) => this.accountService.getAccountUsers().pipe(
                map((users) => users.filter((user) => user.accountId === accountId))
            ))
        );
    }

    onUpdate(account: Account | null): void {
        if (account) {
            this.accountBehaviorSubject.next(account.id);
            this.selectedAccount = account;
        }
    }

    onSelectionChanged(): void {
        const selectedRows = this.gridApi.getSelectedRows() as Account[];
        if (selectedRows.length > 0) {
            this.selectedAccount = selectedRows[0];
            this.accountBehaviorSubject.next(selectedRows[0].id);
        }
    }

    onGridReady(params: GridReadyEvent): void {
        this.gridApi = params.api;
    }
}
