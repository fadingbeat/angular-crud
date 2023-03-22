import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactModel } from '../../models/contact.model';
import { ContactsService } from 'src/app/services/contacts.service';
import { PageEvent } from '@angular/material/paginator';
import { Observable, of, throwError } from 'rxjs';
import { PageModel } from 'src/app/models/page.model';
import { catchError, concatMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationWindowComponent } from 'src/app/shared/confirmation-window/confirmation-window.component';
import { MatTable } from '@angular/material/table';

@Component({
    selector: 'app-contacts-table',
    templateUrl: './contacts-table.component.html',
    styleUrls: ['./contacts-table.component.scss'],
})
export class ContactsTableComponent implements OnInit {
    visibleColumns: string[] = [
        'id',
        'firstName',
        'lastName',
        'email',
        'address',
        'phoneNumber',
        'actions',
    ];
    contacts: PageModel<ContactModel>;
    dataSource$: Observable<PageModel<ContactModel>>;
    pageEvent: PageEvent;
    page: number;
    perPage: number;
    spinnerLoading = false;

    constructor(
        private readonly contactsService: ContactsService,
        private snackBar: MatSnackBar,
        private router: Router,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.spinnerLoading = true;
        this.dataSource$ = this.contactsService.getContacts();
        this.getContactsData();
        this.spinnerLoading = false;
    }

    getContactsData() {
        this.dataSource$.subscribe(
            (res) => ((this.contacts = res), console.log(this.contacts.data))
        );
    }

    onPaginateChange(page: PageEvent) {
        this.spinnerLoading = true;
        this.page = page.pageIndex + 1;
        this.perPage = page.pageSize;
        const getContactsQuery = {
            page: this.page,
            perPage: this.perPage,
        };

        this.dataSource$
            .pipe(
                catchError((err) => {
                    this.spinnerLoading = false;
                    return throwError(err);
                }),
                concatMap(() => {
                    return this.contactsService.getContacts(getContactsQuery);
                })
            )
            .subscribe(
                (res) => (
                    (this.contacts = res),
                    (res.page = getContactsQuery.page),
                    (res.perPage = getContactsQuery.perPage),
                    (this.spinnerLoading = false)
                )
            );
    }

    // Navigate to page for adding new contact
    navigateToAdd() {
        this.router.navigateByUrl(`create`);
    }

    deleteContact(id: number) {
        const dialogRef = this.dialog.open(ConfirmationWindowComponent, {
            width: '400px',
            autoFocus: false,

            data: {
                question: 'ARE YOU SURE YOU WANT TO DELETE THE CONTACT?',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result.confirmed) {
                this.contactsService.deleteContact(id).subscribe(() => {
                    this.snackBar.open(
                        'CONTACT SUCCESSFULLY DELETED',
                        'SUCCESS',
                        {
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                            duration: 5000,
                        }
                    );
                });
            }
        });
    }

    editContact(id: number) {
        this.router.navigateByUrl(`edit/${id}`);
    }
}
