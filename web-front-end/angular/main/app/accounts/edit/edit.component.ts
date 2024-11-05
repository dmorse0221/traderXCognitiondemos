import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Account } from '../../model/account.model';
import { AccountService } from '../../service/account.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';

@Component({
    selector: 'app-edit-account',
    templateUrl: 'edit.component.html',
    styleUrls: ['edit.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AlertModule
    ]
})
export class EditAccountComponent {
    @Output() update = new EventEmitter<Account>();
    _account?: Account;
    @Input() set account(ac: Account | undefined) {
        this._account = ac;
        if (ac?.displayName) {
            this.displayName = ac.displayName;
        }
    }
    get account() {
        return this._account;
    }
    displayName?: string = undefined;
    accountResponse: any;

    constructor(private accountService: AccountService) { }

    add() {
        if (!this.displayName?.trim()) {
            return;
        }
        const account = Object.assign(this.account || {}, { displayName: this.displayName }) as Account;
        this.accountService.addAccount(account).subscribe(() => {
            this.accountResponse = { success: true, msg: `Account ${account.id ? 'updated' : 'added'} successfully!` };
            this.update.emit(account);
            this.reset();
        }, (err) => {
            console.error(err);
            this.accountResponse = { success: err, msg: `There is some error!` };
        });
    }

    reset() {
        this.account = undefined;
        this.displayName = undefined;
    }

    onCloseAlert() {
        this.accountResponse = undefined;
    }
}
