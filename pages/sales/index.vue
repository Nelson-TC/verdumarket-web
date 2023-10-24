<script setup lang="ts">
import moment from "moment";

const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const { data: sales, refresh } = await useFetch("/api/sales", {
  headers,
});

const mountLoaded = ref<Boolean>(false);
onMounted(() => {
  mountLoaded.value = true;
});

const expandedRows = ref([]);

const showDeleteModal = ref(false);
const saleToDelete = ref({});

const openDeleteSaleModal = (sale: any) => {
  saleToDelete.value = sale;
  showDeleteModal.value = true;
};

const saleDestroyed = () => {
  refresh();
};
</script>
<template>
  <DeleteModal
    :show="showDeleteModal"
    :record="saleToDelete"
    routeToDelete="/api/sales"
    primaryText="¿Seguro que quieres eliminar esta venta?"
    secondaryText="Si la venta tiene una factura, la factura también será eliminada y el inventario será reestablecido"
    @close="showDeleteModal = false"
    @success="saleDestroyed"
  />
  <div class="p-2 bg-white rounded-lg shadow" v-if="mountLoaded">
    <DataTable class="text-sm md:text-base" :value="sales" v-model:expanded-rows="expandedRows">
      <template #header>
        <div class="flex items-center space-x-2">
          <h1 class="text-lg font-black md:text-xl">Listado de ventas</h1>
          <div class="flex items-center justify-end flex-1 space-x-2">
            <NuxtLink
              to="/sales/create"
              class="inline-flex items-center px-4 py-2 text-sm transition rounded-lg min-w-max md:text-base bg-main-secondary hover:brightness-90"
            >
              Crear venta
            </NuxtLink>
          </div>
        </div>
      </template>
      <Column expander style="width: 5rem" />
      <Column header="Código" field="id" />
      <Column header="Fecha">
        <template #body="{ data }">
          {{ moment(data.date).format("DD/MM/YYYY hh:mm") }}
        </template>
      </Column>
      <Column header="Total">
        <template #body="{ data }">
          {{ data.total.toFixed(2) }}
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="{ data }">
          <div class="flex w-full space-x-6 md:space-x-4">
            <NuxtLink
              :to="`/sales/${data.id}/invoice/show`"
              v-if="data.invoice"
              class="px-2 py-1.5 text-xs font-semibold text-red-100 transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              <i class="h-full pi pi-file"></i>
            </NuxtLink>
            <NuxtLink
              v-else
              :to="`/sales/${data.id}/invoice/create`"
              class="px-2 py-1.5 text-xs font-semibold text-red-100 transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              <i class="h-full pi pi-file-edit"></i>
            </NuxtLink>
            <button
              @click="openDeleteSaleModal(data)"
              class="px-2 py-1.5 text-xs font-semibold text-red-100 transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              <i class="h-full pi pi-times"></i>
            </button>
          </div>
        </template>
      </Column>
      <template #expansion="sale">
        <div class="p-4 bg-neutral-300 rounded-xl">
          <DataTable
            :value="sale.data.content"
            class="p-datatable-sm !text-xs md:!text-sm"
          >
            <Column field="quantity" header="Cantidad" />
            <Column field="name" header="Nombre" />
            <Column header="Precio">
              <template #body="{ data }">
                <p>{{ (data.unitPrice * data.quantity).toFixed(2) }}</p>
                <span class="text-xs"
                  >{{ data.unitPrice.toFixed(2) }} x {{ data.quantity }}</span
                >
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </DataTable>
  </div>
  <div class="flex items-center justify-center p-12" v-else>
    <div
      class="w-10 h-10 border-4 rounded-full border-t-neutral-500 border-l-neutral-500 border-r-neutral-500 border-b-neutral-100 animate-spin"
    ></div>
  </div>
</template>