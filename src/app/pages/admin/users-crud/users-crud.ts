import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PasswordModule } from 'primeng/password';

import { Crud } from '@/pages/crud/crud';
import { PersonaService } from '@/pages/service/persona.service';
import { SessionService } from '@/pages/service/session.service';
import { UserService } from '@/pages/service/user.service';
import { Persona } from '@/models/persona';
import { Usuario } from '@/models/usuario';

@Component({
    selector: 'app-users-crud',
    standalone: true,
    templateUrl: './users-crud.html',
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        PasswordModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class UsersCrud extends Crud {
    override elementAdminName = 'Administrar Usuarios';
    override pluralName = 'Usuarios';
    override singularName = 'Usuario';

    personasList: { label: string; value: number }[] = [];

    constructor(
        private sessionService: SessionService,
        private usersService: UserService,
        private personasService: PersonaService,
        protected override messageService: MessageService,
        protected override confirmationService: ConfirmationService
    ) {
        super(messageService, confirmationService);
    }

    // 🔹 Listado: base usuarios, cada uno con su persona (si existe) o null
    override async setElements(): Promise<void> {
        try {
            const [usuariosApi, personas] = await Promise.all([
                this.usersService.getAllUsuarios(),
                this.personasService.getAllPersonas()
            ]);

            const enriched = (usuariosApi as Usuario[]).map((u) => {
                const persona = personas.find(
                    (p: any) => (p.usuarioId ?? p.usuarioid) === u.id
                ) || null;

                return {
                    ...u,                             // id, email, etc del usuario
                    persona,                         // objeto Persona o null
                    personaid: persona?.personaid ?? null // para el select
                };
            });

            this.elements.set(enriched);

            this.personasList = personas.map((persona) => ({
                label: `${persona.nombres} ${persona.apellidos} - ${persona.numero_documento}`,
                value: persona.personaid
            }));
        } catch (error) {
            console.error('Error fetching users or personas:', error);
            this.errorMessage('Hubo un error al obtener usuarios o personas');
        }
    }

    override setExportColumns(): void {
        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'email', header: 'Email' },
            { field: 'persona', header: 'Persona' }
        ];

        this.exportColumns = this.cols.map((col) => ({
            title: col.header,
            dataKey: col.field
        }));
    }

    // 🔹 Estos métodos SIGUEN existiendo, sólo ocultamos los botones en el HTML
    override async deleteSelectedElementsLogic(): Promise<boolean> {
        try {
            const idsToDelete = this.selectedElements?.map((e) => e.id) || [];
            await this.usersService.bulkDeleteUsuarios(idsToDelete);

            this.elements.set(
                this.elements().filter((val) => !this.selectedElements?.includes(val))
            );

            return true;
        } catch (error) {
            console.error('Error bulk deleting usuarios:', error);
            this.errorMessage('Hubo un error al eliminar los usuarios seleccionados');
            return false;
        }
    }

    override async deleteElementLogic(element: any): Promise<boolean> {
        try {
            await this.usersService.deleteUsuario(element.id);

            this.elements.set(
                this.elements().filter((val) => val.id !== element.id)
            );

            return true;
        } catch (error) {
            console.error('Error deleting usuario:', error);
            this.errorMessage('Hubo un error al eliminar el usuario');
            return false;
        }
    }

    override requiredFields(): boolean {
        const isNew = !this.element.id; // si no tiene id, lo consideramos nuevo
    
        if (isNew) {
            // Para crear usuario sí necesitas email y contraseña
            return !!this.element.email && !!this.element.password;
        }
    
        // En edición no obligamos nada más (solo asignar persona si quieres)
        return true;
    }

    override checkConflicts(): { conflict: boolean; message: string } {
        const _elements = this.elements();

        return {
            conflict: _elements.some(
                (e: any) => e.email === this.element.email && e.id !== this.element.id
            ),
            message: 'Ya existe un usuario con este email'
        };
    }

    // 🔹 Crear / actualizar usuario + setear usuarioId en la persona seleccionada
    override async saveElementLogic(): Promise<boolean> {
        const _elements = this.elements();
        const isNew = !this.element.id;
    
        if (this.checkConflicts().conflict) {
            this.errorMessage(this.checkConflicts().message);
            return false;
        }
    
        try {
            if (isNew) {
                // 👉 CREAR USUARIO (Supabase) + asignar persona si se eligió
                const signupResponse = await this.usersService.signup(
                    this.element.email,
                    this.element.password
                );
                const newUser: Usuario = signupResponse.user;
                let persona: Persona | null = null;
    
                if (this.element.personaid) {
                    persona = await this.personasService.updatePersonaUser(
                        this.element.personaid,
                        newUser.id
                    );
                }
    
                // _elements.push({
                //     ...newUser,
                //     persona,
                //     personaid: persona?.personaid ?? null
                // });
    
                // this.elements.set(_elements);
                this.setElements();
                this.successMessage('Usuario creado correctamente');
                return true;
            } else {
                // 👉 EDITAR: solo reasignar persona, NO tocar email / password
                const idx = _elements.findIndex((e: any) => e.id === this.element.id);
                if (idx === -1) {
                    this.errorMessage('No se encontró el usuario en la lista');
                    return false;
                }
    
                let persona: Persona | null = null;
    
                if (this.element.personaid) {
                    // Asignar este usuario a la persona seleccionada
                    persona = await this.personasService.updatePersonaUser(
                        this.element.personaid,
                        this.element.id
                    );
                }
    
                this.setElements();
                this.successMessage('Usuario actualizado correctamente');
                return true;
            }
        } catch (error) {
            console.error('Error saving usuario:', error);
            this.errorMessage(
                isNew
                    ? 'Hubo un error al crear el usuario'
                    : 'Hubo un error al actualizar la persona del usuario'
            );
            return false;
        }
    }

    override confirmationDeleteMessage = (element: any) =>
        `¿Seguro que quiere eliminar el usuario con correo ${element?.email}?`;
    override confirmationBulkDeleteMessage =
        '¿Seguro que quiere eliminar los usuarios seleccionados?';
    override deleteSuccessMessage = 'Usuario eliminado correctamente';
    override bulkDeleteSuccessMessage = 'Usuarios eliminados correctamente';

    onHeaderToggle(event: any) {
        if (event.checked) {
            this.selectedElements = this.elements().filter((e: any) => !this.isSame(e));
        } else {
            this.selectedElements = [];
        }
    }

    isSame(element: any): boolean {
        return this.sessionService.getUser()
            ? element.id === this.sessionService.getUser()!.id
            : false;
    }
}
