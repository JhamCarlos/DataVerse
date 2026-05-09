<template>
  <div class="space-y-4">
    <!-- Header Page -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Gestión de Usuarios</h2>
        <p class="text-sm text-gray-500 mt-1">Administra los usuarios del sistema y sus accesos</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg mb-4">
      <Toolbar class="bg-transparent border-none p-0">
        <template #start>
          <Button label="Nuevo Usuario" icon="pi pi-user-plus" class="p-button-primary mr-2" @click="openNew" />
        </template>
        <template #end>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Buscar usuario..." />
          </span>
        </template>
      </Toolbar>
    </div>

    <!-- Data Table -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
      <DataTable ref="dt" :value="usuariosActivos" dataKey="id" :paginator="true" :rows="10" 
                 :filters="filters" responsiveLayout="scroll" :rowHover="true" class="p-datatable-sm">
                 
        <template #empty>
          <div class="text-center py-8 text-gray-500">No se encontraron usuarios registrados.</div>
        </template>

        <Column field="nombre_completo" header="Nombre Completo" style="min-width: 14rem" sortable></Column>
        
        <Column field="username" header="Usuario" style="min-width: 10rem" sortable>
          <template #body="{ data }">
            <span class="font-medium text-primary">@{{ data.username }}</span>
          </template>
        </Column>

        <Column field="correo" header="Correo Electrónico" style="min-width: 14rem" sortable></Column>

        <Column field="role" header="Rol / Perfil" style="min-width: 10rem" sortable>
          <template #body="{ data }">
            <Tag :severity="getRoleSeverity(data.role)" :value="data.role" />
          </template>
        </Column>

        <Column header="Acciones" style="min-width: 10rem; text-align: center">
          <template #body="{ data }">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info mr-2" @click="editUser(data)" v-tooltip.top="'Editar'" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeleteUser(data)" v-tooltip.top="'Eliminar'" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal Formulario -->
    <Dialog v-model:visible="formDialog" :style="{width: '500px'}" :header="isEditing ? 'Editar Usuario' : 'Nuevo Usuario'" :modal="true" class="p-fluid" :pt="dialogFormPt">
      <FormUsuario 
        :initialData="usuarioActual" 
        :isEditing="isEditing" 
        @save="saveUser" 
        @cancel="formDialog = false" 
      />
    </Dialog>

    <!-- Modal Confirmación Eliminar -->
    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmar Eliminación" :modal="true" :pt="dialogConfirmPt">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-red-500 text-4xl" />
        <span v-if="usuarioActual">¿Estás seguro de que deseas eliminar al usuario <b>{{ usuarioActual.nombre_completo }}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
        <Button label="Sí, Eliminar" icon="pi pi-check" class="p-button-danger" @click="deleteUser" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from '../../../store/useStore';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { dialogFormPt, dialogConfirmPt } from '../../../utils/dialogPt';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import FormUsuario from '../../../components/forms/FormUsuario.vue';

const store = useStore();
const toast = useToast();

const formDialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const usuarioActual = ref({});
const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const usuariosActivos = computed(() => {
  return store.state.usuarios.filter(u => u.estado === 1);
});

const getRoleSeverity = (role) => {
  switch (role) {
    case 'ADMIN': return 'danger';
    case 'INQUILINO': return 'info';
    case 'OPERARIO': return 'warn';
    default: return 'secondary';
  }
};

const openNew = () => {
  usuarioActual.value = { estado: 1, role: 'ADMIN' };
  isEditing.value = false;
  formDialog.value = true;
};

const editUser = (user) => {
  usuarioActual.value = { ...user };
  isEditing.value = true;
  formDialog.value = true;
};

const confirmDeleteUser = (user) => {
  usuarioActual.value = user;
  deleteDialog.value = true;
};

const saveUser = (userData) => {
  if (isEditing.value) {
    const index = store.state.usuarios.findIndex(u => u.id === userData.id);
    if (index !== -1) {
      store.state.usuarios[index] = userData;
      toast.add({severity:'success', summary: 'Usuario Actualizado', detail: 'El usuario se actualizó correctamente', life: 3000});
    }
  } else {
    const newId = store.state.usuarios.length > 0 ? Math.max(...store.state.usuarios.map(u => u.id)) + 1 : 1;
    store.state.usuarios.push({ ...userData, id: newId });
    toast.add({severity:'success', summary: 'Usuario Creado', detail: 'El usuario se registró correctamente', life: 3000});
  }
  formDialog.value = false;
  usuarioActual.value = {};
};

const deleteUser = () => {
  const index = store.state.usuarios.findIndex(u => u.id === usuarioActual.value.id);
  if (index !== -1) {
    store.state.usuarios[index].estado = 0; // Soft delete
    toast.add({severity:'success', summary: 'Usuario Eliminado', detail: 'El usuario ha sido desactivado', life: 3000});
  }
  deleteDialog.value = false;
  usuarioActual.value = {};
};
</script>
