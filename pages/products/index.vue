<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const { getSession } = useAuth();
const filter = ref("");
const search_query = ref("")

const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const { data: products, refresh, pending } = await useFetch("/api/products", {
  headers,
  query: {
    search_query,
  },
});

const mountLoaded = ref<Boolean>(false);
onMounted(() => {
  mountLoaded.value = true;
});

let searchTimeout: any
const debounceSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => search_query.value = filter.value, 250);
}

const showModal = ref(false);

watch(
  () => filter.value,
  () => debounceSearch()
);
</script>

<template>
  <Modal :show="showModal"> </Modal>
  <div class="px-6 py-4 bg-white rounded-lg shadow">
    <template v-if="mountLoaded">
      <DataTable :value="products" lazy :loading="pending">
        <template #header>
          <div class="flex items-center space-x-2">
            <h1 class="text-base font-black md:text-lg">
              Listado de productos
            </h1>
            <div class="flex items-center justify-end flex-1 space-x-2">
              <button
                class="inline-flex items-center px-4 py-2 text-sm transition-colors rounded-lg min-w-max bg-sky-200 text-sky-800 hover:bg-sky-300/75 md:text-base"
              >
                Crear producto
              </button>
            </div>
          </div>
          <input
            :value="filter"
            @input="(e) => (filter = e.target.value)"
            type="text"
            class="w-full mt-2 custom-input"
            placeholder="Buscar productos"
          />
        </template>
        <Column header="ID" field="id" />
        <Column header="Nombre" field="name" />
        <Column header="Precio Unitario" field="unitPrice" />
        <Column header="Inventario" field="stock" />
        <Column header="Unidad de medida" field="unitMeasurement" />
      </DataTable>
    </template>
    <div class="flex items-center justify-center p-12" v-else>
      <div
        class="w-10 h-10 border-4 rounded-full border-t-neutral-500 border-l-neutral-500 border-r-neutral-500 border-b-neutral-100 animate-spin"
      ></div>
    </div>
  </div>
</template>