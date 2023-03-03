import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ContactModel } from 'src/app/models/contact.model';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
    selector: 'app-edit-contact',
    templateUrl: './edit-contact.component.html',
    styleUrls: ['./edit-contact.component.scss'],
})
export class EditContactComponent implements OnInit {
    @Output() contactDataForm: FormGroup;
    selectedContact: Observable<ContactModel>;
    selectedContactId: number;
    editContact: boolean = false;
    unsubscribe$ = new Subject<void>();
    contactId: string;
    spinnerLoading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private contactService: ContactsService,
        private snackBar: MatSnackBar,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.createContactForm();
    }

    ngOnInit() {
        const routeParams = this.route.snapshot.params;
        this.selectedContactId = Number(routeParams.id);

        const editMode = this.router.url.startsWith('/edit');
        if (editMode) {
            this.selectedContact = this.contactService.getContactById(
                this.selectedContactId
            );
            this.spinnerLoading = true;
            this.selectedContact.subscribe((res: ContactModel) => {
                this.editContact = true;
                this.editSelectedContact(res);
                this.spinnerLoading = false;
            });
        }
    }

    createContactForm() {
        this.contactDataForm = this.fb.group({
            id: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            emailAddress: [
                '',
                Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
            ],
            address: [''],
            phoneNumber: ['', Validators.pattern('[ +()0-9]+')],
        });
    }

    editSelectedContact(contact: ContactModel) {
        this.contactDataForm.patchValue({
            id: contact.id,
            firstName: contact.firstName,
            lastName: contact.lastName,
            emailAddress: contact.emailAddress,
            address: contact.address,
            phoneNumber: contact.phoneNumber,
        });
    }

    onSubmit() {
        if (this.editContact) {
            this.contactService
                .updateContact(
                    this.selectedContactId,
                    this.contactDataForm.value
                )
                .subscribe(() => {
                    this.snackBar.open(
                        'CONTACT SUCCESSFULLY UPDATED',
                        'SUCCESS',
                        {
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                            duration: 5000,
                        }
                    );
                    this.navigateToContacts();
                });
        } else {
            this.contactService
                .createContact(this.contactDataForm.value)
                .subscribe((res) => {
                    this.snackBar.open(
                        'CONTACT SUCCESSFULLY ADDED',
                        'SUCCESS',
                        {
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                            duration: 5000,
                        }
                    );
                });
        }
    }

    navigateToContacts() {
        this.router.navigateByUrl(``);
    }
}
