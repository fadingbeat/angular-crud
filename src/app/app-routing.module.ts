import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';
import { ContactsTableComponent } from './views/contacts-table/contacts-table.component';
import { EditContactComponent } from './views/edit-contact/edit-contact.component';

const routes: Routes = [
    {
        path: '',
        component: ContactsTableComponent,
    },
    {
        path: 'edit/:id',
        component: EditContactComponent,
    },
    {
        path: 'create',
        component: EditContactComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
