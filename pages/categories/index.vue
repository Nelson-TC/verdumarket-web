<script setup lang="ts">
import { useToast } from "vue-toastification";

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const toast = useToast();

const {
  data: categories,
  refresh,
  pending,
} = await useFetch("/api/categories", {
  headers,
});

const mountLoaded = ref<Boolean>(false);
onMounted(() => {
  mountLoaded.value = true;
});

const showModal = ref(false);
const modalMode = ref("");

const showDeleteModal = ref(false);

const categoryToDelete = ref({
  id: null,
  name: "",
});

const editCategoryForm = ref({
  name: "",
});

const resetEditCategoryForm = () => {
  editCategoryForm.value = {
    name: "",
  };
};

const createCategoryForm = ref({
  name: "",
});

const resetCreateCategoryForm = () => {
  createCategoryForm.value = {
    name: "",
  };
};

const openDeleteCategoryModal = (category: any) => {
  categoryToDelete.value = category;
  showDeleteModal.value = true;
};

const openCreateCategoryModal = () => {
  modalMode.value = "create";
  showModal.value = true;
};

const categoryToEdit = ref({
  id: null,
  name: ""
})

const openEditCategoryModal = (category: any) => {
  categoryToEdit.value = category
  editCategoryForm.value = {
    name: category.name,
  };
  modalMode.value = "edit";
  showModal.value = true;
};

const storeCategory = async () => {
  await $fetch("/api/categories", {
    method: "POST",
    body: { ...createCategoryForm.value },
  }).then(() => {
    showModal.value = false;
    toast.success("Categoría añadida con éxito");
    resetCreateCategoryForm();
    refresh();
  });
};

const updateCategory = async () => {
  await $fetch(`/api/categories/${categoryToEdit.value.id}`, {
    method: "PUT",
    body: { ...editCategoryForm.value },
  }).then(() => {
    showModal.value = false;
    toast.success("Categoría actualizada con éxito");
    resetEditCategoryForm();
    refresh();
  });
};

const categoryDestroyed = () => {
  refresh();
};
</script>

<template>
  <DeleteModal
    :show="showDeleteModal"
    :record="categoryToDelete"
    routeToDelete="/api/categories"
    @close="showDeleteModal = false"
    @success="categoryDestroyed"
  />
  <Modal :show="showModal" @close="showModal = false" vertical-position="top">
    <form
      @submit.prevent="storeCategory"
      v-if="modalMode === 'create'"
      class="p-4"
    >
      <p class="text-lg font-semibold text-center text-neutral-600">
        Crear Categoría
      </p>
      <div class="flex flex-col mt-2">
        <label class="custom-label-input" for="name">Nombre</label>
        <input
          id="name"
          v-model="createCategoryForm.name"
          type="text"
          class="custom-input"
          placeholder="Ingresar nombre"
          autocomplete="off"
        />
      </div>
      <div class="flex space-x-4">
        <button
          type="button"
          @click="showModal = false"
          class="w-full py-2 mx-auto mt-8 font-semibold text-red-100 transition bg-red-600 rounded-lg hover:brightness-90"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="w-full py-2 mx-auto mt-8 font-semibold text-white transition rounded-lg bg-main-primary hover:brightness-90"
        >
          Crear
        </button>
      </div>
    </form>
    <form
      @submit.prevent="updateCategory"
      v-if="modalMode === 'edit'"
      class="p-4"
    >
      <p class="text-lg font-semibold text-center text-neutral-600">
        Editar Categoría
      </p>
      <div class="flex flex-col mt-2">
        <label class="custom-label-input" for="name">Nombre</label>
        <input
          id="name"
          v-model="editCategoryForm.name"
          type="text"
          class="custom-input"
          placeholder="Ingresar nombre"
          autocomplete="off"
        />
      </div>
      <div class="flex space-x-4">
        <button
          type="button"
          @click="showModal = false"
          class="w-full py-2 mx-auto mt-8 font-semibold text-red-100 transition bg-red-600 rounded-lg hover:brightness-90"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="w-full py-2 mx-auto mt-8 font-semibold text-white transition rounded-lg bg-main-primary hover:brightness-90"
        >
          Actualizar
        </button>
      </div>
    </form>
  </Modal>
  <div class="p-2 bg-white rounded-lg shadow" v-if="mountLoaded">
    <DataTable class="text-sm md:text-base" :value="categories">
      <template #header>
        <div class="flex items-center space-x-2">
          <h1 class="text-lg font-black md:text-xl">Listado de categorías</h1>
          <div class="flex items-center justify-end flex-1 space-x-2">
            <button
              class="inline-flex items-center px-4 py-2 text-sm transition rounded-lg min-w-max md:text-base bg-main-secondary hover:brightness-90"
              @click="openCreateCategoryModal"
            >
              Crear categoría
            </button>
          </div>
        </div>
      </template>
      <Column header="Nombre" field="name" />
      <Column header="Acciones">
        <template #body="{ data }">
          <div class="flex w-full space-x-6 md:space-x-4">
            <button
              @click="openEditCategoryModal(data)"
              class="px-2 py-1.5 text-xs font-semibold text-red-100 transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              <i class="h-full pi pi-pencil"></i>
            </button>
            <button
              @click="openDeleteCategoryModal(data)"
              class="px-2 py-1.5 text-xs font-semibold text-red-100 transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              <i class="h-full pi pi-times"></i>
            </button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <div class="flex items-center justify-center p-12" v-else>
    <div
      class="w-10 h-10 border-4 rounded-full border-t-neutral-500 border-l-neutral-500 border-r-neutral-500 border-b-neutral-100 animate-spin"
    ></div>
  </div>
</template>