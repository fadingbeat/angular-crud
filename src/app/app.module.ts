import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ContactsTableComponent } from './views/contacts-table/contacts-table.component';
import { EditContactComponent } from './views/edit-contact/edit-contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactsService } from './services/contacts.service';
import { ErrorDialogService } from './shared/errors/error-dialog.service';
import { GlobalErrorHandler } from './core/global-error-handler';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './shared/spinner/loading-spinner/loading-spinner.component';

@NgModule({
    declarations: [
        AppComponent,
        ContactsTableComponent,
        EditContactComponent,
        LoadingSpinnerComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
    ],
    providers: [
        ContactsService,
        ErrorDialogService,
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
